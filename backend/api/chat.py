"""
Chat API — Streaming AI chat endpoint.
POST /api/chat — Accepts a message, returns streamed AI response.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional
import json

from backend.services.chat_service import handle_chat_message, clear_conversation

router = APIRouter(prefix="/api/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    """Incoming chat message from the frontend."""
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[str] = "default"


class ClearRequest(BaseModel):
    """Request to clear conversation history."""
    conversation_id: str = "default"


@router.post("")
async def chat(request: ChatRequest):
    """
    Stream an AI response to the user's message.
    Uses Server-Sent Events (SSE) format for real-time streaming.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    async def event_stream():
        try:
            async for chunk in handle_chat_message(
                message=request.message,
                conversation_id=request.conversation_id or "default",
            ):
                # SSE format: each chunk as a data event
                data = json.dumps({"chunk": chunk})
                yield f"data: {data}\n\n"

            # Signal stream completion
            yield f"data: {json.dumps({'done': True})}\n\n"

        except Exception as e:
            error_data = json.dumps({"error": str(e)})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/clear")
async def clear_chat(request: ClearRequest):
    """Clear a conversation's history."""
    success = clear_conversation(request.conversation_id)
    return {
        "success": success,
        "message": "Conversation cleared" if success else "Conversation not found",
    }
