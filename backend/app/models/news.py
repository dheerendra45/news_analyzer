"""
News model for MongoDB
"""
from datetime import datetime
from typing import Optional, List
from enum import Enum


class NewsStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


class NewsTier(str, Enum):
    TIER_1 = "tier_1"  # Major - Crimson
    TIER_2 = "tier_2"  # Medium - Gold
    TIER_3 = "tier_3"  # Minor - Teal


class NewsModel:
    """News document structure for MongoDB"""
    
    @staticmethod
    def create_document(
        title: str,
        description: str,
        summary: str,
        source: str,
        source_url: Optional[str] = None,
        image_url: Optional[str] = None,
        category: str = "General",
        tier: NewsTier = NewsTier.TIER_2,
        status: NewsStatus = NewsStatus.DRAFT,
        tags: List[str] = None,
        affected_roles: List[str] = None,
        companies: List[str] = None,
        key_stat_value: Optional[str] = None,
        key_stat_label: Optional[str] = None,
        secondary_stat_value: Optional[str] = None,
        secondary_stat_label: Optional[str] = None,
        published_date: Optional[datetime] = None,
        created_by: Optional[str] = None
    ) -> dict:
        """Create a new news document"""
        now = datetime.utcnow()
        return {
            "title": title,
            "description": description,
            "summary": summary,
            "source": source,
            "source_url": source_url,
            "image_url": image_url,
            "category": category,
            "tier": tier.value if isinstance(tier, NewsTier) else tier,
            "status": status.value if isinstance(status, NewsStatus) else status,
            "tags": tags or [],
            "affected_roles": affected_roles or [],
            "companies": companies or [],
            "key_stat": {
                "value": key_stat_value,
                "label": key_stat_label
            } if key_stat_value else None,
            "secondary_stat": {
                "value": secondary_stat_value,
                "label": secondary_stat_label
            } if secondary_stat_value else None,
            "published_date": published_date or now,
            "created_at": now,
            "updated_at": now,
            "created_by": created_by
        }
    
    @staticmethod
    def from_db(document: dict) -> Optional[dict]:
        """Convert MongoDB document to response format"""
        if document is None:
            return None
        
        return {
            "id": str(document["_id"]),
            "title": document["title"],
            "description": document["description"],
            "summary": document.get("summary", ""),
            "source": document.get("source", ""),
            "source_url": document.get("source_url"),
            "image_url": document.get("image_url"),
            "category": document["category"],
            "tier": document.get("tier", "tier_2"),
            "status": document["status"],
            "tags": document.get("tags", []),
            "affected_roles": document.get("affected_roles", []),
            "companies": document.get("companies", []),
            "key_stat": document.get("key_stat"),
            "secondary_stat": document.get("secondary_stat"),
            "published_date": document["published_date"],
            "created_at": document["created_at"],
            "updated_at": document.get("updated_at"),
            "created_by": document.get("created_by")
        }
