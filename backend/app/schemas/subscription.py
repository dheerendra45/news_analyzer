from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class SubscriptionCreate(BaseModel):
    email: EmailStr
    role: str
    interest: str

class SubscriptionResponse(BaseModel):
    id: str
    email: str
    role: str
    interest: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
