# Technical Proposal: Apply Form Submission with Email & CAPTCHA
## New Purpose House Website

**Date:** December 2024  
**Form:** Application Form (`/apply`)  
**Requirements:** Email delivery + CAPTCHA protection

---

## Executive Summary

This proposal outlines the implementation of form submission functionality for the Apply page (`app/apply/page.tsx`). The solution will include:
1. Form data collection and validation
2. Google reCAPTCHA v3 integration for bot protection
3. Email delivery via Resend API (recommended) or alternative services
4. User feedback and error handling
5. Secure server-side processing

---

## 1. Current State Analysis

### 1.1 Existing Files

**Form Component:**
- `app/apply/page.tsx` - Current form implementation (lines 48-108)
  - Form structure exists but no submission handler
  - Uses dynamic form generation from `content.json`
  - No validation beyond HTML5 `required` attributes
  - No CAPTCHA integration

**Form Data Structure:**
- `data/content.json` (lines 242-287)
  - Defines `formSections` with field configurations
  - Fields include: text, email, tel, date, number, textarea, checkbox-group

**Existing Dependencies:**
- ✅ `react-hook-form` (v7.60.0) - Already installed
- ✅ `zod` (v3.25.76) - Already installed (for validation)
- ✅ `@hookform/resolvers` (v3.10.0) - Already installed

**API Structure:**
- `app/api/content/route.ts` - Example API route exists
- No form submission API route yet

### 1.2 Missing Components

- ❌ Form submission handler
- ❌ Form validation schema
- ❌ CAPTCHA integration
- ❌ Email service integration
- ❌ Environment variables configuration
- ❌ Success/error UI feedback
- ❌ Loading states

---

## 2. Technology Stack Recommendations

### 2.1 Email Service Options

**Option 1: Resend (Recommended) ⭐**
- **Why:** Modern, developer-friendly, great Next.js integration
- **Cost:** Free tier: 3,000 emails/month
- **Setup:** Simple API key
- **Documentation:** https://resend.com/docs

**Option 2: SendGrid**
- **Why:** Established, reliable
- **Cost:** Free tier: 100 emails/day
- **Setup:** API key + domain verification
- **Documentation:** https://docs.sendgrid.com

**Option 3: Nodemailer with SMTP**
- **Why:** Full control, works with any SMTP provider
- **Cost:** Depends on SMTP provider (Gmail, Outlook, etc.)
- **Setup:** More complex, requires SMTP credentials
- **Documentation:** https://nodemailer.com

**Recommendation:** **Resend** - Best balance of ease, reliability, and cost for this use case.

### 2.2 CAPTCHA Solution

**Option 1: Google reCAPTCHA v3 (Recommended) ⭐**
- **Why:** Invisible, better UX, scores user behavior
- **Cost:** Free
- **Setup:** Site key + Secret key
- **Documentation:** https://developers.google.com/recaptcha/docs/v3

**Option 2: hCaptcha**
- **Why:** Privacy-focused alternative
- **Cost:** Free tier available
- **Setup:** Site key + Secret key
- **Documentation:** https://docs.hcaptcha.com

**Option 3: Turnstile (Cloudflare)**
- **Why:** Privacy-focused, no tracking
- **Cost:** Free
- **Setup:** Site key + Secret key
- **Documentation:** https://developers.cloudflare.com/turnstile

**Recommendation:** **Google reCAPTCHA v3** - Most widely used, invisible to users, proven reliability.

---

## 3. Implementation Plan

### Phase 1: Environment Setup

#### 3.1.1 Create Environment Variables File

**File:** `.env.local` (create new file in project root)

```bash
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Client Email (where form submissions are sent)
CLIENT_EMAIL=your-client@email.com

# Optional: Email "From" address
EMAIL_FROM=noreply@newpurposehouse.org
```

**Action Items:**
1. Create `.env.local` file in project root
2. Add to `.gitignore` (should already be there)
3. Get API keys from Resend and Google reCAPTCHA
4. Set client email address

#### 3.1.2 Install Required Dependencies

**File:** `package.json`

```bash
npm install resend react-google-recaptcha-v3
# OR
pnpm add resend react-google-recaptcha-v3
```

**New Dependencies:**
- `resend` - Email service SDK
- `react-google-recaptcha-v3` - reCAPTCHA v3 React integration

