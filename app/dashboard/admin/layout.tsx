'use client'
import { Sidebar } from './components/Sidebar'
import { GlobalHeader } from './components/GlobalHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-slate-900 antialiased">
      {/* 1. SIDEBAR */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. HEADER */}
        <div className="h-20 shrink-0">
          <GlobalHeader />
        </div>

        {/* 3. SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#F8FAFC]">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none" />
          
          {/* THE FIX: 
              Removed "max-w-[1600px]" and "mx-auto".
              Now the content will stretch to the edges 100%.
          */}
          <div className="w-full h-full p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}