# 🤖 AI Chat Bot — Complete Documentation

> Full-stack AI chatbot system powering the Creator Hub portfolio website.
> Includes the **Auto-Switch Model Cascade (AI Arsenal)**, RAG pipeline, streaming UI, and all supporting infrastructure.

---

## 📐 Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                     │
│                                                          │
│  AIChatWidget.tsx ──► chat-store.ts (Zustand) ──► SSE    │
│       │                    │                              │
│  TypewriterText        fetch('/api/chat')                │
│  FAQ Suggestions       StreamingResponse                 │
└──────────────────────────┬───────────────────────────────┘
                           │ POST /api/chat (SSE)
┌──────────────────────────▼───────────────────────────────┐
│                    BACKEND (FastAPI)                      │
│                                                          │
│  api/chat.py ──► chat_service.py ──► gemini_client.py    │
│                       │                    │              │
│                  rag_service.py      MODEL CASCADE        │
│                  (Knowledge Base)    (Auto-Switch)        │
│                                                          │
│  Middleware: SecurityHeaders, RateLimit, CORS             │
└──────────────────────────────────────────────────────────┘
```

---

## 🔥 Auto-Switch Model Cascade (AI Arsenal)

The core innovation — automatically cascades through multiple Gemini models based on message intent, retrying on failures (rate limits, regional blocks) until one succeeds.

### Model Tiers (config.py)

```python
# backend/core/config.py
GEMINI_MODEL_ELITE: str = "gemini-2.0-flash-thinking-exp"   # Deep reasoning
GEMINI_MODEL_PRO:   str = "gemini-1.5-pro"                  # Analysis
GEMINI_MODEL_FLASH_2: str = "gemini-2.0-flash"              # Fast + smart
GEMINI_MODEL_FLASH: str = "gemini-1.5-flash"                # Stable workhorse
GEMINI_MODEL_LITE:  str = "gemini-1.5-flash-8b"             # Lightweight
SAFETY_NET:              "gemini-1.5-flash"                  # Hardcoded fallback
```

### Cascade Logic (gemini_client.py)

```python
MODEL_TIERS = {
    "ELITE":        settings.GEMINI_MODEL_ELITE,
    "BRAIN":        settings.GEMINI_MODEL_PRO,
    "SMART_FLASH":  settings.GEMINI_MODEL_FLASH_2,
    "STABLE_FLASH": settings.GEMINI_MODEL_FLASH,
    "LITE_FLASH":   settings.GEMINI_MODEL_LITE,
    "SAFETY_NET":   "gemini-1.5-flash",
}

MAX_RETRIES_PER_MODEL = 2
```

### Intent-Based Priority Routing

```python
def _get_priority_list(message: str) -> list[str]:
    msg = message.lower()

    # Technical/Logic triggers → Pro/Elite boosted
    elite_triggers = {"calculate", "solve", "logic", "complex", "step by step", "technical", "engineering"}
    if any(t in msg for t in elite_triggers):
        return ["STABLE_FLASH", "SMART_FLASH", "BRAIN", "ELITE", "SAFETY_NET"]

    # General conversation → Flash-first for reliability (15 RPM vs 2 RPM on free tier)
    return ["STABLE_FLASH", "LITE_FLASH", "SMART_FLASH", "BRAIN", "ELITE", "SAFETY_NET"]
```

### Pro Model Boost (chat_service.py)

```python
def _should_use_pro(message: str) -> bool:
    pro_keywords = [
        "analyze", "compare", "strategy", "detailed",
        "explain in depth", "business plan", "architecture",
        "recommend", "evaluate", "assessment",
    ]
    return any(keyword in message.lower() for keyword in pro_keywords)
