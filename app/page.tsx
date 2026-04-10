'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  FileText,
  SquarePen,
  Image as ImageIcon,
  CalendarDays,
  CalendarPlus,
  CalendarRange,
  Bell
} from 'lucide-react'

type NotificationItem = {
  id: string
  message: string
  createdAt: string
}

export default function Home() {
  const [message, setMessage] = useState('')
  const [hasNotification, setHasNotification] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('genba_notifications')
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as NotificationItem[]
      setHasNotification(parsed.length > 0)
    } catch {
      setHasNotification(false)
    }
  }, [])

  const saveNotification = (text: string) => {
    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      message: text,
      createdAt: new Date().toISOString()
    }

    const saved = localStorage.getItem('genba_notifications')
    const current = saved ? (JSON.parse(saved) as NotificationItem[]) : []
    const next = [newItem, ...current].slice(0, 50)

    localStorage.setItem('genba_notifications', JSON.stringify(next))
    setHasNotification(next.length > 0)
  }

  useEffect(() => {
    const channel = supabase
      .channel('realtime-home-notify')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
          setHasNotification(true)

          if (payload.eventType === 'INSERT') {
            setMessage('日報が追加されました')
            saveNotification('日報が追加されました')
          }
          if (payload.eventType === 'UPDATE') {
            setMessage('日報が更新されました')
            saveNotification('日報が更新されました')
          }
          if (payload.eventType === 'DELETE') {
            setMessage('日報が削除されました')
            saveNotification('日報が削除されました')
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        (payload) => {
          setHasNotification(true)

          if (payload.eventType === 'INSERT') {
            setMessage('スケジュールが追加されました')
            saveNotification('スケジュールが追加されました')
          }
          if (payload.eventType === 'UPDATE') {
            setMessage('スケジュールが更新されました')
            saveNotification('スケジュールが更新されました')
          }
          if (payload.eventType === 'DELETE') {
            setMessage('スケジュールが削除されました')
            saveNotification('スケジュールが削除されました')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 2500)
    return () => clearTimeout(timer)
  }, [message])

  const today = useMemo(() => {
    return new Date().toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    })
  }, [])

  const menuItems = [
    { href: '/reports', ja: '日報一覧', en: 'Reports', icon: FileText },
    { href: '/reports/new', ja: '日報登録', en: 'New Report', icon: SquarePen },
    { href: '/photos', ja: '写真一覧', en: 'Photos', icon: ImageIcon },
    { href: '/schedules', ja: '予定一覧', en: 'Schedules', icon: CalendarDays },
    { href: '/schedules/new', ja: '予定登録', en: 'New Schedule', icon: CalendarPlus },
    { href: '/schedules/calendar', ja: 'カレンダー', en: 'Calendar', icon: CalendarRange }
  ]

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
            marginBottom: 12,
            position: 'relative'
          }}
        >
          <Link
            href="/notifications"
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              color: '#ffffff',
              textDecoration: 'none'
            }}
          >
            <div style={{ position: 'relative', width: 24, height: 24 }}>
              <Bell size={22} />
              {hasNotification && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 10,
                    height: 10,
                    background: '#ef4444',
                    borderRadius: '50%',
                    border: '2px solid #464646'
                  }}
                />
              )}
            </div>
          </Link>

          <div style={{ fontSize: 24, fontWeight: 700 }}>
            株式会社 玄
          </div>

          <div style={{ fontSize: 13, color: '#d1d5db', marginTop: 4 }}>
            今日もお疲れ様です。
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: '#ffffff' }}>
            {today}
          </div>
        </div>

        {message && (
          <div
            style={{
              background: '#808080',
              color: '#ffffff',
              padding: 10,
              borderRadius: 14,
              marginBottom: 12,
              fontSize: 13
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            background: '#808080',
            borderRadius: 20,
            padding: 12
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 10,
              color: '#ffffff'
            }}
          >
            メニュー
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10
            }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: '#1f1f1f',
                      borderRadius: 16,
                      padding: 12,
                      minHeight: 90,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Icon size={18} color="#ffffff" />

                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#ffffff'
                        }}
                      >
                        {item.ja}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#d1d5db'
                        }}
                      >
                        {item.en}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}