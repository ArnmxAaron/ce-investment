'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { FiSend, FiImage, FiCheck, FiUser, FiClock } from 'react-icons/fi'

export const AdminChatManager = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [uploading, setUploading] = useState(false);
  // NEW: State for counting incoming staff messages
  const [staffUnreadCount, setStaffUnreadCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    const channel = supabase.channel('admin-chat-sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_messages' 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new]);
          
          // If the message is from staff, increment the counter
          if (!payload.new.is_admin) {
            setStaffUnreadCount(prev => prev + 1);
            // If admin is active, mark it seen immediately
            markAsSeen(payload.new.id);
          }
        }
        
        // If an update happens (like staff seeing admin's message), sync local state
        if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
        }

        scrollToBottom();
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) {
      setMessages(data);
      
      // Calculate how many messages from staff are not 'seen'
      const unreadFromStaff = data.filter(m => !m.is_admin && m.status !== 'seen');
      setStaffUnreadCount(unreadFromStaff.length);

      // Auto-clear those unread messages since Admin is now viewing the component
      if (unreadFromStaff.length > 0) {
        const unreadIds = unreadFromStaff.map(m => m.id);
        markMultipleAsSeen(unreadIds);
        setStaffUnreadCount(0); // Reset local count
      }
    }
    scrollToBottom();
  };

  const markAsSeen = async (id: number) => {
    await supabase.from('chat_messages').update({ status: 'seen' }).eq('id', id);
  };

  const markMultipleAsSeen = async (ids: number[]) => {
    await supabase.from('chat_messages').update({ status: 'seen' }).in('id', ids);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setUploading(true);

    try {
      const { error } = await supabase.from('chat_messages').insert([{
        text: replyText,
        sender_name: 'Admin',
        message_type: 'text',
        is_admin: true,
        status: 'sent'
      }]);

      if (error) throw error;
      setReplyText('');
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Admin Header with Counter */}
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiUser size={20} />
            </div>
            {/* Notification Badge for Staff Messages */}
            {staffUnreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                {staffUnreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-sm uppercase tracking-wider leading-none">Staff Support Monitor</h2>
            <p className="text-[10px] text-slate-400 mt-1">
              {staffUnreadCount > 0 ? `${staffUnreadCount} unread messages` : 'Real-time oversight for C&E Investment'}
            </p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Gateway Active</span>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8fafc]">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.is_admin ? 'items-end' : 'items-start'}`}>
            <span className="text-[9px] font-black text-slate-400 mb-1 px-2 uppercase tracking-tighter">
              {m.is_admin ? 'Admin' : m.sender_name}
            </span>
            <div className={`max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
              m.is_admin ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'
            }`}>
              {m.message_type === 'image' && <img src={m.file_url} className="rounded-xl mb-2 max-h-60 w-full object-cover" alt="Staff upload" />}
              <p>{m.text}</p>
            </div>
            <div className="flex items-center gap-2 mt-1.5 px-2">
              <span className="text-[9px] text-slate-400 font-bold opacity-70">
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {/* Checkmarks for Admin's messages (Staff seen status) */}
              {m.is_admin && (
                <div className={`flex -space-x-1 ${m.status === 'seen' ? 'text-blue-500' : 'text-slate-300'}`}>
                  <FiCheck size={12}/><FiCheck size={12}/>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Reply Bar */}
      <form onSubmit={handleAdminReply} className="p-5 bg-white border-t flex gap-3 items-center">
        <div className="flex-1 relative">
          <input 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type a message to staff..."
            className="w-full bg-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <button 
          type="submit" 
          disabled={uploading || !replyText.trim()}
          className="bg-slate-900 text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-30"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSend size={20} />
          )}
        </button>
      </form>
    </div>
  )
}