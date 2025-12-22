"use client"

import type React from "react"

export const dynamic = "force-dynamic"

import { submitWaitlist } from "@/app/actions/waitlist"
import Image from "next/image"
import { LandingPageClient } from "@/components/landing-page-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OAuthRedirectHandler } from "@/components/oauth-redirect-handler"
import { useEffect, useRef, useState } from "react"

// Ensures the server action is bundled
void submitWaitlist

export default function LandingPage() {
  const [card1Visible, setCard1Visible] = useState(false)
  const [card2Visible, setCard2Visible] = useState(false)
  const [card3Visible, setCard3Visible] = useState(false)
  const [card4Visible, setCard4Visible] = useState(false)

  const card1Ref = useRef<HTMLDivElement | null>(null)
  const card2Ref = useRef<HTMLDivElement | null>(null)
  const card3Ref = useRef<HTMLDivElement | null>(null)
  const card4Ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const createObserver = (ref: React.RefObject<HTMLDivElement | null>, setVisible: (visible: boolean) => void) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
          }
        },
        { threshold: 0.15 },
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return observer
    }

    const observer1 = createObserver(card1Ref, setCard1Visible)
    const observer2 = createObserver(card2Ref, setCard2Visible)
    const observer3 = createObserver(card3Ref, setCard3Visible)
    const observer4 = createObserver(card4Ref, setCard4Visible)

    return () => {
      observer1.disconnect()
      observer2.disconnect()
      observer3.disconnect()
      observer4.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#1C1C1C] overflow-x-hidden">
      <OAuthRedirectHandler />

      <Header />

      {/* Hero Section */}
      <main className="relative py-3 md:py-5 overflow-x-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col text-center z-10">
            <h1 className="text-3xl md:text-4xl lg:text-[52px] font-semibold text-white mb-4 leading-tight text-balance max-w-5xl mx-auto">
              Powerful tools built for real talent, agencies, and casting professionals
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed font-medium max-w-3xl mx-auto">
              Book Talent uses AI to connect verified people and real opportunities — faster, safer, and smarter than
              ever.
            </p>

            {/* BUTTON + MODAL NOW HANDLED BY CLIENT COMPONENT */}
            <div className="flex justify-center">
              <LandingPageClient />
            </div>
          </div>
        </div>
      </main>

      {/* Key App Features Section */}
      <section className="py-4 md:py-6">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-white text-center mb-16">
            Key App Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* AI-powered matches */}
            <div
              ref={card1Ref}
              className={`border border-gray-600/30 rounded-2xl p-6 bg-[#212024] transition-all duration-[1400ms] ${
                card1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: card1Visible ? "0ms" : "0ms" }}
            >
              <div className="mb-4 flex">
                <div className="w-10 h-10 flex items-center justify-start">
                  <Image src="/images/lightning.png" alt="Lightning icon" width={40} height={40} priority />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-powered matches</h3>
                <p className="text-white mb-3 font-normal text-base">
                  No more endless scrolling or cold outreach. Just verified matches that make sense.
                </p>
              </div>
            </div>

            {/* Verified Users & Gigs */}
            <div
              ref={card2Ref}
              className={`border border-gray-600/30 rounded-2xl p-6 bg-[#212024] transition-all duration-[1400ms] ${
                card2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: card2Visible ? "100ms" : "0ms" }}
            >
              <div className="mb-4 flex">
                <div className="w-10 h-10 flex items-center justify-start">
                  <Image src="/images/tick.png" alt="Checkmark icon" width={40} height={40} priority />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Verified Users & Gigs</h3>
                <p className="text-white mb-3 font-normal text-base">
                  Every profile is screened and approved to ensure authenticity and professionalism.
                </p>
              </div>
            </div>

            {/* Smart Booking System */}
            <div
              ref={card3Ref}
              className={`border border-gray-600/30 rounded-2xl p-6 bg-[#212024] transition-all duration-[1400ms] ${
                card3Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: card3Visible ? "200ms" : "0ms" }}
            >
              <div className="mb-4 flex">
                <div className="w-10 h-10 flex items-center justify-start">
                  <Image src="/images/calender.png" alt="Calendar icon" width={40} height={40} priority />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Smart Booking System</h3>
                <p className="text-white mb-3 font-normal text-base">
                  No middlemen. No confusion. Just clean, direct bookings.
                </p>
              </div>
            </div>

            {/* Safety & Privacy */}
            <div
              ref={card4Ref}
              className={`border border-gray-600/30 rounded-2xl p-6 bg-[#212024] transition-all duration-[1400ms] ${
                card4Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: card4Visible ? "300ms" : "0ms" }}
            >
              <div className="mb-4 flex">
                <div className="w-10 h-10 flex items-center justify-start">
                  <Image src="/images/padlock.png" alt="Lock icon" width={40} height={40} priority />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Safety & Privacy</h3>
                <p className="text-white mb-3 font-normal text-base">Your Profile. Your rules.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
