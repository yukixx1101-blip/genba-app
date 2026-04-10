'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { supabase } from '@/lib/supabase'

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
  content: string | null
}

export default function CalendarPage() {
  const router = useRouter()
  const [value, setValue] = useState<Date>(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const { data: schedulesData, error: schedulesError } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })

    if (schedulesError) {
      alert('予定取得エラー: ' + schedulesError.message)
      return
    }

    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('id, date, site, content')
      .order('date', { ascending: true })

    if (reportsError) {
      alert('日報取得エラー: ' + reportsError.message)
      return
    }

    setSchedules((schedulesData as Schedule[]) || [])
    setReports((reportsData as Report[]) || [])
  }

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

  const selectedDate = formatDate(value)

  const selectedSchedules = useMemo(() => {
    return schedules.filter((s) => normalizeDbDate(s.date) === selectedDate)
  }, [schedules, selectedDate])

  const selectedReports = useMemo(() => {
    return reports.filter((r) => normalizeDbDate(r.date) === selectedDate)
  }, [reports, selectedDate])

  const hasSchedule = (date: Date) => {
    const d = formatDate(date)
    return schedules.some((s) => normalizeDbDate(s.date) === d)
  }

  const hasReport = (date: Date) => {
    const d = formatDate(date)
    return reports.some((r) => normalizeDbDate(r.date) === d)
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null

    const schedule = hasSchedule(date)
    const report = hasReport(date)

    if (!schedule && !report) return null

    return (
      <div
        style={{
          marginTop: 4,
          display: 'flex',
          justifyContent: 'center',
          gap: 4
        }}
      >
        {schedule && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.2)'
            }}
          />
        )}
        {report && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#bfbfbf',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.2)'
            }}
          />
        )}
      </div>
    )
  }

  const handleClickDay = (date: Date) => {
    setValue(date)
  }

  const handleCreateSchedule = () => {
    router.push(`/schedules/new?date=${selectedDate}`)
  }

  return (
    <div style={{ background: '#000000', minHeight: '100vh', padding: 12 }}>
      <style>{`
        .genba-calendar .react-calendar {
          width: 100%;
          border: none;
          background: #1f1f1f;
          color: #ffffff;
          font-family: sans-serif;
        }

        .genba-calendar .react-calendar__navigation button {
          color: #ffffff;
          background: transparent;
          min-width: 44px;
          font-size: 14px;
          border-radius: 10px;
        }

        .genba-calendar .react-calendar__navigation button:enabled:hover,
        .genba-calendar .react-calendar__navigation button:enabled:focus {
          background: #2a2a2a;
        }

        .genba-calendar .react-calendar__month-view__weekdays {
          color: #d1d5db;
          font-size: 12px;
          text-transform: none;
        }

        .genba-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }

        .genba-calendar .react-calendar__tile {
          background: transparent;
          color: #ffffff;
          border-radius: 12px;
          height: 58px;
          position: relative;
        }

        .genba-calendar .react-calendar__tile:enabled:hover,
        .genba-calendar .react-calendar__tile:enabled:focus {
          background: #2a2a2a;
        }

        .genba-calendar .react-calendar__tile--now {
          background: #464646;
          color: #ffffff;
        }

        .genba-calendar .react-calendar__tile--active {
          background: #808080 !important;
          color: #000000 !important;
        }

        .genba-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #6b7280;
        }
      `}</style>

      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div
          style={{
            background: '#464646',
            borderRadius: 20,
            padding: 16,
            color: '#fff',
            marginBottom: 12
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700 }}>カレンダー</div>
          <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
            Calendar
          </div>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 16,
            padding: 10,
            marginBottom: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8
          }}
        >
          <Link href="/schedules" style={{ textDecoration: 'none' }}>
            <button style={btn}>一覧</button>
          </Link>

          <Link href="/schedules/new" style={{ textDecoration: 'none' }}>
            <button style={btn}>登録</button>
          </Link>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 20,
            padding: 12,
            marginBottom: 12
          }}
        >
          <div
            className="genba-calendar"
            style={{
              background: '#1f1f1f',
              borderRadius: 16,
              padding: 10
            }}
          >
            <Calendar
              onChange={(v) => setValue(v as Date)}
              onClickDay={handleClickDay}
              value={value}
              locale="ja-JP"
              tileContent={tileContent}
            />
          </div>

          <div
            style={{
              marginTop: 10,
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              fontSize: 12,
              color: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={legendWhite} />
              予定
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={legendGray} />
              日報
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: '#d1d5db'
            }}
          >
            日付タップで内容確認、下のボタンでその日付の予定登録
          </div>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 20,
            padding: 12
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
              {selectedDate}
            </div>

            <button
              onClick={handleCreateSchedule}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                border: 'none',
                background: '#1f1f1f',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 12
              }}
            >
              この日で予定登録
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={sectionTitle}>予定</div>
            {selectedSchedules.length === 0 ? (
              <div style={empty}>予定なし</div>
            ) : (
              selectedSchedules.map((s) => (
                <div key={s.id} style={item}>
                  <div style={itemTitle}>{s.site_name}</div>
                  <div style={itemText}>{s.work_content}</div>
                  <div style={itemSub}>{s.memo || 'メモなし'}</div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <Link
                      href={`/schedules/${s.id}/edit`}
                      style={{ flex: 1, textDecoration: 'none' }}
                    >
                      <button
                        style={{
                          width: '100%',
                          padding: 10,
                          background: '#808080',
                          color: '#000000',
                          border: 'none',
                          borderRadius: 10,
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

          <div>
            <div style={sectionTitle}>日報</div>
            {selectedReports.length === 0 ? (
              <div style={empty}>日報なし</div>
            ) : (
              selectedReports.map((r) => (
                <div key={r.id} style={item}>
                  <div style={itemTitle}>{r.site || '-'}</div>
                  <div style={itemText}>{r.content || '-'}</div>
                </div>
              ))
            )}
          </div>
        </div>
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

const sectionTitle = {
  fontSize: 12,
  color: '#d1d5db',
  marginBottom: 6
}

const item = {
  background: '#1f1f1f',
  borderRadius: 12,
  padding: 10,
  marginBottom: 8,
  color: '#fff'
}

const empty = {
  background: '#1f1f1f',
  borderRadius: 12,
  padding: 10,
  color: '#d1d5db'
}

const itemTitle = {
  fontWeight: 700,
  marginBottom: 4
}

const itemText = {
  fontSize: 14,
  marginBottom: 4,
  lineHeight: 1.6
}

const itemSub = {
  fontSize: 12,
  color: '#d1d5db'
}

const legendWhite = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#ffffff',
  display: 'inline-block'
}

const legendGray = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#bfbfbf',
  display: 'inline-block'
}