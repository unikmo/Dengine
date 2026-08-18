import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getWorkspaceAccess } from '@/lib/workspace-auth'

export async function POST(req:NextRequest,{params}:{params:Promise<{workspaceId:string}>}){
  const {workspaceId}=await params; const access=await getWorkspaceAccess(workspaceId)
  if(!access) return NextResponse.json({error:'Workspace access required.'},{status:401})
  const body=await req.json(); const taskId=typeof body?.taskId==='string'?body.taskId:''; const text=typeof body?.body==='string'?body.body.trim():''; const author=typeof body?.author==='string'?body.author.trim():''
  if(!taskId||!text) return NextResponse.json({error:'Task and comment are required.'},{status:400})
  const db=createServerClient(); const {data,error}=await db.rpc('rye_add_comment',{p_workspace_id:workspaceId,p_task_id:taskId,p_access_hash:access.hash,p_author:author,p_body:text})
  if(error) return NextResponse.json({error:error.message||'Comment could not be added.'},{status:403})
  return NextResponse.json({ok:true,id:data})
}
