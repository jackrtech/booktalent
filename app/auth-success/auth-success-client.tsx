"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { handleOAuthCallback } from "@/app/actions/auth"

export function AuthSuccessClient() {
  const router = useRouter()

  useEffect(() => {
    const processOAuth = async () => {
      console.log("[v0] AuthSuccessClient mounted")

      // Create Supabase client
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      // Check for hash fragments or query params
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const searchParams = new URLSearchParams(window.location.search)

      const code = searchParams.get("code") || hashParams.get("code")
      const accessToken = hashParams.get("access_token")

      console.log("[v0] OAuth params:", { hasCode: !!code, hasAccessToken: !!accessToken })

      try {
        // If we have an access token in the hash, the session is already set
        if (accessToken) {
          console.log("[v0] Access token found in hash, session already established")
        }

        // Call the server action to handle profile creation
        const result = await handleOAuthCallback(code)

        if (!result.success) {
          console.error("[v0] OAuth callback failed:", result.error)
          router.push("/?error=oauth_failed")
          return
        }

        console.log("[v0] OAuth callback successful:", result)

        // Redirect based on user state
        if (!result.hasUserType) {
          console.log("[v0] New user, redirecting to verification")
          router.push("/verification")
        } else {
          console.log("[v0] Existing user, redirecting to dashboard")
          router.push(`/dashboard/${result.userType}`)
        }
      } catch (error) {
        console.error("[v0] OAuth processing error:", error)
        router.push("/?error=oauth_error")
      }
    }

    processOAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}
