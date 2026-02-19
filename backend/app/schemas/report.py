"""
Report Pydantic schemas for request/response validation
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.report import ReportStatus


# Base schemas
class ReportBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    summary: str = Field(..., min_length=1, max_length=10000)  # Increased limit for rich reports


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
    # Rich report fields
    subtitle: Optional[str] = None
    label: Optional[str] = None
    tier: Optional[str] = None
    hero_stats: Optional[List[Dict[str, Any]]] = None
    hero_context: Optional[str] = None
    exec_summary: Optional[Dict[str, Any]] = None
    metrics: Optional[List[Dict[str, Any]]] = None
    data_table: Optional[List[Dict[str, Any]]] = None
    rpi_analysis: Optional[Dict[str, Any]] = None
    risk_buckets: Optional[List[Dict[str, Any]]] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    guidance: Optional[List[Dict[str, Any]]] = None
    sources: Optional[List[Dict[str, Any]]] = None
    is_rich_report: bool = False
    html_content: Optional[str] = None  # Full HTML document for standalone HTML reports
    # Flexible extra fields - accepts any additional data like context_box, insight_block, etc.
    extra_fields: Optional[Dict[str, Any]] = None
    # Section customization fields
    context_label: Optional[str] = None
    context_title: Optional[str] = None
    context_intro: Optional[str] = None
    metrics_label: Optional[str] = None
    metrics_title: Optional[str] = None
    metrics_intro: Optional[str] = None
    context_box: Optional[Dict[str, Any]] = None
    insight_block: Optional[Dict[str, Any]] = None


# Update schema
class ReportUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    summary: Optional[str] = Field(None, min_length=1, max_length=10000)  # Increased limit for rich reports
    content: Optional[str] = None
    file_url: Optional[str] = None
    pdf_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[ReportStatus] = None
    reading_time: Optional[int] = Field(None, ge=1)
    author: Optional[str] = None
    published_date: Optional[datetime] = None
    # Rich report fields
    subtitle: Optional[str] = None
    label: Optional[str] = None
    tier: Optional[str] = None
    hero_stats: Optional[List[Dict[str, Any]]] = None
    hero_context: Optional[str] = None
    exec_summary: Optional[Dict[str, Any]] = None
    metrics: Optional[List[Dict[str, Any]]] = None
    data_table: Optional[List[Dict[str, Any]]] = None
    rpi_analysis: Optional[Dict[str, Any]] = None
    risk_buckets: Optional[List[Dict[str, Any]]] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    guidance: Optional[List[Dict[str, Any]]] = None
    sources: Optional[List[Dict[str, Any]]] = None
    is_rich_report: Optional[bool] = None
    html_content: Optional[str] = None  # Full HTML document for standalone HTML reports
    extra_fields: Optional[Dict[str, Any]] = None
    context_label: Optional[str] = None
    context_title: Optional[str] = None
    context_intro: Optional[str] = None
    metrics_label: Optional[str] = None
    metrics_title: Optional[str] = None
    metrics_intro: Optional[str] = None
    context_box: Optional[Dict[str, Any]] = None
    insight_block: Optional[Dict[str, Any]] = None


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
    # Rich report fields
    subtitle: Optional[str] = None
    label: Optional[str] = None
    tier: Optional[str] = None
    hero_stats: Optional[List[Dict[str, Any]]] = None
    hero_context: Optional[str] = None
    exec_summary: Optional[Dict[str, Any]] = None
    metrics: Optional[List[Dict[str, Any]]] = None
    data_table: Optional[List[Dict[str, Any]]] = None
    rpi_analysis: Optional[Dict[str, Any]] = None
    risk_buckets: Optional[List[Dict[str, Any]]] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    guidance: Optional[List[Dict[str, Any]]] = None
    sources: Optional[List[Dict[str, Any]]] = None
    is_rich_report: bool = False
    html_content: Optional[str] = None  # Full HTML document for standalone HTML reports
    extra_fields: Optional[Dict[str, Any]] = None
    context_label: Optional[str] = None
    context_title: Optional[str] = None
    context_intro: Optional[str] = None
    metrics_label: Optional[str] = None
    metrics_title: Optional[str] = None
    metrics_intro: Optional[str] = None
    context_box: Optional[Dict[str, Any]] = None
    insight_block: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    items: List[ReportResponse]
    total: int
    page: int
    size: int
    pages: int


# Send Preview Schema
class SendPreviewRequest(BaseModel):
    to_email: str = Field(..., description="Manager's email address")
    subject: str = Field(..., description="Email subject")
    report_title: str = Field(..., description="Report title")
    report_summary: Optional[str] = Field("", description="Report summary")
    report_author: Optional[str] = Field("Admin", description="Report author")
    message: Optional[str] = Field("", description="Custom message from admin")
    html_content: str = Field(..., description="Full HTML content of the report")


class SendPreviewResponse(BaseModel):
    success: bool
    message: str
