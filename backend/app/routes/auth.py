"""
Authentication routes
"""
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from app.schemas.user import (
    UserCreate,
    AdminCreate,
    LoginRequest,
    LoginResponse,
    UserResponse
)
from app.services.auth_service import AuthService
from app.services.file_upload import file_upload_service
from app.dependencies import get_current_user, get_admin_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user account
    
    - **email**: Valid email address
    - **username**: 3-50 characters
    - **password**: 6-100 characters
    """
    user = await AuthService.create_user(user_data)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    return user


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """
    Login and get access token
    
    - **email**: Registered email address
    - **password**: Account password
    """
    user = await AuthService.authenticate_user(
        login_data.email,
        login_data.password
    )
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = AuthService.create_user_token(user)
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(**user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user's information
    """
    return current_user


@router.post("/admin/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_admin(admin_data: AdminCreate):
    """
    Register a new admin account (Self-registration with domain validation)
    
    Only users with emails from allowed domains (@replaceable.ai, @attacked.ai) can register as admins.
    
    - **email**: Valid email from allowed domain (@replaceable.ai or @attacked.ai)
    - **username**: 3-50 characters
    - **password**: 6-100 characters
    """
    try:
        admin = await AuthService.create_admin(admin_data)
        
        if admin is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or username already registered"
            )
        
        return admin
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/admin/create", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_admin(
    admin_data: AdminCreate,
    current_admin: dict = Depends(get_admin_user)
):
    """
    Create a new admin user (Admin only)
    
    - **email**: Valid email address (must be from @replaceable.ai or @attacked.ai domain)
    - **username**: 3-50 characters
    - **password**: 6-100 characters
    """
    try:
        admin = await AuthService.create_admin(admin_data)
        
        if admin is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or username already registered"
            )
        
        return admin
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_admin_user)
):
    """
    Upload an image file (Admin only)
    
    Supported formats: JPG, JPEG, PNG, GIF, WEBP
    """
    url = await file_upload_service.upload_image(file)
    return {"url": url, "filename": file.filename}


@router.post("/upload/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_admin_user)
):
    """
    Upload a PDF file (Admin only)
    """
    url = await file_upload_service.upload_pdf(file)
    return {"url": url, "filename": file.filename}
