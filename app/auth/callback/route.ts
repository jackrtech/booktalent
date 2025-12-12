import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  console.log("[v0] OAuth callback hit")
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[v0] Failed to exchange code for session:", exchangeError)
      return NextResponse.redirect(`${requestUrl.origin}?error=auth_failed`)
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("[v0] Failed to get user after OAuth:", userError)
      return NextResponse.redirect(`${requestUrl.origin}?error=auth_failed`)
    }

    console.log("[v0] OAuth user authenticated:", user.id, user.email)

    const serviceSupabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })

    // Check if profile exists using service role
    const { data: existingProfile, error: checkError } = await serviceSupabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (checkError) {
      console.error("[v0] Error checking for existing profile:", checkError)
    }

    // If no profile exists, create one
    if (!existingProfile) {
      console.log("[v0] Creating profile for OAuth user...")

      const { error: profileError } = await serviceSupabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        user_type: null,
        is_verified: false,
        verification_status: "pending",
        onboarding_completed: false,
      })

      if (profileError) {
        console.error("[v0] Failed to create OAuth profile:", profileError)
        // Continue anyway - user exists in auth.users
      } else {
        console.log("[v0] OAuth profile created successfully")
      }
    } else {
      console.log("[v0] Profile already exists for OAuth user")
    }

    const { data: profile, error: profileFetchError } = await serviceSupabase
      .from("profiles")
      .select("user_type, onboarding_completed, is_verified")
      .eq("id", user.id)
      .single()

    if (profileFetchError || !profile) {
      console.error("[v0] Failed to fetch profile after OAuth:", profileFetchError)
      // Default to verification if we can't get profile
      return NextResponse.redirect(`${requestUrl.origin}/verification`)
    }

    console.log("[v0] Profile data:", profile)

    // Redirect based on profile status
    if (!profile.user_type || !profile.is_verified) {
      console.log("[v0] Redirecting to verification")
      return NextResponse.redirect(`${requestUrl.origin}/verification`)
    } else if (!profile.onboarding_completed) {
      console.log("[v0] Redirecting to onboarding")
      return NextResponse.redirect(`${requestUrl.origin}/onboarding/${profile.user_type}`)
    } else {
      console.log("[v0] Redirecting to dashboard")
      return NextResponse.redirect(`${requestUrl.origin}/dashboard/${profile.user_type}`)
    }
  }

  // If no code or auth failed, redirect to home
  console.log("[v0] No code provided, redirecting to home")
  return NextResponse.redirect(requestUrl.origin)
}
