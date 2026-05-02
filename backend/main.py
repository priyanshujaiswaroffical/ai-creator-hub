"""
🚀 AI-Native Creator Hub — FastAPI Backend
Main application entry point.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import os

from backend.core.config import settings
from backend.api.chat import router as chat_router
from backend.api.leads import router as leads_router


# ============================================
# Security Headers Middleware
# ============================================

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        if settings.APP_ENV != "development":
            response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        return response


# ============================================
# App Initialization
# ============================================

app = FastAPI(
    title="AI-Native Creator Hub API",
    description="Backend for the Full-Stack Creator's startup + portfolio platform",
    version="1.0.0",
    docs_url="/docs" if settings.APP_ENV == "development" else None,
    redoc_url="/redoc" if settings.APP_ENV == "development" else None,
)

# ============================================
# Middleware Stack
# ============================================

# Security headers on every response
app.add_middleware(SecurityHeadersMiddleware)

# CORS (Allow Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ============================================
# Route Registration
# ============================================

app.include_router(chat_router)
app.include_router(leads_router)


# ============================================
# Health Check
# ============================================

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "online",
        "service": "AI-Native Creator Hub API",
        "version": "1.0.0",
        "mode": "mock" if settings.is_mock_mode else "live",
        "creator": settings.CREATOR_NAME,
    }


@app.get("/api/status", tags=["Health"])
async def api_status():
    """Detailed API status with feature availability."""
    return {
        "api": "operational",
        "ai_mode": "mock (no API key)" if settings.is_mock_mode else "gemini_live",
        "features": {
            "chat": True,
            "leads": True,
            "rag": True,
            "streaming": True,
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
