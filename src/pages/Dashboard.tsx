import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Users,
  UserCheck,
  UserPlus,
  Crown,
  FileText,
  HardDrive,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import { useDashboardStats } from '../hooks/useDashboardStats'
import StatCard from '../components/StatCard'
import RecentActivity from '../components/RecentActivity'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getPlanCount(planCounts: { plan: string; count: number }[], plan: string): number {
  return planCounts.find((p) => p.plan === plan)?.count ?? 0
}

type DocPeriod = 'today' | 'week' | 'month'

export default function Dashboard() {
  const stats = useDashboardStats()
  const [docPeriod, setDocPeriod] = useState<DocPeriod>('today')

  const docCount =
    docPeriod === 'today'
      ? stats.docsToday
      : docPeriod === 'week'
        ? stats.docsThisWeek
        : stats.docsThisMonth

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            {stats.lastUpdated
              ? `Last updated: ${stats.lastUpdated.toLocaleTimeString()}`
              : 'Loading...'}
          </p>
        </div>
        <button
          onClick={stats.refresh}
          disabled={stats.isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={stats.isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {stats.error && (
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100 text-sm text-yellow-700">
          {stats.error}
        </div>
      )}

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="Total Users"
          value={stats.totalUsers}
          subtext={`+${stats.newUsersThisWeek} this week`}
          isLoading={stats.isLoading}
        />
        <StatCard
          icon={<UserCheck size={20} />}
          label="Free Users"
          value={getPlanCount(stats.planCounts, 'free')}
          isLoading={stats.isLoading}
        />
        <StatCard
          icon={<UserPlus size={20} />}
          label="Trial Users"
          value={getPlanCount(stats.planCounts, 'trial')}
          isLoading={stats.isLoading}
        />
        <StatCard
          icon={<Crown size={20} />}
          label="Paid Users"
          value={getPlanCount(stats.planCounts, 'paid')}
          isLoading={stats.isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Growth */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-slate-900 mb-4">User Growth (30 days)</h3>
          <div className="h-64">
            {stats.userGrowth.length > 0 ? (
              <Line
                data={{
                  labels: stats.userGrowth.map((d) =>
                    new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  ),
                  datasets: [
                    {
                      label: 'Users',
                      data: stats.userGrowth.map((d) => d.count),
                      borderColor: '#4F46E5',
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      fill: true,
                      tension: 0.3,
                      pointRadius: 0,
                      pointHitRadius: 10,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { maxTicksLimit: 7, font: { size: 11 } },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { font: { size: 11 } },
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-heading font-semibold text-slate-900 mb-4">Plan Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {stats.planCounts.length > 0 ? (
              <Doughnut
                data={{
                  labels: stats.planCounts.map((p) => p.plan.charAt(0).toUpperCase() + p.plan.slice(1)),
                  datasets: [
                    {
                      data: stats.planCounts.map((p) => p.count),
                      backgroundColor: ['#4F46E5', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
                  },
                  cutout: '65%',
                }}
              />
            ) : (
              <div className="text-slate-400">No data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Document stats with bar chart */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-slate-900">Documents</h3>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            {(['today', 'week', 'month'] as DocPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setDocPeriod(period)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  docPeriod === period
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 flex flex-col justify-center">
            <p className="text-4xl font-bold font-heading text-slate-900">{docCount}</p>
            <p className="text-sm text-slate-500 mt-1">documents this {docPeriod}</p>
          </div>
          <div className="lg:col-span-2 h-48">
            {stats.docsByType.length > 0 ? (
              <Bar
                data={{
                  labels: stats.docsByType.map(
                    (d) => d.message_type.charAt(0).toUpperCase() + d.message_type.slice(1)
                  ),
                  datasets: [
                    {
                      label: 'Count',
                      data: stats.docsByType.map((d) => d.count),
                      backgroundColor: '#4F46E5',
                      borderRadius: 6,
                      barThickness: 32,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, ticks: { font: { size: 11 } } },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText size={18} />}
          label="Docs Today"
          value={stats.docsToday}
          isLoading={stats.isLoading}
        />
        <StatCard
          icon={<FileText size={18} />}
          label="Docs This Week"
          value={stats.docsThisWeek}
          isLoading={stats.isLoading}
        />
        <StatCard
          icon={<HardDrive size={18} />}
          label="Storage Used"
          value={formatBytes(stats.totalStorage)}
          isLoading={stats.isLoading}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Avg Docs/User"
          value={stats.avgDocsPerUser}
          isLoading={stats.isLoading}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
