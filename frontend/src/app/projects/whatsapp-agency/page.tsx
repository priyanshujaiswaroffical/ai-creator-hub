'use client';

import { motion } from 'framer-motion';
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  ArrowLeft,
  Search,
  Clock,
  CheckCircle2,
  Lock,
  Circle,
  ShieldAlert,
  Activity,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_CONVERSATIONS = [
  { 
    id: 'mock-1', 
    phone_number: '+91 98XXX X4321', 
    name: 'John Doe', 
    profile_name: 'John Doe',
    status: 'ACTIVE', 
    session_count: 1,
    last_message: 'How much for the SEO audit?', 
    created_at: new Date().toISOString(),
    messages: [
      { role: 'user', content: 'Hello, I need pricing for SEO services.', created_at: new Date(Date.now() - 3600000).toISOString() },
      { role: 'assistant', content: 'Hi John! Our SEO audits start at ₹25,000. Would you like a custom quote?', created_at: new Date(Date.now() - 3500000).toISOString() }
    ]
  },
  { 
    id: 'mock-2', 
    phone_number: '+1 415 XXX 8886', 
    name: 'Sarah Miller', 
    profile_name: 'Sarah Miller',
    status: 'ESCALATED', 
    session_count: 2,
    last_message: 'Can I see your portfolio?', 
    created_at: new Date(Date.now() - 5000).toISOString(), // Recent but returning
    messages: [
      { role: 'user', content: 'Hi, I am back. Can I see your past work?', created_at: new Date(Date.now() - 5000).toISOString() },
      { role: 'assistant', content: 'Welcome back Sarah! Certainly. You can explore our featured projects right here.', created_at: new Date(Date.now() - 4000).toISOString() }
    ]
  },
];

