'use client'
import { FiShield, FiClock, FiLock, FiCheckCircle } from 'react-icons/fi'

export function LockTutorial() {
  const steps = [
    {
      title: "01. Access Security Tab",
      desc: "Open the 'Settings' panel from your main sidebar. Inside, locate the 'Security' category to manage terminal access.",
      icon: <FiShield />,
      color: "text-blue-500 bg-blue-50"
    },
    {
      title: "02. Configure Auto-Lock",
      desc: "Use the dropdown to set an 'Idle Timeout'. We recommend 5 minutes for a balance of security and convenience.",
      icon: <FiClock />,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      title: "03. Manual Lockdown",
      desc: "Need to step away? Click the 'Status' button at the bottom of the sidebar to instantly lock the terminal.",
      icon: <FiLock />,
      color: "text-rose-500 bg-rose-50"
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {steps.map((step, i) => (
        <div key={i} className="group flex gap-6 p-6 border border-slate-100 rounded-2xl hover:border-blue-100 hover:bg-blue-50/10 transition-all">
          <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-xl shadow-sm ${step.color}`}>
            {step.icon}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">
              {step.title}
            </h4>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-lg">
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}