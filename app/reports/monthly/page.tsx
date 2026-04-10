'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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

type WorkerSummary = {
  workerId: string
  workerName: string
  count: number
  sites: string[]
  dates: string[]
  contents: string[]
  photos: number
  totalWorkHours: number
  totalOvertimeHours: number
  holidayCount: number
}

export default function MonthlyPage() {
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [reports, setReports] = useState<Report[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMonthlyData(month)
  }, [month])

  const fetchMonthlyData = async (targetMonth: string) => {
    setLoading(true)

    const startDate = `${targetMonth}-01`
    const [year, monthText] = targetMonth.split('-')
    const nextMonthDate = new Date(Number(year), Number(monthText), 1)
    const endDate = `${nextMonthDate.getFullYear()}-${String(
      nextMonthDate.getMonth() + 1
    ).padStart(2, '0')}-01`

    const [{ data: reportsData, error: reportsError }, { data: workersData, error: workersError }] =
      await Promise.all([
        supabase
          .from('reports')
          .select(
            'id, date, site, worker_id, content, photo_url, work_hours, overtime_hours, is_holiday_work'
          )
          .gte('date', startDate)
          .lt('date', endDate)
          .order('date', { ascending: true }),
        supabase
          .from('workers')
          .select('id, name')
          .order('name', { ascending: true })
      ])

    if (reportsError) {
      alert('日報取得エラー: ' + reportsError.message)
      setLoading(false)
      return
    }

    if (workersError) {
      alert('作業員取得エラー: ' + workersError.message)
      setLoading(false)
      return
    }

    setReports((reportsData as Report[]) || [])
    setWorkers((workersData as Worker[]) || [])
    setLoading(false)
  }

  const workerMap = useMemo(() => {
    const map: Record<string, string> = {}
    workers.forEach((worker) => {
      map[worker.id] = worker.name
    })
    return map
  }, [workers])

  const summaries = useMemo<WorkerSummary[]>(() => {
    const grouped: Record<string, WorkerSummary> = {}

    reports.forEach((report) => {
      const workerId = report.worker_id || 'unassigned'
      const workerName =
        report.worker_id && workerMap[report.worker_id]
          ? workerMap[report.worker_id]
          : '未選択'

      if (!grouped[workerId]) {
        grouped[workerId] = {
          workerId,
          workerName,
          count: 0,
          sites: [],
          dates: [],
          contents: [],
          photos: 0,
          totalWorkHours: 0,
          totalOvertimeHours: 0,
          holidayCount: 0
        }
      }

      grouped[workerId].count += 1

      if (report.site && !grouped[workerId].sites.includes(report.site)) {
        grouped[workerId].sites.push(report.site)
      }

      if (report.date) {
        grouped[workerId].dates.push(report.date)
      }

      if (report.content) {
        grouped[workerId].contents.push(report.content)
      }

      if (report.photo_url) {
        grouped[workerId].photos += 1
      }

      grouped[workerId].totalWorkHours += Number(report.work_hours ?? 0)
      grouped[workerId].totalOvertimeHours += Number(report.overtime_hours ?? 0)

      if (report.is_holiday_work) {
        grouped[workerId].holidayCount += 1
      }
    })

    return Object.values(grouped).sort((a, b) =>
      a.workerName.localeCompare(b.workerName, 'ja')
    )
  }, [reports, workerMap])

  const totalReports = reports.length
  const totalPhotos = reports.filter((item) => item.photo_url).length
  const totalSites = new Set(reports.map((item) => item.site).filter(Boolean)).size
  const totalWorkHours = reports.reduce((sum, item) => sum + Number(item.work_hours ?? 0), 0)
  const totalOvertimeHours = reports.reduce(
    (sum, item) => sum + Number(item.overtime_hours ?? 0),
    0
  )
  const totalHolidayCount = reports.filter((item) => item.is_holiday_work).length

  const monthLabel = useMemo(() => {
    const [y, m] = month.split('-')
    return `${y}年${Number(m)}月`
  }, [month])

  return (
    <div
      style={{
        background: '#ffffff',
        minHeight: '100vh',
        color: '#111111',
        fontFamily: '"Hiragino Sans","Yu Gothic","YuGothic","Meiryo",sans-serif'
      }}
    >
      <style>{`
        @page {
          size: A4;
          margin: 12mm;
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
          maxWidth: 980,
          margin: '0 auto',
          padding: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center'
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

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid #d1d5db',
            fontSize: 14
          }}
        />

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

      <div style={{ maxWidth: 980, margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>月間まとめPDF</h1>
          <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{monthLabel}</div>
          <p style={{ marginTop: 8, color: '#555555', fontSize: 13 }}>
            出力日: {new Date().toLocaleDateString('ja-JP')}
          </p>
        </div>

        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                marginBottom: 18
              }}
            >
              <div style={summaryBox}>
                <div style={summaryLabel}>日報件数</div>
                <div style={summaryValue}>{totalReports}</div>
              </div>

              <div style={summaryBox}>
                <div style={summaryLabel}>現場数</div>
                <div style={summaryValue}>{totalSites}</div>
              </div>

              <div style={summaryBox}>
                <div style={summaryLabel}>写真枚数</div>
                <div style={summaryValue}>{totalPhotos}</div>
              </div>

              <div style={summaryBox}>
                <div style={summaryLabel}>総作業時間</div>
                <div style={summaryValue}>{totalWorkHours.toFixed(1)}h</div>
              </div>

              <div style={summaryBox}>
                <div style={summaryLabel}>総残業時間</div>
                <div style={summaryValue}>{totalOvertimeHours.toFixed(1)}h</div>
              </div>

              <div style={summaryBox}>
                <div style={summaryLabel}>休日出勤件数</div>
                <div style={summaryValue}>{totalHolidayCount}</div>
              </div>
            </div>

            {summaries.length === 0 ? (
              <div
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: 12,
                  padding: 20
                }}
              >
                この月の日報はありません。
              </div>
            ) : (
              summaries.map((summary, index) => (
                <div
                  key={summary.workerId}
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 14,
                    pageBreakInside: 'avoid'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      alignItems: 'flex-start',
                      marginBottom: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{summary.workerName}</div>
                      <div style={{ fontSize: 12, color: '#666666', marginTop: 4 }}>
                        Worker Summary
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#666666' }}>No. {index + 1}</div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '160px 1fr',
                      gap: 8,
                      fontSize: 14,
                      marginBottom: 12
                    }}
                  >
                    <div style={{ color: '#666666' }}>日報件数</div>
                    <div>{summary.count} 件</div>

                    <div style={{ color: '#666666' }}>写真あり件数</div>
                    <div>{summary.photos} 件</div>

                    <div style={{ color: '#666666' }}>総作業時間</div>
                    <div>{summary.totalWorkHours.toFixed(1)}h</div>

                    <div style={{ color: '#666666' }}>総残業時間</div>
                    <div>{summary.totalOvertimeHours.toFixed(1)}h</div>

                    <div style={{ color: '#666666' }}>休日出勤件数</div>
                    <div>{summary.holidayCount} 件</div>

                    <div style={{ color: '#666666' }}>現場一覧</div>
                    <div>{summary.sites.length > 0 ? summary.sites.join(' / ') : 'なし'}</div>

                    <div style={{ color: '#666666' }}>作業日</div>
                    <div>{summary.dates.length > 0 ? summary.dates.join(' / ') : 'なし'}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 13, color: '#666666', marginBottom: 8 }}>
                      作業内容一覧
                    </div>

                    {summary.contents.length === 0 ? (
                      <div style={{ fontSize: 14 }}>なし</div>
                    ) : (
                      <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                        {summary.contents.map((content, contentIndex) => (
                          <li key={`${summary.workerId}-${contentIndex}`} style={{ fontSize: 14 }}>
                            {content}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              ))
            )}

            <div style={{ marginTop: 20 }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 13
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>日付</th>
                    <th style={thStyle}>作業員</th>
                    <th style={thStyle}>現場名</th>
                    <th style={thStyle}>作業時間</th>
                    <th style={thStyle}>残業</th>
                    <th style={thStyle}>休日出勤</th>
                    <th style={thStyle}>作業内容</th>
                    <th style={thStyle}>写真</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td style={tdStyle}>{report.date || ''}</td>
                      <td style={tdStyle}>
                        {report.worker_id ? workerMap[report.worker_id] || '未選択' : '未選択'}
                      </td>
                      <td style={tdStyle}>{report.site || ''}</td>
                      <td style={tdStyle}>{Number(report.work_hours ?? 0).toFixed(1)}h</td>
                      <td style={tdStyle}>{Number(report.overtime_hours ?? 0).toFixed(1)}h</td>
                      <td style={tdStyle}>{report.is_holiday_work ? 'あり' : 'なし'}</td>
                      <td style={tdStyle}>{report.content || ''}</td>
                      <td style={tdStyle}>{report.photo_url ? 'あり' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const summaryBox = {
  border: '1px solid #d1d5db',
  borderRadius: 12,
  padding: 14
}

const summaryLabel = {
  fontSize: 13,
  color: '#666666'
}

const summaryValue = {
  fontSize: 24,
  fontWeight: 700,
  marginTop: 4
}

const thStyle = {
  border: '1px solid #d1d5db',
  padding: 8,
  textAlign: 'left' as const,
  background: '#f3f4f6'
}

const tdStyle = {
  border: '1px solid #d1d5db',
  padding: 8,
  verticalAlign: 'top' as const
}