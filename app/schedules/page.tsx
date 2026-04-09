'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ScheduleList() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })

    setData(data || [])
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>スケジュール一覧</h1>

      {data.map((item) => (
        <div key={item.id} style={{
          border: '1px solid #ccc',
          marginBottom: 10,
          padding: 10,
          borderRadius: 8
        }}>
          <p>📅 {item.date}</p>
          <p>🏗 {item.site_name}</p>
          <p>🔧 {item.work_content}</p>
          <p>📝 {item.memo}</p>
        </div>
      ))}
    </div>
  )
}