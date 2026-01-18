"""
User Pydantic schemas for request/response validation
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)


# Create schemas
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    role: UserRole = UserRole.USER


class AdminCreate(UserBase):
    """Schema for creating admin users"""
    password: str = Field(..., min_length=6, max_length=100)
    role: UserRole = UserRole.ADMIN


# Update schemas
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    is_active: Optional[bool] = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6, max_length=100)


# Response schemas
class UserResponse(BaseModel):
    id: str
    email: EmailStr
    username: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    hashed_password: str


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# OTP schemas
class OTPRequest(BaseModel):
    """Request to initiate OTP login"""
    email: EmailStr
    password: str


class OTPRequestResponse(BaseModel):
    """Response after OTP is sent"""
    message: str
    email: str
    otp_sent: bool = True


class OTPVerify(BaseModel):
    """Verify OTP and complete login"""
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class OTPVerifyResponse(BaseModel):
    """Response after successful OTP verification"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
