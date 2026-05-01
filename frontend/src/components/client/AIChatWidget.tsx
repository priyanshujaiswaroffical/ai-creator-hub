/**
 * AIChatWidget — Restored version with FAQ and Original Premium Styling.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chat-store';

export default function AIChatWidget() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isStreaming,
    isOpen,
    toggleChat,
    sendMessage,
    clearChat,
  } = useChatStore();

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999 }}>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        id="chat-toggle-btn"
        aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
        suppressHydrationWarning
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
          boxShadow: '0 10px 40px rgba(0, 240, 255, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          color: 'white',
          transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            height: '550px',
            background: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 240, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
        >
          <style>{`
            @keyframes chatFadeIn {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: '#050505' }}>AI</div>
                <div>
                   <span style={{ fontWeight: 'bold', fontSize: '15px', color: 'white', display: 'block' }}>Priyanshu's AI</span>
                   <span style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span> Online
                   </span>
                </div>
             </div>
             <button onClick={clearChat} id="chat-clear-btn" aria-label="Clear chat history" suppressHydrationWarning style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '6px 12px', borderRadius: '8px', color: '#a1a1aa', fontSize: '12px', cursor: 'pointer' }}>Clear</button>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🤖</div>
                <h4 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '16px' }}>I'm Priyanshu's AI</h4>
                <p style={{ color: '#a1a1aa', fontSize: '13px', margin: '0 0 24px 0' }}>How can I help you today?</p>
                
                {/* FAQ / SUGGESTIONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'What services do you offer?',
                    'Tell me about your tech stack',
                    'Show me your projects',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      suppressHydrationWarning
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '12px',
                        color: '#ededed',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ 
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)' : 'rgba(255,255,255,0.05)',
                  color: msg.role === 'user' ? '#050505' : 'white',
                  padding: '10px 16px',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  boxShadow: msg.role === 'user' ? '0 4px 15px rgba(0, 240, 255, 0.2)' : 'none'
                }}>
                  {msg.content || (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
                      <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <style>{`
              .typing-dot {
                width: 5px;
                height: 5px;
                background: #a1a1aa;
                border-radius: 50%;
                animation: typingBounce 1.4s infinite ease-in-out;
              }
              @keyframes typingBounce {
                0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                40% { transform: translateY(-5px); opacity: 1; }
              }
            `}</style>            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '10px 14px' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                suppressHydrationWarning
                style={{ flex: 1, background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '14px' }}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                id="chat-send-btn"
                aria-label="Send message"
                suppressHydrationWarning
                style={{ 
                  background: input.trim() ? 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)' : 'transparent', 
                  color: input.trim() ? '#050505' : '#52525b',
                  border: 'none', 
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
