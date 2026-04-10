'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
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

export default function ReportsPrintClient({
  workerId
}: {
  workerId: string
}) {
  const [reports, setReports] = useState<Report[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const didPrintRef = useRef(false)

  useEffect(() => {
    fetchAll()
  }, [workerId])

  useEffect(() => {
    if (loading || didPrintRef.current) return
    didPrintRef.current = true

    const timer = setTimeout(() => {
      window.print()
    }, 400)

    return () => clearTimeout(timer)
  }, [loading])

  const fetchAll = async () => {
    setLoading(true)

    const { data: workersData, error: workersError } = await supabase
      .from('workers')
      .select('id, name')
      .order('name', { ascending: true })

    if (workersError) {
      alert('作業員取得エラー: ' + workersError.message)
      setLoading(false)
      return
    }

    let query = supabase
      .from('reports')
      .select('id, date, site, worker_id, content, photo_url')
      .order('date', { ascending: false, nullsFirst: false })

    if (workerId !== 'all') {
      query = query.eq('worker_id', workerId)
    }

    const { data: reportsData, error: reportsError } = await query

    if (reportsError) {
      alert('日報取得エラー: ' + reportsError.message)
      setLoading(false)
      return
    }

    setWorkers((workersData as Worker[]) || [])
    setReports((reportsData as Report[]) || [])
    setLoading(false)
  }

  const workerMap = useMemo(() => {
    const map: Record<string, string> = {}
    workers.forEach((worker) => {
      map[worker.id] = worker.name
    })
    return map
  }, [workers])

  const title =
    workerId === 'all'
      ? '日報一覧'
      : `${workerMap[workerId] || '作業員'} 日報一覧`

  return (
    <div
      style={{
        background: '#ffffff',
        minHeight: '100vh',
        color: '#111111',
        fontFamily:
          '"Hiragino Sans","Yu Gothic","YuGothic","Meiryo",sans-serif'
      }}
    >
      <style>{`
        @page {
          size: A4;
          margin: 14mm;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div
        className="no-print"
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: 16,
          display: 'flex',
          gap: 8
        }}
      >
        <Link href="/reports" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: 'none',
              background: '#1f1f1f',
              color: '#ffffff',
              fontWeight: 700
            }}
          >
            一覧へ戻る
          </button>
        </Link>

        <button
          onClick={() => window.print()}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: 'none',
            background: '#464646',
            color: '#ffffff',
            fontWeight: 700
          }}
        >
          印刷 / PDF保存
        </button>
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: 24
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>{title}</h1>
          <p style={{ marginTop: 8, color: '#555555', fontSize: 13 }}>
            出力日: {new Date().toLocaleDateString('ja-JP')}
          </p>
        </div>

        {loading ? (
          <p>読み込み中...</p>
        ) : reports.length === 0 ? (
          <p>出力対象の日報がありません。</p>
        ) : (
          reports.map((item, index) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: 12,
                padding: 16,
                marginBottom: 14,
                pageBreakInside: 'avoid'
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 14
                }}
              >
                <div style={{ color: '#666666' }}>日付</div>
                <div>{item.date || '未入力'}</div>

                <div style={{ color: '#666666' }}>現場名</div>
                <div>{item.site || '未入力'}</div>

                <div style={{ color: '#666666' }}>作業員</div>
                <div>
                  {item.worker_id ? workerMap[item.worker_id] || '未選択' : '未選択'}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: '#666666',
                    marginBottom: 6
                  }}
                >
                  作業内容
                </div>
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                    fontSize: 14
                  }}
                >
                  {item.content || '未入力'}
                </div>
              </div>

              {item.photo_url && (
                <div style={{ marginTop: 14 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#666666',
                      marginBottom: 6
                    }}
                  >
                    写真
                  </div>
                  <img
                    src={item.photo_url}
                    alt="日報写真"
                    style={{
                      width: '100%',
                      maxHeight: 420,
                      objectFit: 'contain',
                      borderRadius: 10,
                      border: '1px solid #e5e7eb'
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  marginTop: 10,
                  textAlign: 'right',
                  color: '#999999',
                  fontSize: 12
                }}
              >
                No. {index + 1}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}