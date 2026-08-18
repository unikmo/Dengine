import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getWorkspaceAccess } from '@/lib/workspace-auth'

const STATUSES=['not_started','in_progress','blocked','awaiting_approval','done']

export async function PATCH(req:NextRequest,{params}:{params:Promise<{workspaceId:string,taskId:string}>}){
  const {workspaceId,taskId}=await params; const access=await getWorkspaceAccess(workspaceId)
  if(!access) return NextResponse.json({error:'Workspace access required.'},{status:401})
  const body=await req.json(); const db=createServerClient(); let replan:any=null

  if(typeof body?.targetDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(body.targetDate)){
    const result=await db.rpc('rye_replan_task_date',{p_workspace_id:workspaceId,p_task_id:taskId,p_access_hash:access.hash,p_new_target_date:body.targetDate})
    if(result.error) return NextResponse.json({error:result.error.message||'Task replanning failed.'},{status:403})
    replan=result.data
  }

  if(body?.status||body?.ownerMemberId!==undefined||body?.evidenceNote!==undefined||body?.blockedReason!==undefined){
    const status=STATUSES.includes(body?.status)?body.status:'in_progress'
    const {error}=await db.rpc('rye_update_task',{
      p_workspace_id:workspaceId,p_task_id:taskId,p_access_hash:access.hash,p_status:status,
      p_owner_member_id:body?.ownerMemberId||null,p_evidence_note:typeof body?.evidenceNote==='string'?body.evidenceNote.slice(0,2000):null,
      p_blocked_reason:typeof body?.blockedReason==='string'?body.blockedReason.slice(0,1000):null,
    })
    if(error) return NextResponse.json({error:error.message||'Task update failed.'},{status:403})
  }
  return NextResponse.json({ok:true,replan})
}
