import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    console.log("[v0 OAuth Callback] Route hit")
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const origin = requestUrl.origin

    console.log("[v0 OAuth Callback] Full URL:", request.url)
    console.log("[v0 OAuth Callback] Code present:", !!code)
    console.log("[v0 OAuth Callback] Origin:", origin)

    if (!code) {
      console.log("[v0 OAuth Callback] No code parameter, redirecting to home")
      return NextResponse.redirect(`${origin}/?error=no_code`)
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("[v0 OAuth Callback] Missing environment variables!")
      return new NextResponse(
        `<html><body><h1>Configuration Error</h1><p>Missing SUPABASE_URL or SUPABASE_ANON_KEY</p><a href="${origin}">Go Home</a></body></html>`,
        {
          status: 500,
          headers: { "Content-Type": "text/html" },
        },
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error("[v0 OAuth Callback] Cookie set error:", error)
          }
        },
        remove: (name: string, options: any) => {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.error("[v0 OAuth Callback] Cookie remove error:", error)
          }
        },
      },
    })

    console.log("[v0 OAuth Callback] Exchanging code for session...")
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[v0 OAuth Callback] Exchange error:", exchangeError)
      return NextResponse.redirect(`${origin}/?error=exchange_failed`)
    }

    console.log("[v0 OAuth Callback] Code exchanged successfully")

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("[v0 OAuth Callback] User fetch error:", userError)
      return NextResponse.redirect(`${origin}/?error=user_fetch_failed`)
    }

    console.log("[v0 OAuth Callback] User authenticated:", user.id, user.email)

    const serviceSupabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: any) => {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.error("[v0 OAuth Callback] Service cookie set error:", error)
            }
          },
          remove: (name: string, options: any) => {
            try {
              cookieStore.set({ name, value: "", ...options })
            } catch (error) {
              console.error("[v0 OAuth Callback] Service cookie remove error:", error)
            }
          },
        },
      },
    )

    console.log("[v0 OAuth Callback] Checking for existing profile...")
    const { data: existingProfile, error: checkError } = await serviceSupabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (checkError) {
      console.error("[v0 OAuth Callback] Profile check error:", checkError)
    }

    console.log("[v0 OAuth Callback] Profile exists:", !!existingProfile)

    let isNewUser = false

    if (!existingProfile) {
      isNewUser = true
      console.log("[v0 OAuth Callback] Creating new profile for user:", user.id)

      const { error: profileError } = await serviceSupabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        user_type: null,
        is_verified: false,
        verification_status: "pending",
        onboarding_completed: false,
      })

      if (profileError) {
        console.error("[v0 OAuth Callback] Profile creation error:", profileError)
        console.error("[v0 OAuth Callback] Error details:", JSON.stringify(profileError, null, 2))
      } else {
        console.log("[v0 OAuth Callback] Profile created successfully")
      }
    }

    if (isNewUser || !existingProfile) {
      console.log("[v0 OAuth Callback] Redirecting new user to /verification")
      return NextResponse.redirect(`${origin}/verification`)
    }

    const { data: profile } = await serviceSupabase
      .from("profiles")
      .select("user_type, onboarding_completed, is_verified")
      .eq("id", user.id)
      .single()

    if (!profile || !profile.user_type || !profile.is_verified) {
      console.log("[v0 OAuth Callback] Existing user needs verification")
      return NextResponse.redirect(`${origin}/verification`)
    }

    if (!profile.onboarding_completed) {
      console.log("[v0 OAuth Callback] Redirecting to onboarding")
      return NextResponse.redirect(`${origin}/onboarding/${profile.user_type}`)
    }

    console.log("[v0 OAuth Callback] Redirecting to dashboard")
    return NextResponse.redirect(`${origin}/dashboard/${profile.user_type}`)
  } catch (error: any) {
    console.error("[v0 OAuth Callback] Top-level error:", error)
    const requestUrl = new URL(request.url)
    const origin = requestUrl.origin

    return new NextResponse(
      `<html><body style="font-family: monospace; padding: 40px;"><h1>OAuth Callback Error</h1><pre style="background: #f5f5f5; padding: 20px; border-radius: 8px;">${error?.message || error?.toString() || "Unknown error"}\n\nStack:\n${error?.stack || "No stack trace"}</pre><a href="${origin}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Go Home</a></body></html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      },
    )
  }
}
