"""
Email service for sending report previews and notifications
"""
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.config import settings


class EmailService:
    """Email service using SMTP"""
    
    @staticmethod
    async def send_preview_email(
        to_email: str,
        subject: str,
        report_title: str,
        report_summary: str,
        report_author: str,
        message: str,
        html_content: str
    ) -> bool:
        """
        Send a report preview email to a manager
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            report_title: Title of the report
            report_summary: Brief summary
            report_author: Author of the report
            message: Custom message from admin
            html_content: Full HTML content of the report
            
        Returns:
            bool: True if email sent successfully
        """
        
        # Check if email is configured
        if not settings.email_configured:
            # For development, just return True (simulated send)
            print(f"[DEV MODE] Email would be sent to: {to_email}")
            print(f"[DEV MODE] Subject: {subject}")
            return True
        
        try:
            # Create message container
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
            msg["To"] = to_email
            
            # Plain text version
            text_content = f"""
Report Preview Request
======================

Report: {report_title}
Author: {report_author}

Summary:
{report_summary}

{f'Message from Admin: {message}' if message else ''}

---
Please review the HTML attachment for the full report preview.

This email was sent from Replaceable.ai Reports System
            """
            
            # HTML version with embedded report
            html_email = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f5f3;">
  <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <div style="background-color: #0f0f0f; padding: 24px 32px;">
      <h1 style="margin: 0; color: #ffffff; font-size: 24px;">
        Replace<span style="color: #c41e3a;">able</span>.ai
      </h1>
      <p style="margin: 8px 0 0 0; color: #8b8b8b; font-size: 14px;">
        Report Preview Request
      </p>
    </div>
    
    <!-- Info Banner -->
    <div style="background-color: #e8f4fd; border-left: 4px solid #0066cc; padding: 16px 24px; margin: 24px;">
      <p style="margin: 0; color: #0066cc; font-weight: bold; font-size: 14px;">
        ⚡ Preview Request for Approval
      </p>
    </div>
    
    <!-- Report Details -->
    <div style="padding: 24px 32px;">
      <h2 style="margin: 0 0 16px 0; color: #0f0f0f; font-size: 28px; font-family: Georgia, serif;">
        {report_title}
      </h2>
      
      <p style="margin: 0 0 24px 0; color: #6f6f6f; font-size: 14px;">
        By {report_author}
      </p>
      
      <!-- Summary Box -->
      <div style="background-color: #f8f8f8; border-left: 4px solid #c41e3a; padding: 16px 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; color: #8b8b8b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
          Summary
        </p>
        <p style="margin: 0; color: #2d2d2d; font-size: 16px; line-height: 1.6;">
          {report_summary}
        </p>
      </div>
      
      {f'''
      <!-- Admin Message -->
      <div style="background-color: #fff8e6; border: 1px solid #ffd700; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; color: #b8860b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
          📝 Message from Admin
        </p>
        <p style="margin: 0; color: #2d2d2d; font-size: 15px; line-height: 1.5;">
          {message}
        </p>
      </div>
      ''' if message else ''}
    </div>
    
    <!-- Divider -->
    <div style="border-top: 2px solid #e8e8e8; margin: 0 32px;"></div>
    
    <!-- Full Report Preview -->
    <div style="padding: 32px;">
      <h3 style="margin: 0 0 16px 0; color: #0f0f0f; font-size: 18px;">
        📄 Full Report Preview
      </h3>
      <p style="margin: 0 0 16px 0; color: #6f6f6f; font-size: 14px;">
        Scroll down to see the complete report as it will appear when published:
      </p>
      
      <!-- Embedded Report Frame -->
      <div style="border: 2px solid #e8e8e8; padding: 20px; background-color: #ffffff; max-height: 800px; overflow: auto;">
        {html_content}
      </div>
    </div>
    
    <!-- Action Buttons Placeholder -->
    <div style="padding: 24px 32px; text-align: center; background-color: #f8f8f8;">
      <p style="margin: 0 0 16px 0; color: #6f6f6f; font-size: 14px;">
        Please review and respond to the admin with your approval or feedback.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #0f0f0f; padding: 24px 32px; text-align: center;">
      <p style="margin: 0 0 8px 0; color: #8b8b8b; font-size: 12px;">
        This is an automated preview request from Replaceable.ai
      </p>
      <p style="margin: 0; color: #6f6f6f; font-size: 11px;">
        © 2026 Replaceable.ai · All rights reserved
      </p>
    </div>
    
  </div>
</body>
</html>
            """
            
            # Attach parts
            part1 = MIMEText(text_content, "plain")
            part2 = MIMEText(html_email, "html")
            msg.attach(part1)
            msg.attach(part2)
            
            # Send email
            context = ssl.create_default_context()
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                server.starttls(context=context)
                server.login(settings.smtp_user, settings.smtp_password)
                server.sendmail(
                    settings.smtp_from_email,
                    to_email,
                    msg.as_string()
                )
            
            return True
            
        except Exception as e:
            print(f"Email send error: {str(e)}")
            raise e

    @staticmethod
    async def send_email(
        to_email: str,
        subject: str,
        text_content: str,
        html_content: Optional[str] = None
    ) -> bool:
        """
        Send a generic email
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            text_content: Plain text content
            html_content: Optional HTML content
            
        Returns:
            bool: True if email sent successfully
        """
        
        # Check if email is configured
        if not settings.email_configured:
            print(f"[DEV MODE] Email would be sent to: {to_email}")
            print(f"[DEV MODE] Subject: {subject}")
            return True
        
        try:
            # Create message container
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
            msg["To"] = to_email
            
            # Attach plain text
            part1 = MIMEText(text_content, "plain")
            msg.attach(part1)
            
            # Attach HTML if provided
            if html_content:
                part2 = MIMEText(html_content, "html")
                msg.attach(part2)
            
            # Send email
            context = ssl.create_default_context()
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                server.starttls(context=context)
                server.login(settings.smtp_user, settings.smtp_password)
                server.sendmail(
                    settings.smtp_from_email,
                    to_email,
                    msg.as_string()
                )
            
            return True
            
        except Exception as e:
            print(f"Email send error: {str(e)}")
            raise e


email_service = EmailService()
