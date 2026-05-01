"""
Chat Service — Orchestrates the AI conversation flow.
Combines RAG context retrieval with Gemini generation.
"""

from typing import AsyncGenerator
from backend.core.gemini_client import generate_gemini_response
from backend.services.rag_service import retrieve_context


# In-memory conversation storage for MVP
# Replace with Supabase in production
_conversations: dict[str, list[dict[str, str]]] = {}

# Maximum number of conversations to keep in memory to prevent leaks
MAX_CONVERSATIONS = 500


async def handle_chat_message(
    message: str,
    conversation_id: str = "default",
) -> AsyncGenerator[str, None]:
    """
    Process an incoming chat message:
    1. Retrieve relevant portfolio context via RAG
    2. Build conversation history
    3. Stream response from Gemini (or mock)
    """

    # Step 1: Retrieve relevant context from portfolio knowledge
    context = retrieve_context(message)

    # Step 2: Track conversation history (with memory limit)
    if conversation_id not in _conversations:
        # Evict oldest conversation if at capacity
        if len(_conversations) >= MAX_CONVERSATIONS:
            oldest_key = next(iter(_conversations))
            del _conversations[oldest_key]
        _conversations[conversation_id] = []

    _conversations[conversation_id].append({
        "role": "user",
        "content": message,
    })

    # Step 3: Determine if this needs the Pro model (complex analysis)
    use_pro = _should_use_pro(message)

    # Step 4: Build the full prompt with history context
    history_context = _build_history_context(conversation_id)
    full_context = f"{context}\n\nConversation history:\n{history_context}"

    # Step 5: Stream the response
    response_text = ""
    async for chunk in generate_gemini_response(
        message=message,
        context=full_context,
        use_pro=use_pro,
    ):
        response_text += chunk
        yield chunk

    # Step 6: Save assistant response to history
    _conversations[conversation_id].append({
        "role": "assistant",
        "content": response_text,
    })


def _should_use_pro(message: str) -> bool:
    """
    Determine if the message requires the Pro model.
    Complex/analytical queries get routed to Gemini Pro.
    """
    pro_keywords = [
        "analyze", "compare", "strategy", "detailed",
        "explain in depth", "business plan", "architecture",
        "recommend", "evaluate", "assessment",
    ]
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in pro_keywords)


def _build_history_context(conversation_id: str, max_turns: int = 10) -> str:
    """Build a string of recent conversation history."""
    history = _conversations.get(conversation_id, [])
    recent = history[-(max_turns * 2):]  # Last 10 turns (20 messages)
    lines = []
    for msg in recent:
        role = msg["role"].capitalize()
        lines.append(f"{role}: {msg['content']}")
    return "\n".join(lines) if lines else "No previous conversation."


def clear_conversation(conversation_id: str) -> bool:
    """Clear a specific conversation's history."""
    if conversation_id in _conversations:
        del _conversations[conversation_id]
        return True
    return False
