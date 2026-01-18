"""
Report model for MongoDB
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
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
        created_by: Optional[str] = None,
        # Rich report fields
        subtitle: Optional[str] = None,
        label: Optional[str] = None,
        tier: Optional[str] = None,
        hero_stats: Optional[List[Dict[str, Any]]] = None,
        hero_context: Optional[str] = None,
        exec_summary: Optional[Dict[str, Any]] = None,
        metrics: Optional[List[Dict[str, Any]]] = None,
        data_table: Optional[List[Dict[str, Any]]] = None,
        rpi_analysis: Optional[Dict[str, Any]] = None,
        risk_buckets: Optional[List[Dict[str, Any]]] = None,
        timeline: Optional[List[Dict[str, Any]]] = None,
        guidance: Optional[List[Dict[str, Any]]] = None,
        sources: Optional[List[Dict[str, Any]]] = None,
        is_rich_report: bool = False,
        html_content: Optional[str] = None
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
            "created_by": created_by,
            # Rich report fields
            "subtitle": subtitle,
            "label": label,
            "tier": tier,
            "hero_stats": hero_stats or [],
            "hero_context": hero_context,
            "exec_summary": exec_summary,
            "metrics": metrics or [],
            "data_table": data_table or [],
            "rpi_analysis": rpi_analysis,
            "risk_buckets": risk_buckets or [],
            "timeline": timeline or [],
            "guidance": guidance or [],
            "sources": sources or [],
            "is_rich_report": is_rich_report,
            "html_content": html_content
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
            "created_by": document.get("created_by"),
            # Rich report fields
            "subtitle": document.get("subtitle"),
            "label": document.get("label"),
            "tier": document.get("tier"),
            "hero_stats": document.get("hero_stats", []),
            "hero_context": document.get("hero_context"),
            "exec_summary": document.get("exec_summary"),
            "metrics": document.get("metrics", []),
            "data_table": document.get("data_table", []),
            "rpi_analysis": document.get("rpi_analysis"),
            "risk_buckets": document.get("risk_buckets", []),
            "timeline": document.get("timeline", []),
            "guidance": document.get("guidance", []),
            "sources": document.get("sources", []),
            "is_rich_report": document.get("is_rich_report", False),
            "html_content": document.get("html_content")
        }
