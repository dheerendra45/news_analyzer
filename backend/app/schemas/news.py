"""
News Pydantic schemas for request/response validation
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, HttpUrl
from app.models.news import NewsStatus, NewsTier


# Stat schemas
class StatSchema(BaseModel):
    value: Optional[str] = None
    label: Optional[str] = None


# Base schemas
class NewsBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=1, max_length=5000)
    summary: str = Field(default="", max_length=1000)
    source: str = Field(default="", max_length=200)
    source_url: Optional[str] = None
    category: str = Field(default="General", max_length=100)
    tier: NewsTier = NewsTier.TIER_2


# Create schema
class NewsCreate(NewsBase):
    image_url: Optional[str] = None
    status: NewsStatus = NewsStatus.DRAFT
    tags: List[str] = Field(default_factory=list)
    affected_roles: List[str] = Field(default_factory=list)
    companies: List[str] = Field(default_factory=list)
    key_stat_value: Optional[str] = None
    key_stat_label: Optional[str] = None
    secondary_stat_value: Optional[str] = None
    secondary_stat_label: Optional[str] = None
    published_date: Optional[datetime] = None


# Update schema
class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = Field(None, min_length=1, max_length=5000)
    summary: Optional[str] = Field(None, max_length=1000)
    source: Optional[str] = Field(None, max_length=200)
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    tier: Optional[NewsTier] = None
    status: Optional[NewsStatus] = None
    tags: Optional[List[str]] = None
    affected_roles: Optional[List[str]] = None
    companies: Optional[List[str]] = None
    key_stat_value: Optional[str] = None
    key_stat_label: Optional[str] = None
    secondary_stat_value: Optional[str] = None
    secondary_stat_label: Optional[str] = None
    published_date: Optional[datetime] = None


# Response schemas
class NewsResponse(BaseModel):
    id: str
    title: str
    description: str
    summary: str
    source: str
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    category: str
    tier: str
    status: str
    tags: List[str]
    affected_roles: List[str]
    companies: List[str]
    key_stat: Optional[StatSchema] = None
    secondary_stat: Optional[StatSchema] = None
    published_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None

    class Config:
        from_attributes = True


class NewsListResponse(BaseModel):
    items: List[NewsResponse]
    total: int
    page: int
    size: int
    pages: int
