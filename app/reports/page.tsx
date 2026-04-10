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
  work_hours: number | null
  overtime_hours: number | null
  is_holiday_work: boolean | null
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
    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false })

    if (reportsError) {
      alert('日報取得エラー: ' + reportsError.message)
      return
    }

    const { data: workersData, error: workersError } = await supabase
      .from('workers')
      .select('*')
      .order('name', { ascending: true })

    if (workersError) {
      alert('作業員取得エラー: ' + workersError.message)
      return
    }

    setReports(reportsData || [])
    setWorkers(workersData || [])
  }

  const handleDelete = async (id: string) => {
    const ok = confirm('この日報を削除しますか？')
    if (!ok) return

    const { error } = await supabase.from('reports').delete().eq('id', id)

    if (error) {
      alert('削除エラー: ' + error.message)
      return
    }

    alert('削除しました')
    fetchAll()
  }

  const workerMap = useMemo(() => {
    const map: Record<string, string> = {}
    workers.forEach((w) => {
      map[w.id] = w.name
    })
    return map
  }, [workers])

  const filteredReports = useMemo(() => {
    if (selectedWorker === 'all') return reports
    return reports.filter((r) => r.worker_id === selectedWorker)
  }, [reports, selectedWorker])

  const printHref =
    selectedWorker === 'all'
      ? '/reports/print'
      : `/reports/print?workerId=${encodeURIComponent(selectedWorker)}`

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div
          style={{
            background: '#464646',
            padding: 16,
            borderRadius: 20,
            color: '#fff',
            marginBottom: 12
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700 }}>日報一覧</div>
          <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
            Reports
          </div>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 16,
            padding: 10,
            marginBottom: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8
          }}
        >
          <Link href="/reports/new" style={{ textDecoration: 'none' }}>
            <button style={btn}>日報登録</button>
          </Link>

          <Link href={printHref} style={{ textDecoration: 'none' }}>
            <button style={btn}>PDF出力</button>
          </Link>

          <Link href="/reports/monthly" style={{ textDecoration: 'none' }}>
            <button style={btn}>月間まとめ</button>
          </Link>
        </div>

        <div
          style={{
            background: '#808080',
            padding: 8,
            borderRadius: 12,
            marginBottom: 12,
            display: 'flex',
            gap: 6,
            overflowX: 'auto'
          }}
        >
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

        {filteredReports.length === 0 ? (
          <div
            style={{
              background: '#1f1f1f',
              color: '#fff',
              padding: 14,
              borderRadius: 12
            }}
          >
            日報はまだありません
          </div>
        ) : (
          filteredReports.map((r) => (
            <div
              key={r.id}
              style={{
                background: '#1f1f1f',
                color: '#fff',
                padding: 12,
                borderRadius: 12,
                marginBottom: 10
              }}
            >
              <div style={{ fontSize: 14, marginBottom: 4 }}>{r.date || '-'}</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>{r.site || '-'}</div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                {r.worker_id ? workerMap[r.worker_id] || '-' : '-'}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 8
                }}
              >
                <div style={infoBox}>
                  <div style={infoLabel}>作業時間</div>
                  <div style={infoValue}>{Number(r.work_hours ?? 0).toFixed(1)}h</div>
                </div>

                <div style={infoBox}>
                  <div style={infoLabel}>残業時間</div>
                  <div style={infoValue}>{Number(r.overtime_hours ?? 0).toFixed(1)}h</div>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: r.is_holiday_work ? '#808080' : '#464646',
                  color: '#fff',
                  fontSize: 12,
                  marginBottom: 8
                }}
              >
                {r.is_holiday_work ? '休日出勤あり' : '通常勤務'}
              </div>

              <div style={{ lineHeight: 1.6 }}>{r.content || '-'}</div>

              {r.photo_url && (
                <img
                  src={r.photo_url}
                  alt="日報写真"
                  style={{
                    width: '100%',
                    marginTop: 8,
                    borderRadius: 10
                  }}
                />
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Link
                  href={`/reports/${r.id}/edit`}
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <button
                    style={{
                      width: '100%',
                      padding: 10,
                      borderRadius: 10,
                      border: 'none',
                      background: '#808080',
                      color: '#000',
                      fontWeight: 700
                    }}
                  >
                    編集
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(r.id)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: 'none',
                    background: '#464646',
                    color: '#fff',
                    fontWeight: 700
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
  whiteSpace: 'nowrap' as const
}

const infoBox = {
  background: '#2a2a2a',
  borderRadius: 10,
  padding: 10
}

const infoLabel = {
  fontSize: 11,
  color: '#d1d5db',
  marginBottom: 4
}

const infoValue = {
  fontSize: 16,
  color: '#ffffff',
  fontWeight: 700
}