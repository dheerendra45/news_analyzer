"""
Authentication service for user management
"""
from typing import Optional
from bson import ObjectId
from app.database import get_users_collection
from app.models.user import UserModel, UserRole
from app.schemas.user import UserCreate, AdminCreate, UserResponse
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.config import settings


class AuthService:
    """Service class for authentication operations"""
    
    @staticmethod
    def is_valid_admin_domain(email: str) -> bool:
        """
        Check if email domain is valid for admin access
        
        Args:
            email: User email address
        
        Returns:
            True if domain is in allowed admin domains list
        """
        if not email or "@" not in email:
            return False
        domain = email.split("@")[1].lower()
        return domain in settings.admin_domain_list
    
    @staticmethod
    async def create_user(user_data: UserCreate) -> Optional[dict]:
        """
        Create a new user
        
        Args:
            user_data: User creation data
        
        Returns:
            Created user dict or None if email/username exists
        """
        collection = get_users_collection()
        
        # Check if email or username already exists
        existing = await collection.find_one({
            "$or": [
                {"email": user_data.email},
                {"username": user_data.username}
            ]
        })
        
        if existing:
            return None
        
        # Create user document
        hashed_pwd = hash_password(user_data.password)
        user_doc = UserModel.create_document(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_pwd,
            role=user_data.role
        )
        
        result = await collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        
        return UserModel.from_db(user_doc)
    
    @staticmethod
    async def create_admin(admin_data: AdminCreate) -> Optional[dict]:
        """
        Create a new admin user
        
        Args:
            admin_data: Admin creation data
        
        Returns:
            Created admin dict or None if email/username exists or invalid domain
        """
        # Validate admin email domain
        if not AuthService.is_valid_admin_domain(admin_data.email):
            raise ValueError(f"Admin email must be from one of these domains: {', '.join(settings.admin_domain_list)}")
        
        collection = get_users_collection()
        
        # Check if email or username already exists
        existing = await collection.find_one({
            "$or": [
                {"email": admin_data.email},
                {"username": admin_data.username}
            ]
        })
        
        if existing:
            return None
        
        # Create admin document
        hashed_pwd = hash_password(admin_data.password)
        user_doc = UserModel.create_document(
            email=admin_data.email,
            username=admin_data.username,
            hashed_password=hashed_pwd,
            role=UserRole.ADMIN
        )
        
        result = await collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        
        return UserModel.from_db(user_doc)
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> Optional[dict]:
        """
        Authenticate a user by email and password
        
        Args:
            email: User email
            password: Plain text password
        
        Returns:
            User dict if authenticated, None otherwise
        """
        collection = get_users_collection()
        
        user = await collection.find_one({"email": email})
        
        if not user:
            return None
        
        if not verify_password(password, user["hashed_password"]):
            return None
        
        if not user.get("is_active", True):
            return None
        
        return UserModel.from_db(user)
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[dict]:
        """
        Get user by ID
        
        Args:
            user_id: User ID string
        
        Returns:
            User dict or None
        """
        collection = get_users_collection()
        
        try:
            user = await collection.find_one({"_id": ObjectId(user_id)})
            return UserModel.from_db(user)
        except:
            return None
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[dict]:
        """
        Get user by email
        
        Args:
            email: User email
        
        Returns:
            User dict or None
        """
        collection = get_users_collection()
        user = await collection.find_one({"email": email})
        return UserModel.from_db(user)
    
    @staticmethod
    def create_user_token(user: dict) -> str:
        """
        Create access token for user
        
        Args:
            user: User dict
        
        Returns:
            JWT access token
        """
        token_data = {
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"]
        }
        return create_access_token(token_data)
    
    @staticmethod
    async def seed_admin_user():
        """
        Optional: Log message about admin registration
        Admins now self-register with valid domain emails
        """
        from app.config import settings
        print(f"ℹ️  Admin registration enabled for domains: {', '.join(settings.admin_domain_list)}")
        print("ℹ️  Admins can register at POST /api/auth/admin/register")
