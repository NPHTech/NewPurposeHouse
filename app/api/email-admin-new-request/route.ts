
export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"


export async function POST(request: NextRequest) {
    
  try {
    // Validate environment variables
    if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {

      console.error("❌ Missing SMTP environment variables")

      return NextResponse.json(
        { error: "Email service configuration is missing" },
        { status: 500 }
      )
    }

    // Create transporter with environment variables
    // Postmark uses port 587 for TLS or 2525 for non-TLS
    const smtpPort = parseInt(process.env.SMTP_PORT || "587")
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER || "smtp.postmarkapp.com",
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      requireTLS: smtpPort === 587, // Require TLS for port 587
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        // Do not fail on invalid certificates
        rejectUnauthorized: false
      }
    })

    // Verify transporter configuration
    await transporter.verify()

    // Parse request body with error handling
    let body
    try {
      const text = await request.text()
      if (!text || text.trim() === '') {
        return NextResponse.json(
          { error: "Request body is empty" },
          { status: 400 }
        )
      }
      body = JSON.parse(text)
    } catch (parseError: any) {
      console.error("❌ JSON parse error:", parseError.message)
      return NextResponse.json(
        { error: "Invalid JSON in request body", details: parseError.message },
        { status: 400 }
      )
    }
    
    console.log("Received form data:", body)
    const { firstName, lastName, dateOfBirth, email, phone, address, city, state, zipCode, householdSize, servicesNeeded, additionalInfo } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !dateOfBirth || !phone || !address || !city || !state || !zipCode || !householdSize) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      )
    }

    const subject = "New Application - New Purpose House"
    const recipientEmail = process.env.TEST_EMAIL || process.env.ADMIN_EMAIL
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USERNAME

    if (!fromEmail) {
      return NextResponse.json(
        { error: "SMTP_FROM environment variable is required" },
        { status: 500 }
      )
    }

    if (!recipientEmail) {
      console.error("❌ No recipient email configured (TEST_EMAIL or ADMIN_EMAIL)")
      return NextResponse.json(
        { error: "Recipient email not configured. Please set TEST_EMAIL or ADMIN_EMAIL" },
        { status: 500 }
      )
    }

    console.log("📧 Email configuration:")
    console.log("   From:", fromEmail)
    console.log("   To:", recipientEmail)
    console.log("   Reply-To:", email)

    // Format services needed (checkbox group)
    const servicesList = servicesNeeded && Array.isArray(servicesNeeded) && servicesNeeded.length > 0
      ? servicesNeeded.join(", ")
      : "None selected"

    console.log("🟡 Sending email to:", recipientEmail)

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_NAME 
        ? `${process.env.SMTP_FROM_NAME} <${fromEmail}>`
        : fromEmail,
      to: recipientEmail,
      replyTo: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c2d12;">New Application Submission</h2>
          
          <h3 style="color: #92400e; border-bottom: 2px solid #fbbf24; padding-bottom: 5px;">Personal Information</h3>
          <div style="margin-bottom: 20px;">
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
          </div>

          <h3 style="color: #92400e; border-bottom: 2px solid #fbbf24; padding-bottom: 5px;">Household Information</h3>
          <div style="margin-bottom: 20px;">
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>State:</strong> ${state}</p>
            <p><strong>ZIP Code:</strong> ${zipCode}</p>
            <p><strong>Household Size:</strong> ${householdSize}</p>
          </div>

          <h3 style="color: #92400e; border-bottom: 2px solid #fbbf24; padding-bottom: 5px;">Services Requested</h3>
          <div style="margin-bottom: 20px;">
            <p><strong>Services Needed:</strong> ${servicesList}</p>
          </div>

          ${additionalInfo ? `
          <h3 style="color: #92400e; border-bottom: 2px solid #fbbf24; padding-bottom: 5px;">Additional Information</h3>
          <div style="margin-bottom: 20px; white-space: pre-wrap;">${additionalInfo}</div>
          ` : ''}
        </div>`,
    })

    console.log("✅ Email sent successfully!")
    console.log("   Message ID:", info.messageId)
    console.log("   To:", recipientEmail)
    console.log("   Response:", info.response)

    return NextResponse.json(
      {
        message: "Email sent successfully",
        messageId: info.messageId,
        recipient: recipientEmail,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ Exception during email delivery:")
    console.error("   Error:", error.message)
    console.error("   Stack:", error.stack)
    if (error.response) {
      console.error("   SMTP Response:", error.response)
    }
    if (error.responseCode) {
      console.error("   Response Code:", error.responseCode)
    }
    return NextResponse.json(
      {
        message: "Exception delivering email",
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}