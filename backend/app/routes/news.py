"""
News routes - CRUD operations for news articles
"""
from datetime import datetime
from math import ceil
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.database import get_news_collection
from app.models.news import NewsModel, NewsStatus
from app.schemas.news import (
    NewsCreate,
    NewsUpdate,
    NewsResponse,
    NewsListResponse
)
from app.dependencies import get_admin_user, get_optional_user

router = APIRouter(prefix="/news", tags=["News"])


# ============ PUBLIC ENDPOINTS ============

@router.get("", response_model=NewsListResponse)
async def get_all_news(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    tier: Optional[str] = None,
    status: Optional[str] = Query(None, description="Filter by status (draft/published)"),
    search: Optional[str] = None,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Get all published news articles with pagination
    
    - Public users: Only see published news
    - Admin users: Can filter by status
    """
    collection = get_news_collection()
    
    # Build query filter
    query = {}
    
    # Public users only see published news
    is_admin = current_user and current_user.get("role") == "admin"
    if not is_admin:
        query["status"] = NewsStatus.PUBLISHED.value
    elif status:
        query["status"] = status
    
    if category:
        query["category"] = category
    
    if tier:
        query["tier"] = tier
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"summary": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await collection.count_documents(query)
    pages = ceil(total / size) if total > 0 else 1
    
    # Get paginated results
    skip = (page - 1) * size
    cursor = collection.find(query).sort("published_date", -1).skip(skip).limit(size)
    
    news_list = []
    async for doc in cursor:
        news_list.append(NewsModel.from_db(doc))
    
    return NewsListResponse(
        items=[NewsResponse(**n) for n in news_list],
        total=total,
        page=page,
        size=size,
        pages=pages
    )


@router.get("/{news_id}", response_model=NewsResponse)
async def get_news_by_id(
    news_id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Get a single news article by ID
    
    - Public users: Only published news
    - Admin users: Any news
    """
    collection = get_news_collection()
    
    try:
        news = await collection.find_one({"_id": ObjectId(news_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid news ID format"
        )
    
    if news is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    # Check access for non-admin users
    is_admin = current_user and current_user.get("role") == "admin"
    if not is_admin and news.get("status") != NewsStatus.PUBLISHED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    return NewsResponse(**NewsModel.from_db(news))


# ============ ADMIN ENDPOINTS ============

@router.post("", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
async def create_news(
    news_data: NewsCreate,
    current_user: dict = Depends(get_admin_user)
):
    """
    Create a new news article (Admin only)
    """
    collection = get_news_collection()
    
    news_doc = NewsModel.create_document(
        title=news_data.title,
        description=news_data.description,
        summary=news_data.summary,
        source=news_data.source,
        source_url=news_data.source_url,
        image_url=news_data.image_url,
        category=news_data.category,
        tier=news_data.tier,
        status=news_data.status,
        tags=news_data.tags,
        affected_roles=news_data.affected_roles,
        companies=news_data.companies,
        key_stat_value=news_data.key_stat_value,
        key_stat_label=news_data.key_stat_label,
        secondary_stat_value=news_data.secondary_stat_value,
        secondary_stat_label=news_data.secondary_stat_label,
        published_date=news_data.published_date,
        created_by=current_user["id"]
    )
    
    result = await collection.insert_one(news_doc)
    news_doc["_id"] = result.inserted_id
    
    return NewsResponse(**NewsModel.from_db(news_doc))


@router.put("/{news_id}", response_model=NewsResponse)
async def update_news(
    news_id: str,
    news_data: NewsUpdate,
    current_user: dict = Depends(get_admin_user)
):
    """
    Update a news article (Admin only)
    """
    collection = get_news_collection()
    
    try:
        existing = await collection.find_one({"_id": ObjectId(news_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid news ID format"
        )
    
    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    # Build update document
    update_data = news_data.model_dump(exclude_unset=True)
    
    # Handle key_stat and secondary_stat
    if "key_stat_value" in update_data or "key_stat_label" in update_data:
        update_data["key_stat"] = {
            "value": update_data.pop("key_stat_value", existing.get("key_stat", {}).get("value")),
            "label": update_data.pop("key_stat_label", existing.get("key_stat", {}).get("label"))
        }
    
    if "secondary_stat_value" in update_data or "secondary_stat_label" in update_data:
        update_data["secondary_stat"] = {
            "value": update_data.pop("secondary_stat_value", existing.get("secondary_stat", {}).get("value")),
            "label": update_data.pop("secondary_stat_label", existing.get("secondary_stat", {}).get("label"))
        }
    
    # Convert enums to values
    if "tier" in update_data and update_data["tier"]:
        update_data["tier"] = update_data["tier"].value if hasattr(update_data["tier"], "value") else update_data["tier"]
    
    if "status" in update_data and update_data["status"]:
        update_data["status"] = update_data["status"].value if hasattr(update_data["status"], "value") else update_data["status"]
    
    update_data["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"_id": ObjectId(news_id)},
        {"$set": update_data}
    )
    
    updated = await collection.find_one({"_id": ObjectId(news_id)})
    return NewsResponse(**NewsModel.from_db(updated))


@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_news(
    news_id: str,
    current_user: dict = Depends(get_admin_user)
):
    """
    Delete a news article (Admin only)
    """
    collection = get_news_collection()
    
    try:
        result = await collection.delete_one({"_id": ObjectId(news_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid news ID format"
        )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )


@router.patch("/{news_id}/status")
async def toggle_news_status(
    news_id: str,
    current_user: dict = Depends(get_admin_user)
):
    """
    Toggle news status between draft and published (Admin only)
    """
    collection = get_news_collection()
    
    try:
        news = await collection.find_one({"_id": ObjectId(news_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid news ID format"
        )
    
    if news is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    # Toggle status
    current_status = news.get("status", NewsStatus.DRAFT.value)
    new_status = NewsStatus.PUBLISHED.value if current_status == NewsStatus.DRAFT.value else NewsStatus.DRAFT.value
    
    await collection.update_one(
        {"_id": ObjectId(news_id)},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
    )
    
    updated = await collection.find_one({"_id": ObjectId(news_id)})
    return NewsResponse(**NewsModel.from_db(updated))


@router.get("/categories/list")
async def get_news_categories():
    """
    Get list of all unique news categories
    """
    collection = get_news_collection()
    categories = await collection.distinct("category")
    return {"categories": categories}
