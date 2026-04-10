'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Photo = {
  id: string
  photo_url: string | null
  shot_date: string | null
  worker_id: string | null
}

type Worker = {
  id: string
  name: string
}

export default function SitePhotosPage() {
  const params = useParams()
  const site = decodeURIComponent(params.site as string)

  const [data, setData] = useState<Photo[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
    fetchWorkers()
  }, [site])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('id, photo_url, shot_date, worker_id')
      .eq('site', site)
      .order('shot_date', { ascending: false })

    if (error) {
      alert('取得エラー: ' + error.message)
      return
    }

    setData(data || [])
  }

  const fetchWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      alert('作業員取得エラー: ' + error.message)
      return
    }

    setWorkers(data || [])
  }

  const workerMap = useMemo(() => {
    const map: Record<string, string> = {}
    workers.forEach((worker) => {
      map[worker.id] = worker.name
    })
    return map
  }, [workers])

  const handleDelete = async (id: string) => {
    const ok = confirm('この写真を削除しますか？')
    if (!ok) return

    const { error } = await supabase.from('photos').delete().eq('id', id)

    if (error) {
      alert('削除エラー: ' + error.message)
      return
    }

    fetchData()
  }

  const makeSafeFolderName = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return 'site-unknown'

    return (
      trimmed
        .normalize('NFKC')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^[-_]+|[-_]+$/g, '') || 'site-unknown'
    )
  }

  const handleReplace = async (id: string, file: File) => {
    const fileExt = file.name.split('.').pop() || 'jpg'
    const safeSite = makeSafeFolderName(site)
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = `${safeSite}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(filePath, file)

    if (uploadError) {
      alert('アップロード失敗: ' + uploadError.message)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('report-photos')
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase
      .from('photos')
      .update({ photo_url: publicUrlData.publicUrl })
      .eq('id', id)

    if (updateError) {
      alert('差替エラー: ' + updateError.message)
      return
    }

    fetchData()
  }

  return (
    <div style={{ background: '#000000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div
          style={{
            background: '#464646',
            borderRadius: 20,
            padding: 16,
            color: '#ffffff',
            marginBottom: 12
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700 }}>{site}</div>
          <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
            Site Photos
          </div>
        </div>

        {data.length === 0 ? (
          <div
            style={{
              background: '#1f1f1f',
              color: '#d1d5db',
              borderRadius: 16,
              padding: 16
            }}
          >
            写真はありません
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10
            }}
          >
            {data.map((item) =>
              item.photo_url ? (
                <div
                  key={item.id}
                  style={{
                    background: '#1f1f1f',
                    padding: 8,
                    borderRadius: 12
                  }}
                >
                  <button
                    onClick={() => setSelectedImage(item.photo_url)}
                    style={{
                      width: '100%',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={item.photo_url}
                      alt="現場写真"
                      style={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 8,
                        display: 'block'
                      }}
                    />
                  </button>

                  <div style={{ fontSize: 11, color: '#d1d5db', marginTop: 8, marginBottom: 4 }}>
                    撮影日: {item.shot_date || '-'}
                  </div>

                  <div style={{ fontSize: 11, color: '#d1d5db', marginBottom: 8 }}>
                    作業員: {item.worker_id ? workerMap[item.worker_id] || '-' : '-'}
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 8,
                        border: 'none',
                        background: '#464646',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 700
                      }}
                    >
                      削除
                    </button>

                    <label
                      style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 8,
                        border: 'none',
                        background: '#808080',
                        color: '#000000',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      差替
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleReplace(item.id, file)
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.88)',
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
              maxWidth: 900,
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: -44,
                right: 0,
                padding: '8px 12px',
                borderRadius: 10,
                border: 'none',
                background: '#1f1f1f',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              閉じる
            </button>

            <img
              src={selectedImage}
              alt="拡大写真"
              style={{
                width: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 12,
                display: 'block',
                background: '#111111'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}