"""
Reports routes - CRUD operations for reports
"""
from datetime import datetime
from math import ceil
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.database import get_reports_collection
from app.models.report import ReportModel, ReportStatus
from app.schemas.report import (
    ReportCreate,
    ReportUpdate,
    ReportResponse,
    ReportListResponse,
    SendPreviewRequest,
    SendPreviewResponse
)
from app.dependencies import get_admin_user, get_optional_user
from app.services.email_service import email_service

router = APIRouter(prefix="/reports", tags=["Reports"])


# ============ PUBLIC ENDPOINTS ============

@router.get("", response_model=ReportListResponse)
async def get_all_reports(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    tag: Optional[str] = None,
    status: Optional[str] = Query(None, description="Filter by status (draft/published)"),
    search: Optional[str] = None,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Get all published reports with pagination
    
    - Public users: Only see published reports
    - Admin users: Can filter by status
    """
    collection = get_reports_collection()
    
    # Build query filter
    query = {}
    
    # Public users only see published reports
    is_admin = current_user and current_user.get("role") == "admin"
    if not is_admin:
        query["status"] = ReportStatus.PUBLISHED.value
    elif status:
        query["status"] = status
    
    if tag:
        query["tags"] = tag
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"summary": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await collection.count_documents(query)
    pages = ceil(total / size) if total > 0 else 1
    
    # Get paginated results
    skip = (page - 1) * size
    cursor = collection.find(query).sort("published_date", -1).skip(skip).limit(size)
    
    report_list = []
    async for doc in cursor:
        report_list.append(ReportModel.from_db(doc))
    
    return ReportListResponse(
        items=[ReportResponse(**r) for r in report_list],
        total=total,
        page=page,
        size=size,
        pages=pages
    )


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report_by_id(
    report_id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Get a single report by ID
    
    - Public users: Only published reports
    - Admin users: Any report
    """
    collection = get_reports_collection()
    
    try:
        report = await collection.find_one({"_id": ObjectId(report_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report ID format"
        )
    
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check access for non-admin users
    is_admin = current_user and current_user.get("role") == "admin"
    if not is_admin and report.get("status") != ReportStatus.PUBLISHED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return ReportResponse(**ReportModel.from_db(report))


# ============ ADMIN ENDPOINTS ============

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_data: ReportCreate,
    current_user: dict = Depends(get_admin_user)
):
    """
    Create a new report (Admin only)
    """
    collection = get_reports_collection()
    
    report_doc = ReportModel.create_document(
        title=report_data.title,
        summary=report_data.summary,
        content=report_data.content,
        file_url=report_data.file_url,
        pdf_url=report_data.pdf_url,
        cover_image_url=report_data.cover_image_url,
        tags=report_data.tags,
        status=report_data.status,
        reading_time=report_data.reading_time,
        author=report_data.author,
        published_date=report_data.published_date,
        created_by=current_user["id"],
        # Rich report fields
        subtitle=report_data.subtitle,
        label=report_data.label,
        tier=report_data.tier,
        hero_stats=report_data.hero_stats,
        hero_context=report_data.hero_context,
        exec_summary=report_data.exec_summary,
        metrics=report_data.metrics,
        data_table=report_data.data_table,
        rpi_analysis=report_data.rpi_analysis,
        risk_buckets=report_data.risk_buckets,
        timeline=report_data.timeline,
        guidance=report_data.guidance,
        sources=report_data.sources,
        is_rich_report=report_data.is_rich_report,
        html_content=report_data.html_content
    )
    
    result = await collection.insert_one(report_doc)
    report_doc["_id"] = result.inserted_id
    
    return ReportResponse(**ReportModel.from_db(report_doc))


@router.put("/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: str,
    report_data: ReportUpdate,
    current_user: dict = Depends(get_admin_user)
):
    """
    Update a report (Admin only)
    """
    collection = get_reports_collection()
    
    try:
        existing = await collection.find_one({"_id": ObjectId(report_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report ID format"
        )
    
    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Build update document
    update_data = report_data.model_dump(exclude_unset=True)
    
    # Convert enums to values
    if "status" in update_data and update_data["status"]:
        update_data["status"] = update_data["status"].value if hasattr(update_data["status"], "value") else update_data["status"]
    
    update_data["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"_id": ObjectId(report_id)},
        {"$set": update_data}
    )
    
    updated = await collection.find_one({"_id": ObjectId(report_id)})
    return ReportResponse(**ReportModel.from_db(updated))


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: str,
    current_user: dict = Depends(get_admin_user)
):
    """
    Delete a report (Admin only)
    """
    collection = get_reports_collection()
    
    try:
        result = await collection.delete_one({"_id": ObjectId(report_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report ID format"
        )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )


@router.patch("/{report_id}/status")
async def toggle_report_status(
    report_id: str,
    current_user: dict = Depends(get_admin_user)
):
    """
    Toggle report status between draft and published (Admin only)
    """
    collection = get_reports_collection()
    
    try:
        report = await collection.find_one({"_id": ObjectId(report_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report ID format"
        )
    
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Toggle status
    current_status = report.get("status", ReportStatus.DRAFT.value)
    new_status = ReportStatus.PUBLISHED.value if current_status == ReportStatus.DRAFT.value else ReportStatus.DRAFT.value
    
    await collection.update_one(
        {"_id": ObjectId(report_id)},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
    )
    
    updated = await collection.find_one({"_id": ObjectId(report_id)})
    return ReportResponse(**ReportModel.from_db(updated))


@router.get("/tags/list")
async def get_report_tags():
    """
    Get list of all unique report tags
    """
    collection = get_reports_collection()
    tags = await collection.distinct("tags")
    return {"tags": tags}


@router.post("/send-preview", response_model=SendPreviewResponse)
async def send_report_preview(
    preview_data: SendPreviewRequest,
    current_user: dict = Depends(get_admin_user)
):
    """
    Send a report preview to a manager for approval (Admin only)
    
    This endpoint allows admins to send a preview of a report to a manager
    before publishing. The manager receives an email with the full HTML
    preview of the report.
    """
    try:
        # Validate email format
        import re
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, preview_data.to_email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email address format"
            )
        
        # Send the preview email
        success = await email_service.send_preview_email(
            to_email=preview_data.to_email,
            subject=preview_data.subject,
            report_title=preview_data.report_title,
            report_summary=preview_data.report_summary or "",
            report_author=preview_data.report_author or "Admin",
            message=preview_data.message or "",
            html_content=preview_data.html_content
        )
        
        if success:
            return SendPreviewResponse(
                success=True,
                message=f"Preview sent successfully to {preview_data.to_email}"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send preview email"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error sending preview: {str(e)}"
        )
