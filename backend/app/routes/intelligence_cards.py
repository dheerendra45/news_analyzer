"""
Intelligence Cards routes - CRUD operations for landing page and archive cards
"""
from datetime import datetime
from math import ceil
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.database import get_intelligence_cards_collection
from app.models.intelligence_card import IntelligenceCardModel, CardStatus
from app.schemas.intelligence_card import (
    IntelligenceCardCreate,
    IntelligenceCardUpdate,
    IntelligenceCardResponse,
    IntelligenceCardListResponse,
    PlatformStatsResponse,
    AdminStatsResponse
)
from app.dependencies import get_admin_user, get_optional_user

router = APIRouter(prefix="/intelligence-cards", tags=["Intelligence Cards"])


# ============ PUBLIC ENDPOINTS ============

@router.get("/stats", response_model=PlatformStatsResponse)
async def get_platform_stats():
    """
    Get platform statistics for the landing page hero section
    """
    collection = get_intelligence_cards_collection()
    
    # Count published cards
    total_analyses = await collection.count_documents({"status": CardStatus.PUBLISHED.value})
    
    # Get unique companies
    pipeline = [
        {"$match": {"status": CardStatus.PUBLISHED.value}},
        {"$group": {"_id": "$company"}},
        {"$count": "total"}
    ]
    companies_result = await collection.aggregate(pipeline).to_list(1)
    total_companies = companies_result[0]["total"] if companies_result else 0
    
    return PlatformStatsResponse(
        total_analyses=total_analyses,
        total_roles_assessed=285000,
        ai_capital_tracked="412B",
        jobs_impacted="847K",
        total_companies=total_companies,
        accuracy_rate="94%"
    )


@router.get("/admin-stats", response_model=AdminStatsResponse)
async def get_admin_stats(current_user: dict = Depends(get_admin_user)):
    """
    Get admin dashboard statistics (requires admin authentication)
    """
    collection = get_intelligence_cards_collection()
    
    # Count all cards by status
    total_cards = await collection.count_documents({})
    published_cards = await collection.count_documents({"status": CardStatus.PUBLISHED.value})
    draft_cards = await collection.count_documents({"status": CardStatus.DRAFT.value})
    featured_cards = await collection.count_documents({"is_featured": True})
    
    return AdminStatsResponse(
        total_cards=total_cards,
        published_cards=published_cards,
        draft_cards=draft_cards,
        featured_cards=featured_cards
    )


@router.get("/landing", response_model=List[IntelligenceCardResponse])
async def get_landing_cards(
    limit: int = Query(8, ge=1, le=20)
):
    """
    Get cards for the landing page news feed (horizontal scroll)
    Returns published cards ordered by display_order and published_date
    """
    collection = get_intelligence_cards_collection()
    
    cursor = collection.find(
        {"status": CardStatus.PUBLISHED.value}
    ).sort([
        ("display_order", 1),
        ("published_date", -1)
    ]).limit(limit)
    
    cards = []
    async for doc in cursor:
        cards.append(IntelligenceCardModel.from_db(doc))
    
    return [IntelligenceCardResponse(**c) for c in cards]


@router.get("/featured", response_model=Optional[IntelligenceCardResponse])
async def get_featured_card():
    """
    Get the featured card for the archive page banner
    """
    collection = get_intelligence_cards_collection()
    
    doc = await collection.find_one({
        "status": CardStatus.PUBLISHED.value,
        "is_featured": True
    })
    
    if not doc:
        # Return the most recent if no featured
        doc = await collection.find_one(
            {"status": CardStatus.PUBLISHED.value},
            sort=[("published_date", -1)]
        )
    
    if doc:
        card = IntelligenceCardModel.from_db(doc)
        return IntelligenceCardResponse(**card)
    
    return None


