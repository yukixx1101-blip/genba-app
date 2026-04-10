'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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
  const [value, setValue] = useState<Date>(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const { data: schedulesData } = await supabase
      .from('schedules')
      .select('*')

    const { data: reportsData } = await supabase
      .from('reports')
      .select('*')

    setSchedules(schedulesData || [])
    setReports(reportsData || [])
  }

  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 10)
  }

  const selectedDate = formatDate(value)

  const selectedSchedules = useMemo(() => {
    return schedules.filter((s) => s.date === selectedDate)
  }, [schedules, selectedDate])

  const selectedReports = useMemo(() => {
    return reports.filter((r) => r.date === selectedDate)
  }, [reports, selectedDate])

  const hasSchedule = (date: Date) => {
    const d = formatDate(date)
    return schedules.some((s) => s.date === d)
  }

  const hasReport = (date: Date) => {
    const d = formatDate(date)
    return reports.some((r) => r.date === d)
  }

  const tileContent = ({ date, view }: any) => {
    if (view !== 'month') return null

    const schedule = hasSchedule(date)
    const report = hasReport(date)

    if (!schedule && !report) return null

    return (
      <div
        style={{
          marginTop: 2,
          display: 'flex',
          justifyContent: 'center',
          gap: 3
        }}
      >
        {schedule && (
          <span style={dotWhite} />
        )}
        {report && (
          <span style={dotGray} />
        )}
      </div>
    )
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* ヘッダー */}
        <div style={header}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            カレンダー
          </div>
          <div style={subText}>
            Calendar
          </div>
        </div>

        {/* ナビ */}
        <div style={navBox}>
          <Link href="/schedules" style={link}>
            <button style={btn}>一覧</button>
          </Link>

          <Link href="/schedules/new" style={link}>
            <button style={btn}>登録</button>
          </Link>
        </div>

        {/* カレンダー */}
        <div style={card}>
          <Calendar
            onChange={(v) => setValue(v as Date)}
            value={value}
            locale="ja-JP"
            tileContent={tileContent}
          />
        </div>

        {/* 選択日 */}
        <div style={card}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            {selectedDate}
          </div>

          {/* 予定 */}
          <Section title="予定">
            {selectedSchedules.length === 0 ? (
              <Empty text="予定なし" />
            ) : (
              selectedSchedules.map((s) => (
                <Item key={s.id}>
                  <div style={title}>{s.site_name}</div>
                  <div style={text}>{s.work_content}</div>
                  <div style={subText}>{s.memo || 'メモなし'}</div>
                </Item>
              ))
            )}
          </Section>

          {/* 日報 */}
          <Section title="日報">
            {selectedReports.length === 0 ? (
              <Empty text="日報なし" />
            ) : (
              selectedReports.map((r) => (
                <Item key={r.id}>
                  <div style={title}>{r.site || '-'}</div>
                  <div style={text}>{r.content || '-'}</div>
                </Item>
              ))
            )}
          </Section>
        </div>

      </div>
    </div>
  )
}

/* コンポーネント */
const Section = ({ title, children }: any) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>
      {title}
    </div>
    {children}
  </div>
)

const Item = ({ children }: any) => (
  <div style={item}>{children}</div>
)

const Empty = ({ text }: any) => (
  <div style={empty}>{text}</div>
)

/* スタイル */
const header = {
  background: '#464646',
  borderRadius: 20,
  padding: 16,
  color: '#fff',
  marginBottom: 12
}

const navBox = {
  background: '#808080',
  borderRadius: 16,
  padding: 10,
  marginBottom: 12,
  display: 'flex',
  gap: 8
}

const card = {
  background: '#808080',
  borderRadius: 20,
  padding: 12,
  marginBottom: 12
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
  color: '#aaa'
}

const title = {
  fontWeight: 700,
  marginBottom: 4
}

const text = {
  fontSize: 14,
  marginBottom: 4
}

const subText = {
  fontSize: 12,
  color: '#aaa'
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

const link = { flex: 1, textDecoration: 'none' }

const dotWhite = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#fff'
}

const dotGray = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#aaa'
}