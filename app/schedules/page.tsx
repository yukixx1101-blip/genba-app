'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Schedule = {
  id: string
  date: string
  site_name: string
  work_content: string
  memo: string
}

export default function ScheduleList() {
  const [data, setData] = useState<Schedule[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      alert('取得エラー: ' + error.message)
      return
    }

    setData(data || [])
  }

  const handleDelete = async (id: string) => {
    const ok = confirm('削除しますか？')
    if (!ok) return

    const { error } = await supabase.from('schedules').delete().eq('id', id)

    if (error) {
      alert('削除エラー: ' + error.message)
      return
    }

    fetchData()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        padding: 12
      }}
    >
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
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            予定一覧
          </div>
          <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>
            Schedules
          </div>
        </div>

        <div
          style={{
            background: '#808080',
            borderRadius: 16,
            padding: 10,
            marginBottom: 12
          }}
        >
          <Link href="/schedules/new" style={{ textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: 'none',
                background: '#1f1f1f',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 700
              }}
            >
              予定登録
            </button>
          </Link>
        </div>

        {data.length === 0 ? (
          <div
            style={{
              background: '#1f1f1f',
              borderRadius: 16,
              padding: 16,
              color: '#d1d5db'
            }}
          >
            まだ予定がありません
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#1f1f1f',
                borderRadius: 16,
                padding: 14,
                marginBottom: 10,
                color: '#ffffff'
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: '#d1d5db',
                  marginBottom: 8
                }}
              >
                {item.date || '-'}
              </div>

              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 8,
                  lineHeight: 1.4
                }}
              >
                {item.site_name || '現場名未入力'}
              </div>

              <div
                style={{
                  background: '#2a2a2a',
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 8
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: '#d1d5db',
                    marginBottom: 4
                  }}
                >
                  作業内容
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: '#ffffff'
                  }}
                >
                  {item.work_content || 'なし'}
                </div>
              </div>

              <div
                style={{
                  background: '#2a2a2a',
                  borderRadius: 12,
                  padding: 10
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: '#d1d5db',
                    marginBottom: 4
                  }}
                >
                  メモ
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: '#ffffff'
                  }}
                >
                  {item.memo || 'なし'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Link
                  href={`/schedules/${item.id}/edit`}
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <button
                    style={{
                      width: '100%',
                      padding: 10,
                      background: '#808080',
                      color: '#000000',
                      border: 'none',
                      borderRadius: 10,
                      fontWeight: 700
                    }}
                  >
                    編集
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    flex: 1,
                    padding: 10,
                    background: '#464646',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 700
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}