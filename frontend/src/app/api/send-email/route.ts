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

    // 2. Send professional auto-reply to CLIENT
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your inquiry has been received | AI Creator Hub`,
      html: `
        <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #ffffff; color: #1a1a1a; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="font-weight: 300;">Hello ${name},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Thank you for your interest in collaborating with **AI Creator Hub**.</p>
          <p style="font-size: 16px; line-height: 1.6;">I have received your request regarding <strong>${service_type}</strong> and I am personally reviewing the details of your project.</p>
          <p style="font-size: 16px; line-height: 1.6;">Expect a detailed response or a scheduling link from me within the next 24 hours.</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin-bottom: 0;"><strong>Priyanshu Jaiswar</strong></p>
            <p style="color: #666; margin-top: 4px;">Founder & Creative Director</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Vercel Email Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
