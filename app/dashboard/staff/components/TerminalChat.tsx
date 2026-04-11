'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FiHeadphones, 
  FiSend, 
  FiMinimize2, 
  FiCheck, 
  FiImage, 
  FiTrash2,
  FiClock
} from 'react-icons/fi'

export const TerminalChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  // NEW: State for counting incoming Admin messages
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMessages();
    const channel = supabase.channel('terminal-main')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_messages' 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new]);
          
          // If message is from Admin and terminal is closed, increment count
          if (payload.new.is_admin && !isOpen) {
            setUnreadCount(prev => prev + 1);
          }
          // If terminal is open, mark it seen immediately
          if (payload.new.is_admin && isOpen) {
            markAsSeen(payload.new.id);
          }
        }
        
        if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
        }
        
        scrollToBottom();
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isOpen]);

  // Handle clearing unread count when terminal opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      clearUnread();
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    const { data } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
    if (data) {
      setMessages(data);
      // Initialize unread count from Admin messages
      const unread = data.filter(m => m.is_admin && m.status !== 'seen').length;
      setUnreadCount(unread);
    }
    scrollToBottom();
  };

  const markAsSeen = async (id: number) => {
    await supabase.from('chat_messages').update({ status: 'seen' }).eq('id', id);
  };

  const clearUnread = async () => {
    const unreadIds = messages.filter(m => m.is_admin && m.status !== 'seen').map(m => m.id);
    if (unreadIds.length > 0) {
      await supabase.from('chat_messages').update({ status: 'seen' }).in('id', unreadIds);
    }
    setUnreadCount(0);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const clearMedia = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedImage) return;
    setUploading(true);
    
    try {
      let fileUrl = null;
      let type = 'text';
      
      if (selectedImage) {
        type = 'image';
        const path = `images/${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('chat-media')
          .upload(path, selectedImage);
        
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('chat-media').getPublicUrl(path);
        fileUrl = data.publicUrl;
      }

      const { error: dbError } = await supabase.from('chat_messages').insert([{
        text: newMessage,
        sender_name: 'Staff',
        message_type: type,
        file_url: fileUrl,
        is_admin: false,
        status: 'sent'
      }]);

      if (dbError) throw dbError;
      setNewMessage('');
      clearMedia();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-100 font-sans">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
          }
        }}
      />

      {isOpen ? (
        <div className="bg-white w-100 h-162.5 shadow-2xl rounded-[3rem] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
          
          {/* Header */}
          <div className="bg-[#0f172a] p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiHeadphones size={24} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-4 border-[#0f172a] rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tight">Support Terminal</h3>
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest italic">Admin is Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all">
              <FiMinimize2 />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f8fafc]">
            <div className="flex justify-center">
               <span className="bg-slate-200 text-slate-500 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                 {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
               </span>
            </div>

            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.is_admin ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] shadow-sm leading-relaxed ${
                  m.is_admin ? 'bg-white text-slate-700 border border-slate-100' : 'bg-slate-900 text-white'
                }`}>
                  {m.message_type === 'image' && m.file_url && (
                    <img src={m.file_url} className="rounded-xl mb-2 max-h-48 w-full object-cover shadow-sm" alt="Upload" />
                  )}
                  {m.text && <p>{m.text}</p>}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-bold text-slate-400 px-1">
                  <FiClock size={10} className="opacity-50" />
                  {new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  {!m.is_admin && (
                    <div className={`flex -space-x-1 ${m.status === 'seen' ? 'text-blue-500' : 'text-slate-300'}`}>
                      <FiCheck size={12}/><FiCheck size={12}/>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="p-5 bg-white border-t border-slate-50">
            <div className="flex items-center gap-4 mb-3 px-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-blue-600 transition-colors">
                <FiImage size={24}/>
              </button>
            </div>
            
            <form onSubmit={sendMessage} className="flex gap-2">
              <input 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Type your message..." 
                className="flex-1 bg-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
              <button type="submit" disabled={uploading} className="bg-slate-900 text-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg active:scale-95 transition-all">
                {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSend size={24} />}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Floating Toggle Button with Red Badge */
        <button 
          onClick={() => setIsOpen(true)} 
          className="relative bg-slate-900 w-24 h-24 rounded-[3rem] shadow-2xl flex items-center justify-center border-4 border-white transition-all active:scale-95 hover:scale-105"
        >
          <div className="relative">
            <FiHeadphones size={42} className="text-white" />
            
            {/* Unread Message Count Badge */}
            {unreadCount > 0 && (
              <div className="absolute -top-4 -right-4 bg-red-500 text-white text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-white animate-bounce shadow-lg">
                {unreadCount}
              </div>
            )}

            {!unreadCount && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
            )}
          </div>
        </button>
      )}
    </div>
  )
}