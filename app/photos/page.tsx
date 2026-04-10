'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Report = {
  id: string
  site: string | null
  photo_url: string | null
}

export default function PhotosPage() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase
      .from('reports')
      .select('id, site, photo_url')

    setReports(data || [])
  }

  const grouped = useMemo(() => {
    const map: Record<string, Report[]> = {}

    reports.forEach((r) => {
      if (!r.photo_url) return
      const key = r.site || '未設定'

      if (!map[key]) map[key] = []
      map[key].push(r)
    })

    return map
  }, [reports])

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={header}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>写真一覧</div>
          <div style={sub}>Photos</div>
        </div>

        {Object.keys(grouped).map((site) => (
          <div key={site} style={card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{site}</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <Link href={`/photos/${encodeURIComponent(site)}`} style={link}>
                <button style={btn}>一覧</button>
              </Link>

              <Link href={`/reports/new?site=${site}`} style={link}>
                <button style={btn}>アップロード</button>
              </Link>
            </div>

            <div style={{ fontSize: 12, color: '#aaa' }}>
              写真 {grouped[site].length}枚
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const header = {
  background: '#464646',
  borderRadius: 20,
  padding: 16,
  color: '#fff',
  marginBottom: 12
}

const card = {
  background: '#1f1f1f',
  borderRadius: 16,
  padding: 12,
  marginBottom: 10,
  color: '#fff'
}

const btn = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: 'none',
  background: '#808080',
  color: '#000',
  fontWeight: 700
}

const sub = { fontSize: 12, color: '#d1d5db' }
const link = { flex: 1, textDecoration: 'none' }