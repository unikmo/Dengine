import WorkspaceClient from '@/components/WorkspaceClient'

export const dynamic='force-dynamic'

export default async function WorkspacePage({params}:{params:Promise<{workspaceId:string}>}){
  const {workspaceId}=await params
  return <WorkspaceClient workspaceId={workspaceId}/>
}
