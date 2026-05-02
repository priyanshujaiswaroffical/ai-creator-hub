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
      subject: `🚀 New Lead: ${name} (${service_type})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00e5ff;">New Project Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service Requested:</strong> ${service_type}</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    });

    // 2. Send professional auto-reply to CLIENT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Received: Your Inquiry for ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #00e5ff;">Hi ${name},</h2>
          <p>Thank you for reaching out to **AI Creator Hub**.</p>
          <p>I've received your request for <strong>${service_type}</strong>. Your vision sounds exciting, and I'm already looking over your message.</p>
          <p>I will personally get back to you within the next 24 hours to discuss the next steps.</p>
          <br />
          <p>Best Regards,</p>
          <p><strong>Priyanshu Jaiswar</strong><br/>Founder, AI Creator Hub</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Vercel Email Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
