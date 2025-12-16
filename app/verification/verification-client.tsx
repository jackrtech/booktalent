"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function VerificationClient() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ email: string; userType: string | null } | null>(null)

  useEffect(() => {
    console.log("[v0] VerificationClient: Checking user session")

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    // Check if user is authenticated
    supabase.auth.getUser().then(({ data: { user: authUser }, error: authError }) => {
      if (authError || !authUser) {
        console.log("[v0] No authenticated user, redirecting to home")
        router.push("/")
        return
      }

      console.log("[v0] User authenticated:", authUser.email)

      // Get user profile (created automatically by trigger)
      supabase
        .from("profiles")
        .select("user_type, email")
        .eq("id", authUser.id)
        .single()
        .then(({ data: profile, error: profileError }) => {
          if (profileError) {
            console.error("[v0] Profile fetch error:", profileError)
            setError("Failed to load profile. Please try refreshing.")
            setIsLoading(false)
            return
          }

          console.log("[v0] Profile loaded:", profile)

          if (profile.user_type) {
            // User has already selected account type, redirect to onboarding
            console.log("[v0] User type exists, redirecting to onboarding")
            router.push(`/onboarding/${profile.user_type}`)
          } else {
            // Show account type selection
            setUser({ email: profile.email, userType: null })
            setIsLoading(false)
          }
        })
    })
  }, [router])

  const handleAccountTypeSelection = async (userType: "talent" | "business") => {
    console.log("[v0] Account type selected:", userType)
    setIsLoading(true)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      setError("Not authenticated")
      setIsLoading(false)
      return
    }

    const { error: updateError } = await supabase.from("profiles").update({ user_type: userType }).eq("id", authUser.id)

    if (updateError) {
      console.error("[v0] Failed to update user type:", updateError)
      setError("Failed to set account type. Please try again.")
      setIsLoading(false)
      return
    }

    console.log("[v0] User type updated successfully, redirecting to onboarding")
    router.push(`/onboarding/${userType}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#14DFFF] border-r-transparent mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link href="/">
            <Button className="bg-[#14DFFF] hover:bg-[#00bce6] text-black">Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
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
          <Button
            onClick={() => handleAccountTypeSelection("talent")}
            disabled={isLoading}
            className="w-full bg-[#14DFFF] hover:bg-[#00bce6] text-black font-semibold h-12 rounded-full text-base"
          >
            I'm Talent
          </Button>

          <Button
            onClick={() => handleAccountTypeSelection("business")}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-200 text-black font-semibold h-12 rounded-full text-base"
          >
            I'm a Business
          </Button>
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
