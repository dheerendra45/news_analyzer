"""
Routes package
"""
from app.routes.auth import router as auth_router
from app.routes.news import router as news_router
from app.routes.reports import router as reports_router

__all__ = [
    "auth_router",
    "news_router",
    "reports_router"
]
