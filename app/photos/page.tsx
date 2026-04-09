'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ReportPhoto = {
  id: string
  date: string
  site_name: string | null
  content: string
  photo_url: string | null
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<ReportPhoto[]>([])

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('id, date, site_name, content, photo_url')
      .not('photo_url', 'is', null)
      .order('site_name', { ascending: true })
      .order('date', { ascending: false })

    if (error) {
      alert('取得エラー: ' + error.message)
      return
    }

    setPhotos((data as ReportPhoto[]) || [])
  }

  const groupedPhotos = useMemo(() => {
    const groups: Record<string, ReportPhoto[]> = {}

    photos.forEach((item) => {
      const key = item.site_name?.trim() || '未分類'
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
    })

    return groups
  }, [photos])

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        写真一覧
      </h1>

      {Object.keys(groupedPhotos).length === 0 ? (
        <p>写真がありません</p>
      ) : (
        Object.entries(groupedPhotos).map(([siteName, items]) => (
          <div key={siteName} style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid #ddd'
              }}
            >
              🏗 {siteName}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#fff'
                  }}
                >
                  {item.photo_url && (
                    <img
                      src={item.photo_url}
                      alt="現場写真"
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  )}

                  <div style={{ padding: 12 }}>
                    <p style={{ marginBottom: 6 }}>📅 {item.date}</p>
                    <p style={{ fontSize: 14, color: '#444' }}>
                      📝 {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}