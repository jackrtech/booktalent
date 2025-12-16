"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { handleOAuthCallback } from "@/app/actions/auth"

export function AuthSuccessClient() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processOAuth = async () => {
      console.log("[v0] AuthSuccessClient mounted")
      console.log("[v0] Current URL:", window.location.href)
      console.log("[v0] Hash:", window.location.hash)
      console.log("[v0] Search:", window.location.search)

      try {
        // Create Supabase client
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        console.log("[v0] Waiting for Supabase to establish session...")
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("[v0] Session check:", { hasSession: !!session, error: sessionError })

        if (sessionError) {
          console.error("[v0] Session error:", sessionError)
          setError("Failed to establish session")
          setTimeout(() => router.push("/?error=session_failed"), 2000)
          return
        }

        if (!session) {
          console.log("[v0] No session found, redirecting to home")
          setTimeout(() => router.push("/?error=no_session"), 2000)
          return
        }

        console.log("[v0] Session established, calling handleOAuthCallback")

        const result = await handleOAuthCallback(null)

        if (!result.success) {
          console.error("[v0] OAuth callback failed:", result.error)
          setError(result.error || "Failed to complete sign in")
          setTimeout(() => router.push("/?error=callback_failed"), 2000)
          return
        }

        console.log("[v0] OAuth callback successful:", result)

        if (!result.hasUserType) {
          console.log("[v0] New user without account type, redirecting to verification")
          router.push("/verification")
        } else {
          console.log("[v0] Existing user, redirecting to dashboard")
          router.push(`/dashboard/${result.userType}`)
        }
      } catch (error) {
        console.error("[v0] OAuth processing error:", error)
        setError("An unexpected error occurred")
        setTimeout(() => router.push("/?error=processing_failed"), 2000)
      }
    }

    processOAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="text-red-500 text-xl">⚠️</div>
            <p className="text-red-500">{error}</p>
            <p className="text-muted-foreground text-sm">Redirecting...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Completing sign in...</p>
            <p className="text-muted-foreground text-sm">Please wait while we set up your account</p>
          </>
        )}
      </div>
    </div>
  )
}
