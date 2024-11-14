import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Log the incoming request data
    const { reminder, reminderDate, email } = await req.json();
    console.log('Received request data:', { reminder, reminderDate, email });

    // Ensure email and reminder are present
    if (!email || !reminder || !reminderDate) {
      console.error('Missing required fields in request:', { email, reminder, reminderDate });
      return NextResponse.json(
        { error: 'Missing required fields: email, reminder, or reminderDate.' },
        { status: 400 }
      );
    }

    // Setup the transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Log transporter details (sensitive data redacted)
    console.log('Email transporter configured:', {
      user: process.env.EMAIL_USER,
      service: 'gmail',
    });

    // Create email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${reminder}`,
      text: `You requested a reminder for: ${reminder}\nDate & Time: ${new Date(reminderDate).toLocaleString()}`,
    };

    // Log the email options being sent
    console.log('Sending email with the following options:', mailOptions);

    // Attempt to send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    // Return success response
    return NextResponse.json(
      { message: 'Email sent successfully!', info },
      { status: 200 }
    );
  } catch (error) {
    // Log detailed error for debugging
    console.error('Error sending email:', error);

    // Capture and return the error response with details
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
