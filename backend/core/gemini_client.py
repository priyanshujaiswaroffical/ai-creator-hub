"""
Gemini AI Client — Handles both real Gemini calls and mock fallback.
Initializes Flash (speed) and Pro (analysis) model instances.
"""

import asyncio
from typing import AsyncGenerator

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


# Model names for routing
MODEL_FLASH = "gemini-1.5-flash"
MODEL_PRO = "gemini-1.5-pro"


async def generate_gemini_response(
    message: str,
    context: str = "",
    use_pro: bool = False,
) -> AsyncGenerator[str, None]:
    """
    Generate a streamed response from Gemini.
    Falls back to mock mode if no API key is configured.
    Routes to Pro model for complex queries, Flash for speed.
    """
    if settings.is_mock_mode:
        async for chunk in generate_mock_response(message):
            yield chunk
        return

    # --- Real Gemini integration ---
    import google.generativeai as genai

    # Route to Pro for complex analysis, Flash for everything else
    model_name = MODEL_PRO if use_pro else MODEL_FLASH
    
    print(f"DEBUG: Using REAL Gemini API (Model: {model_name})")
    genai.configure(api_key=settings.GEMINI_API_KEY)

    model = genai.GenerativeModel(model_name)
    
    print(f"DEBUG: Using {model_name} for: {message[:50]}...")

    system_prompt = (
        f"You are {settings.CREATOR_NAME}'s AI representative. You talk like a real human—friendly, natural, and casual. No corporate robotic talk.\n"
        "STRICT CONSTRAINTS:\n"
        "1. NO MARKDOWN: NEVER use asterisks (* or **) for bold or italics. Use plain text only.\n"
        "2. EXTREMELY CONCISE: Keep responses as short as possible. Use 1-2 sentences maximum unless a detailed explanation is literally required. Avoid filler words and unnecessary greetings after the first interaction.\n"
        "3. NO BULLET POINTS: Use plain sentences or numbered items (1. 2. 3.) without extra formatting.\n"
        "GUIDELINES:\n"
        "1. YOUR ROLE: You represent the creator. You know about AI Agents, 3D Web, and Video Production.\n"
        "2. HANDLING PROJECTS: If they want to build something, suggest the contact form below quickly and stop talking.\n"
        "3. If they say 'Hi', just be a friendly human: 'Hey! How can I help you today?'\n"
    )

    full_prompt = f"{system_prompt}\n\n"
    if context:
        full_prompt += f"Relevant portfolio context:\n{context}\n\n"
    full_prompt += f"User message: {message}"

    response = await model.generate_content_async(
        full_prompt,
        stream=True,
    )

    async for chunk in response:
        if chunk.text:
            yield chunk.text
