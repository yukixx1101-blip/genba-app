'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function MonthlyPage() {
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false })

    setReports(data || [])
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 20 }}>
      <Link href="/reports">
        <button style={{ marginBottom: 20 }}>戻る</button>
      </Link>

      <h1>月間まとめ</h1>

      <button onClick={() => window.print()}>
        PDF出力
      </button>

      {reports.map((r) => (
        <div key={r.id} style={{ borderBottom: '1px solid #ccc', padding: 10 }}>
          <div>{r.date}</div>
          <div>{r.site}</div>
          <div>{r.content}</div>
        </div>
      ))}
    </div>
  )
}