"""
Services package
"""
from app.services.auth_service import AuthService
from app.services.file_upload import FileUploadService, file_upload_service
from app.services.email_service import EmailService, email_service

__all__ = [
    "AuthService",
    "FileUploadService",
    "file_upload_service",
    "EmailService",
    "email_service"
]
