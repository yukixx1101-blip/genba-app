import ReportsPrintClient from './ReportsPrintClient'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ReportsPrintPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const workerIdParam = params.workerId
  const workerId = Array.isArray(workerIdParam)
    ? workerIdParam[0] || 'all'
    : workerIdParam || 'all'

  return <ReportsPrintClient workerId={workerId} />
}