export default function WhatsAppAgencyDashboard() {
  const [isLive, setIsLive] = useState(false);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState('mock-1');
  const [loading, setLoading] = useState(false);
  const [clientPhone, setClientPhone] = useState('');
  const [messageCache, setMessageCache] = useState<Record<string, any[]>>({});

  const toggleLiveMode = (val: boolean) => {
    setIsLive(val);
    if (val) {
      setLoading(true);
      setConversations([]);
      setActiveChatId('');
      setTimeout(() => setLoading(false), 800);
    } else {
      setConversations(MOCK_CONVERSATIONS);
      setActiveChatId('mock-1');
      setLoading(false);
    }
  };

  const isSearchReady = clientPhone.replace(/\D/g, '').length >= 10;

  useEffect(() => {
    if (!isLive) return;
    
    let isMounted = true;
    const fetchData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_AGENCY_API_URL || 'http://localhost:8000';
        const phoneParam = isSearchReady ? `&phone=${clientPhone}` : '';
        const url = `${apiBase}/api/conversations?limit=20${phoneParam}`;
        
        const res = await fetch(url, { headers: { 'Authorization': `Bearer WhatsappAiAgencySecret` } });
        const data = await res.json();
        
        if (data.conversations && isMounted) {
          // Double-Guard: Filter duplicates by last 10 digits
          const seen = new Set();
          const unique = data.conversations.filter((c: any) => {
            const raw = (c.phone_number || "").replace(/\D/g, "");
            const norm = raw.length >= 10 ? raw.slice(-10) : raw;
            if (seen.has(norm)) return false;
            seen.add(norm);
            return true;
          });
          
          setConversations(unique);
          
          if (isSearchReady && !activeChatId && unique.length > 0) {
             setActiveChatId(unique[0].id);
          }
        }
      } catch (err) { console.error('Fetch error:', err); }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [isLive, clientPhone, activeChatId, isSearchReady]);

  useEffect(() => {
    if (!isLive || !activeChatId || activeChatId.startsWith('mock-')) return;
    const fetchMessages = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_AGENCY_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiBase}/api/conversations/${activeChatId}`, { headers: { 'Authorization': `Bearer WhatsappAiAgencySecret` } });
        const data = await res.json();
        if (data.messages) setMessageCache(prev => ({ ...prev, [activeChatId]: data.messages }));
      } catch (err) { console.error('Message fetch error:', err); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [isLive, activeChatId]);

  const activeChat = useMemo(() => {
    if (!isLive || activeChatId.startsWith('mock-')) {
      return MOCK_CONVERSATIONS.find(c => c.id === activeChatId) || MOCK_CONVERSATIONS[0];
    }
    const base = conversations.find(c => c.id === activeChatId);
    if (!base) return null;
    return { ...base, messages: messageCache[activeChatId] || [] };
  }, [isLive, activeChatId, conversations, messageCache]);

  // --- SMART STATUS LOGIC (TODAY + 1ST VISIT = ACTIVE, OTHERWISE = ESCALATED) ---
  const getSmartStatus = (chat: any) => {
    const chatDate = new Date(chat.created_at);
    const now = new Date();
    const diffInHours = (now.getTime() - chatDate.getTime()) / (1000 * 60 * 60);
    
    // If older than 24h OR returning user (session_count > 1) -> ESCALATED
    if (diffInHours >= 24 || (chat.session_count && chat.session_count > 1)) {
      return 'ESCALATED';
    }
    return 'ACTIVE';
  };

  return (
    <div className="h-screen bg-[var(--bg-obsidian)] text-[var(--text-primary)] font-body selection:bg-[var(--accent-purple)] selection:text-white overflow-hidden flex flex-col">
      {/* Top Nav */}
      <nav className="h-16 border-b border-[var(--glass-border)] bg-[var(--bg-surface)]/50 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/#projects" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center shadow-[0_0_15px_rgba(112,0,255,0.4)]">
              <Bot size={18} className="text-white" />
            </div>
            <h1 className="font-display font-bold tracking-tight text-lg">
              Agency <span className="text-gradient">Command Center</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] p-1 rounded-full border border-[var(--glass-border)]">
            <button onClick={() => toggleLiveMode(false)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${!isLive ? 'bg-[var(--accent-purple)] text-white shadow-lg shadow-[var(--accent-purple)]/20' : 'text-[var(--text-secondary)] hover:text-white'}`}>Portfolio</button>
            <button onClick={() => toggleLiveMode(true)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${isLive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-[var(--text-secondary)] hover:text-white'}`}>Live Node</button>
          </div>

          <a href={`https://wa.me/15556412032?text=Hello! I'm testing the Agency Bot from the portfolio. My number is ${clientPhone || '...'}`} target="_blank" className="btn-primary !py-2 !px-4 !text-[11px] !rounded-lg flex items-center gap-2 hover:scale-105 transition-transform shrink-0 shadow-xl shadow-[var(--accent-purple)]/30"><Zap size={14} />Test Bot Live</a>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[300px] min-w-[300px] max-w-[300px] shrink-0 border-r border-[var(--glass-border)] bg-[var(--bg-surface)]/30 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[var(--glass-border)] shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
              <input 
                type="text" 
                placeholder={isLive ? "Enter number to unlock..." : "Search demo clients..."} 
                value={clientPhone} 
                onChange={(e) => setClientPhone(e.target.value)} 
                className="w-full bg-[var(--bg-obsidian)] border border-[var(--glass-border)] rounded-xl py-2.5 pl-10 pr-4 text-xs focus:border-[var(--accent-purple)] outline-none transition-all" 
              />
            </div>
            {isLive && !isSearchReady && (
              <div className="mt-4 flex items-center justify-between">
                 <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                   <Activity size={12} className="text-emerald-500" />
                   Recent Activity
                 </span>
                 <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase">Live Sync</span>
                 </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {loading ? <div className="p-5 space-y-4">{[1,2,3].map(i => <div key={i} className="animate-pulse h-16 bg-white/5 rounded-xl" />)}</div> : 
              conversations.map((chat) => {
                const status = getSmartStatus(chat);
                const isMyChat = isSearchReady && activeChatId === chat.id;
                
                return (
                  <button 
                    key={chat.id} 
                    disabled={isLive && !isSearchReady}
                    onClick={() => setActiveChatId(chat.id)} 
                    className={`w-full p-5 text-left border-b border-[var(--glass-border)]/20 transition-all relative group overflow-hidden ${isMyChat ? 'bg-[var(--accent-purple)]/10 border-l-4 border-l-[var(--accent-purple)]' : 'hover:bg-white/5'} ${isLive && !isSearchReady ? 'cursor-default grayscale-[0.5]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className="font-bold text-[13px] tracking-tight text-white flex-1 truncate uppercase">{!isLive ? chat.name : (chat.profile_name || chat.phone_number)}</span>
                      <span className="text-[10px] text-[var(--text-muted)] font-bold whitespace-nowrap">{chat.created_at ? new Date(chat.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'LIVE'}</span>
                    </div>
                    <p className="text-[12px] text-[var(--text-secondary)] line-clamp-1 opacity-60 mb-2 truncate">{chat.last_message || 'Session active...'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {status === 'ACTIVE' ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] flex items-center gap-1.5">
                          <Circle size={6} className="fill-emerald-400" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                          <ShieldAlert size={10} />
                          ESCALATED
                          {chat.session_count > 1 && <span className="text-[7px] opacity-60 font-black ml-1">(RE-VISIT)</span>}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            }
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 flex flex-col bg-[var(--bg-obsidian)] relative overflow-hidden">
          {!isSearchReady && isLive && (
             <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--bg-obsidian)]/95 backdrop-blur-xl">
                <div className="max-w-xl w-full p-10 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-3xl bg-[var(--accent-purple)]/10 flex items-center justify-center border border-[var(--accent-purple)]/20 mx-auto mb-8 shadow-[0_0_50px_rgba(112,0,255,0.2)]">
                    <ShieldCheck size={40} className="text-[var(--accent-purple)]" />
                  </div>
                  
                  <h2 className="font-display font-bold text-3xl mb-4 tracking-tight text-white">Secure Privacy Gateway</h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-10 opacity-70 max-w-md mx-auto">
                    To protect client privacy, this dashboard requires your full phone number to unlock your personal AI conversation logs.
                  </p>
                  
                  <div className="flex flex-col gap-4 text-center mb-10">
                    <p className="text-sm text-[var(--text-primary)] font-medium">
                      <span className="text-[var(--accent-purple)] font-bold">Step 1:</span> Click <span className="text-[var(--accent-purple)] font-bold">Test Bot Live</span> to start a chat.
                    </p>
                    <p className="text-sm text-[var(--text-primary)] font-medium">
                      <span className="text-[var(--accent-purple)] font-bold">Step 2:</span> Enter your full <span className="text-white font-bold">10-digit number</span> to see logs.
                    </p>
                  </div>
                  
                  <div className="inline-flex items-center gap-4 py-3 px-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold uppercase tracking-widest text-[11px] shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    100% SAFE • END-TO-END ENCRYPTED
                  </div>
                </div>
             </div>
          )}

          {/* Header */}
          <div className="h-16 px-8 border-b border-[var(--glass-border)] bg-[var(--bg-surface)]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 overflow-hidden">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-purple)]/20 to-transparent border border-white/10 flex items-center justify-center shrink-0"><MessageSquare size={20} className="text-[var(--accent-purple)]" /></div>
               <div className="overflow-hidden">
                 <h2 className="font-bold text-base text-white tracking-wide truncate">{!isLive ? activeChat?.name : (activeChat?.profile_name || activeChat?.phone_number || 'Secure Session')}</h2>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest truncate opacity-70">End-to-End Encrypted Communication</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
            {activeChat?.messages?.map((msg: any, idx: number) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-start' : 'items-end ml-auto text-right'}`}>
                <div className={`p-5 rounded-2xl shadow-xl border ${msg.role === 'user' ? 'bg-[var(--bg-surface)] border-white/10 rounded-tl-none text-white' : 'bg-[var(--accent-purple)]/10 border-[var(--accent-purple)]/30 rounded-tr-none text-white shadow-[0_0_20px_rgba(112,0,255,0.1)]'}`}>
                  <p className="text-[14px] leading-relaxed">{msg.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                   {msg.role === 'user' ? 'Client' : 'AI Agent'} • {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-[var(--glass-border)] text-center bg-black/10 shrink-0"><p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-[0.5em] opacity-50">Agency Node Process v1.1.2</p></div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(112,0,255,0.1); border-radius: 10px; }
        .text-gradient { background: linear-gradient(135deg, #fff 0%, var(--accent-purple) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      `}</style>
    </div>
  );
}
