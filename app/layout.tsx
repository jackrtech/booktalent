import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { OAuthHandler } from "@/components/oauth-handler"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "BookTalent - Powerful tools for talent, agencies, and casting professionals",
  description:
    "Book talent with a curated platform connecting people and real projects. Discover diverse talent and connect from one unified hub.",
  generator: "v0.app",
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <OAuthHandler />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