---

### Phase 2: Form Validation Schema

#### 3.2.1 Create Validation Schema

**File:** `lib/validations/apply-form.ts` (create new file)

```typescript
import { z } from "zod"

// Validation schema matching form structure from content.json
export const applyFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  
  // Household Information
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  householdSize: z.number().min(1, "Household size is required"),
  
  // Services Requested
  servicesNeeded: z.array(z.string()).min(1, "Please select at least one service"),
  additionalInfo: z.string().optional(),
  
  // CAPTCHA token
  recaptchaToken: z.string().min(1, "CAPTCHA verification failed"),
})

export type ApplyFormData = z.infer<typeof applyFormSchema>
```

**Action Items:**
1. Create `lib/validations/` directory
2. Create `apply-form.ts` with schema
3. Match field names exactly to `content.json` form structure

---

### Phase 3: API Route for Form Submission

#### 3.3.1 Create Form Submission API Route

**File:** `app/api/apply/route.ts` (create new file)

```typescript
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { applyFormSchema } from "@/lib/validations/apply-form"

const resend = new Resend(process.env.RESEND_API_KEY)

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`,
      }
    )
    
    const data = await response.json()
    return data.success && data.score >= 0.5 // Score threshold
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return false
  }
}

// Format form data as HTML email
function formatEmailHTML(formData: any): string {
  return `
    <h2>New Application Submission</h2>
    <h3>Personal Information</h3>
    <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
    <p><strong>Date of Birth:</strong> ${formData.dateOfBirth}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone}</p>
    
    <h3>Household Information</h3>
    <p><strong>Address:</strong> ${formData.address}</p>
    <p><strong>City:</strong> ${formData.city}</p>
    <p><strong>State:</strong> ${formData.state}</p>
    <p><strong>ZIP Code:</strong> ${formData.zipCode}</p>
    <p><strong>Household Size:</strong> ${formData.householdSize}</p>
    
    <h3>Services Requested</h3>
    <ul>
      ${formData.servicesNeeded.map((service: string) => `<li>${service}</li>`).join("")}
    </ul>
    
    ${formData.additionalInfo ? `<h3>Additional Information</h3><p>${formData.additionalInfo}</p>` : ""}
    
    <hr>
    <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
  `
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate form data
    const validationResult = applyFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const formData = validationResult.data
    
    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(formData.recaptchaToken)
    
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: "CAPTCHA verification failed" },
        { status: 400 }
      )
    }
    
    // Send email
    const emailResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@newpurposehouse.org",
      to: process.env.CLIENT_EMAIL || "info@newpurposehouse.org",
      subject: `New Application: ${formData.firstName} ${formData.lastName}`,
      html: formatEmailHTML(formData),
      replyTo: formData.email, // Allow replying directly to applicant
    })
    
    if (emailResult.error) {
      console.error("Email sending error:", emailResult.error)
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: true, message: "Application submitted successfully" },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Form submission error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

**Action Items:**
1. Create `app/api/apply/` directory
2. Create `route.ts` file
3. Implement validation, CAPTCHA verification, and email sending
4. Handle errors appropriately

---

### Phase 4: reCAPTCHA Integration

#### 3.4.1 Create reCAPTCHA Provider Component

**File:** `components/providers/recaptcha-provider.tsx` (create new file)

```typescript
"use client"

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { ReactNode } from "react"

interface ReCaptchaProviderProps {
  children: ReactNode
}

export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  
  if (!siteKey) {
    console.warn("reCAPTCHA site key not found")
    return <>{children}</>
  }
  
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      language="en"
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
```

#### 3.4.2 Add Provider to Layout

**File:** `app/layout.tsx`

Add the provider to wrap the application:

```typescript
import { ReCaptchaProvider } from "@/components/providers/recaptcha-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReCaptchaProvider>
          {children}
        </ReCaptchaProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

**Action Items:**
1. Create `components/providers/` directory
2. Create `recaptcha-provider.tsx`
3. Update `app/layout.tsx` to include provider

---

### Phase 5: Update Apply Form Component

#### 3.5.1 Integrate Form Handling

**File:** `app/apply/page.tsx`

**Changes needed:**

1. **Add imports:**
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { applyFormSchema, type ApplyFormData } from "@/lib/validations/apply-form"
import { useState } from "react"
```

