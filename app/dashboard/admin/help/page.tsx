'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FiHelpCircle, FiInfo } from 'react-icons/fi'
import { LockTutorial } from '../components/LockTutorial'
import { HelpSidebar } from './components/HelpSidebar' // Import the new sidebar

export default function HelpPage() {
  const [topics, setTopics] = useState<any[]>([])
  const [selectedTopic, setSelectedTopic] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data } = await supabase.from('help_articles').select('*').order('category')
        if (data && data.length > 0) {
          setTopics(data)
          setSelectedTopic(data.find((a: any) => a.title.toLowerCase().includes('lock')) || data[0])
        } else {
          const fallback = [{ id: '1', title: 'Lock System Guide', category: 'Security' }]
          setTopics(fallback); setSelectedTopic(fallback[0])
        }
      } finally { setLoading(false) }
    }
    fetchArticles()
  }, [])

  return (
    <div className="flex h-[calc(100vh-140px)] -m-6 lg:-m-8 bg-white rounded-3xl overflow-hidden border border-slate-200">
      <HelpSidebar 
        topics={topics.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))}
        selectedId={selectedTopic?.id}
        onSelect={setSelectedTopic}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      <div className="flex-1 bg-white overflow-y-auto p-10">
        {selectedTopic ? (
          <div className="max-w-2xl">
            <header className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[7px] font-black uppercase tracking-widest mb-3">
                <FiInfo size={10}/> Protocol Reference
              </span>
              <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none mb-2">{selectedTopic.title}</h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{selectedTopic.subtitle || "System SOP"}</p>
            </header>

            {selectedTopic.title.toLowerCase().includes('lock') ? <LockTutorial /> : <p className="text-[9px]">Content Loading...</p>}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10"><FiHelpCircle size={40} /></div>
        )}
      </div>
    </div>
  )
}