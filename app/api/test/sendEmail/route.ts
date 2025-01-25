import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

interface EmailRequestBody {
  reminder: string;
  reminderDate: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const { reminder, reminderDate, email }: EmailRequestBody = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${reminder}`,
      text: `You requested a reminder for: ${reminder}\nDate & Time: ${new Date(reminderDate).toLocaleString()}`,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully!', info },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
