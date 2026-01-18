"""
Schema definitions for Intelligence Cards
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class CardStat(BaseModel):
    value: Optional[str] = None
    label: Optional[str] = None
    type: Optional[str] = None  # "critical", "elevated", "moderate"


class IntelligenceCardBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    title_highlight: str = Field(default="", max_length=100)
    company: str = Field(..., min_length=1, max_length=100)
    company_icon: str = Field(default="", max_length=10)
    company_gradient: str = Field(default="", max_length=50)
    company_logo: Optional[str] = Field(default=None, max_length=500)
    category: str = Field(default="General", max_length=50)
    excerpt: str = Field(default="", max_length=500)
    tier: str = Field(default="tier_2")
    tier_label: str = Field(default="Tier 2 Elevated")
    
    # Statistics
    stat1_value: Optional[str] = None
    stat1_label: Optional[str] = None
    stat2_value: Optional[str] = None
    stat2_label: Optional[str] = None
    stat2_type: Optional[str] = None
    stat3_value: Optional[str] = None
    stat3_label: Optional[str] = None
    
    # RPI Data
    rpi_score: Optional[str] = Field(default=None)
    jobs_affected: Optional[str] = None
    ai_investment: Optional[str] = None
    
    # Links
    report_id: Optional[str] = None
    analysis_url: Optional[str] = None
    
    # Metadata
    is_featured: bool = False
    display_order: int = 0
    industry: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class IntelligenceCardCreate(IntelligenceCardBase):
    status: str = Field(default="draft")
    published_date: Optional[datetime] = None


class IntelligenceCardUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    title_highlight: Optional[str] = Field(default=None, max_length=100)
    company: Optional[str] = Field(default=None, min_length=1, max_length=100)
    company_icon: Optional[str] = Field(default=None, max_length=10)
    company_gradient: Optional[str] = Field(default=None, max_length=50)
    company_logo: Optional[str] = Field(default=None, max_length=500)
    category: Optional[str] = Field(default=None, max_length=50)
    excerpt: Optional[str] = Field(default=None, max_length=500)
    tier: Optional[str] = None
    tier_label: Optional[str] = None
    status: Optional[str] = None
    
    # Statistics
    stat1_value: Optional[str] = None
    stat1_label: Optional[str] = None
    stat2_value: Optional[str] = None
    stat2_label: Optional[str] = None
    stat2_type: Optional[str] = None
    stat3_value: Optional[str] = None
    stat3_label: Optional[str] = None
    
    # RPI Data
    rpi_score: Optional[str] = Field(default=None)
    jobs_affected: Optional[str] = None
    ai_investment: Optional[str] = None
    
    # Links
    report_id: Optional[str] = None
    analysis_url: Optional[str] = None
    
    # Metadata
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    industry: Optional[str] = None
    tags: Optional[List[str]] = None
    published_date: Optional[datetime] = None


class IntelligenceCardResponse(BaseModel):
    id: str
    title: str
    title_highlight: str
    company: str
    company_icon: str
    company_gradient: str
    company_logo: Optional[str] = None
    category: str
    excerpt: str
    tier: str
    tier_label: str
    status: str
    
    # Statistics
    stat1: Optional[CardStat] = None
    stat2: Optional[CardStat] = None
    stat3: Optional[CardStat] = None
    
    # RPI Data
    rpi_score: Optional[str] = None
    jobs_affected: Optional[str] = None
    ai_investment: Optional[str] = None
    
    # Links
    report_id: Optional[str] = None
    analysis_url: Optional[str] = None
    
    # Metadata
    is_featured: bool
    display_order: int
    published_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    industry: Optional[str] = None
    tags: List[str]

    class Config:
        from_attributes = True


class IntelligenceCardListResponse(BaseModel):
    items: List[IntelligenceCardResponse]
    total: int
    page: int
    size: int
    pages: int


# Platform statistics response
class PlatformStatsResponse(BaseModel):
    total_analyses: int
    total_roles_assessed: int
    ai_capital_tracked: str
    jobs_impacted: str
    total_companies: int
    accuracy_rate: str


# Admin dashboard stats response
class AdminStatsResponse(BaseModel):
    total_cards: int
    published_cards: int
    draft_cards: int
    featured_cards: int
