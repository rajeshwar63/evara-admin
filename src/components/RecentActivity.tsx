import { useState, useEffect } from 'react'
import { getRecentActivity, type ActivityEntry } from '../lib/queries'
import { MessageSquare } from 'lucide-react'

function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return phone || 'N/A'
  return phone.slice(0, 3) + '***' + phone.slice(-3)
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const typeBadgeColors: Record<string, string> = {
  text: 'bg-blue-100 text-blue-700',
  image: 'bg-green-100 text-green-700',
  document: 'bg-purple-100 text-purple-700',
  audio: 'bg-yellow-100 text-yellow-700',
  video: 'bg-red-100 text-red-700',
}

export default function RecentActivity() {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchActivity() {
    try {
      const data = await getRecentActivity(20)
      setEntries(data)
      setError('')
    } catch {
      setError('Failed to load activity')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivity()
    const interval = setInterval(fetchActivity, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-heading font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-heading font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-heading font-semibold text-slate-900 mb-4">Recent Activity</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-400">No recent activity</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <MessageSquare size={16} className="text-slate-400 shrink-0" />
              <span className="text-sm font-mono text-slate-600 w-28 shrink-0">
                {maskPhone(entry.phone_number)}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  typeBadgeColors[entry.message_type] || 'bg-slate-100 text-slate-600'
                }`}
              >
                {entry.message_type}
              </span>
              <span className="text-xs text-slate-400 capitalize">{entry.direction}</span>
              <span className="text-xs text-slate-400 ml-auto shrink-0">
                {timeAgo(entry.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
