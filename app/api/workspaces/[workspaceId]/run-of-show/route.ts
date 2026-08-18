import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getWorkspaceAccess } from '@/lib/workspace-auth'

export async function POST(req:NextRequest,{params}:{params:Promise<{workspaceId:string}>}){
  const {workspaceId}=await params; const access=await getWorkspaceAccess(workspaceId)
  if(!access) return NextResponse.json({error:'Workspace access required.'},{status:401})
  const body=await req.json(); const db=createServerClient()
  const {data,error}=await db.rpc('rye_save_run_of_show',{
    p_workspace_id:workspaceId,p_access_hash:access.hash,p_id:body?.id||null,p_start_time:body?.startTime||null,
    p_duration_minutes:Number(body?.durationMinutes)||15,p_cue:typeof body?.cue==='string'?body.cue:'',p_owner_label:typeof body?.owner==='string'?body.owner:'',
    p_location:typeof body?.location==='string'?body.location:'',p_technical_cue:typeof body?.technicalCue==='string'?body.technicalCue:'',
    p_contingency:typeof body?.contingency==='string'?body.contingency:'',p_notes:typeof body?.notes==='string'?body.notes:'',
    p_status:['planned','ready','live','complete','at_risk'].includes(body?.status)?body.status:'planned',
  })
  if(error) return NextResponse.json({error:error.message||'Run of Show item could not be saved.'},{status:403})
  return NextResponse.json({ok:true,id:data})
}

export async function DELETE(req:NextRequest,{params}:{params:Promise<{workspaceId:string}>}){
  const {workspaceId}=await params; const access=await getWorkspaceAccess(workspaceId)
  if(!access) return NextResponse.json({error:'Workspace access required.'},{status:401})
  const body=await req.json(); const db=createServerClient(); const {error}=await db.rpc('rye_delete_run_of_show',{p_workspace_id:workspaceId,p_access_hash:access.hash,p_id:body?.id})
  if(error) return NextResponse.json({error:error.message||'Run of Show item could not be deleted.'},{status:403})
  return NextResponse.json({ok:true})
}
