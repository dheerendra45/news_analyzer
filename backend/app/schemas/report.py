"""
Report Pydantic schemas for request/response validation
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.report import ReportStatus


# Base schemas
class ReportBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    summary: str = Field(..., min_length=1, max_length=2000)


# Create schema
class ReportCreate(ReportBase):
    content: Optional[str] = None
    file_url: Optional[str] = None
    pdf_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    status: ReportStatus = ReportStatus.DRAFT
    reading_time: Optional[int] = Field(None, ge=1)
    author: Optional[str] = None
    published_date: Optional[datetime] = None


# Update schema
class ReportUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    summary: Optional[str] = Field(None, min_length=1, max_length=2000)
    content: Optional[str] = None
    file_url: Optional[str] = None
    pdf_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[ReportStatus] = None
    reading_time: Optional[int] = Field(None, ge=1)
    author: Optional[str] = None
    published_date: Optional[datetime] = None


# Response schemas
class ReportResponse(BaseModel):
    id: str
    title: str
    summary: str
    content: Optional[str] = None
    file_url: Optional[str] = None
    pdf_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    tags: List[str]
    status: str
    reading_time: Optional[int] = None
    author: Optional[str] = None
    published_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None

    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    items: List[ReportResponse]
    total: int
    page: int
    size: int
    pages: int
