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

export default function Home() {
  const [message, setMessage] = useState('')
  const [hasNotification, setHasNotification] = useState(false)

  useEffect(() => {
    const channel = supabase
      .channel('realtime-home-notify')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        () => {
          setHasNotification(true)
          setMessage('日報が更新されました')
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        () => {
          setHasNotification(true)
          setMessage('スケジュールが更新されました')
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
        
        {/* ヘッダー */}
        <div
          style={{
            background: '#6e6e6e', // ←ここ変更
            borderRadius: 20,
            padding: 16,
            color: '#ffffff',
            marginBottom: 12,
            position: 'relative'
          }}
        >
          {/* 通知 */}
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <Bell size={20} />
            {hasNotification && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 10,
                  height: 10,
                  background: '#ef4444',
                  borderRadius: '50%'
                }}
              />
            )}
          </div>

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

        {/* 通知 */}
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

        {/* メニュー枠 */}
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