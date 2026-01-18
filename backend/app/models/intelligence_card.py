"""
Intelligence Card model for MongoDB - Used for landing page and archive cards
"""
from datetime import datetime
from typing import Optional, List
from enum import Enum


class CardTier(str, Enum):
    TIER_1 = "tier_1"  # Critical - Crimson
    TIER_2 = "tier_2"  # Elevated - Gold
    TIER_3 = "tier_3"  # Moderate - Teal


class CardStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


class IntelligenceCardModel:
    """Intelligence Card document structure for MongoDB"""
    
    @staticmethod
    def create_document(
        title: str,
        title_highlight: str,  # The emphasized part of title (e.g., "30,000 Jobs")
        company: str,
        company_icon: str,  # Single letter or emoji for company icon
        company_gradient: str,  # CSS class for background gradient (e.g., "amazon", "meta")
        category: str,
        excerpt: str,
        tier: CardTier = CardTier.TIER_2,
        tier_label: str = "Tier 2 Elevated",
        status: CardStatus = CardStatus.DRAFT,
        
        # Company Logo
        company_logo: Optional[str] = None,
        
        # Statistics
        stat1_value: Optional[str] = None,
        stat1_label: Optional[str] = None,
        stat2_value: Optional[str] = None,
        stat2_label: Optional[str] = None,
        stat2_type: Optional[str] = None,  # "critical", "elevated", "moderate"
        stat3_value: Optional[str] = None,
        stat3_label: Optional[str] = None,
        
        # RPI Data
        rpi_score: Optional[int] = None,
        jobs_affected: Optional[str] = None,
        ai_investment: Optional[str] = None,
        
        # Links
        report_id: Optional[str] = None,  # Link to detailed report
        analysis_url: Optional[str] = None,
        
        # Metadata
        is_featured: bool = False,
        display_order: int = 0,
        published_date: Optional[datetime] = None,
        created_by: Optional[str] = None,
        
        # Additional fields for archive
        industry: Optional[str] = None,
        tags: List[str] = None
    ) -> dict:
        """Create a new intelligence card document"""
        now = datetime.utcnow()
        return {
            "title": title,
            "title_highlight": title_highlight,
            "company": company,
            "company_icon": company_icon,
            "company_gradient": company_gradient,
            "company_logo": company_logo,
            "category": category,
            "excerpt": excerpt,
            "tier": tier.value if isinstance(tier, CardTier) else tier,
            "tier_label": tier_label,
            "status": status.value if isinstance(status, CardStatus) else status,
            
            # Statistics
            "stat1": {
                "value": stat1_value,
                "label": stat1_label
            } if stat1_value else None,
            "stat2": {
                "value": stat2_value,
                "label": stat2_label,
                "type": stat2_type
            } if stat2_value else None,
            "stat3": {
                "value": stat3_value,
                "label": stat3_label
            } if stat3_value else None,
            
            # RPI Data
            "rpi_score": rpi_score,
            "jobs_affected": jobs_affected,
            "ai_investment": ai_investment,
            
            # Links
            "report_id": report_id,
            "analysis_url": analysis_url,
            
            # Metadata
            "is_featured": is_featured,
            "display_order": display_order,
            "published_date": published_date or now,
            "created_at": now,
            "updated_at": now,
            "created_by": created_by,
            
            # Additional fields
            "industry": industry,
            "tags": tags or []
        }
    
    @staticmethod
    def from_db(document: dict) -> Optional[dict]:
        """Convert MongoDB document to response format"""
        if document is None:
            return None
        
        return {
            "id": str(document["_id"]),
            "title": document["title"],
            "title_highlight": document.get("title_highlight", ""),
            "company": document["company"],
            "company_icon": document.get("company_icon", ""),
            "company_gradient": document.get("company_gradient", ""),
            "company_logo": document.get("company_logo"),
            "category": document["category"],
            "excerpt": document.get("excerpt", ""),
            "tier": document.get("tier", "tier_2"),
            "tier_label": document.get("tier_label", "Tier 2"),
            "status": document["status"],
            
            # Statistics
            "stat1": document.get("stat1"),
            "stat2": document.get("stat2"),
            "stat3": document.get("stat3"),
            
            # RPI Data
            "rpi_score": document.get("rpi_score"),
            "jobs_affected": document.get("jobs_affected"),
            "ai_investment": document.get("ai_investment"),
            
            # Links
            "report_id": document.get("report_id"),
            "analysis_url": document.get("analysis_url"),
            
            # Metadata
            "is_featured": document.get("is_featured", False),
            "display_order": document.get("display_order", 0),
            "published_date": document["published_date"],
            "created_at": document["created_at"],
            "updated_at": document.get("updated_at"),
            "created_by": document.get("created_by"),
            
            # Additional fields
            "industry": document.get("industry"),
            "tags": document.get("tags", [])
        }
