import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'

export const WORKSPACE_COOKIE_PREFIX='rye_ws_'
export function workspaceCookieName(workspaceId:string){return `${WORKSPACE_COOKIE_PREFIX}${workspaceId}`}
export function hashWorkspaceToken(token:string){return createHash('sha256').update(token).digest('hex')}

export async function getWorkspaceAccess(workspaceId:string){
  const store=await cookies()
  const token=store.get(workspaceCookieName(workspaceId))?.value
  if(!token||token.length<32) return null
  return {token,hash:hashWorkspaceToken(token)}
}
