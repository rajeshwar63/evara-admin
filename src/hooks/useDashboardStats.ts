import { useState, useEffect, useCallback } from 'react'
import {
  getUserCount,
  getUserCountByPlan,
  getNewUsersThisWeek,
  getUserGrowthLast30Days,
  getDocumentCountToday,
  getDocumentCountThisWeek,
  getDocumentCountThisMonth,
  getDocumentsByType,
  getTotalStorageUsed,
  getAvgDocsPerUser,
} from '../lib/queries'

export interface DashboardStats {
  totalUsers: number
  planCounts: { plan: string; count: number }[]
  newUsersThisWeek: number
  userGrowth: { date: string; count: number }[]
  docsToday: number
  docsThisWeek: number
  docsThisMonth: number
  docsByType: { message_type: string; count: number }[]
  totalStorage: number
  avgDocsPerUser: number
  isLoading: boolean
  error: string
  lastUpdated: Date | null
  refresh: () => void
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState({
    totalUsers: 0,
    planCounts: [] as { plan: string; count: number }[],
    newUsersThisWeek: 0,
    userGrowth: [] as { date: string; count: number }[],
    docsToday: 0,
    docsThisWeek: 0,
    docsThisMonth: 0,
    docsByType: [] as { message_type: string; count: number }[],
    totalStorage: 0,
    avgDocsPerUser: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    setError('')

    const results = await Promise.allSettled([
      getUserCount(),
      getUserCountByPlan(),
      getNewUsersThisWeek(),
      getUserGrowthLast30Days(),
      getDocumentCountToday(),
      getDocumentCountThisWeek(),
      getDocumentCountThisMonth(),
      getDocumentsByType(),
      getTotalStorageUsed(),
      getAvgDocsPerUser(),
    ])

    function getValue<T>(index: number, fallback: T): T {
      const r = results[index]
      return r.status === 'fulfilled' ? r.value as T : fallback
    }

    setStats({
      totalUsers: getValue(0, 0),
      planCounts: getValue(1, []),
      newUsersThisWeek: getValue(2, 0),
      userGrowth: getValue(3, []),
      docsToday: getValue(4, 0),
      docsThisWeek: getValue(5, 0),
      docsThisMonth: getValue(6, 0),
      docsByType: getValue(7, []),
      totalStorage: getValue(8, 0),
      avgDocsPerUser: getValue(9, 0),
    })

    const failedCount = results.filter(r => r.status === 'rejected').length
    if (failedCount > 0) {
      setError(`${failedCount} queries failed to load`)
    }

    setIsLoading(false)
    setLastUpdated(new Date())
  }, [])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 60000)
    return () => clearInterval(interval)
  }, [fetchAll])

  return { ...stats, isLoading, error, lastUpdated, refresh: fetchAll }
}
