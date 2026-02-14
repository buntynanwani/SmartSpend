"""
Application configuration using environment variables.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Simple settings class loaded from environment variables."""

    APP_NAME: str = os.getenv("APP_NAME", "SmartSpend API")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000"
    ).split(",")


def get_settings() -> Settings:
    return Settings()
