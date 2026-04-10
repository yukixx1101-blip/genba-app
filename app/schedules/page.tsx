'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Schedule = {
  id: number
  title: string
  date: string
  location?: string | null
  description?: string | null
  created_at?: string
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [])

  async function fetchSchedules() {
    setLoading(true)

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('予定取得エラー:', error)
      setSchedules([])
      setLoading(false)
      return
    }

    setSchedules(data ?? [])
    setLoading(false)
  }

  const filteredSchedules = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date)
      scheduleDate.setHours(0, 0, 0, 0)
      return scheduleDate >= today
    })
  }, [schedules])

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  async function handleDelete(id: number) {
    const ok = window.confirm('この予定を削除しますか？')
    if (!ok) return

    const { error } = await supabase.from('schedules').delete().eq('id', id)

    if (error) {
      alert('削除に失敗しました')
      console.error(error)
      return
    }

    setSchedules((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">予定一覧</h1>
            <p className="mt-1 text-sm text-gray-600">
              過去の日付の予定は表示していません
            </p>
          </div>

          <Link
            href="/schedule/new"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            ＋ 予定登録
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
            読み込み中...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-sm">
            表示する予定はありません
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-sm font-medium text-blue-600">
                      {formatDate(schedule.date)}
                    </p>
                    <h2 className="text-lg font-bold text-gray-900">
                      {schedule.title}
                    </h2>

                    {schedule.location ? (
                      <p className="mt-2 text-sm text-gray-600">
                        現場: {schedule.location}
                      </p>
                    ) : null}

                    {schedule.description ? (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                        {schedule.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/schedule/${schedule.id}/edit`}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}