2. **Add form state and handlers:**
```typescript
export default function ApplyPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  
  const { executeRecaptcha } = useGoogleReCaptcha()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
  })
  
  const onSubmit = async (data: ApplyFormData) => {
    if (!executeRecaptcha) {
      setErrorMessage("reCAPTCHA not loaded. Please refresh the page.")
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")
    
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha("submit_application")
      
      // Submit form data
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Submission failed")
      }
      
      setSubmitStatus("success")
      reset() // Clear form
      
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }
```

3. **Update form JSX:**
```typescript
<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
  {/* Existing form fields with register() */}
  {content.apply.formSections.map((section, sectionIndex) => (
    <div key={sectionIndex} className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-yellow-700">{section.title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {section.fields.map((field, fieldIndex) => (
          <div key={fieldIndex} className={/* ... */}>
            {/* Update inputs to use register() */}
            {field.type === "textarea" ? (
              <Textarea
                {...register(field.name)}
                id={field.name}
                name={field.name}
                required={field.required}
                rows={4}
              />
            ) : field.type === "checkbox-group" ? (
              // Handle checkbox groups
            ) : (
              <Input
                {...register(field.name)}
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
              />
            )}
            {/* Display validation errors */}
            {errors[field.name as keyof ApplyFormData] && (
              <p className="text-sm text-destructive mt-1">
                {errors[field.name as keyof ApplyFormData]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  ))}
  
  {/* Success/Error Messages */}
  {submitStatus === "success" && (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <p className="text-green-800">
        Thank you! Your application has been submitted successfully. We'll be in touch soon.
      </p>
    </div>
  )}
  
  {submitStatus === "error" && (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-800">
        {errorMessage || "There was an error submitting your application. Please try again."}
      </p>
    </div>
  )}
  
  {/* Submit Button */}
  <Button
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-pink-300 hover:bg-pink-400 text-white disabled:opacity-50"
    size="lg"
  >
    {isSubmitting ? "Submitting..." : "Submit Application"}
  </Button>
</form>
```

**Action Items:**
1. Update `app/apply/page.tsx` with form handling
2. Integrate `react-hook-form` with validation
3. Add reCAPTCHA token generation
4. Add success/error UI feedback
5. Handle checkbox groups properly (they need special handling)

---

### Phase 6: Handle Checkbox Groups

#### 3.6.1 Checkbox Group Handling

**File:** `app/apply/page.tsx`

Checkbox groups need special handling because they're arrays:

```typescript
// In the form, for checkbox-group fields:
{field.type === "checkbox-group" ? (
  <div className="space-y-3">
    <Label>
      {field.label}
      {field.required && <span className="text-destructive ml-1">*</span>}
    </Label>
    {field.options?.map((option, optionIndex) => (
      <div key={optionIndex} className="flex items-center gap-2">
        <Checkbox
          {...register(`servicesNeeded`, {
            // Handle array of strings
          })}
          value={option}
          id={`${field.name}-${optionIndex}`}
        />
        <label
          htmlFor={`${field.name}-${optionIndex}`}
          className="text-sm cursor-pointer"
        >
          {option}
        </label>
      </div>
    ))}
    {errors.servicesNeeded && (
      <p className="text-sm text-destructive mt-1">
        {errors.servicesNeeded.message}
      </p>
    )}
  </div>
) : (
  // ... other field types
)}
```

**Note:** Checkbox groups require custom registration logic. Consider using `Controller` from react-hook-form for complex cases.

---

## 4. File Structure Summary

### New Files to Create

```
lib/
  validations/
    apply-form.ts          # Zod validation schema

app/
  api/
    apply/
      route.ts             # Form submission API endpoint

components/
  providers/
    recaptcha-provider.tsx # reCAPTCHA provider wrapper

.env.local                 # Environment variables (DO NOT COMMIT)
```

### Files to Modify

```
app/
  apply/
    page.tsx               # Add form handling, validation, submission
  layout.tsx               # Add ReCaptchaProvider

package.json               # Add resend, react-google-recaptcha-v3
```

---

## 5. Step-by-Step Implementation Checklist

### Step 1: Setup (Day 1)
- [ ] Create `.env.local` file
- [ ] Sign up for Resend account, get API key
- [ ] Sign up for Google reCAPTCHA v3, get site key and secret key
- [ ] Install dependencies: `pnpm add resend react-google-recaptcha-v3`
- [ ] Add environment variables to `.env.local`

