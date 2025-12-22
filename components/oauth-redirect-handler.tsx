"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export function OAuthRedirectHandler() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      console.log("[v0] OAuth handler: Checking for session")

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      // Check if we just came back from OAuth (has hash or code in URL)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const searchParams = new URLSearchParams(window.location.search)
      const hasOAuthParams = hashParams.has("access_token") || searchParams.has("code")

      if (!hasOAuthParams) {
        console.log("[v0] OAuth handler: No OAuth parameters, skipping")
        setIsChecking(false)
        return
      }

      console.log("[v0] OAuth handler: OAuth parameters detected, checking session")

      // Wait a bit for Supabase to set the session
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        console.log("[v0] OAuth handler: Session found, redirecting to verification")

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname)

        // Redirect to verification
        router.push("/verification")
      } else {
        console.log("[v0] OAuth handler: No session found")
        setIsChecking(false)
      }
    }

    checkSessionAndRedirect()
  }, [router])

  if (!isChecking) return null

  return (
    <div className="fixed inset-0 bg-[#1C1C1C] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14DFFF] mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  )
}
