"use server"

import { createServerClient } from "@supabase/ssr"
import { ServerClient } from "postmark"

export async function submitWaitlist(formData: FormData) {
  const name = ((formData.get("name") as string) || "").trim()
  const email = ((formData.get("email") as string) || "").trim().toLowerCase()

  console.log("SERVER ACTION HIT:", { name, email })

  // Name: 2+ alphabetic characters (including international), max 50 chars
  const nameRegex = /^[\p{L}\s'-]{2,50}$/u
  if (!nameRegex.test(name)) {
    return {
      success: false,
      error: "Name must be at least 2 letters and contain only alphabetic characters.",
    }
  }

  // Email: Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    }
  }

  if (email.length > 100) {
    return {
      success: false,
      error: "Email is too long.",
    }
  }

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get: () => "",
      set: () => {},
      remove: () => {},
    },
  })

  const { data: existingUser, error: checkError } = await supabase
    .from("waitlist")
    .select("name")
    .eq("email", email)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 means no rows found, which is what we want
    console.error("Database check error:", checkError)
    return {
      success: false,
      error: "An error occurred. Please try again.",
    }
  }

  if (existingUser) {
    // User already exists
    return {
      success: false,
      duplicate: true,
      existingName: name, // Using form-submitted name instead of existingUser.name
    }
  }

  const { data, error } = await supabase.from("waitlist").insert({ name, email }).select().single()

  if (error) {
    console.error("Insert error:", error)
    return {
      success: false,
      error: "An error occurred. Please try again.",
    }
  }

  if (data) {
    console.log("[v0] User successfully inserted into database:", { name, email })
    console.log("[v0] Checking environment variables...")
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

      console.log("[v0] Attempting to send email to:", email)
      console.log("[v0] Email from:", process.env.POSTMARK_SENDER_EMAIL)

      const emailResult = await client.sendEmail({
        From: process.env.POSTMARK_SENDER_EMAIL!,
        To: email,
        Subject: "Welcome to the Book Talent Waitlist",
        HtmlBody: htmlBody,
        TextBody: `Hi ${name},\n\nThank you for joining the Book Talent waitlist! We're excited to have you on board.\n\nYou'll be among the first to know when we launch. Stay tuned for updates!\n\nBest regards,\nThe Book Talent Team`,
        MessageStream: "outbound",
      })

      console.log("[v0] Email sent successfully!")
      console.log("[v0] Postmark response:", emailResult)
      debugInfo.push("Email sent successfully!")
      debugInfo.push(`Postmark MessageID: ${emailResult.MessageID}`)

      return { success: true, debug: debugInfo.join(" | ") }
    } catch (emailError) {
      debugInfo.push("EMAIL ERROR!")
      debugInfo.push(`Error: ${emailError instanceof Error ? emailError.message : String(emailError)}`)

      return { success: true, debug: debugInfo.join(" | "), emailError: true }
    }
  }

  return { success: true }
}
