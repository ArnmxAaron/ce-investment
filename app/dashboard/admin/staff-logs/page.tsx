'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface StaffProfile {
  id: string
  full_name: string
  role: string
  total_sales_count: number
  total_revenue: number
}

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<StaffProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaffPerformance()
  }, [])

  async function fetchStaffPerformance() {
    setLoading(true)
    // 1. Get all profiles where role is staff
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('role', 'staff')

    if (profiles) {
      const performanceData = await Promise.all(
        profiles.map(async (staff) => {
          // 2. Get their specific sales stats
          const { data: sales } = await supabase
            .from('sales')
            .select('total_price')
            .eq('sold_by', staff.id)

          const totalRevenue = sales?.reduce((acc, s) => acc + Number(s.total_price), 0) || 0
          
          return {
            ...staff,
            total_sales_count: sales?.length || 0,
            total_revenue: totalRevenue
          }
        })
      )
      setStaffList(performanceData)
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-white text-3xl font-black uppercase tracking-tight">Staff Management</h1>
          <p className="text-slate-500">Monitor performance and access for C & E Staff</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all">
          + New Staff Account
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-slate-500 animate-pulse">Analyzing staff records...</div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-500 text-xs uppercase font-black">
                <tr>
                  <th className="p-5">Staff Member</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Total Sales</th>
                  <th className="p-5">Revenue Generated</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-t border-slate-800 hover:bg-slate-800/30">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 font-black">
                          {staff.full_name[0]}
                        </div>
                        <span className="font-bold text-white">{staff.full_name}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/30">
                        ACTIVE
                      </span>
                    </td>
                    <td className="p-5 font-mono">{staff.total_sales_count} Sales</td>
                    <td className="p-5 font-black text-blue-400">NLe {staff.total_revenue.toLocaleString()}</td>
                    <td className="p-5 text-right">
                      <button className="text-slate-500 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors">
                        Suspend Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-blue-600/5 border border-blue-600/20 rounded-2xl">
        <p className="text-blue-500 text-xs font-bold leading-relaxed">
          💡 <span className="uppercase ml-1">Admin Tip:</span> Performance data is calculated in real-time. Use the "Suspend Access" button if a staff member is no longer authorized to process sales for C & E Investment.
        </p>
      </div>
    </div>
  )
}