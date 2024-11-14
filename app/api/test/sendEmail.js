// pages/api/sendEmail.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reminder, reminderDate, email } = req.body;

    // Use environment variables for sensitive information
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can replace this with another service like SendGrid or Mailgun if needed
      auth: {
        user: process.env.EMAIL_USER, // Accessing email from environment variables
        pass: process.env.EMAIL_PASS, // Accessing email password from environment variables
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${reminder}`,
      text: `You requested a reminder for: ${reminder}\nDate & Time: ${new Date(reminderDate).toLocaleString()}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!', info });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
