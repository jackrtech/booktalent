import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  console.log("[v0] OAuth callback route starting")

  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const origin = requestUrl.origin

    console.log("[v0] OAuth callback - Code:", code ? "present" : "missing")
    console.log("[v0] Origin:", origin)
    console.log("[v0] Full URL:", request.url)

    // Check environment variables
    console.log("[v0] SUPABASE_URL:", process.env.SUPABASE_URL ? "present" : "MISSING")
    console.log("[v0] SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "present" : "MISSING")
    console.log("[v0] SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "MISSING")

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("[v0] ERROR: Missing required environment variables")
      return NextResponse.json({ error: "Server configuration error - missing Supabase credentials" }, { status: 500 })
    }

    if (!code) {
      console.log("[v0] No code provided, redirecting to origin")
      return NextResponse.redirect(origin)
    }

    console.log("[v0] Getting cookies...")
    const cookieStore = await cookies()
    console.log("[v0] Cookies retrieved")

    console.log("[v0] Creating Supabase client...")
    const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })
    console.log("[v0] Supabase client created")

    console.log("[v0] Exchanging code for session...")
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[v0] Code exchange error:", exchangeError)
      return NextResponse.json(
        { error: "Failed to exchange code for session", details: exchangeError.message },
        { status: 400 },
      )
    }

    console.log("[v0] Code exchange successful")

    // Get user
    console.log("[v0] Getting user...")
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("[v0] Get user error:", userError)
      return NextResponse.json({ error: "Failed to get user", details: userError.message }, { status: 400 })
    }

    if (!user) {
      console.error("[v0] No user found after successful exchange")
      return NextResponse.redirect(origin)
    }

    console.log("[v0] User found:", user.email, "ID:", user.id)

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] ERROR: Missing SUPABASE_SERVICE_ROLE_KEY")
      return NextResponse.json({ error: "Server configuration error - missing service role key" }, { status: 500 })
    }

    // Use service role to check/create profile
    console.log("[v0] Creating service role client...")
    const serviceSupabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })
    console.log("[v0] Service role client created")

    // Check if profile exists
    console.log("[v0] Checking for existing profile...")
    const { data: existingProfile, error: profileCheckError } = await serviceSupabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (profileCheckError) {
      console.error("[v0] Profile check error:", profileCheckError)
      // Continue anyway - profile might have been created by trigger
    }

    console.log("[v0] Profile exists:", !!existingProfile)

    // Create profile if it doesn't exist
    if (!existingProfile) {
      console.log("[v0] Creating new profile...")
      const { error: insertError } = await serviceSupabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        user_type: null,
        is_verified: false,
        verification_status: "pending",
        onboarding_completed: false,
      })

      if (insertError) {
        console.error("[v0] Profile creation error:", insertError)
        // Continue anyway - might have been created by trigger
      } else {
        console.log("[v0] Profile created successfully")
      }

      console.log("[v0] Redirecting to /verification")
      return NextResponse.redirect(`${origin}/verification`)
    }

    console.log("[v0] Profile already exists, redirecting to origin")
    return NextResponse.redirect(origin)
  } catch (error: any) {
    console.error("[v0] CRITICAL ERROR in OAuth callback:", error)
    console.error("[v0] Error stack:", error.stack)
    return NextResponse.json(
      {
        error: "Internal server error during OAuth callback",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
