import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  console.log("[v0 OAuth Callback] Route hit")
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  console.log("[v0 OAuth Callback] Code present:", !!code)
  console.log("[v0 OAuth Callback] Origin:", origin)

  if (!code) {
    console.log("[v0 OAuth Callback] No code, redirecting to home")
    return NextResponse.redirect(origin)
  }

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

  console.log("[v0 OAuth Callback] Exchanging code for session...")
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error("[v0 OAuth Callback] Failed to exchange code:", exchangeError)
    return NextResponse.redirect(`${origin}?error=auth_failed`)
  }

  console.log("[v0 OAuth Callback] Getting user...")
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("[v0 OAuth Callback] Failed to get user:", userError)
    return NextResponse.redirect(`${origin}?error=auth_failed`)
  }

  console.log("[v0 OAuth Callback] User authenticated:", user.id, user.email)

  const serviceSupabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: "", ...options })
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
    console.error("[v0 OAuth Callback] Error checking profile:", checkError)
  }

  console.log("[v0 OAuth Callback] Existing profile found:", !!existingProfile)

  let isNewUser = false

  if (!existingProfile) {
    isNewUser = true
    console.log("[v0 OAuth Callback] Creating new profile...")

    const { error: profileError } = await serviceSupabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      user_type: null,
      is_verified: false,
      verification_status: "pending",
      onboarding_completed: false,
    })

    if (profileError) {
      console.error("[v0 OAuth Callback] Failed to create profile:", profileError)
      console.error("[v0 OAuth Callback] Profile error details:", JSON.stringify(profileError, null, 2))
      // Still redirect to verification even if profile creation fails
      return NextResponse.redirect(`${origin}/verification`)
    }

    console.log("[v0 OAuth Callback] Profile created successfully")
  }

  console.log("[v0 OAuth Callback] Fetching profile data...")
  const { data: profile, error: profileFetchError } = await serviceSupabase
    .from("profiles")
    .select("user_type, onboarding_completed, is_verified")
    .eq("id", user.id)
    .single()

  if (profileFetchError || !profile) {
    console.error("[v0 OAuth Callback] Failed to fetch profile:", profileFetchError)
    console.log("[v0 OAuth Callback] Defaulting to verification redirect")
    return NextResponse.redirect(`${origin}/verification`)
  }

  console.log("[v0 OAuth Callback] Profile data:", profile)
  console.log("[v0 OAuth Callback] Is new user:", isNewUser)

  if (isNewUser || !profile.user_type || !profile.is_verified) {
    console.log("[v0 OAuth Callback] Redirecting to /verification")
    return NextResponse.redirect(`${origin}/verification`)
  } else if (!profile.onboarding_completed) {
    console.log("[v0 OAuth Callback] Redirecting to onboarding")
    return NextResponse.redirect(`${origin}/onboarding/${profile.user_type}`)
  } else {
    console.log("[v0 OAuth Callback] Redirecting to dashboard")
    return NextResponse.redirect(`${origin}/dashboard/${profile.user_type}`)
  }
}
