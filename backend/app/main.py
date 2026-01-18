"""
FastAPI Main Application
News Analyzer Full Stack Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.services.auth_service import AuthService
from app.routes import auth_router, news_router, reports_router
from app.routes.intelligence_cards import router as intelligence_cards_router


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

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(news_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(intelligence_cards_router, prefix="/api")


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
