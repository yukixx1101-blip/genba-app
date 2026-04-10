'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PhotoUploadPage() {
  const router = useRouter()

  const [site, setSite] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [sites, setSites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    const { data } = await supabase
      .from('photos')
      .select('site')

    if (!data) return

    const unique = Array.from(
      new Set(data.map((d) => d.site).filter(Boolean))
    ) as string[]

    setSites(unique)
  }

  const makeSafeFolderName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '')
  }

  const handleUpload = async () => {
    if (!site.trim()) {
      alert('現場名を入力してください')
      return
    }

    if (!photoFile) {
      alert('写真を選択してください')
      return
    }

    try {
      setLoading(true)

      const ext = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const filePath = `${makeSafeFolderName(site)}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('report-photos')
        .upload(filePath, photoFile)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('report-photos')
        .getPublicUrl(filePath)

      const { error } = await supabase.from('photos').insert({
        site,
        photo_url: data.publicUrl
      })

      if (error) {
        throw error
      }

      alert('アップロード完了')
      router.push('/photos')
    } catch (e: any) {
      alert('エラー: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: 12 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        <div style={header}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>写真アップロード</div>
          <div style={sub}>Upload Photo</div>
        </div>

        <div style={box}>

          <select
            value={site}
            onChange={(e) => setSite(e.target.value)}
            style={input}
          >
            <option value="">現場選択</option>
            {sites.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="新規現場名"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            style={input}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            style={{ marginBottom: 16, color: '#fff' }}
          />

          <button onClick={handleUpload} style={btn}>
            {loading ? 'アップロード中...' : 'アップロード'}
          </button>

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
  marginBottom: 12
}

const sub = {
  fontSize: 12,
  color: '#d1d5db'
}

const box = {
  background: '#808080',
  borderRadius: 20,
  padding: 12
}

const input = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  borderRadius: 12,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff'
}

const btn = {
  width: '100%',
  padding: 12,
  borderRadius: 12,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff',
  fontWeight: 700
}