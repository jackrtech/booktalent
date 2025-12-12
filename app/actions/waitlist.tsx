"use server"

import { createClient } from "@supabase/supabase-js"
import { ServerClient } from "postmark"

export async function submitWaitlist(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim()
  const email = ((formData.get("email") as string) || "").trim().toLowerCase()

  console.log("[v0] ============ WAITLIST SUBMISSION START ============")
  console.log("[v0] Received data:", { name, email })
  console.log("[v0] FormData entries:", Array.from(formData.entries()))

  // Name: 2+ alphabetic characters (including international), max 50 chars
  const nameRegex = /^[\p{L}\s'-]{2,50}$/u
  if (!nameRegex.test(name)) {
    console.log("[v0] VALIDATION FAILED: Invalid name")
    return {
      success: false,
      error: "Name must be at least 2 letters and contain only alphabetic characters.",
    }
  }

  // Email: Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.log("[v0] VALIDATION FAILED: Invalid email")
    return {
      success: false,
      error: "Please enter a valid email address.",
    }
  }

  if (email.length > 100) {
    console.log("[v0] VALIDATION FAILED: Email too long")
    return {
      success: false,
      error: "Email is too long.",
    }
  }

  console.log("[v0] Validation passed, creating Supabase client...")
  console.log("[v0] SUPABASE_URL exists:", !!process.env.SUPABASE_URL)
  console.log("[v0] SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log("[v0] Checking for existing user in waitlist...")
  const { data: existingUser, error: checkError } = await supabase
    .from("waitlist")
    .select("name")
    .eq("email", email)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("[v0] DATABASE CHECK ERROR:", {
      message: checkError.message,
      details: checkError.details,
      hint: checkError.hint,
      code: checkError.code,
    })
    return {
      success: false,
      error: "An error occurred. Please try again.",
    }
  }

  if (existingUser) {
    console.log("[v0] User already exists in waitlist:", existingUser)
    return {
      success: false,
      duplicate: true,
      existingName: name,
    }
  }

  console.log("[v0] No existing user found, proceeding with insert...")
  const { data, error } = await supabase.from("waitlist").insert({ name, email }).select().single()

  if (error) {
    console.error("[v0] INSERT ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    return {
      success: false,
      error: "An error occurred. Please try again.",
    }
  }

  if (data) {
    console.log("[v0] User successfully inserted:", data)
    console.log("[v0] Checking email environment variables...")
    console.log("[v0] POSTMARK_API_TOKEN exists:", !!process.env.POSTMARK_API_TOKEN)
    console.log("[v0] POSTMARK_SENDER_EMAIL:", process.env.POSTMARK_SENDER_EMAIL)

    const debugInfo: string[] = []
    debugInfo.push(`User inserted: ${name} (${email})`)
    debugInfo.push(`POSTMARK_API_TOKEN exists: ${!!process.env.POSTMARK_API_TOKEN}`)
    debugInfo.push(`POSTMARK_SENDER_EMAIL: ${process.env.POSTMARK_SENDER_EMAIL || "NOT SET"}`)

    try {
      debugInfo.push("Initializing Postmark client...")
      const client = new ServerClient(process.env.POSTMARK_API_TOKEN!)

      const htmlBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 20px 0; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 8px; }
              .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #666; }
              h1 { color: #000; margin-bottom: 20px; }
              p { margin-bottom: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Book Talent!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for joining the Book Talent waitlist! We're excited to have you on board.</p>
                <p>You'll be among the first to know when we launch. Stay tuned for updates!</p>
                <p>Best regards,<br>The Book Talent Team</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Book Talent. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `

      console.log("[v0] Attempting to send email...")
      const emailResult = await client.sendEmail({
        From: process.env.POSTMARK_SENDER_EMAIL!,
        To: email,
        Subject: "Welcome to the Book Talent Waitlist",
        HtmlBody: htmlBody,
        TextBody: `Hi ${name},\n\nThank you for joining the Book Talent waitlist! We're excited to have you on board.\n\nYou'll be among the first to know when we launch. Stay tuned for updates!\n\nBest regards,\nThe Book Talent Team`,
        MessageStream: "outbound",
      })

      console.log("[v0] Email sent successfully:", emailResult.MessageID)
      console.log("[v0] ============ WAITLIST SUBMISSION SUCCESS ============")
      return { success: true }
    } catch (emailError) {
      console.error("[v0] EMAIL SEND ERROR:", emailError)
      console.log("[v0] User was added to waitlist but email failed")
      console.log("[v0] ============ WAITLIST SUBMISSION PARTIAL SUCCESS ============")
      return { success: true, emailError: true }
    }
  }

  console.log("[v0] ============ WAITLIST SUBMISSION END ============")
  return { success: true }
}
