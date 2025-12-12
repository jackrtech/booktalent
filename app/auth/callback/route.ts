import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  console.log("[v0] OAuth callback hit - Code:", code ? "present" : "missing")

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log("[v0] Code exchange successful")

      // Get user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        console.log("[v0] User:", user.email)

        // Use service role to create profile
        const serviceSupabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
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

        // Check if profile exists
        const { data: existingProfile } = await serviceSupabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        console.log("[v0] Profile exists:", !!existingProfile)

        // Create profile if it doesn't exist
        if (!existingProfile) {
          console.log("[v0] Creating new profile")
          await serviceSupabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            user_type: null,
            is_verified: false,
            verification_status: "pending",
            onboarding_completed: false,
          })

          return NextResponse.redirect(`${origin}/verification`)
        }
      }
    } else {
      console.error("[v0] Exchange error:", error)
    }
  }

  return NextResponse.redirect(origin)
}
