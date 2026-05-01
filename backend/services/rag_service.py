"""
RAG Service — Retrieval-Augmented Generation for portfolio knowledge.
Uses in-memory vector store for MVP, designed to swap to Supabase pgvector.
"""

from typing import Optional

# ============================================
# Portfolio Knowledge Base (hardcoded for MVP)
# Replace with Supabase pgvector in production
# ============================================

PORTFOLIO_KNOWLEDGE: list[dict[str, str]] = [
    {
        "category": "skills",
        "content": (
            "Core skills include: React Three Fiber for 3D web experiences, "
            "GSAP and Framer Motion for scroll-bound animations, Next.js 14 with "
            "TypeScript for production frontends, FastAPI for high-performance backends, "
            "Google Gemini 1.5 Flash/Pro for AI agent development, LangChain for RAG pipelines, "
            "DaVinci Resolve for professional video editing, and Photoshop for high-CTR thumbnails."
        ),
    },
    {
        "category": "services",
        "content": (
            "I'm currently focused on building high-end prototype solutions while completing my studies. "
            "These include: "
            "1) AI Digital Workers — Custom WhatsApp and Web chatbot prototypes built on Gemini. "
            "2) Video Production — End-to-end cinematic editing and motion graphics projects. "
            "3) 3D Web Experiences — Interactive, scroll-animated websites using React Three Fiber. "
            "My goal is to take these cutting-edge student projects and turn them into a real startup agency."
        ),
    },
    {
        "category": "tech_stack",
        "content": (
            "The production tech stack for 2026 includes: "
            "Frontend — Next.js 14+, TypeScript, Tailwind CSS, Zustand for state management. "
            "3D Engine — React Three Fiber (Three.js), @react-three/drei. "
            "Animation — GSAP with ScrollTrigger, Framer Motion. "
            "Backend — Python FastAPI with async support. "
            "AI — Google Gemini 1.5 Flash (speed) and Pro (analysis), LangChain, text-embedding-004. "
            "Database — Supabase (PostgreSQL, Auth, pgvector for RAG memory). "
            "Deployment — Vercel (frontend), Render/Railway (backend Docker), same-region strategy."
        ),
    },
    {
        "category": "projects",
        "content": (
            "My most notable projects (built as premium academic prototypes) include: "
            "1) AI-Native Creator Hub — A startup/portfolio concept featuring 3D scrollytelling "
            "and an AI chat assistant (that's me!). "
            "2) WhatsApp AI Agents — A proof-of-concept digital worker that handles customer support queries. "
            "3) Cinematic Reels — Video editing projects showcasing my ability to blend technical skill "
            "with creative storytelling."
        ),
    },
    {
        "category": "about",
        "content": (
            "I'm a highly driven Computer Science student who bridges the gap between creative media "
            "and cutting-edge tech. I love building things that look cinema-grade and run flawlessly. "
            "While I'm currently focused on college projects, my ambition is to launch a premium "
            "AI startup agency. This portfolio is a living breathing prototype of what I'm capable of "
            "when I combine 3D web dev, AI engineering, and video production."
        ),
    },
]


def retrieve_context(query: str, top_k: int = 2) -> str:
    """
    Simple keyword-based retrieval for MVP.
    In production, this will use Supabase pgvector with text-embedding-004.
    """
    query_lower = query.lower()

    # Score each document by keyword overlap
    scored_docs: list[tuple[float, str]] = []
    for doc in PORTFOLIO_KNOWLEDGE:
        content = doc["content"].lower()
        category = doc["category"].lower()

        score = 0.0
        query_words = query_lower.split()
        for word in query_words:
            if len(word) > 2:  # Skip tiny words
                if word in content:
                    score += 1.0
                if word in category:
                    score += 2.0  # Category match is stronger

        scored_docs.append((score, doc["content"]))

    # Sort by score descending, return top_k
    scored_docs.sort(key=lambda x: x[0], reverse=True)
    top_docs = [doc for score, doc in scored_docs[:top_k] if score > 0]

    if not top_docs:
        # Return general info if no specific match
        return PORTFOLIO_KNOWLEDGE[0]["content"]

    return "\n\n".join(top_docs)
