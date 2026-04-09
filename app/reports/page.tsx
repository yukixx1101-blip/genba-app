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

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('id, date, site, worker_id, content, photo_url')
      .order('date', { ascending: false, nullsFirst: false })

    if (reportsError) {
      alert('日報取得エラー: ' + reportsError.message)
      return
    }

    const { data: workersData, error: workersError } = await supabase
      .from('workers')
      .select('id, name')
      .order('name', { ascending: true })

    if (workersError) {
      alert('作業員取得エラー: ' + workersError.message)
      return
    }

    setReports((reportsData as Report[]) || [])
    setWorkers((workersData as Worker[]) || [])
  }

  const workerMap = useMemo(() => {
    const map: Record<string, string> = {}
    workers.forEach((worker) => {
      map[worker.id] = worker.name
    })
    return map
  }, [workers])

  return (
    <div style={{ padding: 16, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        日報一覧
      </h1>

      <Link href="/reports/new">
        <button
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
            border: 'none',
            background: '#16a34a',
            color: '#fff',
            fontSize: 16
          }}
        >
          ＋ 日報登録
        </button>
      </Link>

      {reports.length === 0 ? (
        <p>まだ日報がありません</p>
      ) : (
        reports.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              background: '#fff'
            }}
          >
            <p>📅 {item.date || '未入力'}</p>
            <p>🏗 {item.site || '未入力'}</p>
            <p>👷 {item.worker_id ? workerMap[item.worker_id] || '未選択' : '未選択'}</p>
            <p>📝 {item.content || '未入力'}</p>

            {item.photo_url && (
              <img
                src={item.photo_url}
                alt="日報写真"
                style={{
                  width: '100%',
                  marginTop: 12,
                  borderRadius: 8
                }}
              />
            )}
          </div>
        ))
      )}
    </div>
  )
}