import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
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

    await supabase.auth.exchangeCodeForSession(code)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      console.log("[v0] OAuth user authenticated:", user.id, user.email)

      // Check if profile exists
      const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      // If no profile exists, create one using service role key
      if (!existingProfile) {
        console.log("[v0] Creating profile for OAuth user...")

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
        } else {
          console.log("[v0] OAuth profile created successfully")
        }
      }

      // Redirect based on profile status
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type, onboarding_completed, is_verified")
        .eq("id", user.id)
        .single()

      if (!profile?.user_type || !profile?.is_verified) {
        return NextResponse.redirect(`${requestUrl.origin}/verification`)
      } else if (!profile?.onboarding_completed) {
        return NextResponse.redirect(`${requestUrl.origin}/onboarding/${profile.user_type}`)
      } else {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard/${profile.user_type}`)
      }
    }
  }

  // If no code or auth failed, redirect to home
  return NextResponse.redirect(requestUrl.origin)
}
