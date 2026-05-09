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
            "Technical Arsenal: Priyanshu is a highly proficient Full-Stack Developer and AI Engineer. "
            "His core tech stack includes React Three Fiber and Three.js for 3D web rendering, Next.js 14 (TypeScript) for scalable frontend architectures, "
            "and Python FastAPI for high-performance, asynchronous backends. "
            "For animations, he leverages GSAP ScrollTrigger and Framer Motion to create buttery-smooth, premium user experiences. "
            "In the AI space, he works with Google Gemini 1.5/2.0 models, LangChain, and vector databases (Supabase pgvector) to build autonomous digital workers. "
            "He also possesses professional video production skills, utilizing DaVinci Resolve for cinematic editing and Photoshop for high-CTR graphic design."
        ),
    },
    {
        "category": "services",
        "content": (
            "Priyanshu operates at the intersection of AI, Web3D, and Digital Media. He offers three premium services: "
            "1. AI Digital Workers: Custom-engineered, autonomous chatbots (like WhatsApp AI Agencies) that handle customer support, lead generation, and dynamic interactions using RAG. "
            "2. 3D Web Experiences: Next-generation portfolio and corporate websites featuring interactive 3D elements, scroll-bound animations, and glassmorphic premium aesthetics. "
            "3. Cinematic Video Production: End-to-end video editing, motion graphics, and high-retention visual storytelling tailored for modern digital platforms."
        ),
    },
    {
        "category": "tech_stack",
        "content": (
            "Priyanshu's 2026 Production Tech Stack is strictly modern and scalable. "
            "Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Zustand, Framer Motion. "
            "3D/Graphics: React Three Fiber, WebGL, Drei. "
            "Backend: Python, FastAPI, Uvicorn. "
            "AI & Data: Google Gemini (Flash & Pro), LangChain, text-embedding models. "
            "Infrastructure & Database: Vercel (Edge computing), Render (Dockerized microservices), Supabase (PostgreSQL with pgvector for AI memory). "
            "This stack ensures maximum performance, SEO optimization, and seamless AI integration."
        ),
    },
    {
        "category": "projects",
        "content": (
            "Notable Projects: "
            "1. AI-Native Creator Hub: Priyanshu's flagship portfolio platform. It features immersive 3D scrollytelling, a dynamic dark-mode glassmorphic UI, and a fully integrated AI Chat Agent (me) powered by an Auto-Switch Model Cascade. "
            "2. WhatsApp AI Agency Command Center: A secure, real-time dashboard for managing autonomous WhatsApp bots. It features end-to-end encryption UI, live node syncing, and smart escalation routing for customer service bots. "
            "3. Cinematic Media Vault: A collection of high-end video projects demonstrating advanced color grading, motion tracking, and narrative pacing."
        ),
    },
    {
        "category": "about",
        "content": (
            "Priyanshu is a visionary Full-Stack Creator and Computer Science student. "
            "He rejects generic, template-based web design in favor of 'UI/UX Pro Max' aesthetics—focusing on dark modes, glassmorphism, precise typography, and fluid micro-interactions. "
            "His overarching ambition is to bridge the gap between cinematic media and autonomous technology by launching a premium AI startup agency. "
            "He doesn't just write code; he engineers digital experiences that feel physical, high-end, and intelligent. He is currently scaling his prototype projects into enterprise-ready solutions."
        ),
    },
    {
        "category": "pricing_and_contact",
        "content": (
            "Project inquiries and pricing are strictly custom, depending on the complexity of the AI integration or 3D web development required. "
            "Priyanshu takes on select clients who value premium, cutting-edge digital products. "
            "To start a project or request an SEO/Architecture audit, clients should use the Contact section on the Creator Hub or reach out via his official channels."
        ),
    }
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
