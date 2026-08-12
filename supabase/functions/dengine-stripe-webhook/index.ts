import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ESSENTIAL_LINK = "plink_1U3Ty6CIFQh1oigOkto4hWGI";
const PROFESSIONAL_LINK = "plink_1U3TyCCIFQh1oigOv909vWmb";
const encoder = new TextEncoder();

function safeEqual(a: string, b: string) { if (a.length !== b.length) return false; let diff=0; for(let i=0;i<a.length;i++) diff |= a.charCodeAt(i)^b.charCodeAt(i); return diff===0; }
function toHex(bytes:ArrayBuffer){ return Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,"0")).join(""); }
async function verifySignature(body:string,header:string,secret:string){
  const fields=header.split(",").map(part=>part.trim().split("=",2));
  const timestamp=fields.find(([key])=>key==="t")?.[1];
  const signatures=fields.filter(([key])=>key==="v1").map(([,value])=>value);
  if(!timestamp||signatures.length===0)return false;
  const seconds=Number(timestamp); if(!Number.isFinite(seconds)||Math.abs(Math.floor(Date.now()/1000)-seconds)>300)return false;
  const key=await crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const signature=toHex(await crypto.subtle.sign("HMAC",key,encoder.encode(`${timestamp}.${body}`)));
  return signatures.some(candidate=>safeEqual(candidate,signature));
}
function tierForSession(session:any){ const link=typeof session.payment_link==="string"?session.payment_link:session.payment_link?.id; if(link===ESSENTIAL_LINK)return "essential"; if(link===PROFESSIONAL_LINK)return "professional"; return null; }

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return new Response("Method not allowed",{status:405});
  const url=Deno.env.get("SUPABASE_URL"); const serviceRole=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!serviceRole)return new Response("Server configuration error",{status:500});
  const supabase=createClient(url,serviceRole,{auth:{persistSession:false}});
  const {data:webhookSecret,error:secretError}=await supabase.rpc("dengine_get_webhook_secret");
  if(secretError||!webhookSecret){console.error("Unable to load webhook secret",secretError);return new Response("Server configuration error",{status:500});}
  const signatureHeader=req.headers.get("stripe-signature"); if(!signatureHeader)return new Response("Missing signature",{status:400});
  const rawBody=await req.text(); if(!(await verifySignature(rawBody,signatureHeader,webhookSecret)))return new Response("Invalid signature",{status:400});
  let event:any; try{event=JSON.parse(rawBody)}catch{return new Response("Invalid payload",{status:400})}
  try{
    if(event.type==="checkout.session.completed"||event.type==="checkout.session.async_payment_succeeded"){
      const session=event.data.object;
      if(event.type==="checkout.session.completed"&&session.payment_status!=="paid")return Response.json({received:true,pending:true});
      const draftToken=session.client_reference_id; const tier=tierForSession(session); const expectedSubtotal=tier==="essential"?1900:tier==="professional"?3900:null;
      if(!draftToken||!tier||session.currency!=="usd"||session.amount_subtotal!==expectedSubtotal)return new Response("Unmatched checkout",{status:400});
      const {data:order}=await supabase.from("dengine_orders").select("id").eq("draft_token",draftToken).eq("tier",tier).eq("status","checkout_created").order("created_at",{ascending:false}).limit(1).maybeSingle();
      if(!order)return new Response("Prepared order not found",{status:409});
      const paymentIntent=typeof session.payment_intent==="string"?session.payment_intent:session.payment_intent?.id??null;
      await supabase.from("dengine_orders").update({status:"paid",stripe_checkout_session_id:session.id,stripe_payment_intent_id:paymentIntent,customer_email:session.customer_details?.email??session.customer_email??null,verified_at:new Date().toISOString()}).eq("id",order.id);
      await supabase.from("dengine_plan_drafts").update({expires_at:new Date(Date.now()+365*24*60*60*1000).toISOString()}).eq("draft_token",draftToken);
      await supabase.from("dengine_conversion_events").insert({event_name:"purchase_completed",draft_token:draftToken,metadata:{tier,session:session.id,payment_link:session.payment_link}});
    }
    if(event.type==="checkout.session.expired"){
      const session=event.data.object; const draftToken=session.client_reference_id; const tier=tierForSession(session);
      if(draftToken&&tier){const {data:order}=await supabase.from("dengine_orders").select("id").eq("draft_token",draftToken).eq("tier",tier).eq("status","checkout_created").order("created_at",{ascending:false}).limit(1).maybeSingle(); if(order)await supabase.from("dengine_orders").update({status:"expired"}).eq("id",order.id);}
    }
    if(event.type==="charge.refunded"){
      const charge=event.data.object; const paymentIntent=typeof charge.payment_intent==="string"?charge.payment_intent:charge.payment_intent?.id;
      if(paymentIntent)await supabase.from("dengine_orders").update({status:"refunded"}).eq("stripe_payment_intent_id",paymentIntent);
    }
    return Response.json({received:true});
  }catch(error){console.error("DEngine webhook processing failed",error);return new Response("Webhook processing failed",{status:500});}
});
