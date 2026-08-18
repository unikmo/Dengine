import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getWorkspaceAccess } from '@/lib/workspace-auth'

export const dynamic='force-dynamic'

export async function GET(_req:NextRequest,{params}:{params:Promise<{workspaceId:string}>}){
  const {workspaceId}=await params
  const access=await getWorkspaceAccess(workspaceId)
  if(!access) return NextResponse.json({error:'Workspace access required.'},{status:401})
  const db=createServerClient(); const {data,error}=await db.rpc('rye_get_workspace',{p_workspace_id:workspaceId,p_access_hash:access.hash})
  if(error) return NextResponse.json({error:'Workspace access denied.'},{status:403})
  return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}})
}

export async function PATCH(req:NextRequest,{params}:{params:Promise<{workspaceId:string}>}){
  const {workspaceId}=await params; const access=await getWorkspaceAccess(workspaceId)
  if(!access) return NextResponse.json({error:'Workspace access required.'},{status:401})
  const body=await req.json(); const eventDate=typeof body?.eventDate==='string'?body.eventDate:''
  if(!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return NextResponse.json({error:'A valid event date is required.'},{status:400})
  const db=createServerClient(); const {data,error}=await db.rpc('rye_replan_workspace_date',{p_workspace_id:workspaceId,p_access_hash:access.hash,p_new_event_date:eventDate})
  if(error) return NextResponse.json({error:error.message||'Replanning failed.'},{status:403})
  return NextResponse.json({ok:true,replan:data})
}
