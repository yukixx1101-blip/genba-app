'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Schedule = {
  id: string
  date: string
  site_name: string
  work_content: string
  memo: string
}

export default function ScheduleList() {
  const [data, setData] = useState<Schedule[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select('id, date, site_name, work_content, memo')
      .order('date', { ascending: true })

    if (error) {
      alert('取得エラー: ' + error.message)
      return
    }

    setData(data || [])
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        スケジュール一覧
      </h1>

      <Link href="/schedules/new">
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
          ＋ スケジュール登録
        </button>
      </Link>

      {data.length === 0 ? (
        <p>まだ予定がありません</p>
      ) : (
        data.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              background: '#fff'
            }}
          >
            <p>📅 {item.date}</p>
            <p>🏗 {item.site_name}</p>
            <p>🔧 {item.work_content}</p>
            <p>📝 {item.memo || 'なし'}</p>
          </div>
        ))
      )}
    </div>
  )
}