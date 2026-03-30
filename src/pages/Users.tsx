import { useState, useEffect, useMemo } from 'react'
import { Users, Search, Eye, EyeOff } from 'lucide-react'
import { getAllUsers, type UserDetail } from '../lib/queries'

function maskPhone(phone: string): string {
  if (phone.length < 7) return '****'
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function isActive(lastActive: string | null): boolean {
  if (!lastActive) return false
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return new Date(lastActive).getTime() > sevenDaysAgo
}

const planBadgeColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-600',
  trial: 'bg-blue-50 text-blue-700',
  individual: 'bg-emerald-50 text-emerald-700',
  family: 'bg-purple-50 text-purple-700',
}

type SortKey = 'phone_number' | 'plan' | 'created_at' | 'doc_count' | 'storage_used' | 'last_active'

export function UsersPage() {
  const [users, setUsers] = useState<UserDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [revealedPhones, setRevealedPhones] = useState<Set<string>>(new Set())

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data)
      setIsLoading(false)
    })
  }, [])

  const toggleReveal = (phone: string) => {
    setRevealedPhones((prev) => {
      const next = new Set(prev)
      if (next.has(phone)) next.delete(phone)
      else next.add(phone)
      return next
    })
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(key === 'phone_number' || key === 'plan')
    }
  }

  const filteredUsers = useMemo(() => {
    let result = users
    if (searchQuery) {
      result = result.filter((u) => u.phone_number.includes(searchQuery))
    }
    result = [...result].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'phone_number':
          cmp = a.phone_number.localeCompare(b.phone_number)
          break
        case 'plan':
          cmp = a.plan.localeCompare(b.plan)
          break
        case 'created_at':
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'doc_count':
          cmp = a.doc_count - b.doc_count
          break
        case 'storage_used':
          cmp = a.storage_used - b.storage_used
          break
        case 'last_active':
          cmp = new Date(a.last_active || 0).getTime() - new Date(b.last_active || 0).getTime()
          break
      }
      return sortAsc ? cmp : -cmp
    })
    return result
  }, [users, searchQuery, sortKey, sortAsc])

  const freeCount = users.filter((u) => u.plan === 'free').length
  const trialCount = users.filter((u) => u.plan === 'trial').length
  const paidCount = users.filter((u) => u.plan === 'individual' || u.plan === 'family').length

  const SortHeader = ({ label, sortField }: { label: string; sortField: SortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
      onClick={() => handleSort(sortField)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === sortField && (
          <span className="text-brand-500">{sortAsc ? '↑' : '↓'}</span>
        )}
      </span>
    </th>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          {users.length} total user{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Total Users</p>
          <p className="text-2xl font-bold font-heading text-slate-900">{isLoading ? '—' : users.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Free</p>
          <p className="text-2xl font-bold font-heading text-slate-600">{isLoading ? '—' : freeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Trial</p>
          <p className="text-2xl font-bold font-heading text-blue-700">{isLoading ? '—' : trialCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Paid</p>
          <p className="text-2xl font-bold font-heading text-emerald-700">{isLoading ? '—' : paidCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <SortHeader label="Phone" sortField="phone_number" />
                <SortHeader label="Plan" sortField="plan" />
                <SortHeader label="Signed Up" sortField="created_at" />
                <SortHeader label="Documents" sortField="doc_count" />
                <SortHeader label="Storage" sortField="storage_used" />
                <SortHeader label="Last Active" sortField="last_active" />
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Users size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-400">
                      {searchQuery ? 'No users match your search' : 'No users found'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const active = isActive(user.last_active)
                  return (
                    <tr
                      key={user.phone_number}
                      className={`border-b border-slate-50 hover:bg-slate-100 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-700">
                            {revealedPhones.has(user.phone_number)
                              ? user.phone_number
                              : maskPhone(user.phone_number)}
                          </span>
                          <button
                            onClick={() => toggleReveal(user.phone_number)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            title={revealedPhones.has(user.phone_number) ? 'Hide' : 'Reveal'}
                          >
                            {revealedPhones.has(user.phone_number) ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            planBadgeColors[user.plan] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{user.doc_count}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatBytes(user.storage_used)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {user.last_active ? timeAgo(user.last_active) : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              active ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                          <span className={`text-xs ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {active ? 'Active' : 'Inactive'}
                          </span>
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
