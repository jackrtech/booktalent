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
import { signUp, signIn } from "@/app/actions/auth"
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

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      if (mode === "signup") {
        const result = await signUp(formData)

        if (!result.success) {
          setError(result.error || "Sign up failed")
          setStatus("idle")
          return
        }

        console.log("[v0] Signup successful, redirecting to verification")
        handleClose()
        router.push("/verification")
      } else {
        const result = await signIn(formData)

        if (!result.success) {
          setError(result.error || "Sign in failed")
          setStatus("idle")
          return
        }

        console.log("[v0] Signin successful:", result)
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
      console.error("[v0] Auth error:", err)
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
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              style={{ backgroundColor: "#161618" }}
              disabled
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 rounded" />
            </button>
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              style={{ backgroundColor: "#161618" }}
              disabled
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 rounded" />
            </button>
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              style={{ backgroundColor: "#161618" }}
              disabled
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