### Step 2: Validation Schema (Day 1)
- [ ] Create `lib/validations/apply-form.ts`
- [ ] Define Zod schema matching form structure
- [ ] Export TypeScript type from schema

### Step 3: API Route (Day 2)
- [ ] Create `app/api/apply/route.ts`
- [ ] Implement form validation
- [ ] Implement reCAPTCHA verification
- [ ] Implement email sending with Resend
- [ ] Add error handling
- [ ] Test API route with Postman/curl

### Step 4: reCAPTCHA Integration (Day 2)
- [ ] Create `components/providers/recaptcha-provider.tsx`
- [ ] Update `app/layout.tsx` to include provider
- [ ] Test reCAPTCHA loads on page

### Step 5: Form Integration (Day 3)
- [ ] Update `app/apply/page.tsx` with react-hook-form
- [ ] Add form state management
- [ ] Integrate reCAPTCHA token generation
- [ ] Add form submission handler
- [ ] Handle checkbox groups properly
- [ ] Add loading states
- [ ] Add success/error UI feedback

### Step 6: Testing (Day 3-4)
- [ ] Test form validation (all fields)
- [ ] Test successful submission
- [ ] Test error handling
- [ ] Test CAPTCHA verification
- [ ] Test email delivery
- [ ] Test on mobile devices
- [ ] Test with slow connection

### Step 7: Polish (Day 4)
- [ ] Add form reset after success
- [ ] Improve error messages
- [ ] Add accessibility features
- [ ] Test edge cases
- [ ] Document any special handling needed

---

## 6. Security Considerations

### 6.1 Server-Side Validation
- ✅ All validation happens on the server (API route)
- ✅ Client-side validation is for UX only
- ✅ Never trust client-submitted data

### 6.2 CAPTCHA Protection
- ✅ reCAPTCHA v3 runs on every submission
- ✅ Score threshold (0.5) filters suspicious submissions
- ✅ Token verified server-side only

### 6.3 Rate Limiting (Future Enhancement)
- Consider adding rate limiting to prevent spam
- Options: Vercel Edge Config, Upstash Redis, or middleware

### 6.4 Email Security
- ✅ Reply-To set to applicant email (allows direct replies)
- ✅ From address should be verified domain
- ✅ HTML email sanitized (no user input in HTML directly)

---

## 7. Error Handling Strategy

### 7.1 Client-Side Errors
- **Validation errors:** Display inline with fields
- **Network errors:** Show user-friendly message
- **CAPTCHA errors:** Prompt to refresh page

### 7.2 Server-Side Errors
- **Validation failures:** Return 400 with error details
- **CAPTCHA failures:** Return 400 without details (security)
- **Email failures:** Return 500, log error server-side
- **Unexpected errors:** Return 500, log for debugging

### 7.3 User Feedback
- Success message with clear next steps
- Error messages that are helpful but not technical
- Loading states during submission
- Disable form during submission

---

## 8. Email Template Design

### 8.1 Email Content Structure

The email should include:
1. **Subject:** "New Application: [First Name] [Last Name]"
2. **Body:**
   - Clear section headers
   - All form data organized by section
   - Timestamp of submission
   - Reply-To set to applicant email

### 8.2 Future Enhancements
- HTML email template with branding
- Plain text fallback
- Email to applicant (confirmation)
- Auto-responder setup

---

## 9. Testing Plan

### 9.1 Unit Tests
- Validation schema tests
- API route tests (mocked)
- Form component tests

### 9.2 Integration Tests
- End-to-end form submission
- CAPTCHA verification flow
- Email delivery verification

### 9.3 Manual Testing Checklist
- [ ] Submit with all required fields
- [ ] Submit with missing required fields
- [ ] Submit with invalid email format
- [ ] Submit with invalid phone number
- [ ] Submit with no services selected
- [ ] Submit with CAPTCHA disabled (should fail)
- [ ] Submit multiple times quickly (rate limiting)
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Verify email received correctly
- [ ] Verify email formatting

---

## 10. Cost Estimation

### 10.1 Service Costs

**Resend (Email):**
- Free tier: 3,000 emails/month
- Paid: $20/month for 50,000 emails
- **Estimated:** Free tier sufficient for initial launch