```

When `use_pro=True`, the `BRAIN` tier gets moved to the **top** of the priority list.

### Cascade Execution Flow

```python
async def generate_gemini_response(message, context="", use_pro=False):
    if settings.is_mock_mode:
        # No API key → use mock responses
        async for chunk in generate_mock_response(message):
            yield chunk
        return

    priority_keys = _get_priority_list(message)

    # Boost BRAIN to top if pro requested
    if use_pro and "BRAIN" in priority_keys:
        priority_keys.remove("BRAIN")
        priority_keys.insert(0, "BRAIN")

    # Cascade through models
    for role_key in priority_keys:
        model_name = MODEL_TIERS.get(role_key)
        if not model_name: continue

        for attempt in range(1, MAX_RETRIES_PER_MODEL + 1):
            try:
                model = genai.GenerativeModel(model_name)
                response = await model.generate_content_async(full_prompt, stream=True)

                has_content = False
                async for chunk in response:
                    if chunk.text:
                        has_content = True
                        yield chunk.text

                if has_content:
                    return  # Success! Exit both loops

            except (ResourceExhausted, FailedPrecondition, InvalidArgument):
                await asyncio.sleep(0.8)  # Breath before next attempt
                if attempt < MAX_RETRIES_PER_MODEL:
                    continue
                else:
                    break  # Next model

            except Exception:
                break  # Critical fail → next model

    # ALL models failed → mock fallback (UI stays clean)
    async for chunk in generate_mock_response(message):
        yield chunk
```

---

## 🧠 System Prompt

```python
system_prompt = (
    f"You are {settings.CREATOR_NAME}'s AI representative. "
    "You talk like a real human—friendly, natural, and casual. No corporate robotic talk.\n"
    "STRICT CONSTRAINTS:\n"
    "1. NO MARKDOWN: NEVER use asterisks (* or **) for bold or italics. Use plain text only.\n"
    "2. EXTREMELY CONCISE: Keep responses as short as possible. 1-2 sentences max unless detailed explanation is required.\n"
    "3. NO BULLET POINTS: Use plain sentences or numbered items (1. 2. 3.).\n"
    "GUIDELINES:\n"
    "1. YOUR ROLE: You represent the creator. You know about AI Agents, 3D Web, and Video Production.\n"
    "2. HANDLING PROJECTS: If they want to build something, suggest the contact form below quickly.\n"
    "3. If they say 'Hi', just be a friendly human.\n"
)
```

---

## 📚 RAG Service (Knowledge Base)

Keyword-based retrieval from hardcoded portfolio knowledge. Scores documents by word overlap and category match.

### Knowledge Categories

| Category    | Content Summary |
|-------------|----------------|
| `skills`    | React Three Fiber, GSAP, Next.js, FastAPI, Gemini, LangChain, DaVinci Resolve |
| `services`  | AI Digital Workers, Video Production, 3D Web Experiences |
| `tech_stack`| Full 2026 stack: Next.js, Three.js, FastAPI, Gemini, Supabase, Vercel/Render |
| `projects`  | Creator Hub, WhatsApp AI Agents, Cinematic Reels |
| `about`     | CS student bridging creative media + cutting-edge tech |

### Retrieval Logic

```python
def retrieve_context(query: str, top_k: int = 2) -> str:
    # Score each doc by keyword overlap
    for word in query_words:
        if word in content:  score += 1.0
        if word in category: score += 2.0  # Category match is stronger
    # Return top_k docs with score > 0, else fallback to first doc
```

---

## 🔄 Chat Service (Orchestrator)

**File:** `backend/services/chat_service.py`

### Flow

1. **RAG Retrieval** → Get relevant portfolio context
2. **Conversation History** → In-memory store (max 500 conversations, 10 turns each)
3. **Pro Detection** → Check if message needs the Pro model
4. **Build Context** → Combine RAG + history
5. **Stream Response** → Via Gemini client cascade
6. **Save Response** → Append to conversation history

### Conversation Memory

```python
_conversations: dict[str, list[dict[str, str]]] = {}
MAX_CONVERSATIONS = 500

def _build_history_context(conversation_id, max_turns=10):
    history = _conversations.get(conversation_id, [])
    recent = history[-(max_turns * 2):]  # Last 10 turns (20 messages)
    return "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in recent])
