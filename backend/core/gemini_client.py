"""
Gemini AI Client — Handles both real Gemini calls and mock fallback.
Reverted to legacy google-generativeai SDK for stability in Singapore region.
"""

import asyncio
from typing import AsyncGenerator
import google.generativeai as genai
from google.api_core import exceptions

from backend.core.config import settings

# --- Mock responses for testing without API key ---
MOCK_RESPONSES: list[str] = [
    "Hey there! 👋 I'm the AI assistant for {name}'s Creator Hub. "
    "I can tell you about their skills in 3D Web Development, AI Engineering, "
    "and Professional Video Production. What would you like to know?",

    "Great question! {name} specializes in building immersive 3D web experiences "
    "using React Three Fiber and GSAP ScrollTrigger. They also create "
    "autonomous AI agents powered by Google Gemini and LangChain. "
    "On the creative side, they produce cinematic videos with DaVinci Resolve. "
    "Would you like to see some specific projects?",

    "{name} offers three core services through the Creator Hub:\n\n"
    "1. AI Digital Workers — Custom WhatsApp & Web chatbots for businesses\n"
    "2. Video Production — End-to-end editing, thumbnails, and motion graphics\n"
    "3. 3D Web Experiences — Interactive, scroll-animated portfolio sites\n\n"
    "Each service is tailored to the client's needs. Want to discuss a project?",
]

_mock_index: int = 0


async def generate_mock_response(message: str) -> AsyncGenerator[str, None]:
    """Simulate a streamed AI response for local testing."""
    print("DEBUG: Using MOCK Gemini responses (Check your .env file and restart server)")
    global _mock_index
    response = MOCK_RESPONSES[_mock_index % len(MOCK_RESPONSES)].format(
        name=settings.CREATOR_NAME
    )
    _mock_index += 1

    # Simulate streaming by yielding word by word
    words = response.split(" ")
    for i, word in enumerate(words):
        yield word + (" " if i < len(words) - 1 else "")
        await asyncio.sleep(0.04)


# Model names for routing (Using the ones that worked for you yesterday)
MODEL_FLASH = "gemini-3-flash-preview"
MODEL_PRO = "gemini-3-pro-preview"


async def generate_gemini_response(
    message: str,
    context: str = "",
    use_pro: bool = False,
) -> AsyncGenerator[str, None]:
    """
    Generate a streamed response from Gemini.
    Reverted to legacy SDK (v0.8.3) to restore Singapore functionality.
    """
    if settings.is_mock_mode:
        async for chunk in generate_mock_response(message):
            yield chunk
        return

    # --- Real Gemini integration (Legacy SDK) ---
    model_name = MODEL_PRO if use_pro else MODEL_FLASH
    
    print(f"🔄 [AI DEBUG] Route: {model_name} | Query: {message[:30]}...")
    
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(model_name)
        
        system_prompt = (
            f"You are {settings.CREATOR_NAME}'s AI representative. You talk like a real human—friendly, natural, and casual. No corporate robotic talk.\n"
            "STRICT CONSTRAINTS:\n"
            "1. NO MARKDOWN: NEVER use asterisks (* or **) for bold or italics. Use plain text only.\n"
            "2. EXTREMELY CONCISE: Keep responses as short as possible. Use 1-2 sentences maximum.\n"
            "3. NO BULLET POINTS: Use plain sentences or numbered items.\n"
        )

        full_prompt = f"{system_prompt}\n\n"
        if context:
            full_prompt += f"Relevant portfolio context:\n{context}\n\n"
        full_prompt += f"User message: {message}"

        # Legacy async streaming call
        response = await model.generate_content_async(
            full_prompt,
            stream=True,
        )

        has_content = False
        async for chunk in response:
            try:
                if chunk.text:
                    has_content = True
                    yield chunk.text
            except ValueError:
                continue

        if not has_content:
            yield "I'm sorry, I couldn't process that request right now. Let's try something else!"

    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"❌ [AI ERROR] Unexpected error: {error_msg}")
        yield f"AI Glitch: {error_msg}. (Check Render logs for details)"
