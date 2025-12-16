import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function VerificationPage() {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  let profile = await supabase.from("profiles").select("user_type, email").eq("id", user.id).single()

  if (profile.error || !profile.data) {
    console.log("[v0] Profile not found for user, creating now:", user.id)

    // Use service role key to bypass RLS
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

    const { error: insertError } = await serviceSupabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      user_type: null,
      is_verified: false,
      verification_status: "pending",
      onboarding_completed: false,
    })

    if (insertError) {
      console.error("[v0] Failed to create profile:", insertError)
    } else {
      console.log("[v0] Profile created successfully for OAuth user")
    }

    // Refresh profile data
    profile = await supabase.from("profiles").select("user_type, email").eq("id", user.id).single()
  }

  if (profile.data?.user_type) {
    redirect(`/onboarding/${profile.data.user_type}`)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Book Talent!</h1>
          <p className="text-gray-400 mb-8">
            To get started, please select your account type. This will help us customize your experience.
          </p>
        </div>

        <div className="space-y-4">
          <form action="/api/select-account-type" method="POST">
            <input type="hidden" name="user_type" value="talent" />
            <Button
              type="submit"
              className="w-full bg-[#14DFFF] hover:bg-[#00bce6] text-black font-semibold h-12 rounded-full text-base"
            >
              I'm Talent
            </Button>
          </form>

          <form action="/api/select-account-type" method="POST">
            <input type="hidden" name="user_type" value="business" />
            <Button
              type="submit"
              className="w-full bg-white hover:bg-gray-200 text-black font-semibold h-12 rounded-full text-base"
            >
              I'm a Business
            </Button>
          </form>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Need help?{" "}
          <Link href="/" className="text-[#14DFFF] hover:text-[#00bce6]">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
