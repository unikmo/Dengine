import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { hashWorkspaceToken, workspaceCookieName } from '@/lib/workspace-auth'

export async function GET(req:NextRequest){
  const token=req.nextUrl.searchParams.get('token')||''
  if(token.length<32) return NextResponse.redirect(new URL('/',req.url),303)
  const db=createServerClient(); const {data,error}=await db.rpc('rye_accept_invite',{p_member_access_hash:hashWorkspaceToken(token)})
  const workspaceId=(data as any)?.workspaceId
  if(error||!workspaceId) return NextResponse.redirect(new URL('/?invite=invalid',req.url),303)
  const response=NextResponse.redirect(new URL(`/workspace/${workspaceId}`,req.url),303)
  response.cookies.set(workspaceCookieName(String(workspaceId)),token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*365})
  return response
}