@router.get("", response_model=IntelligenceCardListResponse)
async def get_all_cards(
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    company: Optional[str] = None,
    tier: Optional[str] = None,
    category: Optional[str] = None,
    industry: Optional[str] = None,
    date_filter: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("newest", regex="^(newest|oldest|rpi-high|rpi-low|jobs)$"),
    status: Optional[str] = Query(None, description="Filter by status (draft/published)"),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Get all intelligence cards with pagination and filters
    
    - Public users: Only see published cards
    - Admin users: Can filter by status
    """
    collection = get_intelligence_cards_collection()
    
    # Build query filter
    query = {}
    
    # Public users only see published cards
    is_admin = current_user and current_user.get("role") == "admin"
    if not is_admin:
        query["status"] = CardStatus.PUBLISHED.value
    elif status:
        query["status"] = status
    
    if company:
        query["company"] = {"$regex": company, "$options": "i"}
    
    if tier:
        query["tier"] = tier
    
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    
    if industry:
        query["industry"] = {"$regex": industry, "$options": "i"}
    
    # Date filter
    if date_filter:
        now = datetime.utcnow()
        if date_filter == "7d":
            from datetime import timedelta
            query["published_date"] = {"$gte": now - timedelta(days=7)}
        elif date_filter == "30d":
            from datetime import timedelta
            query["published_date"] = {"$gte": now - timedelta(days=30)}
        elif date_filter == "90d":
            from datetime import timedelta
            query["published_date"] = {"$gte": now - timedelta(days=90)}
        elif date_filter == "2026":
            query["published_date"] = {
                "$gte": datetime(2026, 1, 1),
                "$lt": datetime(2027, 1, 1)
            }
        elif date_filter == "2025":
            query["published_date"] = {
                "$gte": datetime(2025, 1, 1),
                "$lt": datetime(2026, 1, 1)
            }
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    
    # Determine sort order
    sort_field = [("published_date", -1)]  # Default: newest first
    if sort_by == "oldest":
        sort_field = [("published_date", 1)]
    elif sort_by == "rpi-high":
        sort_field = [("rpi_score", -1), ("published_date", -1)]
    elif sort_by == "rpi-low":
        sort_field = [("rpi_score", 1), ("published_date", -1)]
    elif sort_by == "jobs":
        sort_field = [("jobs_affected", -1), ("published_date", -1)]
    
    # Get total count
    total = await collection.count_documents(query)
    pages = ceil(total / size) if total > 0 else 1
    
    # Get paginated results
    skip = (page - 1) * size
    cursor = collection.find(query).sort(sort_field).skip(skip).limit(size)
    
    cards = []
    async for doc in cursor:
        cards.append(IntelligenceCardModel.from_db(doc))
    
    return IntelligenceCardListResponse(
        items=[IntelligenceCardResponse(**c) for c in cards],
        total=total,
        page=page,
        size=size,
        pages=pages
    )


@router.get("/{card_id}", response_model=IntelligenceCardResponse)
async def get_card_by_id(
    card_id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Get a single intelligence card by ID
    
    - Public users: Only published cards
    - Admin users: Any card
    """
    collection = get_intelligence_cards_collection()
    
    try:
        card = await collection.find_one({"_id": ObjectId(card_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid card ID format"
        )
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    
    # Check permissions
    is_admin = current_user and current_user.get("role") == "admin"
    if not is_admin and card["status"] != CardStatus.PUBLISHED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    
    return IntelligenceCardResponse(**IntelligenceCardModel.from_db(card))


# ============ ADMIN ENDPOINTS ============

@router.post("", response_model=IntelligenceCardResponse)
async def create_card(
    card_data: IntelligenceCardCreate,
    admin_user: dict = Depends(get_admin_user)
):
    """
    Create a new intelligence card (Admin only)
    """
    collection = get_intelligence_cards_collection()
    
    document = IntelligenceCardModel.create_document(
        title=card_data.title,
        title_highlight=card_data.title_highlight,
        company=card_data.company,
        company_icon=card_data.company_icon,
        company_gradient=card_data.company_gradient,
        company_logo=card_data.company_logo,
        category=card_data.category,
        excerpt=card_data.excerpt,
        tier=card_data.tier,
        tier_label=card_data.tier_label,
        status=card_data.status,
        stat1_value=card_data.stat1_value,
        stat1_label=card_data.stat1_label,
        stat2_value=card_data.stat2_value,
        stat2_label=card_data.stat2_label,
        stat2_type=card_data.stat2_type,
        stat3_value=card_data.stat3_value,
        stat3_label=card_data.stat3_label,
        rpi_score=card_data.rpi_score,
        jobs_affected=card_data.jobs_affected,
        ai_investment=card_data.ai_investment,
        report_id=card_data.report_id,
        analysis_url=card_data.analysis_url,
        is_featured=card_data.is_featured,
        display_order=card_data.display_order,
        published_date=card_data.published_date,
        created_by=str(admin_user["id"]),
        industry=card_data.industry,
        tags=card_data.tags
    )
    
    result = await collection.insert_one(document)
    document["_id"] = result.inserted_id
    
    return IntelligenceCardResponse(**IntelligenceCardModel.from_db(document))


@router.put("/{card_id}", response_model=IntelligenceCardResponse)
async def update_card(
    card_id: str,
    card_data: IntelligenceCardUpdate,
    admin_user: dict = Depends(get_admin_user)
):
    """
    Update an existing intelligence card (Admin only)
    """
    collection = get_intelligence_cards_collection()
    
    try:
        existing = await collection.find_one({"_id": ObjectId(card_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid card ID format"
        )
    
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    
    # Build update dict
    update_data = card_data.model_dump(exclude_unset=True)
    
    # Handle nested stat objects
    if "stat1_value" in update_data or "stat1_label" in update_data:
        update_data["stat1"] = {
            "value": update_data.pop("stat1_value", existing.get("stat1", {}).get("value") if existing.get("stat1") else None),
            "label": update_data.pop("stat1_label", existing.get("stat1", {}).get("label") if existing.get("stat1") else None)
        }
    
    if "stat2_value" in update_data or "stat2_label" in update_data or "stat2_type" in update_data:
        update_data["stat2"] = {
            "value": update_data.pop("stat2_value", existing.get("stat2", {}).get("value") if existing.get("stat2") else None),
            "label": update_data.pop("stat2_label", existing.get("stat2", {}).get("label") if existing.get("stat2") else None),
            "type": update_data.pop("stat2_type", existing.get("stat2", {}).get("type") if existing.get("stat2") else None)
        }
    
    if "stat3_value" in update_data or "stat3_label" in update_data:
        update_data["stat3"] = {
            "value": update_data.pop("stat3_value", existing.get("stat3", {}).get("value") if existing.get("stat3") else None),
            "label": update_data.pop("stat3_label", existing.get("stat3", {}).get("label") if existing.get("stat3") else None)
        }
    
    update_data["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"_id": ObjectId(card_id)},
        {"$set": update_data}
    )
    
    updated = await collection.find_one({"_id": ObjectId(card_id)})
    return IntelligenceCardResponse(**IntelligenceCardModel.from_db(updated))


@router.delete("/{card_id}")
async def delete_card(
    card_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """
    Delete an intelligence card (Admin only)
    """
    collection = get_intelligence_cards_collection()
    
    try:
        result = await collection.delete_one({"_id": ObjectId(card_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid card ID format"
        )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    
    return {"message": "Card deleted successfully"}


@router.post("/{card_id}/toggle-status", response_model=IntelligenceCardResponse)
async def toggle_card_status(
    card_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """
    Toggle card between draft and published status (Admin only)
    """
    collection = get_intelligence_cards_collection()
    
    try:
        card = await collection.find_one({"_id": ObjectId(card_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid card ID format"
        )
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    
    new_status = CardStatus.PUBLISHED.value if card["status"] == CardStatus.DRAFT.value else CardStatus.DRAFT.value
    
    await collection.update_one(
        {"_id": ObjectId(card_id)},
        {
            "$set": {
                "status": new_status,
                "updated_at": datetime.utcnow(),
                "published_date": datetime.utcnow() if new_status == CardStatus.PUBLISHED.value else card["published_date"]
            }
        }
    )
    
    updated = await collection.find_one({"_id": ObjectId(card_id)})
    return IntelligenceCardResponse(**IntelligenceCardModel.from_db(updated))


@router.post("/{card_id}/toggle-featured", response_model=IntelligenceCardResponse)
async def toggle_featured_status(
    card_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """
    Toggle card featured status (Admin only)
    Only one card can be featured at a time
    """
    collection = get_intelligence_cards_collection()
    
    try:
        card = await collection.find_one({"_id": ObjectId(card_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid card ID format"
        )
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found"
        )
    
    new_featured = not card.get("is_featured", False)
    
    # If setting as featured, unfeature all others
    if new_featured:
        await collection.update_many(
            {"_id": {"$ne": ObjectId(card_id)}},
            {"$set": {"is_featured": False}}
        )
    
    await collection.update_one(
        {"_id": ObjectId(card_id)},
        {
            "$set": {
                "is_featured": new_featured,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    updated = await collection.find_one({"_id": ObjectId(card_id)})
    return IntelligenceCardResponse(**IntelligenceCardModel.from_db(updated))
