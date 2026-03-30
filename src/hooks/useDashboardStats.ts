import { useState, useEffect, useCallback } from 'react'
import * as queries from '../lib/queries'
import type { ActivityEntry } from '../lib/queries'

interface DashboardStats {
  totalUsers: number
  freeUsers: number
  trialUsers: number
  paidUsers: number
  newUsersThisWeek: number
  userGrowth: { date: string; count: number }[]
  planDistribution: { plan: string; count: number }[]
  documentsByType: { message_type: string; count: number }[]
  docsToday: number
  docsThisWeek: number
  docsThisMonth: number
  activeReminders: number
  searchesToday: number
  totalStorage: number
  avgDocsPerUser: number
  recentActivity: ActivityEntry[]
  lastUpdated: Date
  isLoading: boolean
  error: string | null
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    freeUsers: 0,
    trialUsers: 0,
    paidUsers: 0,
    newUsersThisWeek: 0,
    userGrowth: [],
    planDistribution: [],
    documentsByType: [],
    docsToday: 0,
    docsThisWeek: 0,
    docsThisMonth: 0,
    activeReminders: 0,
    searchesToday: 0,
    totalStorage: 0,
    avgDocsPerUser: 0,
    recentActivity: [],
    lastUpdated: new Date(),
    isLoading: true,
    error: null,
  })

  const fetchStats = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        queries.getUserCount(),
        queries.getUserCountByPlan(),
        queries.getNewUsersThisWeek(),
        queries.getUserGrowthLast30Days(),
        queries.getDocumentCountToday(),
        queries.getDocumentCountThisWeek(),
        queries.getDocumentCountThisMonth(),
        queries.getDocumentsByType(),
        queries.getTotalStorageUsed(),
        queries.getActiveRemindersCount(),
        queries.getSearchCountToday(),
        queries.getAvgDocsPerUser(),
        queries.getRecentActivity(20),
      ])

      const getValue = <T,>(index: number, fallback: T): T => {
        const result = results[index]
        return result.status === 'fulfilled' ? (result.value as T) : fallback
      }

      const planDist = getValue(1, [] as { plan: string; count: number }[])
      const freeUsers = planDist.find(p => p.plan === 'free')?.count ?? 0
      const trialUsers = planDist.find(p => p.plan === 'trial')?.count ?? 0
      const paidUsers = planDist
        .filter(p => p.plan === 'individual' || p.plan === 'family')
        .reduce((sum, p) => sum + p.count, 0)

      const failedQueries = results.filter(r => r.status === 'rejected')

      setStats({
        totalUsers: getValue(0, 0),
        freeUsers,
        trialUsers,
        paidUsers,
        newUsersThisWeek: getValue(2, 0),
        userGrowth: getValue(3, []),
        planDistribution: planDist,
        documentsByType: getValue(7, []),
        docsToday: getValue(4, 0),
        docsThisWeek: getValue(5, 0),
        docsThisMonth: getValue(6, 0),
        activeReminders: getValue(9, 0),
        searchesToday: getValue(10, 0),
        totalStorage: getValue(8, 0),
        avgDocsPerUser: getValue(11, 0),
        recentActivity: getValue(12, []),
        lastUpdated: new Date(),
        isLoading: false,
        error: failedQueries.length > 0
          ? `${failedQueries.length} queries failed`
          : null,
      })
    } catch (err) {
      setStats(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch stats',
      }))
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { ...stats, refetch: fetchStats }
}