```

---

## 🌐 Chat API (SSE Streaming)

**File:** `backend/api/chat.py`

```python
# POST /api/chat — Streaming SSE endpoint
@router.post("")
async def chat(request: ChatRequest):
    async def event_stream():
        async for chunk in handle_chat_message(message=request.message, conversation_id=...):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

# POST /api/chat/clear — Clear conversation
@router.post("/clear")
async def clear_chat(request: ClearRequest): ...
```

### Request Schema

```python
class ChatRequest(BaseModel):
    message: str          # min 1, max 2000 chars
    conversation_id: str  # default: "default"
```

---

## 🖥️ Frontend Components

### 1. Zustand Chat Store (`chat-store.ts`)

```typescript
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
```

**SSE Client Logic:**
- Fetches `POST ${NEXT_PUBLIC_API_URL}/api/chat`
- Reads stream with `ReadableStream` + `TextDecoder`
- Parses SSE `data:` lines, extracts `chunk` field
- Updates assistant message content in real-time
- Error fallback message if connection fails

### 2. AIChatWidget (`AIChatWidget.tsx`)

**Features:**
- Floating chat button with gradient (`#00f0ff → #7000ff`) + glow shadow
- Glassmorphism chat panel (`backdrop-filter: blur(40px)`)
- Typewriter effect on latest assistant message (15ms per character)
- Animated typing dots (bounce animation)
- 3 FAQ suggestion buttons on empty chat
- Auto-scroll to latest message
- Auto-focus input on open
- Clear chat button

**FAQ Suggestions:**
```
- "What services do you offer?"
- "Tell me about your tech stack"
- "Show me your projects"
```

**TypewriterText Component:**
```tsx
function TypewriterText({ text, isStreaming }) {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, 15); // 15ms per character
    return () => clearTimeout(timeout);
  }, [text, displayedText, isStreaming]);
  return <>{displayedText}</>;
}
```

---

## 🛡️ Middleware Stack

| Middleware | Purpose |
|-----------|---------|
| `SecurityHeadersMiddleware` | X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS |
| `RateLimitMiddleware` | 60 requests per 60s per IP on `/api/chat` and `/api/leads` |
| `CORSMiddleware` | Allow all origins (configured for Vercel frontend) |

---

## 🔧 Mock Mode (Fallback)

When no `GEMINI_API_KEY` is set, the bot uses rotating mock responses:

```python
MOCK_RESPONSES = [
    "Hey there! 👋 I'm the AI assistant for {name}'s Creator Hub...",
    "Great question! {name} specializes in building immersive 3D web experiences...",
    "{name} offers three core services through the Creator Hub:..."
]
```

Simulates streaming by yielding word-by-word with 40ms delay.

---

## 📁 File Map

| File | Layer | Purpose |
|------|-------|---------|
| `frontend/src/components/client/AIChatWidget.tsx` | Frontend | Chat UI widget |
| `frontend/src/store/chat-store.ts` | Frontend | Zustand state + SSE client |
| `backend/api/chat.py` | API | SSE streaming endpoint |
| `backend/services/chat_service.py` | Service | Orchestrator (RAG + History + Model routing) |
| `backend/services/rag_service.py` | Service | Knowledge base retrieval |
| `backend/core/gemini_client.py` | Core | **Auto-switch model cascade** |
| `backend/core/config.py` | Core | Model names + env config |
| `backend/main.py` | Entry | FastAPI app + middleware |

---

## ⚡ Key Design Decisions

1. **Flash-First Strategy** — `STABLE_FLASH` (1.5 Flash) is always tried first because it has 15 RPM on free tier vs 2 RPM for Pro
2. **2 Retries Per Model** — Handles transient regional blocks before cascading
3. **0.8s Cooldown** — Between retry attempts to let API breathe
4. **Mock Safety Net** — If ALL models fail, mock responses keep the UI clean (no error screens)
5. **In-Memory History** — Max 500 conversations, 10 turns each (designed for MVP, Supabase upgrade path ready)
6. **SSE Streaming** — Real-time token-by-token delivery for premium UX
7. **Typewriter Effect** — 15ms per character animation on the latest message only
