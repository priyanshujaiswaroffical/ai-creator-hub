import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, message, service_type } = data;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 1. Send notification to YOU (The Creator)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CREATOR_EMAIL,
      subject: `🔥 New Lead: ${name}`,
      html: `
        <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #0a0a0a; color: #ffffff; border-radius: 20px;">
          <h1 style="color: #00e5ff; font-size: 24px;">New Project Opportunity</h1>
          <p style="color: #888;">You just received a new message from your portfolio.</p>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 12px; margin-top: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service:</strong> ${service_type}</p>
          </div>
          <div style="margin-top: 20px; line-height: 1.6;">
            <p><strong>Project Details:</strong></p>
            <p style="color: #ccc;">${message}</p>
          </div>
        </div>
      `,
    });

    // 2. Send the USER'S ORIGINAL ARCHITECTURAL TEMPLATE to the CLIENT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Re: Inquiry regarding ${service_type}`,
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            :root { color-scheme: light only; }
            body { background-color: #ffffff; color: #1e293b; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f9; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <table width="100%" style="max-width: 550px; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                        <tr><td height="4" style="background-color: #0f172a;"></td></tr>
                        <tr>
                            <td style="padding: 40px 40px 20px 40px;">
                                <div style="font-size: 14px; letter-spacing: 4px; color: #0f172a; text-transform: uppercase; font-weight: 800; border-left: 3px solid #0f172a; padding-left: 20px;">
                                    AI CREATOR STUDIO
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 40px 40px 40px;">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #0f172a; font-weight: 300;">Hello ${name},</h2>
                                <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.7; color: #475569;">
                                    Thank you for reaching out. I've received your inquiry regarding <strong style="color: #0f172a;">${service_type}</strong>. 
                                </p>
                                <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.7; color: #475569;">
                                    I am personally reviewing the project details and will get back to you within 24 hours to discuss how we can build something exceptional.
                                </p>
                                <table width="100%" style="background-color: #f8fafc; border-radius: 4px; margin-bottom: 30px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">CORE EXPERTISE</div>
                                            <div style="font-size: 13px; color: #1e293b; line-height: 1.8;">
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
                                            <a href="https://priyanshu-studio.vercel.app" target="_blank" style="padding: 14px 30px; font-size: 13px; font-family: Helvetica, Arial, sans-serif; color: #ffffff !important; text-decoration: none; font-weight: 600; display: inline-block; letter-spacing: 1px;">
                                                VIEW SHOWCASE
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #f1f5f9; font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px;">
                                DESIGN &bull; ARCHITECTURE &bull; CODE &bull; MOTION
                            </td>
                        </tr>
                    </table>
                    <div style="margin-top: 20px; font-size: 11px; color: #94a3b8;">&copy; 2026 AI Creator Hub</div>
                </td>
            </tr>
        </table>
    </body>
    </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Vercel Email Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
