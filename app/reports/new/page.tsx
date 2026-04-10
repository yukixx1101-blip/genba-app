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
  const [workHours, setWorkHours] = useState('8.0')
  const [overtimeHours, setOvertimeHours] = useState('0.0')
  const [isHolidayWork, setIsHolidayWork] = useState(false)
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

      const parsedWorkHours = Number(workHours || 0)
      const parsedOvertimeHours = Number(overtimeHours || 0)

      if (Number.isNaN(parsedWorkHours) || parsedWorkHours < 0) {
        alert('作業時間を正しく入力してください')
        return
      }

      if (Number.isNaN(parsedOvertimeHours) || parsedOvertimeHours < 0) {
        alert('残業時間を正しく入力してください')
        return
      }

      setLoading(true)

      let photoUrl: string | null = null

      if (photoFile) {
        photoUrl = await uploadPhoto()
      }

      const insertData = {
        date,
        site,
        worker_id: workerId || null,
        content,
        photo_url: photoUrl,
        work_hours: parsedWorkHours,
        overtime_hours: parsedOvertimeHours,
        is_holiday_work: isHolidayWork
      }

      const { error } = await supabase.from('reports').insert(insertData)

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
    <div style={{ minHeight: '100vh', background: '#000000', padding: 12 }}>
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
          <div style={{ fontSize: 22, fontWeight: 700 }}>日報登録</div>
          <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
            New Report
          </div>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 20,
            padding: 12
          }}
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="現場名"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            style={inputStyle}
          />

          <select
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            style={inputStyle}
          >
            <option value="">作業員を選択</option>
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name}
              </option>
            ))}
          </select>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 12
            }}
          >
            <div>
              <div style={labelStyle}>作業時間 / Work Hours</div>
              <input
                type="number"
                step="0.5"
                min="0"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0 }}
              />
            </div>

            <div>
              <div style={labelStyle}>残業時間 / Overtime</div>
              <input
                type="number"
                step="0.5"
                min="0"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0 }}
              />
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#1f1f1f',
              color: '#ffffff',
              padding: 12,
              borderRadius: 12,
              marginBottom: 12,
              fontSize: 14
            }}
          >
            <input
              type="checkbox"
              checked={isHolidayWork}
              onChange={(e) => setIsHolidayWork(e.target.checked)}
            />
            休日出勤 / Holiday Work
          </label>

          <textarea
            placeholder="作業内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              ...inputStyle,
              minHeight: 120,
              resize: 'vertical'
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            style={{
              width: '100%',
              marginBottom: 16,
              color: '#ffffff'
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 12,
              border: 'none',
              background: '#1f1f1f',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  fontSize: 16,
  boxSizing: 'border-box',
  borderRadius: 12,
  border: 'none',
  background: '#1f1f1f',
  color: '#ffffff'
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#ffffff',
  marginBottom: 6
}