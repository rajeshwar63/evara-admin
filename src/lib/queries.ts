import { supabase } from './supabase'

export interface ActivityEntry {
  id: string
  phone_number: string
  message_type: string
  direction: string
  created_at: string
}

export async function getUserCount(): Promise<number> {
  try {
    const { count } = await supabase.from('users').select('*', { count: 'exact', head: true })
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getUserCountByPlan(): Promise<{ plan: string; count: number }[]> {
  try {
    const { data } = await supabase.from('users').select('plan')
    const counts: Record<string, number> = {}
    for (const row of data ?? []) {
      const plan = row.plan || 'free'
      counts[plan] = (counts[plan] || 0) + 1
    }
    return Object.entries(counts).map(([plan, count]) => ({ plan, count }))
  } catch {
    return []
  }
}

export async function getNewUsersThisWeek(): Promise<number> {
  try {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString())
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getUserGrowthLast30Days(): Promise<{ date: string; count: number }[]> {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    // Group by date
    const dailyCounts: Record<string, number> = {}
    for (const row of data ?? []) {
      const date = row.created_at.split('T')[0]
      dailyCounts[date] = (dailyCounts[date] || 0) + 1
    }

    // Fill missing days and compute cumulative
    const result: { date: string; count: number }[] = []
    let cumulative = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() - 29 + i)
      const dateStr = d.toISOString().split('T')[0]
      cumulative += dailyCounts[dateStr] || 0
      result.push({ date: dateStr, count: cumulative })
    }

    return result
  } catch {
    return []
  }
}

export async function getDocumentCountToday(): Promise<number> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getDocumentCountThisWeek(): Promise<number> {
  try {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const { count } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString())
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getDocumentCountThisMonth(): Promise<number> {
  try {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const { count } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo.toISOString())
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getDocumentsByType(): Promise<{ message_type: string; count: number }[]> {
  try {
    const { data } = await supabase.from('documents').select('message_type')
    const counts: Record<string, number> = {}
    for (const row of data ?? []) {
      const type = row.message_type || 'unknown'
      counts[type] = (counts[type] || 0) + 1
    }
    return Object.entries(counts).map(([message_type, count]) => ({ message_type, count }))
  } catch {
    return []
  }
}

export async function getTotalStorageUsed(): Promise<number> {
  try {
    const { data } = await supabase.from('documents').select('file_size_bytes')
    let total = 0
    for (const row of data ?? []) {
      total += row.file_size_bytes || 0
    }
    return total
  } catch {
    return 0
  }
}

export async function getActiveRemindersCount(): Promise<number> {
  try {
    const { count } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getSearchCountToday(): Promise<number> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('search_log')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
    return count ?? 0
  } catch {
    return 0
  }
}

export async function getRecentActivity(limit: number = 20): Promise<ActivityEntry[]> {
  try {
    const { data } = await supabase
      .from('messages_log')
      .select('id, phone_number, message_type, direction, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)
    return (data as ActivityEntry[]) ?? []
  } catch {
    return []
  }
}

export async function getAvgDocsPerUser(): Promise<number> {
  try {
    const { count: docCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    if (!userCount || userCount === 0) return 0
    return Math.round(((docCount ?? 0) / userCount) * 10) / 10
  } catch {
    return 0
  }
}
