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

export default function ScheduleCalendarPage() {
  const [value, setValue] = useState<Date>(new Date())
  const [data, setData] = useState<Schedule[]>([])

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      alert('取得エラー: ' + error.message)
      return
    }

    setData(data || [])
  }

  const formatDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const selectedSchedules = useMemo(() => {
    const dateText = formatDate(value)
    return data.filter((item) => item.date === dateText)
  }, [value, data])

  const hasSchedule = (date: Date) => {
    const dateText = formatDate(date)
    return data.some((item) => item.date === dateText)
  }

  const handleDelete = async (id: string) => {
    const ok = confirm('この予定を削除しますか？')
    if (!ok) return

    const { error } = await supabase.from('schedules').delete().eq('id', id)

    if (error) {
      alert('削除エラー: ' + error.message)
      return
    }

    alert('削除しました')
    fetchSchedules()
  }

  return (
    <div style={{ padding: 16, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        スケジュールカレンダー
      </h1>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Link href="/schedules">
          <button
            style={{
              padding: 10,
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontSize: 14
            }}
          >
            一覧へ戻る
          </button>
        </Link>

        <Link href="/schedules/new">
          <button
            style={{
              padding: 10,
              borderRadius: 8,
              border: 'none',
              background: '#16a34a',
              color: '#fff',
              fontSize: 14
            }}
          >
            新規登録
          </button>
        </Link>
      </div>

      <div
        style={{
          background: '#fff',
          padding: 12,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <Calendar
          onChange={(nextValue) => setValue(nextValue as Date)}
          value={value}
          locale="ja-JP"
          tileContent={({ date, view }) =>
            view === 'month' && hasSchedule(date) ? (
              <div
                style={{
                  marginTop: 2,
                  fontSize: 10,
                  color: '#ef4444',
                  textAlign: 'center'
                }}
              >
                ●
              </div>
            ) : null
          }
        />
      </div>

      <div
        style={{
          marginTop: 20,
          background: '#fff',
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          {formatDate(value)} の予定
        </h2>

        {selectedSchedules.length === 0 ? (
          <p>予定はありません</p>
        ) : (
          selectedSchedules.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 12,
                marginBottom: 10
              }}
            >
              <p>🏗 {item.site_name}</p>
              <p>🔧 {item.work_content}</p>
              <p>📝 {item.memo || 'なし'}</p>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <Link href={`/schedules/${item.id}/edit`}>
                  <button
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      border: 'none',
                      background: '#2563eb',
                      color: '#fff'
                    }}
                  >
                    編集
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: 'none',
                    background: '#ef4444',
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
