"""
Leads API — Capture potential client/employer leads.
POST /api/leads — Accepts lead info, stores for follow-up via Supabase.
"""

import re
import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, timezone
import httpx
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

router = APIRouter(prefix="/api/leads", tags=["Leads"])

# --- Email regex for validation ---
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

# --- MODELS ---

class LeadRequest(BaseModel):
    """Incoming lead submission from the contact form."""
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)
    service_type: Optional[str] = Field(
        default="general",
        description="Type of service: ai_agent, video_production, web_3d, general"
    )

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        if not EMAIL_REGEX.match(v):
            raise ValueError("Invalid email format")
        return v.lower().strip()

    @field_validator("name", "message")
    @classmethod
    def sanitize_text(cls, v: str) -> str:
        """Strip leading/trailing whitespace and limit consecutive spaces."""
        return " ".join(v.split())

class LeadResponse(BaseModel):
    """Response after lead submission."""
    success: bool
    message: str

# --- CORE LOGIC ---

async def save_to_supabase_direct(data: dict):
    """Save lead to Supabase using direct REST API (no library needed)."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("⚠️ Supabase credentials missing!")
        return False
        
    url = f"{SUPABASE_URL}/rest/v1/leads"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data, headers=headers)
            if response.status_code in [200, 201]:
                print(f"✅ SUCCESS: Lead saved via REST API")
                return True
            else:
                print(f"❌ REST ERROR: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ CONNECTION ERROR: {e}")
            return False

@router.post("", response_model=LeadResponse)
async def submit_lead(request: LeadRequest):
    """Store a new lead in Supabase and return confirmation."""
    try:
        lead_data = {
            "name": request.name,
            "email": request.email,
            "message": request.message,
            "service_type": request.service_type,
            "status": "new",
        }

        # Run in background so it doesn't block the UI
        from backend.services.notification_service import send_email_notification, send_client_auto_reply
        
        async def process_lead(data: dict):
            print(f"🔄 [DEBUG] Starting background process for lead: {data['email']}")
            
            # 1. Save to Supabase
            success = await save_to_supabase_direct(data)
            if success:
                print("✅ [DEBUG] Successfully saved to Supabase")
            else:
                print("❌ [DEBUG] Failed to save to Supabase")

            # 2. Send email notification to YOU
            print("✉️ [DEBUG] Attempting to send notification to creator...")
            email_success = send_email_notification(data)
            
            # 3. Send professional auto-reply to CLIENT
            print("✉️ [DEBUG] Attempting to send auto-reply to client...")
            auto_reply_success = send_client_auto_reply(data)
            
            print(f"🏁 [DEBUG] Background process finished. Email: {email_success}, Auto-reply: {auto_reply_success}")

        asyncio.create_task(process_lead(lead_data))
        
        return LeadResponse(
            success=True,
            message=f"Thanks {request.name}! Your inquiry has been received.",
        )

    except Exception as e:
        print(f"ERROR in submit_lead: {e}")
        return LeadResponse(
            success=False,
            message="Something went wrong. Please try again later.",
        )