**Google reCAPTCHA v3:**
- Free for all usage
- **Estimated:** $0

**Total Monthly Cost:** $0 (free tier)

---

## 11. Alternative Approaches

### 11.1 If Resend Doesn't Work

**Option:** Use Nodemailer with SMTP
```typescript
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})
```

### 11.2 If reCAPTCHA Doesn't Work

**Option:** Use hCaptcha or Turnstile
- Similar implementation pattern
- Different provider, same concept

---

## 12. Future Enhancements

### 12.1 Phase 2 Features
- [ ] Database storage of submissions
- [ ] Admin dashboard to view submissions
- [ ] Email notifications to multiple recipients
- [ ] Auto-responder to applicants
- [ ] File upload support (if needed)
- [ ] Form analytics

### 12.2 Phase 3 Features
- [ ] Multi-step form wizard
- [ ] Save draft functionality
- [ ] Email templates customization
- [ ] Integration with CRM
- [ ] Automated follow-up emails

---

## 13. Dependencies to Install

```bash
pnpm add resend react-google-recaptcha-v3
# OR
npm install resend react-google-recaptcha-v3
```

**Package Details:**
- `resend`: ^3.0.0 - Email service SDK
- `react-google-recaptcha-v3`: ^1.10.0 - reCAPTCHA v3 React wrapper

---

## 14. Environment Variables Reference

### Required Variables

```bash
# Resend API Key (from resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Client Email (where submissions are sent)
CLIENT_EMAIL=your-client@email.com

# Optional: Email "From" address
EMAIL_FROM=noreply@newpurposehouse.org
```

### Getting API Keys

**Resend:**
1. Sign up at https://resend.com
2. Go to API Keys section
3. Create new API key
4. Copy key to `.env.local`

**Google reCAPTCHA:**
1. Go to https://www.google.com/recaptcha/admin
2. Create new site
3. Choose reCAPTCHA v3
4. Add your domain
5. Copy Site Key and Secret Key
6. Add to `.env.local`

---

## 15. Code Examples Summary

### Key Implementation Points

1. **Form Validation:** Use Zod schema with react-hook-form
2. **CAPTCHA:** Generate token before submission, verify server-side
3. **Email:** Format data as HTML, send via Resend API
4. **Error Handling:** User-friendly messages, detailed server logs
5. **UX:** Loading states, success/error feedback, form reset

---

## 16. Troubleshooting Guide

### Common Issues

**Issue:** reCAPTCHA not loading
- **Check:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
- **Check:** Provider is in layout.tsx
- **Check:** Browser console for errors

**Issue:** Email not sending
- **Check:** `RESEND_API_KEY` is correct
- **Check:** `CLIENT_EMAIL` is valid
- **Check:** Resend dashboard for delivery status
- **Check:** Server logs for errors

**Issue:** Validation errors
- **Check:** Field names match schema exactly
- **Check:** Required fields are filled
- **Check:** Data types match (numbers, dates, etc.)

**Issue:** Checkbox groups not working
- **Check:** Using `Controller` from react-hook-form
- **Check:** Values are collected as array
- **Check:** Schema expects array type

---

## 17. Success Criteria

### Functional Requirements
- ✅ Form data collected correctly
- ✅ Validation works for all fields
- ✅ CAPTCHA prevents bot submissions
- ✅ Email delivered to client
- ✅ User receives feedback
- ✅ Errors handled gracefully

### Performance Requirements
- ✅ Form submission < 3 seconds
- ✅ No page reload required
- ✅ Smooth user experience

### Security Requirements
- ✅ Server-side validation
- ✅ CAPTCHA verification
- ✅ No sensitive data in client code
- ✅ Rate limiting (future)

---

## Conclusion

This proposal provides a complete implementation plan for the Apply form submission functionality. The solution uses modern, reliable services (Resend + reCAPTCHA v3) and follows Next.js best practices.

**Estimated Implementation Time:** 3-4 days
**Complexity:** Medium
**Dependencies:** 2 new packages
**Cost:** $0 (free tiers)

**Next Steps:**
1. Review and approve this proposal
2. Set up accounts (Resend, reCAPTCHA)
3. Begin Phase 1 implementation
4. Test thoroughly before deployment

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Author:** Technical Proposal Team

