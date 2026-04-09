'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Worker = {
  id: string
  name: string
}

export default function NewReportPage() {
  const router = useRouter()

  const [date, setDate] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [site, setSite] = useState('')
  const [content, setContent] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWorkers()
  }, [])

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
    const trimmed = name.trim()

    if (!trimmed) return 'site-unknown'

    return trimmed
      .normalize('NFKC')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9_-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^[-_]+|[-_]+$/g, '') || 'site-unknown'
  }

  const uploadPhoto = async () => {
    if (!photoFile) return null

    const fileExt = photoFile.name.split('.').pop() || 'jpg'
    const safeSite = makeSafeFolderName(site)
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = `${safeSite}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(filePath, photoFile)

    if (uploadError) {
      throw new Error('画像アップロードエラー: ' + uploadError.message)
    }

    const { data } = supabase.storage
      .from('report-photos')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async () => {
    try {
      if (!date) {
        alert('日付を入力してください')
        return
      }

      if (!site.trim()) {
        alert('現場名を入力してください')
        return
      }

      if (!content.trim()) {
        alert('作業内容を入力してください')
        return
      }

      setLoading(true)

      let photoUrl: string | null = null

      if (photoFile) {
        photoUrl = await uploadPhoto()
      }

      const { error } = await supabase.from('reports').insert({
        date,
        site,
        worker_id: workerId || null,
        content,
        photo_url: photoUrl
      })

      if (error) {
        throw new Error('日報保存エラー: ' + error.message)
      }

      alert('日報を保存しました')
      router.push('/reports')
    } catch (error: any) {
      alert(error.message || '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        日報登録
      </h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <input
        type="text"
        placeholder="現場名"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <select
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      >
        <option value="">作業員を選択</option>
        {workers.map((worker) => (
          <option key={worker.id} value={worker.id}>
            {worker.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="作業内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: '100%',
          minHeight: 120,
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
        style={{
          width: '100%',
          marginBottom: 16
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 8,
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          fontSize: 16,
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? '保存中...' : '保存'}
      </button>
    </div>
  )
}