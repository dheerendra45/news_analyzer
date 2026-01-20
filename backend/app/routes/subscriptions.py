from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from bson import ObjectId

from ..database import get_database
from ..schemas.subscription import SubscriptionCreate, SubscriptionResponse

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

def subscription_helper(subscription) -> dict:
    """Helper to format subscription document"""
    return {
        "id": str(subscription["_id"]),
        "email": subscription["email"],
        "role": subscription["role"],
        "interest": subscription["interest"],
        "created_at": subscription["created_at"],
        "updated_at": subscription.get("updated_at")
    }

@router.post("", response_model=SubscriptionResponse, status_code=201)
async def create_subscription(subscription_data: SubscriptionCreate):
    """Create a new subscription"""
    db = get_database()
    
    # Check if email already exists
    existing = await db.subscriptions.find_one({"email": subscription_data.email})
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="This email is already subscribed"
        )
    
    try:
        subscription_dict = {
            "email": subscription_data.email,
            "role": subscription_data.role,
            "interest": subscription_data.interest,
            "created_at": datetime.utcnow(),
            "updated_at": None
        }
        
        result = await db.subscriptions.insert_one(subscription_dict)
        subscription_dict["_id"] = result.inserted_id
        
        return subscription_helper(subscription_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[SubscriptionResponse])
async def get_subscriptions(skip: int = 0, limit: int = 100):
    """Get all subscriptions (admin only - you may want to add auth here)"""
    db = get_database()
    
    subscriptions = []
    cursor = db.subscriptions.find().skip(skip).limit(limit).sort("created_at", -1)
    
    async for subscription in cursor:
        subscriptions.append(subscription_helper(subscription))
    
    return subscriptions

@router.get("/count")
async def get_subscription_count():
    """Get total subscription count"""
    db = get_database()
    count = await db.subscriptions.count_documents({})
    return {"count": count}

@router.delete("/{subscription_id}")
async def delete_subscription(subscription_id: str):
    """Delete a subscription"""
    db = get_database()
    
    try:
        result = await db.subscriptions.delete_one({"_id": ObjectId(subscription_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        return {"message": "Subscription deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
