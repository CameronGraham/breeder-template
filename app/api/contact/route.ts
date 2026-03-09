import { NextRequest, NextResponse } from 'next/server'

interface ContactFormPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  let body: ContactFormPayload

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    )
  }

  const { name, email, phone, subject, message } = body

  // Validate required fields
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }
  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
  }
  if (!subject?.trim()) {
    return NextResponse.json({ error: 'Subject is required.' }, { status: 400 })
  }
  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }
  if (message.trim().length < 10) {
    return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 })
  }

  // TODO: Replace this section with an actual email sending implementation.
  // Recommended options:
  //   1. Resend (https://resend.com): npm install resend
  //      import { Resend } from 'resend'
  //      const resend = new Resend(process.env.RESEND_API_KEY)
  //      await resend.emails.send({
  //        from: 'noreply@yourdomain.com',
  //        to: process.env.CONTACT_FORM_EMAIL || body.email,
  //        subject: `Contact Form: ${subject}`,
  //        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\n${message}`,
  //      })
  //
  //   2. Nodemailer (with SMTP): npm install nodemailer @types/nodemailer
  //      Configure with SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.
  //
  //   3. SendGrid, Mailgun, AWS SES, etc.
  //
  // For now, we log the submission and return success. In production,
  // connect one of the above email services.

  const recipientEmail = process.env.CONTACT_FORM_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    'hello@example.com'

  // Log submission (remove in production once email service is connected)
  console.log('[Contact Form Submission]', {
    to: recipientEmail,
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || 'Not provided',
    subject: subject.trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json(
    {
      success: true,
      message: 'Your message has been received. We will be in touch shortly.',
    },
    { status: 200 }
  )
}
