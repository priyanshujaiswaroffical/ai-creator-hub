import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from backend.core.config import settings

def send_client_auto_reply(lead_data: dict):
    """
    Sends a professional, minimalist HTML auto-reply to the client.
    """
    email_user = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_PASSWORD")
    client_email = lead_data.get('email')
    creator_name = os.getenv("CREATOR_NAME", "Creator")

    if not email_user or not email_password or not client_email:
        return False

    subject = f"Re: Inquiry regarding {lead_data.get('service_type', 'your project')} - {creator_name}"
    
    # --- BULLETPROOF ARCHITECTURAL STUDIO TEMPLATE (FORCED LIGHT MODE) ---
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light only">
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            :root {{ color-scheme: light only; supported-color-schemes: light only; }}
            html, body {{ background-color: #ffffff !important; color: #1e293b !important; }}
            @media (prefers-color-scheme: dark) {{
                .main-container {{ background-color: #ffffff !important; }}
                .text-fix {{ color: #1e293b !important; }}
                h2, div, p, span {{ color: #1e293b !important; }}
                .bg-fix {{ background-color: #ffffff !important; }}
            }}
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f9; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <!-- Main Container -->
                    <table class="main-container" width="100%" max-width="550" border="0" cellspacing="0" cellpadding="0" style="max-width: 550px; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                        
                        <!-- Sleek Top Accent Line -->
                        <tr>
                            <td height="4" style="background-color: #0f172a;"></td>
                        </tr>

                        <!-- Header Section -->
                        <tr>
                            <td style="padding: 40px 40px 20px 40px; background-color: #ffffff;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="border-left: 3px solid #0f172a; padding-left: 20px; background-color: #ffffff;">
                                            <div style="font-size: 14px; letter-spacing: 4px; color: #0f172a !important; text-transform: uppercase; font-weight: 800;">
                                                {creator_name.upper()} STUDIO
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 20px 40px 40px 40px; background-color: #ffffff;">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #0f172a !important; font-weight: 300; letter-spacing: -0.5px;">Hello {lead_data.get('name')},</h2>
                                <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.7; color: #475569 !important;">
                                    Thank you for reaching out. I've received your inquiry regarding <strong style="color: #0f172a !important;">{lead_data.get('service_type')}</strong>. 
                                </p>
                                <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.7; color: #475569 !important;">
                                    I am personally reviewing the project details and will get back to you within 24 hours to discuss how we can build something exceptional.
                                </p>

                                <!-- Skill Pillar Section -->
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 4px; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8 !important; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">CORE EXPERTISE</div>
                                            <div style="font-size: 13px; color: #1e293b !important; line-height: 1.8;">
                                                &bull; AI-Native Web Development<br>
                                                &bull; Autonomous AI Agents<br>
                                                &bull; Cinematic Video Production<br>
                                                &bull; High-Conversion Thumbnail Design
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Call to Action -->
                                <table border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" bgcolor="#0f172a" style="border-radius: 2px;">
                                            <a href="#" target="_blank" style="padding: 14px 30px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: #ffffff !important; text-decoration: none; font-weight: 600; display: inline-block; letter-spacing: 1px;">
                                                VIEW SHOWCASE
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #f1f5f9; font-size: 11px; color: #cbd5e1 !important; text-transform: uppercase; letter-spacing: 1px;">
                                DESIGN &bull; ARCHITECTURE &bull; CODE &bull; MOTION
                            </td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 20px; font-size: 11px; color: #94a3b8 !important;">
                        &copy; 2026 {creator_name} Hub
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = email_user
    msg['To'] = client_email
    msg['Subject'] = subject
    msg.attach(MIMEText(html_content, 'html'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email_user, email_password)
        server.sendmail(email_user, client_email, msg.as_string())
        server.quit()
        print(f"✅ Professional auto-reply sent to: {client_email}")
        return True
    except Exception as e:
        print(f"❌ Auto-reply failed: {e}")
        return False

def send_email_notification(lead_data: dict):
    """
    Send an email notification to the creator about a new lead.
    Requires EMAIL_USER and EMAIL_PASSWORD (App Password) in .env.
    """
    email_user = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_PASSWORD")
    creator_email = os.getenv("CREATOR_EMAIL", email_user) # Default to user's email

    if not email_user or not email_password:
        print("⚠️ Email notification skipped: EMAIL_USER or EMAIL_PASSWORD not set in .env")
        return False

    # Create the email content
    subject = f"🚀 New Lead: {lead_data.get('name')} - {lead_data.get('service_type')}"
    body = f"""
    New inquiry received from your portfolio:
    
    Name: {lead_data.get('name')}
    Email: {lead_data.get('email')}
    Service: {lead_data.get('service_type')}
    
    Message:
    {lead_data.get('message')}
    
    Status: {lead_data.get('status')}
    ---
    This lead has also been saved to your Supabase database.
    """

    msg = MIMEMultipart()
    msg['From'] = email_user
    msg['To'] = creator_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email_user, email_password)
        text = msg.as_string()
        server.sendmail(email_user, creator_email, text)
        server.quit()
        print(f"✅ Notification email sent to {creator_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False
