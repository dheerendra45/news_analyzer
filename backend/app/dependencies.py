"""
FastAPI Dependencies for authentication and authorization
"""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import verify_token
from app.services.auth_service import AuthService
from app.models.user import UserRole

# Security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency to get current authenticated user from JWT token
    
    Args:
        credentials: HTTP Bearer credentials
    
    Returns:
        Current user dict
    
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    token_data = verify_token(token)
    
    if token_data is None:
        raise credentials_exception
    
    user = await AuthService.get_user_by_id(token_data.user_id)
    
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Dependency to get current active user
    
    Args:
        current_user: Current authenticated user
    
    Returns:
        Current active user dict
    
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


async def get_admin_user(
    current_user: dict = Depends(get_current_active_user)
) -> dict:
    """
    Dependency to ensure current user is an admin
    
    Args:
        current_user: Current active user
    
    Returns:
        Current admin user dict
    
    Raises:
        HTTPException: If user is not an admin
    """
    if current_user.get("role") != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    )
) -> Optional[dict]:
    """
    Optional dependency to get current user (for public endpoints with optional auth)
    
    Args:
        credentials: Optional HTTP Bearer credentials
    
    Returns:
        User dict if authenticated, None otherwise
    """
    if credentials is None:
        return None
    
    token_data = verify_token(credentials.credentials)
    
    if token_data is None:
        return None
    
    user = await AuthService.get_user_by_id(token_data.user_id)
    return user
