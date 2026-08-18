import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { decryptPlan } from '@/lib/plan-vault'
import { WORKSPACE_COOKIE, hashWorkspaceToken } from '@/lib/workspace-auth'

export const runtime='nodejs'
export const dynamic='force-dynamic'

export async function POST(req:NextRequest){
  try{
    const store=await cookies(); const draftToken=store.get('dengine_draft')?.value
    if(!draftToken) return NextResponse.redirect(new URL('/custom',req.url),303)
    const db=createServerClient()
    const {data,error}=await db.rpc('dengine_get_paid_draft',{p_draft_token:draftToken})
    const row=Array.isArray(data)?data[0]:data
    if(error||!row) return NextResponse.redirect(new URL('/checkout/success',req.url),303)
    const plan=decryptPlan({plan_ciphertext:row.plan_ciphertext,plan_iv:row.plan_iv,plan_tag:row.plan_tag}) as any
    const token=randomBytes(32).toString('hex')
    const {data:workspaceId,error:provisionError}=await db.rpc('rye_provision_workspace',{p_draft_token:draftToken,p_plan:plan,p_owner_access_hash:hashWorkspaceToken(token)})
    if(provisionError||!workspaceId) throw provisionError||new Error('Workspace could not be created')
    const response=NextResponse.redirect(new URL(`/workspace/${workspaceId}`,req.url),303)
    response.cookies.set(WORKSPACE_COOKIE,`${workspaceId}.${token}`,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*365})
    return response
  }catch(error){console.error('Workspace provisioning failed',error);return NextResponse.json({error:'Workspace could not be created.'},{status:500})}
}
