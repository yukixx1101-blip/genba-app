'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Calendar, MapPin, FileText } from 'lucide-react'

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
  const [selectedWorker, setSelectedWorker] = useState<string>('all')

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
      .order('name')

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

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* タイトル */}
        <div
          style={{
            background: '#464646',
            padding: 16,
            borderRadius: 20,
            marginBottom: 12,
            color: '#fff'
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            日報一覧
          </div>
          <div style={{ fontSize: 12, color: '#d1d5db' }}>
            Reports
          </div>
        </div>

        {/* 新規ボタン */}
        <Link href="/reports/new">
          <button
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 12,
              borderRadius: 14,
              border: 'none',
              background: '#1f1f1f',
              color: '#fff',
              fontWeight: 700
            }}
          >
            日報登録
          </button>
        </Link>

        {/* 作業員フィルター */}
        <div
          style={{
            background: '#808080',
            borderRadius: 16,
            padding: 8,
            display: 'flex',
            overflowX: 'auto',
            gap: 6,
            marginBottom: 12
          }}
        >
          <button
            onClick={() => setSelectedWorker('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 12,
              border: 'none',
              background: selectedWorker === 'all' ? '#1f1f1f' : '#bfbfbf',
              color: '#fff',
              fontSize: 12
            }}
          >
            全体
          </button>

          {workers.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorker(w.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 12,
                border: 'none',
                background:
                  selectedWorker === w.id ? '#1f1f1f' : '#bfbfbf',
                color: '#fff',
                fontSize: 12,
                whiteSpace: 'nowrap'
              }}
            >
              {w.name}
            </button>
          ))}
        </div>

        {/* リスト */}
        {filteredReports.length === 0 ? (
          <div style={{ color: '#aaa', textAlign: 'center' }}>
            データなし
          </div>
        ) : (
          filteredReports.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#1f1f1f',
                borderRadius: 16,
                padding: 12,
                marginBottom: 10,
                color: '#fff'
              }}
            >
              <div style={{ fontSize: 13, color: '#d1d5db', marginBottom: 6 }}>
                <Calendar size={14} /> {item.date || '-'}
              </div>

              <div style={{ fontSize: 13, marginBottom: 4 }}>
                <MapPin size={14} /> {item.site || '-'}
              </div>

              <div style={{ fontSize: 13, marginBottom: 4 }}>
                <User size={14} />{' '}
                {item.worker_id ? workerMap[item.worker_id] : '-'}
              </div>

              <div style={{ fontSize: 14, marginTop: 6 }}>
                <FileText size={14} /> {item.content || '-'}
              </div>

              {item.photo_url && (
                <img
                  src={item.photo_url}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    marginTop: 8
                  }}
                />
              )}

              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <Link href={`/reports/${item.id}/edit`} style={{ flex: 1 }}>
                  <button
                    style={{
                      width: '100%',
                      padding: 8,
                      borderRadius: 10,
                      border: 'none',
                      background: '#808080',
                      color: '#000'
                    }}
                  >
                    編集
                  </button>
                </Link>

                <button
                  onClick={async () => {
                    await supabase.from('reports').delete().eq('id', item.id)
                    fetchAll()
                  }}
                  style={{
                    flex: 1,
                    padding: 8,
                    borderRadius: 10,
                    border: 'none',
                    background: '#464646',
                    color: '#fff'
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}