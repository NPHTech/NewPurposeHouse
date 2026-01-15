import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {

      console.error("❌ Missing SMTP environment variables")

      return NextResponse.json(
        { error: "Email service configuration is missing" },
        { status: 500 }
      )
    }

    // Create transporter with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Verify transporter configuration
    await transporter.verify()

    const body = await request.json()
    const { firstName, lastName, dateOfBirth, email, phone, address, city, state, zipCode, householdSize, additionalInfo } = body

    if (!firstName || !lastName || !email || !dateOfBirth || !phone || !address || !city || !state || !zipCode || !householdSize || !additionalInfo) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const subject = true ? "Application - New Purpose House" : "Inquiry - New Purpose House"
    const recipientEmail = process.env.ADMIN_EMAIL || "newpurposegithub1@gmail.com"
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER

    console.log("🟡 Sending email...")

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_NAME 
        ? `${process.env.SMTP_FROM_NAME} <${fromEmail}>`
        : fromEmail,
      to: recipientEmail,
      replyTo: email,
      subject: subject,
      html: `
        <h2>New Application Submission</h2>
        <h3>Personal Information</h3>
        <div>
          <strong>Email:</strong> ${email}<br>
          <strong>First Name:</strong> ${firstName}<br>
          <strong>Last Name:</strong> ${lastName}<br>
          <strong>Date of Birth:</strong> ${dateOfBirth}<br>
          <strong>Phone:</strong> ${phone}<br>
          <strong>Address:</strong> ${address}<br>
          <strong>City:</strong> ${city}<br>
          <strong>State:</strong> ${state}<br>
          <strong>ZIP Code:</strong> ${zipCode}<br>
          <strong>Household Size:</strong> ${householdSize}<br>
          <strong>Additional Information:</strong> ${additionalInfo}<br>
        </div>`,
    })

    console.log("✅ Email sent:", info.messageId)

    return NextResponse.json(
      {
        message: "Email sent successfully",
        messageId: info.messageId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ Exception during email delivery:", error.message)
    return NextResponse.json(
      {
        message: "Exception delivering email",
        error: error.message,
      },
      { status: 500 }
    )
  }
}