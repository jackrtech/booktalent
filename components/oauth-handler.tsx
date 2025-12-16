"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { handleOAuthCallback } from "@/app/actions/auth"

export function OAuthHandler() {
  console.log("[v0] OAuth Handler: Component MOUNTED")

  const router = useRouter()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    console.log("[v0] OAuth Handler: useEffect RUNNING")

    const handleOAuth = async () => {
      console.log("[v0] OAuth Handler: handleOAuth function called, hasChecked =", hasChecked)

      // Only run once per page load
      if (hasChecked) {
        console.log("[v0] OAuth Handler: Already checked, skipping")
        return
      }

      setHasChecked(true)
      console.log("[v0] OAuth Handler: Checking for new OAuth session")

      try {
        console.log("[v0] OAuth Handler: Creating Supabase client")
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )
        console.log("[v0] OAuth Handler: Supabase client created")

        // Check if we have a session
        console.log("[v0] OAuth Handler: Getting session")
        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log("[v0] OAuth Handler: Session result", session ? "Session exists" : "No session")

        if (!session) {
          console.log("[v0] OAuth Handler: No session found, exiting")
          return
        }

        console.log("[v0] OAuth Handler: Session found for user", session.user.email)
        console.log("[v0] OAuth Handler: Checking profile in database")

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("user_type, created_at")
          .eq("id", session.user.id)
          .single()

        console.log("[v0] OAuth Handler: Profile query result", { profile, profileError })

        // If profile doesn't exist or was just created (within last minute), process OAuth
        const isNewUser = !profile || new Date().getTime() - new Date(profile.created_at).getTime() < 60000
        console.log("[v0] OAuth Handler: Is new user?", isNewUser)

        if (isNewUser) {
          console.log("[v0] OAuth Handler: NEW OAuth user detected, calling handleOAuthCallback")

          // Call server action to create profile if needed
          const result = await handleOAuthCallback(null)
          console.log("[v0] OAuth Handler: handleOAuthCallback result", result)

          if (result.success) {
            // Redirect based on whether user has selected account type
            if (result.hasUserType) {
              console.log("[v0] OAuth Handler: User has type, refreshing page")
              router.refresh()
            } else {
              console.log("[v0] OAuth Handler: New user, redirecting to /verification")
              router.push("/verification")
            }
          } else {
            console.error("[v0] OAuth Handler: Callback FAILED", result.error)
            alert(`OAuth sign in failed: ${result.error}`)
          }
        } else {
          console.log("[v0] OAuth Handler: Existing user (not OAuth redirect), no action needed")
        }
      } catch (error) {
        console.error("[v0] OAuth Handler: EXCEPTION thrown", error)
      }
    }

    console.log("[v0] OAuth Handler: Setting 500ms timer for handleOAuth")
    // Wait a moment for the page to fully load and Supabase to initialize
    const timer = setTimeout(handleOAuth, 500)
    return () => {
      console.log("[v0] OAuth Handler: Cleanup, clearing timer")
      clearTimeout(timer)
    }
  }, [router, hasChecked])

  console.log("[v0] OAuth Handler: Rendering (returns null)")
  // Don't render anything, this is invisible
  return null
}
