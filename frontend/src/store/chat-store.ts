/**
 * Zustand store for AI Chat state.
 * Handles streaming messages from the FastAPI backend.
 */

import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  isOpen: boolean;
  conversationId: string;

  toggleChat: () => void;
  setOpen: (open: boolean) => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  isOpen: false,
  conversationId: '',

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open: boolean) => set({ isOpen: open }),

  sendMessage: async (message: string) => {
    let { conversationId } = get();
    if (!conversationId) {
      conversationId = `conv_${Date.now()}`;
      set({ conversationId });
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isStreaming: true,
    }));

    // Create placeholder for assistant response
    const assistantId = `msg_${Date.now()}_assistant`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, assistantMsg],
    }));

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response stream');

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                fullContent += data.chunk;
                set((state) => ({
                  messages: state.messages.map((msg) =>
                    msg.id === assistantId
                      ? { ...msg, content: fullContent }
                      : msg
                  ),
                }));
              }
              if (data.done) break;
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      }
    } catch (error) {
      // Update the assistant message with error fallback
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  "I'm having trouble connecting right now. Please make sure the backend server is running on port 8000. 🔧",
              }
            : msg
        ),
      }));
    } finally {
      set({ isStreaming: false });
    }
  },

  clearChat: () =>
    set({
      messages: [],
      conversationId: `conv_${Date.now()}`,
    }),
}));
