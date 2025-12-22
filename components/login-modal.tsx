"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { signUp, signIn, signInWithGoogle } from "@/app/actions/auth"
import { useRouter } from "next/navigation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "signup"
}

export function LoginModal({ isOpen, onClose, initialMode = "login" }: LoginModalProps) {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading">("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setError(null)
    }
  }, [isOpen, initialMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setError(null)

    console.log("[v0] Starting auth process, mode:", mode)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      if (mode === "signup") {
        console.log("[v0] Calling signUp action...")
        const result = await signUp(formData)

        console.log("[v0] SignUp result:", result)

        if (!result.success) {
          console.error("[v0] SignUp failed:", result.error, result.details)
          setError(result.error || "Sign up failed")
          setStatus("idle")
          return
        }

        console.log("[v0] Signup successful! User:", result.userId, result.email)
        console.log("[v0] Redirecting to /verification")
        handleClose()
        router.push("/verification")
      } else {
        console.log("[v0] Calling signIn action...")
        const result = await signIn(formData)

        console.log("[v0] SignIn result:", result)

        if (!result.success) {
          console.error("[v0] SignIn failed:", result.error)
          setError(result.error || "Sign in failed")
          setStatus("idle")
          return
        }

        console.log("[v0] Signin successful, redirecting based on status:", {
          needsVerification: result.needsVerification,
          needsOnboarding: result.needsOnboarding,
          userType: result.userType,
        })
        handleClose()

        if (result.needsVerification) {
          router.push("/verification")
        } else if (result.needsOnboarding) {
          router.push(`/onboarding/${result.userType}`)
        } else if (result.userType === "talent") {
          router.push("/dashboard/talent")
        } else if (result.userType === "business") {
          router.push("/dashboard/business")
        } else {
          router.push("/")
        }
      }
    } catch (err) {
      console.error("[v0] Unexpected auth error:", err)
      setError("An unexpected error occurred. Please try again.")
      setStatus("idle")
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setEmail("")
      setPassword("")
      setShowPassword(false)
      setStatus("idle")
      setError(null)
      setMode(initialMode)
    }, 300)
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login")
    setEmail("")
    setPassword("")
    setShowPassword(false)
    setError(null)
  }

  const handleGoogleSignIn = async () => {
    console.log("[v0] Starting Google OAuth sign in")
    await signInWithGoogle()
    // Browser redirects to Google, no error handling needed
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-[90vw] sm:max-w-md border-none px-6 sm:px-8 py-4 sm:py-5 gap-0 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#101012" }}
      >
        <div>
          <div className="relative mb-2 sm:mb-3">
            <button
              onClick={handleClose}
              className="absolute right-0 top-0 text-white hover:text-gray-400 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex justify-center">
              <Image
                src="/booktalent-logo-2.svg"
                alt="Book Talent"
                width={100}
                height={47}
                className="object-contain sm:w-[120px] sm:h-[56px]"
                priority
              />
            </div>
          </div>

          <h2 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-1.5 leading-snug text-center">
            {mode === "login" ? "Log In" : "Sign Up"}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-2.5 text-center">
            {mode === "login" ? "Please enter your details to log in" : "Create your account to get started"}
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 mb-2 sm:mb-2.5">
            <button
              onClick={handleGoogleSignIn}
              disabled={status === "loading"}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-[#1e1e20] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#161618" }}
              aria-label="Continue with Google"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              style={{ backgroundColor: "#161618" }}
              disabled
              aria-label="Apple Sign In (Coming Soon)"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 rounded" />
            </button>
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              style={{ backgroundColor: "#161618" }}
              disabled
              aria-label="Instagram Sign In (Coming Soon)"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 rounded" />
            </button>
          </div>

          <div className="relative mb-2 sm:mb-2.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 text-gray-500 bg-[#101012]">Or</span>
            </div>
          </div>

          {error && (
            <div className="mb-2 sm:mb-2.5 p-2 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
            <div className="space-y-0.5">
              <Label htmlFor="email" className="text-gray-400 text-xs sm:text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-white placeholder:text-gray-600 h-10 sm:h-11 rounded-lg text-sm"
                style={{ backgroundColor: "#161618", borderColor: "#18181A" }}
                disabled={status === "loading"}
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="password" className="text-gray-400 text-xs sm:text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="text-white placeholder:text-gray-600 h-10 sm:h-11 rounded-lg pr-10 text-sm"
                  style={{ backgroundColor: "#161618", borderColor: "#18181A" }}
                  disabled={status === "loading"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex justify-end pt-0.5">
                <Link
                  href="#"
                  className="text-[#14DFFF] hover:text-[#00bce6] text-xs sm:text-sm cursor-pointer transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#14DFFF] hover:bg-[#00bce6] text-black font-semibold h-10 sm:h-11 rounded-full text-sm sm:text-base mt-2 sm:mt-2.5 cursor-pointer"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-xs sm:text-sm text-gray-400 mt-2 sm:mt-2.5">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#14DFFF] hover:text-[#00bce6] cursor-pointer transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-[#14DFFF] hover:text-[#00bce6] cursor-pointer transition-colors"
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
