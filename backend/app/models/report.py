"""
Report model for MongoDB
"""
from datetime import datetime
from typing import Optional, List
from enum import Enum


class ReportStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


class ReportModel:
    """Report document structure for MongoDB"""
    
    @staticmethod
    def create_document(
        title: str,
        summary: str,
        content: Optional[str] = None,
        file_url: Optional[str] = None,
        pdf_url: Optional[str] = None,
        cover_image_url: Optional[str] = None,
        tags: List[str] = None,
        status: ReportStatus = ReportStatus.DRAFT,
        reading_time: Optional[int] = None,
        author: Optional[str] = None,
        published_date: Optional[datetime] = None,
        created_by: Optional[str] = None
    ) -> dict:
        """Create a new report document"""
        now = datetime.utcnow()
        return {
            "title": title,
            "summary": summary,
            "content": content,
            "file_url": file_url,
            "pdf_url": pdf_url,
            "cover_image_url": cover_image_url,
            "tags": tags or [],
            "status": status.value if isinstance(status, ReportStatus) else status,
            "reading_time": reading_time,
            "author": author,
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
            "summary": document["summary"],
            "content": document.get("content"),
            "file_url": document.get("file_url"),
            "pdf_url": document.get("pdf_url"),
            "cover_image_url": document.get("cover_image_url"),
            "tags": document.get("tags", []),
            "status": document["status"],
            "reading_time": document.get("reading_time"),
            "author": document.get("author"),
            "published_date": document["published_date"],
            "created_at": document["created_at"],
            "updated_at": document.get("updated_at"),
            "created_by": document.get("created_by")
        }
