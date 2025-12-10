"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <>
      <header>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <nav className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center cursor-pointer">
              <Image src="/booktalent-logo.svg" alt="Book Talent" width={70} height={50} className="h-[50px] w-auto" />
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="text-white hover:text-gray-300 transition-colors text-sm md:text-base font-medium"
              >
                Sign Up
              </Link>
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-semibold px-6 md:px-8 py-2 rounded-full text-sm md:text-base"
              >
                Login
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
