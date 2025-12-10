"use client"

import type React from "react"
import { LoginModal } from "./login-modal"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitWaitlist } from "@/app/actions/waitlist"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function LandingPageClient() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate">("idle")
  const [validationError, setValidationError] = useState("")
  const [existingUserName, setExistingUserName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    const trimmedName = firstName.trim()
    const trimmedEmail = email.trim()

    // Name validation: 2+ alphabetic characters (including international)
    const nameRegex = /^[\p{L}\s'-]{2,50}$/u
    if (!nameRegex.test(trimmedName)) {
      setValidationError("Name must be at least 2 letters and contain only alphabetic characters.")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Please enter a valid email address.")
      return
    }

    setStatus("loading")

    const formData = new FormData()
    formData.append("name", trimmedName)
    formData.append("email", trimmedEmail)

    console.log("[v0] Submitting waitlist form...")
    const result = await submitWaitlist(formData)
    console.log("[v0] Server action response:", result)

    if (result.debug) {
      console.log("[v0] Debug info:", result.debug)
    }

    if (result.emailError) {
      console.error("[v0] Email failed to send, but user was added to database")
    }

    if (result.success) {
      console.log("[v0] User successfully added to waitlist")
      setStatus("success")
    } else if (result.duplicate && result.existingName) {
      console.log("[v0] Duplicate user detected:", result.existingName)
      setStatus("duplicate")
      setExistingUserName(result.existingName)
    } else {
      console.error("[v0] Submission failed:", result.error)
      setValidationError(result.error || "Something went wrong. Please try again.")
      setStatus("idle")
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset form after close animation
    setTimeout(() => {
      setFirstName("")
      setEmail("")
      setStatus("idle")
      setValidationError("")
      setExistingUserName("")
    }, 300)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#14DFFF] hover:bg-[#00bce6] text-black font-medium text-lg px-8 py-3 rounded-full transition-colors cursor-pointer"
        >
          Join the waitlist
        </button>
        <button
          onClick={() => setIsSignupOpen(true)}
          className="bg-transparent hover:bg-white/10 text-white font-medium text-lg px-8 py-3 rounded-full border border-white/20 transition-colors cursor-pointer"
        >
          Sign Up Today
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-[90vw] sm:max-w-md border-none p-0 gap-0 max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "#101012" }}
        >
          {status === "success" ? (
            <div className="p-4 sm:p-6 text-center flex flex-col justify-between min-h-[240px] sm:min-h-[280px]">
              <div className="relative flex justify-end">
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-400 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Blue checkmark */}
              <div className="flex justify-center">
                <Image
                  src="/thankyou-tick-blue.svg"
                  alt="Success"
                  width={50}
                  height={51}
                  className="object-contain sm:w-[59px] sm:h-[60px]"
                />
              </div>

              {/* Success message */}
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  Thank you for joining
                  <br />
                  the waitlist
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  You'll be first in line when Book Talent
                  <br />
                  launches.
                </p>
              </div>
            </div>
          ) : status === "duplicate" ? (
            <div className="p-4 sm:p-6 text-center flex flex-col justify-between min-h-[240px] sm:min-h-[280px]">
              <div className="relative flex justify-end">
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-400 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Blue checkmark */}
              <div className="flex justify-center">
                <Image
                  src="/thankyou-tick-blue.svg"
                  alt="Success"
                  width={50}
                  height={51}
                  className="object-contain sm:w-[59px] sm:h-[60px]"
                />
              </div>

              {/* Duplicate message */}
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  You're already with us,
                  <br />
                  {existingUserName}.
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  You'll be first in line when Book Talent
                  <br />
                  launches.
                </p>
              </div>
            </div>
          ) : (
            // Form State
            <div className="p-4 sm:p-6">
              <div className="relative mb-6 sm:mb-8">
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

              <h2 className="text-white text-lg sm:text-xl font-bold mb-4 sm:mb-5 leading-snug text-center">
                Get early access by
                <br />
                joining the waitlist
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                {/* First Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-gray-400 text-xs sm:text-sm">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="text-white placeholder:text-gray-600 h-10 sm:h-11 rounded-lg text-sm"
                    style={{ backgroundColor: "#161618", borderColor: "#18181A" }}
                    disabled={status === "loading"}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
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

                {validationError && <p className="text-red-400 text-xs sm:text-sm">{validationError}</p>}

                {/* Terms text */}
                <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed pt-1">
                  By clicking "Join today", you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-gray-400 cursor-pointer">
                    Terms of Service
                  </Link>{" "}
                  and acknowledge you have read our{" "}
                  <Link href="/privacy" className="underline hover:text-gray-400 cursor-pointer">
                    Privacy Policy
                  </Link>
                  .
                </p>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full bg-[#14DFFF] hover:bg-[#00bce6] text-black font-semibold h-10 sm:h-11 rounded-full text-sm sm:text-base mt-3 sm:mt-4 cursor-pointer"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Joining..." : "Join today"}
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <LoginModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} initialMode="signup" />
    </>
  )
}

export default LandingPageClient
