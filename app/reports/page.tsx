'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Report = {
  id: string
  date: string | null
  site_name: string | null
  content: string | null
  photo_url: string | null
  workers: { name: string }[] | null
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        id,
        date,
        site_name,
        content,
        photo_url,
        workers(name)
      `)
      .order('date', { ascending: false, nullsFirst: false })

    if (error) {
      alert('取得エラー: ' + error.message)
      return
    }

    setReports((data as Report[]) || [])
  }

  return (
    <div style={{ padding: 16, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        日報一覧
      </h1>

      <Link href="/reports/new">
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
          ＋ 日報登録
        </button>
      </Link>

      {reports.length === 0 ? (
        <p>まだ日報がありません</p>
      ) : (
        reports.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              background: '#fff'
            }}
          >
            <p>📅 {item.date || '未入力'}</p>
            <p>🏗 {item.site_name || '未入力'}</p>
            <p>👷 {item.workers?.[0]?.name || '未選択'}</p>
            <p>📝 {item.content || '未入力'}</p>

            {item.photo_url && (
              <img
                src={item.photo_url}
                alt="日報写真"
                style={{
                  width: '100%',
                  marginTop: 12,
                  borderRadius: 8
                }}
              />
            )}
          </div>
        ))
      )}
    </div>
  )
}