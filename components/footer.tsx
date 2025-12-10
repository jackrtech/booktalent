import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "#6C6C73" }}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center cursor-pointer">
            <Image src="/booktalent-logo.svg" alt="BookTalent" width={30} height={30} />
          </Link>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <Link href="/privacy" className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" className="hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </Link>
            </div>
            <div className="text-gray-400 text-xs">© 2025 Book Talent. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
