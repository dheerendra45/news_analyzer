from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class Subscription(BaseModel):
    """Subscription model for newsletter subscriptions"""
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    role: str
    interest: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

