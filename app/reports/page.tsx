'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { supabase } from '@/lib/supabase'
import {
  CalendarDays,
  ClipboardList,
  FileText,
  MapPin,
  User,
  Pencil,
  Trash2
} from 'lucide-react'

type Schedule = {
  id: string
  date: string
  site_name: string
  work_content: string
  memo: string
}

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

export default function ScheduleCalendarPage() {
  const [value, setValue] = useState<Date>(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)

    const [
      { data: schedulesData, error: schedulesError },
      { data: reportsData, error: reportsError },
      { data: workersData, error: workersError }
    ] = await Promise.all([
      supabase
        .from('schedules')
        .select('id, date, site_name, work_content, memo')
        .order('date', { ascending: true }),
      supabase
        .from('reports')
        .select('id, date, site, worker_id, content, photo_url')
        .order('date', { ascending: true }),
      supabase
        .from('workers')
        .select('id, name')
        .order('name', { ascending: true })
    ])

    if (schedulesError) {
      alert('予定取得エラー: ' + schedulesError.message)
      setLoading(false)
      return
    }

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

    setSchedules((schedulesData as Schedule[]) || [])
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

  const formatDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const normalizeDbDate = (dateText: string | null) => {
    if (!dateText) return ''
    return String(dateText).slice(0, 10)
  }

  const selectedDateText = formatDate(value)

  const selectedSchedules = useMemo(() => {
    return schedules.filter((item) => normalizeDbDate(item.date) === selectedDateText)
  }, [schedules, selectedDateText])

  const selectedReports = useMemo(() => {
    return reports.filter((item) => normalizeDbDate(item.date) === selectedDateText)
  }, [reports, selectedDateText])

  const hasSchedule = (date: Date) => {
    const calendarDateText = formatDate(date)
    return schedules.some((item) => normalizeDbDate(item.date) === calendarDateText)
  }

  const hasReport = (date: Date) => {
    const calendarDateText = formatDate(date)
    return reports.some((item) => normalizeDbDate(item.date) === calendarDateText)
  }

  const handleDeleteSchedule = async (id: string) => {
    const ok = confirm('この予定を削除しますか？')
    if (!ok) return

    const { error } = await supabase.from('schedules').delete().eq('id', id)

    if (error) {
      alert('削除エラー: ' + error.message)
      return
    }

    fetchAll()
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null

    const scheduleExists = hasSchedule(date)
    const reportExists = hasReport(date)

    if (!scheduleExists && !reportExists) return null

    return (
      <div
        style={{
          marginTop: 3,
          display: 'flex',
          justifyContent: 'center',
          gap: 4
        }}
      >
        {scheduleExists && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: '#ffffff',
              display: 'inline-block'
            }}
          />
        )}
        {reportExists && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: '#d1d5db',
              display: 'inline-block'
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        padding: 12
      }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div
          style={{
            background: '#464646',
            borderRadius: 20,
            padding: 16,
            color: '#ffffff',
            marginBottom: 12
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700 }}>カレンダー</div>
          <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
            Schedule & Reports
          </div>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 20,
            padding: 12,
            marginBottom: 12,
            display: 'flex',
            gap: 8
          }}
        >
          <Link href="/schedules" style={{ flex: 1, textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 12,
                border: 'none',
                background: '#1f1f1f',
                color: '#ffffff',
                fontWeight: 700
              }}
            >
              一覧へ戻る
            </button>
          </Link>

          <Link href="/schedules/new" style={{ flex: 1, textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 12,
                border: 'none',
                background: '#1f1f1f',
                color: '#ffffff',
                fontWeight: 700
              }}
            >
              新規登録
            </button>
          </Link>
        </div>

        <div
          style={{
            background: '#808080',
            padding: 12,
            borderRadius: 20,
            marginBottom: 12
          }}
        >
          <div
            style={{
              background: '#1f1f1f',
              borderRadius: 16,
              padding: 10
            }}
          >
            <Calendar
              onChange={(nextValue) => setValue(nextValue as Date)}
              value={value}
              locale="ja-JP"
              tileContent={tileContent}
            />
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: '#ffffff',
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap'
            }}
          >
            <span>● 白: 予定あり</span>
            <span>● 薄グレー: 日報あり</span>
          </div>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 20,
            padding: 12
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
            {selectedDateText}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 13,
                color: '#d1d5db',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <CalendarDays size={15} />
              予定
            </div>

            {selectedSchedules.length === 0 ? (
              <div
                style={{
                  background: '#1f1f1f',
                  color: '#d1d5db',
                  borderRadius: 16,
                  padding: 12
                }}
              >
                予定はありません
              </div>
            ) : (
              selectedSchedules.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#1f1f1f',
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 8,
                    color: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <MapPin size={14} />
                    <span>{item.site_name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <ClipboardList size={14} />
                    <span>{item.work_content}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#d1d5db' }}>
                    {item.memo || 'メモなし'}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <Link href={`/schedules/${item.id}/edit`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button
                        style={{
                          width: '100%',
                          padding: 9,
                          borderRadius: 10,
                          border: 'none',
                          background: '#808080',
                          color: '#000000',
                          fontWeight: 700
                        }}
                      >
                        編集
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDeleteSchedule(item.id)}
                      style={{
                        flex: 1,
                        padding: 9,
                        borderRadius: 10,
                        border: 'none',
                        background: '#464646',
                        color: '#ffffff',
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

          <div>
            <div
              style={{
                fontSize: 13,
                color: '#d1d5db',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <FileText size={15} />
              日報
            </div>

            {selectedReports.length === 0 ? (
              <div
                style={{
                  background: '#1f1f1f',
                  color: '#d1d5db',
                  borderRadius: 16,
                  padding: 12
                }}
              >
                日報はありません
              </div>
            ) : (
              selectedReports.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#1f1f1f',
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 8,
                    color: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <MapPin size={14} />
                    <span>{item.site || '現場未入力'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <User size={14} />
                    <span>
                      {item.worker_id ? workerMap[item.worker_id] || '未選択' : '未選択'}
                    </span>
                  </div>

                  <div style={{ fontSize: 14, lineHeight: 1.6 }}>{item.content || '内容なし'}</div>

                  {item.photo_url && (
                    <img
                      src={item.photo_url}
                      alt="日報写真"
                      style={{
                        width: '100%',
                        marginTop: 10,
                        borderRadius: 12
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <Link href={`/reports/${item.id}/edit`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button
                        style={{
                          width: '100%',
                          padding: 9,
                          borderRadius: 10,
                          border: 'none',
                          background: '#808080',
                          color: '#000000',
                          fontWeight: 700
                        }}
                      >
                        編集
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {loading && (
          <div style={{ color: '#d1d5db', textAlign: 'center', marginTop: 12 }}>
            読み込み中...
          </div>
        )}
      </div>
    </div>
  )
}