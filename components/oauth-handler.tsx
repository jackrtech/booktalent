"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { handleOAuthCallback } from "@/app/actions/auth"

export function OAuthHandler() {
  const router = useRouter()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    const handleOAuth = async () => {
      // Only run once per page load
      if (hasChecked) {
        console.log("[v0] OAuth Handler: Already checked, skipping")
        return
      }

      setHasChecked(true)
      console.log("[v0] OAuth Handler: Checking for new OAuth session")

      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        // Check if we have a session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          console.log("[v0] OAuth Handler: No session found")
          return
        }

        console.log("[v0] OAuth Handler: Session found, checking if this is a new OAuth user")

        // Check if profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type, created_at")
          .eq("id", session.user.id)
          .single()

        // If profile doesn't exist or was just created (within last minute), process OAuth
        const isNewUser = !profile || new Date().getTime() - new Date(profile.created_at).getTime() < 60000

        if (isNewUser) {
          console.log("[v0] OAuth Handler: New OAuth user detected, processing")

          // Call server action to create profile if needed
          const result = await handleOAuthCallback(null)
          console.log("[v0] OAuth Handler: Callback result", result)

          if (result.success) {
            // Redirect based on whether user has selected account type
            if (result.hasUserType) {
              console.log("[v0] OAuth Handler: User has type, staying on home")
              router.refresh()
            } else {
              console.log("[v0] OAuth Handler: New user, redirecting to verification")
              router.push("/verification")
            }
          } else {
            console.error("[v0] OAuth Handler: Callback failed", result.error)
            alert(`OAuth sign in failed: ${result.error}`)
          }
        } else {
          console.log("[v0] OAuth Handler: Existing user, not an OAuth redirect")
        }
      } catch (error) {
        console.error("[v0] OAuth Handler: Error", error)
      }
    }

    // Wait a moment for the page to fully load and Supabase to initialize
    const timer = setTimeout(handleOAuth, 500)
    return () => clearTimeout(timer)
  }, [router, hasChecked])

  // Don't render anything, this is invisible
  return null
}
