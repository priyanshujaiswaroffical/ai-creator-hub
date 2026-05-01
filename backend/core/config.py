"""
Application configuration loaded from environment variables.
Uses pydantic-settings for type-safe config management.
"""

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Resolve the .env file path relative to the project root (Master Class/)
ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    """Central configuration for the AI-Native Creator Hub backend."""

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- Google Gemini ---
    GEMINI_API_KEY: str = ""

    # --- Supabase (optional for MVP) ---
    # Supabase Free Tier Integration
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

    # --- App Settings ---
    APP_ENV: str = "development"
    # CORS Config
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    CREATOR_NAME: str = "Creator"

    @property
    def is_mock_mode(self) -> bool:
        """Use mock AI responses when no Gemini API key is provided."""
        return not self.GEMINI_API_KEY or self.GEMINI_API_KEY == "your_gemini_api_key_here"

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


# Singleton instance
settings = Settings()

