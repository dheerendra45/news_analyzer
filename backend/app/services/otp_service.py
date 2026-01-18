"""
OTP Service for admin login verification
"""
import random
import string
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.config import settings
from app.services.email_service import email_service


class OTPService:
    """
    Service for generating and validating OTPs for admin login.
    Uses in-memory storage with automatic expiration.
    """
    
    # In-memory OTP storage: {email: {"otp": "123456", "expires_at": datetime, "user_data": {...}}}
    _otp_store: Dict[str, dict] = {}
    
    # OTP settings
    OTP_LENGTH = 6
    OTP_EXPIRY_MINUTES = 5
    
    @classmethod
    def generate_otp(cls) -> str:
        """Generate a random 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=cls.OTP_LENGTH))
    
    @classmethod
    async def create_and_send_otp(cls, email: str, user_data: dict = None) -> bool:
        """
        Generate OTP, store it, and send via email.
        
        Args:
            email: User's email address
            user_data: Optional user data to store for later token generation
            
        Returns:
            bool: True if OTP was sent successfully
        """
        otp = cls.generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=cls.OTP_EXPIRY_MINUTES)
        
        # Store OTP with user data
        cls._otp_store[email] = {
            "otp": otp,
            "expires_at": expires_at,
            "user_data": user_data or {},
            "attempts": 0
        }
        
        username = "Admin"
        if user_data:
            username = user_data.get("username", "Admin")
        
        # Send OTP via email
        try:
            success = await cls._send_otp_email(email, otp, username)
        except Exception as e:
            print(f"[OTP SERVICE] Email sending failed: {str(e)}")
            # Clean up on failure
            if email in cls._otp_store:
                del cls._otp_store[email]
            raise e
        
        if not success:
            # Clean up if email failed
            del cls._otp_store[email]
            return False
            
        return True
    
    @classmethod
    def verify_otp(cls, email: str, otp: str) -> bool:
        """
        Verify OTP.
        
        Args:
            email: User's email address
            otp: OTP entered by user
            
        Returns:
            bool: True if OTP is valid, False otherwise
        """
        stored = cls._otp_store.get(email)
        
        if not stored:
            return False
        
        # Check if expired
        if datetime.utcnow() > stored["expires_at"]:
            del cls._otp_store[email]
            return False
        
        # Increment attempts
        stored["attempts"] += 1
        
        # Max 3 attempts
        if stored["attempts"] > 3:
            del cls._otp_store[email]
            return False
        
        # Verify OTP
        if stored["otp"] != otp:
            return False
        
        # OTP valid - clean up
        del cls._otp_store[email]
        
        return True
    
    @classmethod
    async def _send_otp_email(cls, to_email: str, otp: str, username: str) -> bool:
        """Send OTP via email"""
        
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f4f5f3;
      margin: 0;
      padding: 40px 20px;
    }}
    .container {{
      max-width: 480px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e8e8e8;
    }}
    .header {{
      background: #0f0f0f;
      padding: 32px;
      text-align: center;
    }}
    .logo {{
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      color: #ffffff;
      text-decoration: none;
    }}
    .logo span {{
      color: #c41e3a;
    }}
    .content {{
      padding: 40px 32px;
      text-align: center;
    }}
    .title {{
      font-size: 24px;
      font-weight: 600;
      color: #0f0f0f;
      margin-bottom: 16px;
    }}
    .text {{
      font-size: 16px;
      color: #6f6f6f;
      line-height: 1.6;
      margin-bottom: 32px;
    }}
    .otp-box {{
      background: #f4f5f3;
      border: 2px dashed #c41e3a;
      padding: 24px;
      margin: 24px 0;
    }}
    .otp-code {{
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 36px;
      font-weight: 700;
      color: #c41e3a;
      letter-spacing: 8px;
    }}
    .expiry {{
      font-size: 14px;
      color: #8b8b8b;
      margin-top: 24px;
    }}
    .warning {{
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 16px;
      margin-top: 24px;
      font-size: 14px;
      color: #856404;
      text-align: left;
    }}
    .footer {{
      background: #f4f5f3;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #8b8b8b;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">Replace<span>able</span>.ai</span>
    </div>
    <div class="content">
      <h1 class="title">Admin Login Verification</h1>
      <p class="text">
        Hello {username},<br><br>
        You're attempting to log in to the Replaceable.ai Admin Dashboard. 
        Please use the verification code below to complete your login.
      </p>
      <div class="otp-box">
        <div class="otp-code">{otp}</div>
      </div>
      <p class="expiry">
        This code expires in <strong>{cls.OTP_EXPIRY_MINUTES} minutes</strong>
      </p>
      <div class="warning">
        <strong>⚠️ Security Notice:</strong> If you didn't request this code, 
        please ignore this email. Do not share this code with anyone.
      </div>
    </div>
    <div class="footer">
      © 2026 Replaceable.ai · Workforce Intelligence Platform
    </div>
  </div>
</body>
</html>
        """
        
        text_content = f"""
Admin Login Verification
========================

Hello {username},

Your verification code for Replaceable.ai Admin Login is:

{otp}

This code expires in {cls.OTP_EXPIRY_MINUTES} minutes.

If you didn't request this code, please ignore this email.

---
Replaceable.ai · Workforce Intelligence Platform
        """
        
        return await email_service.send_email(
            to_email=to_email,
            subject=f"Your Login Code: {otp} - Replaceable.ai",
            text_content=text_content,
            html_content=html_content
        )
    
    @classmethod
    def cleanup_expired(cls):
        """Remove expired OTPs from storage"""
        now = datetime.utcnow()
        expired_emails = [
            email for email, data in cls._otp_store.items()
            if now > data["expires_at"]
        ]
        for email in expired_emails:
            del cls._otp_store[email]


# Create service instance
otp_service = OTPService()
