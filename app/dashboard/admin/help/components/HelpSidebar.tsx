'use client'
import { FiSearch, FiShield, FiBookOpen, FiChevronRight } from 'react-icons/fi'

export function HelpSidebar({ topics, selectedId, onSelect, searchQuery, onSearch }: any) {
  return (
    <div className="w-72 flex flex-col border-r border-slate-100 bg-slate-50/30">
      <div className="p-6 border-b border-slate-100 bg-white">
        <h1 className="text-[10px] font-black text-slate-900 tracking-tighter uppercase italic mb-4">Knowledge Base</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-3" />
          <input 
            type="text" 
            placeholder="Search protocols..." 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-[9px] font-bold outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {topics.map((topic: any) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic)}
            className={`w-full p-3 rounded-xl transition-all text-left border ${
              selectedId === topic.id ? 'bg-white shadow-sm border-slate-200' : 'hover:bg-white/50 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                selectedId === topic.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {topic.title.toLowerCase().includes('lock') ? <FiShield size={12}/> : <FiBookOpen size={12}/>}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest block">{topic.category}</span>
                <p className="font-black text-slate-900 uppercase text-[9px] truncate">{topic.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}