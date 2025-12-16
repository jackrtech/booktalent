"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { handleOAuthCallback, selectAccountType } from "@/app/actions/auth"

export function VerificationClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ email: string; hasUserType: boolean } | null>(null)

  useEffect(() => {
    console.log("[v0] VerificationClient: Component mounted")
    console.log("[v0] VerificationClient: Search params:", Object.fromEntries(searchParams.entries()))
  }, [])

  useEffect(() => {
    const code = searchParams.get("code")
    console.log("[v0] VerificationClient: Code from URL:", code)

    if (code && !isProcessing) {
      console.log("[v0] VerificationClient: OAuth code detected, processing...")
      setIsProcessing(true)

      handleOAuthCallback(code)
        .then((result) => {
          console.log("[v0] VerificationClient: OAuth callback result:", result)
          if (result.success) {
            if (result.hasUserType) {
              router.push(`/onboarding/${result.userType}`)
            } else {
              setUser({ email: result.email, hasUserType: false })
              // Remove code from URL
              router.replace("/verification")
            }
          } else {
            setError(result.error || "Failed to complete sign in")
          }
        })
        .catch((err) => {
          console.error("[v0] VerificationClient: OAuth callback error:", err)
          setError("An unexpected error occurred")
        })
        .finally(() => {
          setIsProcessing(false)
        })
    } else if (!code && !user) {
      console.log("[v0] VerificationClient: No code parameter, checking existing session")
      // No code parameter, check if user is already authenticated
      handleOAuthCallback(null)
        .then((result) => {
          console.log("[v0] VerificationClient: Session check result:", result)
          if (result.success) {
            if (result.hasUserType) {
              router.push(`/onboarding/${result.userType}`)
            } else {
              setUser({ email: result.email, hasUserType: false })
            }
          } else {
            router.push("/")
          }
        })
        .catch(() => {
          console.log("[v0] VerificationClient: No valid session, redirecting to home")
          router.push("/")
        })
    }
  }, [searchParams, router, isProcessing, user])

  const handleAccountTypeSelection = async (userType: "talent" | "business") => {
    console.log("[v0] VerificationClient: Account type selected:", userType)
    setIsProcessing(true)
    try {
      const result = await selectAccountType(userType)
      if (result.success) {
        router.push(`/onboarding/${userType}`)
      } else {
        setError(result.error || "Failed to set account type")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isProcessing) {
    console.log("[v0] VerificationClient: Rendering processing state")
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#14DFFF] border-r-transparent mb-4"></div>
          <p className="text-gray-400">Completing sign in...</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.log("[v0] VerificationClient: Rendering error state:", error)
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
    console.log("[v0] VerificationClient: No user, rendering null")
    return null
  }

  console.log("[v0] VerificationClient: Rendering account type selection")
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
            disabled={isProcessing}
            className="w-full bg-[#14DFFF] hover:bg-[#00bce6] text-black font-semibold h-12 rounded-full text-base"
          >
            I'm Talent
          </Button>

          <Button
            onClick={() => handleAccountTypeSelection("business")}
            disabled={isProcessing}
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
