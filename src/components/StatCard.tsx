import type { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subtext?: string
  isLoading?: boolean
}

export default function StatCard({ icon, label, value, subtext, isLoading }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-500 font-body">{label}</span>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
          {subtext !== undefined && <div className="h-4 w-32 bg-slate-50 rounded animate-pulse" />}
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-900 font-heading">{value}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </>
      )}
    </div>
  )
}
