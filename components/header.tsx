"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"login" | "signup">("login")

  const openSignUpModal = () => {
    setModalMode("signup")
    setIsLoginModalOpen(true)
  }

  const openLoginModal = () => {
    setModalMode("login")
    setIsLoginModalOpen(true)
  }

  return (
    <>
      <header>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <nav className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center cursor-pointer">
              <Image src="/booktalent-logo.svg" alt="Book Talent" width={40} height={40} className="h-10 w-auto" />
            </Link>

            <div className="flex items-center gap-4">
              <Button
                onClick={openSignUpModal}
                variant="ghost"
                className="text-white hover:text-gray-300 hover:bg-transparent font-medium text-base cursor-pointer"
              >
                Sign Up
              </Button>
              <Button
                onClick={openLoginModal}
                className="bg-[#14DFFF] hover:bg-[#00bce6] text-black font-medium text-base px-6 py-2 rounded-full cursor-pointer"
              >
                Login
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} initialMode={modalMode} />
    </>
  )
}
