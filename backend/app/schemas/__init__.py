"""
Schemas package
"""
from app.schemas.user import (
    UserBase,
    UserCreate,
    AdminCreate,
    UserUpdate,
    PasswordUpdate,
    UserResponse,
    Token,
    TokenData,
    LoginRequest,
    LoginResponse
)
from app.schemas.news import (
    NewsBase,
    NewsCreate,
    NewsUpdate,
    NewsResponse,
    NewsListResponse,
    StatSchema
)
from app.schemas.report import (
    ReportBase,
    ReportCreate,
    ReportUpdate,
    ReportResponse,
    ReportListResponse
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate",
    "AdminCreate",
    "UserUpdate",
    "PasswordUpdate",
    "UserResponse",
    "Token",
    "TokenData",
    "LoginRequest",
    "LoginResponse",
    # News schemas
    "NewsBase",
    "NewsCreate",
    "NewsUpdate",
    "NewsResponse",
    "NewsListResponse",
    "StatSchema",
    # Report schemas
    "ReportBase",
    "ReportCreate",
    "ReportUpdate",
    "ReportResponse",
    "ReportListResponse"
]
