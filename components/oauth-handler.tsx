"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { handleOAuthCallback } from "@/app/actions/auth"

export function OAuthHandler() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const handleOAuth = async () => {
      console.log("[v0] OAuth Handler: Checking for OAuth session")

      // Check if this is an OAuth redirect by looking for hash or code in URL
      const hash = window.location.hash
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get("code")

      console.log("[v0] OAuth Handler: hash=", hash, "code=", code)

      // If there's no hash or code, not an OAuth redirect
      if (!hash && !code) {
        console.log("[v0] OAuth Handler: No OAuth parameters found, skipping")
        return
      }

      // Prevent multiple simultaneous processing
      if (isProcessing) {
        console.log("[v0] OAuth Handler: Already processing, skipping")
        return
      }

      setIsProcessing(true)
      console.log("[v0] OAuth Handler: Starting OAuth processing")

      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        // Wait a moment for Supabase to establish session
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if we have a session
        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log("[v0] OAuth Handler: Session check", session ? "Found" : "Not found")

        if (session) {
          console.log("[v0] OAuth Handler: User authenticated, calling handleOAuthCallback")

          // Call server action to create profile if needed
          const result = await handleOAuthCallback(null)
          console.log("[v0] OAuth Handler: Callback result", result)

          if (result.success) {
            // Clean the URL
            window.history.replaceState({}, document.title, "/")

            // Redirect based on whether user has selected account type
            if (result.hasUserType) {
              console.log("[v0] OAuth Handler: User has type, redirecting to home")
              router.push("/")
            } else {
              console.log("[v0] OAuth Handler: New user, redirecting to verification")
              router.push("/verification")
            }
          } else {
            console.error("[v0] OAuth Handler: Callback failed", result.error)
            alert(`OAuth sign in failed: ${result.error}`)
          }
        }
      } catch (error) {
        console.error("[v0] OAuth Handler: Error", error)
        alert("An error occurred during sign in. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }

    handleOAuth()
  }, [router, isProcessing])

  // Don't render anything, this is invisible
  return null
}
