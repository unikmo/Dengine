import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getWorkspaceAccess, hashWorkspaceToken } from '@/lib/workspace-auth'

export async function POST(req:NextRequest,{params}:{params:Promise<{workspaceId:string}>}){
  const {workspaceId}=await params; const access=await getWorkspaceAccess(workspaceId)
  if(!access) return NextResponse.json({error:'Workspace access required.'},{status:401})
  const body=await req.json(); const role=body?.role==='viewer'?'viewer':'editor'
  const name=typeof body?.name==='string'?body.name.trim().slice(0,100):''
  const email=typeof body?.email==='string'?body.email.trim().slice(0,200):''
  const token=randomBytes(32).toString('hex'); const db=createServerClient()
  const {data,error}=await db.rpc('rye_invite_member',{p_workspace_id:workspaceId,p_access_hash:access.hash,p_name:name,p_email:email,p_role:role,p_member_access_hash:hashWorkspaceToken(token)})
  if(error) return NextResponse.json({error:error.message||'Invite could not be created.'},{status:403})
  const url=new URL(`/api/workspaces/join?token=${encodeURIComponent(token)}`,req.url).toString()
  return NextResponse.json({ok:true,memberId:data,inviteUrl:url})
}
