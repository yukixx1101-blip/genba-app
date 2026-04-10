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
  CalendarRange
} from 'lucide-react'

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const channel = supabase
      .channel('realtime-home-notify')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessage('日報が追加されました')
          }
          if (payload.eventType === 'UPDATE') {
            setMessage('日報が更新されました')
          }
          if (payload.eventType === 'DELETE') {
            setMessage('日報が削除されました')
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessage('スケジュールが追加されました')
          }
          if (payload.eventType === 'UPDATE') {
            setMessage('スケジュールが更新されました')
          }
          if (payload.eventType === 'DELETE') {
            setMessage('スケジュールが削除されました')
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

    const timer = setTimeout(() => {
      setMessage('')
    }, 2500)

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
    {
      href: '/reports',
      ja: '日報一覧',
      en: 'Reports',
      icon: FileText
    },
    {
      href: '/reports/new',
      ja: '日報登録',
      en: 'New Report',
      icon: SquarePen
    },
    {
      href: '/photos',
      ja: '写真一覧',
      en: 'Photos',
      icon: ImageIcon
    },
    {
      href: '/schedules',
      ja: '予定一覧',
      en: 'Schedules',
      icon: CalendarDays
    },
    {
      href: '/schedules/new',
      ja: '予定登録',
      en: 'New Schedule',
      icon: CalendarPlus
    },
    {
      href: '/schedules/calendar',
      ja: 'カレンダー',
      en: 'Calendar',
      icon: CalendarRange
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '12px 12px 20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          margin: '0 auto'
        }}
      >
        <div
          style={{
            background: '#111111',
            borderRadius: 22,
            padding: 18,
            color: '#ffffff',
            boxShadow: '0 14px 30px rgba(0, 0, 0, 0.16)',
            marginBottom: 12
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  letterSpacing: '0.02em'
                }}
              >
                株式会社 玄
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: '#d4d4d4',
                  lineHeight: 1.6
                }}
              >
                今日もお疲れ様です。
              </div>
            </div>

            <div
              style={{
                minWidth: 88,
                textAlign: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16,
                padding: '10px 10px'
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#bdbdbd',
                  marginBottom: 4,
                  letterSpacing: '0.06em'
                }}
              >
                TODAY
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#ffffff'
                }}
              >
                {today}
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div
            style={{
              background: '#ffffff',
              color: '#111111',
              border: '1px solid #d9d9d9',
              borderRadius: 16,
              padding: '11px 14px',
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.04)'
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: 14,
            border: '1px solid #e4e4e4',
            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div
            style={{
              marginBottom: 12
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#111111',
                lineHeight: 1.4
              }}
            >
              メニュー
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#7a7a7a',
                marginTop: 2,
                letterSpacing: '0.04em'
              }}
            >
              Quick Access
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 10
            }}
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isDark = index === 0 || index === 3

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  <div
                    style={{
                      background: isDark ? '#111111' : '#f8f8f8',
                      color: isDark ? '#ffffff' : '#111111',
                      border: isDark ? '1px solid #111111' : '1px solid #dddddd',
                      borderRadius: 18,
                      padding: '14px 14px',
                      minHeight: 94,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: isDark
                        ? '0 10px 20px rgba(0, 0, 0, 0.10)'
                        : '0 4px 12px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 10
                      }}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.75}
                        color={isDark ? '#ffffff' : '#111111'}
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          lineHeight: 1.35,
                          marginBottom: 4,
                          letterSpacing: '0.01em'
                        }}
                      >
                        {item.ja}
                      </div>

                      <div
                        style={{
                          fontSize: 11,
                          color: isDark ? '#cfcfcf' : '#6f6f6f',
                          letterSpacing: '0.05em'
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