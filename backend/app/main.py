"""
FastAPI Main Application
News Analyzer Full Stack Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
import os

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.services.auth_service import AuthService
from app.routes import auth_router, news_router, reports_router
from app.routes.intelligence_cards import router as intelligence_cards_router
from app.routes.subscriptions import router as subscriptions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler for startup and shutdown events
    """
    # Startup
    print("🚀 Starting News Analyzer API...")
    await connect_to_mongo()
    await AuthService.seed_admin_user()
    
    # Ensure upload directory exists
    os.makedirs(settings.upload_dir, exist_ok=True)
    os.makedirs(os.path.join(settings.upload_dir, "images"), exist_ok=True)
    os.makedirs(os.path.join(settings.upload_dir, "pdfs"), exist_ok=True)
    
    yield
    
    # Shutdown
    print("👋 Shutting down News Analyzer API...")
    await close_mongo_connection()


# Create FastAPI application
app = FastAPI(
    title="Replaceable.ai News Analyzer API",
    description="""
    ## News Analyzer Full Stack Application API
    
    A comprehensive API for managing AI-related news and reports.
    
    ### Features:
    - **Authentication**: JWT-based authentication with role-based access control
    - **News Management**: Full CRUD for news articles with rich metadata
    - **Reports Management**: Full CRUD for reports with file upload support
    - **File Uploads**: Image and PDF upload support
    
    ### Authentication:
    - Public endpoints: View published news and reports
    - Admin endpoints: Full CRUD access (requires JWT token)
    
    ### Default Admin Credentials:
    - Email: admin@replaceable.ai
    - Password: admin123
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS - Allow all origins for production flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when using "*" for origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
if os.path.exists(settings.upload_dir):
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Custom exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Convert Pydantic validation errors to user-friendly messages
    """
    errors = exc.errors()
    
    # Extract the first error for a simpler message
    if errors:
        first_error = errors[0]
        field_path = " -> ".join(str(loc) for loc in first_error["loc"] if loc != "body")
        error_type = first_error["type"]
        error_msg = first_error["msg"]
        
        # Create user-friendly message based on error type
        if error_type == "string_too_long":
            max_length = first_error.get("ctx", {}).get("max_length", "allowed")
            friendly_msg = f"Field '{field_path}' is too long. Maximum length is {max_length} characters."
        elif error_type == "string_too_short":
            min_length = first_error.get("ctx", {}).get("min_length", "required")
            friendly_msg = f"Field '{field_path}' is too short. Minimum length is {min_length} characters."
        elif error_type == "missing":
            friendly_msg = f"Field '{field_path}' is required but was not provided."
        elif error_type == "value_error":
            friendly_msg = f"Invalid value for field '{field_path}': {error_msg}"
        else:
            friendly_msg = f"Validation error for '{field_path}': {error_msg}"
        
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": friendly_msg,
                "field": field_path,
                "error_type": error_type
            }
        )
    
    # Fallback for multiple errors
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error occurred. Please check your input data."}
    )

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(news_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(intelligence_cards_router, prefix="/api")
app.include_router(subscriptions_router, prefix="/api")


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API health check
    """
    return {
        "message": "Welcome to Replaceable.ai News Analyzer API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": "news-analyzer-api"
    }


# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
