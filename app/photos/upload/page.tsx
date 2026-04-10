'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Worker = {
  id: number
  name: string
}

export default function PhotoUploadPage() {
  const router = useRouter()

  const [site, setSite] = useState('')
  const [shotDate, setShotDate] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
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

    setWorkers((data as Worker[]) || [])
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setPhotoFiles(files)
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

    if (photoFiles.length === 0) {
      alert('写真を選択してください')
      return
    }

    try {
      setLoading(true)

      const safeSite = makeSafeFolderName(site)
      const uploadedRows: {
        site: string
        shot_date: string
        worker_id: number | null
        photo_url: string
      }[] = []

      for (const file of photoFiles) {
        const ext = file.name.split('.').pop() || 'jpg'
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const filePath = `${safeSite}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('report-photos')
          .upload(filePath, file)

        if (uploadError) {
          throw new Error(`アップロード失敗: ${file.name} / ${uploadError.message}`)
        }

        const { data } = supabase.storage
          .from('report-photos')
          .getPublicUrl(filePath)

        uploadedRows.push({
          site,
          shot_date: shotDate,
          worker_id: workerId ? Number(workerId) : null,
          photo_url: data.publicUrl
        })
      }

      const { error: insertError } = await supabase
        .from('photos')
        .insert(uploadedRows)

      if (insertError) {
        throw new Error('保存エラー: ' + insertError.message)
      }

      alert(`${uploadedRows.length}枚アップロードしました`)
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
            multiple
            onChange={handleFileChange}
            style={{ marginBottom: 12, color: '#fff' }}
          />

          <div
            style={{
              marginBottom: 16,
              padding: 10,
              borderRadius: 12,
              background: '#1f1f1f',
              color: '#d1d5db',
              fontSize: 13
            }}
          >
            選択中: {photoFiles.length}枚
          </div>

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