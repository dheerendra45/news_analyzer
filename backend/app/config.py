"""
Application configuration using Pydantic Settings
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "news_analyzer_db"
    
    # JWT
    secret_key: str = "your-super-secret-key-change-in-production-min-32-chars"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # CORS
    frontend_url: str = "http://localhost:5173"
    
    # Admin Domains (comma-separated)
    admin_domains: str = "replaceable.ai,attacked.ai"
    
    # File Upload
    upload_dir: str = "uploads"
    max_file_size: int = 10485760  # 10MB
    
    @property
    def admin_domain_list(self) -> list:
        """Get list of allowed admin domains"""
        return [d.strip().lower() for d in self.admin_domains.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Cache and return settings instance"""
    return Settings()


settings = get_settings()
