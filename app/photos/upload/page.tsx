'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Worker = {
  id: string
  name: string
}

export default function PhotoUploadPage() {
  const router = useRouter()

  const [site, setSite] = useState('')
  const [shotDate, setShotDate] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [sites, setSites] = useState<string[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSites()
    fetchWorkers()

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const siteParam = params.get('site')
      if (siteParam) {
        setSite(siteParam)
      }
    }
  }, [])

  const fetchSites = async () => {
    const { data, error } = await supabase.from('photos').select('site')

    if (error) {
      alert('現場取得エラー: ' + error.message)
      return
    }

    if (!data) return

    const unique = Array.from(
      new Set(data.map((d) => d.site).filter(Boolean))
    ) as string[]

    setSites(unique)
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

  const makeSafeFolderName = (name: string) => {
    return (
      name
        .trim()
        .normalize('NFKC')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^[-_]+|[-_]+$/g, '') || 'site-unknown'
    )
  }

  const handleUpload = async () => {
    if (!site.trim()) {
      alert('現場名を入力してください')
      return
    }

    if (!shotDate) {
      alert('撮影日を入力してください')
      return
    }

    if (!photoFile) {
      alert('写真を選択してください')
      return
    }

    try {
      setLoading(true)

      const ext = photoFile.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
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
        shot_date: shotDate,
        worker_id: workerId || null,
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
        <div style={headerStyle}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>写真アップロード</div>
          <div style={{ fontSize: 12, color: '#d1d5db' }}>Upload Photo</div>
        </div>

        <div style={boxStyle}>
          <select value={site} onChange={(e) => setSite(e.target.value)} style={inputStyle}>
            <option value="">現場選択</option>
            {sites.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="新規現場名"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={shotDate}
            onChange={(e) => setShotDate(e.target.value)}
            style={inputStyle}
          />

          <select value={workerId} onChange={(e) => setWorkerId(e.target.value)} style={inputStyle}>
            <option value="">作業員タグを選択</option>
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            style={{ marginBottom: 16, color: '#fff' }}
          />

          <button onClick={handleUpload} style={buttonStyle} disabled={loading}>
            {loading ? 'アップロード中...' : 'アップロード'}
          </button>
        </div>
      </div>
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

const boxStyle = {
  background: '#808080',
  borderRadius: 20,
  padding: 12
}

const inputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  borderRadius: 12,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff',
  boxSizing: 'border-box' as const
}

const buttonStyle = {
  width: '100%',
  padding: 12,
  borderRadius: 12,
  border: 'none',
  background: '#1f1f1f',
  color: '#fff',
  fontWeight: 700
}