"""
File upload service for handling images and PDFs
"""
import os
import uuid
import aiofiles
from datetime import datetime
from typing import Optional, Tuple
from fastapi import UploadFile, HTTPException
from app.config import settings

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_PDF_EXTENSIONS = {".pdf"}
ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_PDF_EXTENSIONS


class FileUploadService:
    """Service class for file upload operations"""
    
    def __init__(self):
        self.upload_dir = settings.upload_dir
        self.max_file_size = settings.max_file_size
        self._ensure_upload_dirs()
    
    def _ensure_upload_dirs(self):
        """Create upload directories if they don't exist"""
        dirs = [
            self.upload_dir,
            os.path.join(self.upload_dir, "images"),
            os.path.join(self.upload_dir, "pdfs"),
            os.path.join(self.upload_dir, "temp")
        ]
        for dir_path in dirs:
            os.makedirs(dir_path, exist_ok=True)
    
    def _get_file_extension(self, filename: str) -> str:
        """Get file extension from filename"""
        return os.path.splitext(filename)[1].lower()
    
    def _generate_filename(self, original_filename: str) -> str:
        """Generate a unique filename"""
        ext = self._get_file_extension(original_filename)
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"{timestamp}_{unique_id}{ext}"
    
    def _validate_file(self, file: UploadFile) -> Tuple[bool, str]:
        """
        Validate uploaded file
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not file.filename:
            return False, "No filename provided"
        
        ext = self._get_file_extension(file.filename)
        
        if ext not in ALLOWED_EXTENSIONS:
            return False, f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        
        return True, ""
    
    async def upload_image(self, file: UploadFile) -> str:
        """
        Upload an image file
        
        Args:
            file: Uploaded file
        
        Returns:
            URL path to the uploaded image
        
        Raises:
            HTTPException: If file is invalid or upload fails
        """
        # Validate file
        is_valid, error = self._validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
        
        ext = self._get_file_extension(file.filename)
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Only image files are allowed")
        
        # Generate unique filename
        new_filename = self._generate_filename(file.filename)
        file_path = os.path.join(self.upload_dir, "images", new_filename)
        
        # Read and validate file size
        content = await file.read()
        if len(content) > self.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {self.max_file_size // 1024 // 1024}MB"
            )
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Return relative URL path
        return f"/uploads/images/{new_filename}"
    
    async def upload_pdf(self, file: UploadFile) -> str:
        """
        Upload a PDF file
        
        Args:
            file: Uploaded file
        
        Returns:
            URL path to the uploaded PDF
        
        Raises:
            HTTPException: If file is invalid or upload fails
        """
        # Validate file
        is_valid, error = self._validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
        
        ext = self._get_file_extension(file.filename)
        if ext not in ALLOWED_PDF_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Generate unique filename
        new_filename = self._generate_filename(file.filename)
        file_path = os.path.join(self.upload_dir, "pdfs", new_filename)
        
        # Read and validate file size
        content = await file.read()
        if len(content) > self.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {self.max_file_size // 1024 // 1024}MB"
            )
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Return relative URL path
        return f"/uploads/pdfs/{new_filename}"
    
    async def upload_file(self, file: UploadFile) -> str:
        """
        Upload any allowed file (image or PDF)
        
        Args:
            file: Uploaded file
        
        Returns:
            URL path to the uploaded file
        """
        ext = self._get_file_extension(file.filename)
        
        if ext in ALLOWED_IMAGE_EXTENSIONS:
            return await self.upload_image(file)
        elif ext in ALLOWED_PDF_EXTENSIONS:
            return await self.upload_pdf(file)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
    
    def delete_file(self, file_url: str) -> bool:
        """
        Delete a file by its URL path
        
        Args:
            file_url: URL path of the file
        
        Returns:
            True if deleted, False otherwise
        """
        if not file_url or not file_url.startswith("/uploads/"):
            return False
        
        # Convert URL to file path
        relative_path = file_url.replace("/uploads/", "")
        file_path = os.path.join(self.upload_dir, relative_path)
        
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
        except Exception:
            pass
        
        return False


# Global service instance
file_upload_service = FileUploadService()
