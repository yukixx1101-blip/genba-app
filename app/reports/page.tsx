'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Report = {
  id: string
  date: string | null
  site: string | null
  worker_id: string | null
  content: string | null
  photo_url: string | null
}

type Worker = {
  id: string
  name: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorker, setSelectedWorker] = useState('all')

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const { data: reportsData } = await supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false })

    const { data: workersData } = await supabase
      .from('workers')
      .select('*')

    setReports(reportsData || [])
    setWorkers(workersData || [])
  }

  const workerMap = useMemo(() => {
    const map: Record<string, string> = {}
    workers.forEach((w) => (map[w.id] = w.name))
    return map
  }, [workers])

  const filteredReports = useMemo(() => {
    if (selectedWorker === 'all') return reports
    return reports.filter((r) => r.worker_id === selectedWorker)
  }, [reports, selectedWorker])

  const printHref =
    selectedWorker === 'all'
      ? '/reports/print'
      : `/reports/print?workerId=${selectedWorker}`

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        <div style={{
          background: '#464646',
          padding: 16,
          borderRadius: 20,
          color: '#fff',
          marginBottom: 12
        }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>日報一覧</div>
        </div>

        {/* ボタン */}
        <div style={{
          background: '#808080',
          borderRadius: 16,
          padding: 10,
          marginBottom: 12,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8
        }}>
          <Link href="/reports/new">
            <button style={btn}>日報登録</button>
          </Link>

          <Link href={printHref}>
            <button style={btn}>PDF出力</button>
          </Link>

          <Link href="/reports/monthly">
            <button style={btn}>月間まとめ</button>
          </Link>
        </div>

        {/* フィルター */}
        <div style={{
          background: '#808080',
          padding: 8,
          borderRadius: 12,
          marginBottom: 12,
          display: 'flex',
          gap: 6,
          overflowX: 'auto'
        }}>
          <button onClick={() => setSelectedWorker('all')} style={tab}>
            全体
          </button>

          {workers.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorker(w.id)}
              style={tab}
            >
              {w.name}
            </button>
          ))}
        </div>

        {/* リスト */}
        {filteredReports.map((r) => (
          <div key={r.id} style={{
            background: '#1f1f1f',
            color: '#fff',
            padding: 12,
            borderRadius: 12,
            marginBottom: 10
          }}>
            <div>{r.date}</div>
            <div>{r.site}</div>
            <div>{r.worker_id ? workerMap[r.worker_id] : '-'}</div>
            <div>{r.content}</div>

            {r.photo_url && (
              <img src={r.photo_url} style={{ width: '100%', marginTop: 8 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const btn = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff',
  fontWeight: 700
}

const tab = {
  padding: '6px 10px',
  borderRadius: 10,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff',
  whiteSpace: 'nowrap'
}