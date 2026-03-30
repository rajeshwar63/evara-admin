import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center px-4 py-3 bg-white border-b border-slate-100">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
          <span className="ml-3 font-heading font-bold text-lg">
            <span className="text-brand-500">Evara</span> Admin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
