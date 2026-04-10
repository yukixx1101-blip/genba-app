'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Photo = {
  id: string
  site: string | null
  photo_url: string | null
  shot_date: string | null
  worker_id: string | null
}

export default function PhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [showAddSite, setShowAddSite] = useState(false)
  const [newSiteName, setNewSiteName] = useState('')
  const [siteQuery, setSiteQuery] = useState('')
  const [dateQuery, setDateQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('id, site, photo_url, shot_date, worker_id')
      .order('site', { ascending: true })

    if (error) {
      alert('取得エラー: ' + error.message)
      return
    }

    setPhotos(data || [])
  }

  const filteredPhotos = useMemo(() => {
    return photos.filter((item) => {
      const siteMatch = siteQuery.trim()
        ? (item.site || '').includes(siteQuery.trim())
        : true

      const dateMatch = dateQuery ? item.shot_date === dateQuery : true

      return siteMatch && dateMatch
    })
  }, [photos, siteQuery, dateQuery])

  const grouped = useMemo(() => {
    const map: Record<string, Photo[]> = {}

    filteredPhotos.forEach((item) => {
      if (!item.photo_url) return
      const key = item.site || '未設定'
      if (!map[key]) map[key] = []
      map[key].push(item)
    })

    return map
  }, [filteredPhotos])

  const siteNames = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'ja'))

  const handleAddSite = () => {
    const site = newSiteName.trim()

    if (!site) {
      alert('現場名を入力してください')
      return
    }

    router.push(`/photos/upload?site=${encodeURIComponent(site)}`)
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={headerStyle}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>写真一覧</div>
          <div style={{ fontSize: 12, color: '#d1d5db' }}>Photos</div>
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
          <button onClick={() => setShowAddSite(true)} style={darkButtonStyle}>
            現場追加
          </button>

          <Link href="/photos/upload" style={{ textDecoration: 'none' }}>
            <button style={darkButtonStyle}>写真アップロード</button>
          </Link>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 16,
            padding: 10,
            marginBottom: 12
          }}
        >
          <input
            type="text"
            placeholder="現場検索"
            value={siteQuery}
            onChange={(e) => setSiteQuery(e.target.value)}
            style={searchInputStyle}
          />

          <input
            type="date"
            value={dateQuery}
            onChange={(e) => setDateQuery(e.target.value)}
            style={{ ...searchInputStyle, marginBottom: 0 }}
          />
        </div>

        {siteNames.length === 0 ? (
          <div style={emptyStyle}>条件に合う写真がありません</div>
        ) : (
          siteNames.map((site) => {
            const sitePhotos = grouped[site] || []
            const firstPhoto = sitePhotos[0]?.photo_url || null
            const latestDate = sitePhotos[0]?.shot_date || '-'

            return (
              <div key={site} style={cardStyle}>
                {firstPhoto && (
                  <img
                    src={firstPhoto}
                    alt={site}
                    style={{
                      width: '100%',
                      height: 160,
                      objectFit: 'cover',
                      borderRadius: 12,
                      marginBottom: 10,
                      display: 'block'
                    }}
                  />
                )}

                <div style={{ fontWeight: 700, marginBottom: 6, color: '#fff' }}>
                  {site}
                </div>

                <div style={{ fontSize: 12, color: '#d1d5db', marginBottom: 4 }}>
                  写真 {sitePhotos.length}枚
                </div>

                <div style={{ fontSize: 12, color: '#d1d5db', marginBottom: 10 }}>
                  最新撮影日 {latestDate}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    href={`/photos/${encodeURIComponent(site)}`}
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    <button style={lightButtonStyle}>一覧</button>
                  </Link>

                  <Link
                    href={`/photos/upload?site=${encodeURIComponent(site)}`}
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    <button style={lightButtonStyle}>アップロード</button>
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      {showAddSite && (
        <div
          onClick={() => setShowAddSite(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 2000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 420,
              background: '#1f1f1f',
              borderRadius: 18,
              padding: 16
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              現場追加
            </div>
            <div style={{ fontSize: 12, color: '#d1d5db', marginBottom: 12 }}>
              Site Name
            </div>

            <input
              type="text"
              placeholder="現場名を入力"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: 'none',
                background: '#808080',
                color: '#000',
                fontSize: 16,
                boxSizing: 'border-box',
                marginBottom: 12
              }}
            />

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  setShowAddSite(false)
                  setNewSiteName('')
                }}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: 'none',
                  background: '#464646',
                  color: '#fff',
                  fontWeight: 700
                }}
              >
                閉じる
              </button>

              <button
                onClick={handleAddSite}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: 'none',
                  background: '#808080',
                  color: '#000',
                  fontWeight: 700
                }}
              >
                作成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const headerStyle = {
  background: '#464646',
  borderRadius: 20,
  padding: 16,
  color: '#fff',
  marginBottom: 12
}

const cardStyle = {
  background: '#1f1f1f',
  borderRadius: 16,
  padding: 12,
  marginBottom: 10
}

const emptyStyle = {
  background: '#1f1f1f',
  borderRadius: 16,
  padding: 16,
  color: '#d1d5db'
}

const darkButtonStyle = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff',
  fontWeight: 700
}

const lightButtonStyle = {
  width: '100%',
  padding: 10,
  borderRadius: 10,
  border: 'none',
  background: '#808080',
  color: '#000',
  fontWeight: 700
}

const searchInputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 10,
  borderRadius: 12,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff',
  boxSizing: 'border-box' as const
}