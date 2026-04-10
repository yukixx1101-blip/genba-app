'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Report = {
  id: string
  photo_url: string | null
}

export default function SitePhotosPage() {
  const params = useParams()
  const site = decodeURIComponent(params.site as string)

  const [data, setData] = useState<Report[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase
      .from('reports')
      .select('id, photo_url')
      .eq('site', site)

    setData(data || [])
  }

  const handleDelete = async (id: string) => {
    const ok = confirm('削除しますか？')
    if (!ok) return

    await supabase.from('reports').update({ photo_url: null }).eq('id', id)
    fetchData()
  }

  const handleReplace = async (id: string, file: File) => {
    const filePath = `photos/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file)

    if (uploadError) {
      alert('アップロード失敗')
      return
    }

    const { data } = supabase.storage.from('photos').getPublicUrl(filePath)

    await supabase
      .from('reports')
      .update({ photo_url: data.publicUrl })
      .eq('id', id)

    fetchData()
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={header}>{site}</div>

        <div style={grid}>
          {data.map((item) =>
            item.photo_url ? (
              <div key={item.id} style={card}>
                <img src={item.photo_url} style={img} />

                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button onClick={() => handleDelete(item.id)} style={btn}>
                    削除
                  </button>

                  <label style={btn}>
                    差替
                    <input
                      type="file"
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
      </div>
    </div>
  )
}

const header = {
  background: '#464646',
  borderRadius: 20,
  padding: 16,
  color: '#fff',
  marginBottom: 12,
  fontWeight: 700
}

const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10
}

const card = {
  background: '#1f1f1f',
  padding: 8,
  borderRadius: 12
}

const img = {
  width: '100%',
  borderRadius: 8
}

const btn = {
  flex: 1,
  padding: 6,
  borderRadius: 8,
  border: 'none',
  background: '#808080',
  color: '#000',
  fontSize: 12
}