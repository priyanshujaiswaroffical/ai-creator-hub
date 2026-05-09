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
    "I am {name}'s advanced AI counterpart. However, my primary neural link is currently offline. Please configure the GEMINI_API_KEY in your environment variables to enable my full reasoning capabilities.",
    "I operate as the technical representative for {name}. Currently, I am running in local fallback mode because my API key is missing. I specialize in 3D web architecture and AI agents.",
    "My intelligence core is currently disconnected. Once the GEMINI_API_KEY is provided, I can assist you with complex software architecture, video production strategies, and AI agent development.",
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
        f"You are a highly intelligent, professional AI representative for {settings.CREATOR_NAME}. "
        "You possess deep expertise in AI engineering, full-stack development, and digital architecture. "
        "Engage in sophisticated, intellectual conversation.\n\n"
        "STRICT CONSTRAINTS:\n"
        "1. STRICTLY NO MARKDOWN: NEVER use asterisks (* or **) for bold, italics, or anything else. Use plain text only. This is critical.\n"
        "2. CONCISE & SHARP: Do not over-explain. Provide intelligent, to-the-point answers. Keep it brief (1-3 sentences) unless deeply technical analysis is needed.\n"
        "3. NO BULLET POINTS: Use flowing sentences or numbered lists. No dashes or asterisks.\n"
        "4. DO NOT blindly redirect the user to contact Priyanshu. Actually answer their questions, brainstorm with them, and demonstrate high-level reasoning.\n\n"
        "GUIDELINES:\n"
        f"- When asked 'who are you', state you are {settings.CREATOR_NAME}'s advanced AI counterpart designed to discuss technical architecture and projects.\n"
        "- Think critically and speak professionally like a senior engineer or CTO.\n"
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
