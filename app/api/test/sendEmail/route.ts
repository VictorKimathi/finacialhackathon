// app/api/sendEmail/route.js

import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { reminder, reminderDate, email } = await req.json();

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

    // Using NextResponse to return JSON with status 200
    return NextResponse.json(
      { message: 'Email sent successfully!', info },
      { status: 200 }
    );
  } catch (error) {
    // Using NextResponse to return error with status 500
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
