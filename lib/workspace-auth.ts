import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'

export const WORKSPACE_COOKIE='rye_workspace_access'

export function hashWorkspaceToken(token:string){return createHash('sha256').update(token).digest('hex')}

export async function getWorkspaceAccess(workspaceId:string){
  const store=await cookies()
  const raw=store.get(WORKSPACE_COOKIE)?.value
  if(!raw) return null
  const dot=raw.indexOf('.')
  if(dot<1) return null
  const id=raw.slice(0,dot); const token=raw.slice(dot+1)
  if(id!==workspaceId||token.length<32) return null
  return {token,hash:hashWorkspaceToken(token)}
}
