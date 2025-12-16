import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

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

    await supabase.auth.exchangeCodeForSession(code)

    // Check if user needs profile creation
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Use service role to check/create profile
      const adminSupabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
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

      const { data: existingProfile } = await adminSupabase.from("profiles").select("id").eq("id", user.id).single()

      if (!existingProfile) {
        // New user - create profile
        await adminSupabase.from("profiles").insert({
          id: user.id,
          email: user.email,
        })

        // Redirect to verification
        return NextResponse.redirect(new URL("/verification", requestUrl.origin))
      }
    }
  }

  // Redirect to home
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
