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

  const handleDelete = async (id: string) => {
    const ok = confirm('削除しますか？')
    if (!ok) return

    await supabase.from('reports').delete().eq('id', id)
    fetchAll()
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

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* タイトル */}
        <div style={{
          background: '#464646',
          padding: 16,
          borderRadius: 20,
          color: '#fff',
          marginBottom: 12
        }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>日報一覧</div>
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
            <button key={w.id} onClick={() => setSelectedWorker(w.id)} style={tab}>
              {w.name}
            </button>
          ))}
        </div>

        {/* 一覧 */}
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

            {/* 👇 ここ追加（編集・削除） */}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Link href={`/reports/${r.id}/edit`} style={{ flex: 1 }}>
                <button style={btn}>編集</button>
              </Link>

              <button
                onClick={() => handleDelete(r.id)}
                style={delBtn}
              >
                削除
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

const tab = {
  padding: '6px 10px',
  borderRadius: 10,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff'
}

const btn = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: 'none',
  background: '#808080',
  color: '#000',
  fontWeight: 700
}

const delBtn = {
  flex: 1,
  padding: 10,
  borderRadius: 10,
  border: 'none',
  background: '#464646',
  color: '#fff',
  fontWeight: 700
}