"""
Gemini AI Client — Auto-Switch Model Cascade Implementation
Routes to optimal model based on intent and automatically falls back if API fails.
"""

import asyncio
from typing import AsyncGenerator
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, FailedPrecondition, InvalidArgument

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

    words = response.split(" ")
    for i, word in enumerate(words):
        yield word + (" " if i < len(words) - 1 else "")
        await asyncio.sleep(0.04)


# --- Model Cascade Config ---
MODEL_TIERS = {
    "ELITE":        settings.GEMINI_MODEL_ELITE,
    "BRAIN":        settings.GEMINI_MODEL_PRO,
    "SMART_FLASH":  settings.GEMINI_MODEL_FLASH_2,
    "STABLE_FLASH": settings.GEMINI_MODEL_FLASH,
    "LITE_FLASH":   settings.GEMINI_MODEL_LITE,
    "SAFETY_NET":   "gemini-1.5-flash",
}

MAX_RETRIES_PER_MODEL = 2

def _get_priority_list(message: str) -> list[str]:
    msg = message.lower()
    # Technical/Logic triggers → Pro/Elite boosted
    elite_triggers = {"calculate", "solve", "logic", "complex", "step by step", "technical", "engineering"}
    if any(t in msg for t in elite_triggers):
        return ["STABLE_FLASH", "SMART_FLASH", "BRAIN", "ELITE", "SAFETY_NET"]

    # General conversation → Flash-first for reliability
    return ["STABLE_FLASH", "LITE_FLASH", "SMART_FLASH", "BRAIN", "ELITE", "SAFETY_NET"]

async def generate_gemini_response(
    message: str,
    context: str = "",
    use_pro: bool = False,
) -> AsyncGenerator[str, None]:
    """
    Generate a streamed response from Gemini using Auto-Switch Model Cascade.
    """
    if settings.is_mock_mode:
        async for chunk in generate_mock_response(message):
            yield chunk
        return

    genai.configure(api_key=settings.GEMINI_API_KEY)

    priority_keys = _get_priority_list(message)

    # Boost BRAIN to top if pro requested
    if use_pro and "BRAIN" in priority_keys:
        priority_keys.remove("BRAIN")
        priority_keys.insert(0, "BRAIN")

    system_prompt = (
        f"You are {settings.CREATOR_NAME}'s AI representative. You talk like a real human—friendly, natural, and casual. No corporate robotic talk.\n"
        "STRICT CONSTRAINTS:\n"
        "1. NO MARKDOWN: NEVER use asterisks (* or **) for bold or italics. Use plain text only.\n"
        "2. EXTREMELY CONCISE: Keep responses as short as possible. Use 1-2 sentences maximum unless a detailed explanation is literally required.\n"
        "3. NO BULLET POINTS: Use plain sentences or numbered items (1. 2. 3.).\n"
        "GUIDELINES:\n"
        "1. YOUR ROLE: You represent the creator. You know about AI Agents, 3D Web, and Video Production.\n"
        "2. HANDLING PROJECTS: If they want to build something, suggest the contact form below quickly.\n"
        "3. If they say 'Hi', just be a friendly human.\n"
    )

    full_prompt = f"{system_prompt}\n\n"
    if context:
        full_prompt += f"Relevant portfolio context:\n{context}\n\n"
    full_prompt += f"User message: {message}"

    print(f"🔄 [AI CASCADE] Starting sequence. Priority: {priority_keys}")

    # Cascade through models
    for role_key in priority_keys:
        model_name = MODEL_TIERS.get(role_key)
        if not model_name: continue

        for attempt in range(1, MAX_RETRIES_PER_MODEL + 1):
            try:
                print(f"🔄 [AI ATTEMPT] Trying model: {model_name} (Attempt {attempt})")
                model = genai.GenerativeModel(model_name)
                response = await model.generate_content_async(full_prompt, stream=True)

                has_content = False
                async for chunk in response:
                    try:
                        if chunk.text:
                            has_content = True
                            yield chunk.text
                    except ValueError:
                        continue

                if has_content:
                    return  # Success! Exit both loops

            except (ResourceExhausted, FailedPrecondition, InvalidArgument) as e:
                print(f"⚠️ [AI FAIL] {model_name} failed: {e.__class__.__name__}. Retrying in 0.8s...")
                await asyncio.sleep(0.8)  # Breath before next attempt
                if attempt < MAX_RETRIES_PER_MODEL:
                    continue
                else:
                    break  # Next model

            except Exception as e:
                print(f"❌ [AI CRITICAL] {model_name} crashed: {e}. Moving to next model.")
                break  # Critical fail → next model

    # ALL models failed → mock fallback (UI stays clean)
    print("❌ [AI CASCADE FAILED] All models failed. Falling back to mock responses.")
    async for chunk in generate_mock_response(message):
        yield chunk
