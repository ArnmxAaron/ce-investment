'use client'
import { Sidebar } from './components/Sidebar'
import { GlobalHeader } from './components/GlobalHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <GlobalHeader />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none" />
          
          {/* CHANGED: 
              1. Removed max-w-[1400px] and mx-auto.
              2. Added w-full to allow content to span the whole screen.
              3. Adjusted padding (p-6 to p-10) for better large-screen breathing room.
          */}
          <div className="w-full p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}