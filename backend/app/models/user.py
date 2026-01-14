"""
User model for MongoDB
"""
from datetime import datetime
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


class UserModel:
    """User document structure for MongoDB"""
    
    @staticmethod
    def create_document(
        email: str,
        username: str,
        hashed_password: str,
        role: UserRole = UserRole.USER,
        is_active: bool = True
    ) -> dict:
        """Create a new user document"""
        return {
            "email": email,
            "username": username,
            "hashed_password": hashed_password,
            "role": role.value,
            "is_active": is_active,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    
    @staticmethod
    def from_db(document: dict) -> Optional[dict]:
        """Convert MongoDB document to response format"""
        if document is None:
            return None
        
        return {
            "id": str(document["_id"]),
            "email": document["email"],
            "username": document["username"],
            "role": document["role"],
            "is_active": document["is_active"],
            "created_at": document["created_at"],
            "updated_at": document.get("updated_at")
        }
