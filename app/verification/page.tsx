import { Suspense } from "react"
import { VerificationClient } from "./verification-client"

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14DFFF] mx-auto"></div>
            <p className="text-gray-400">Loading verification page...</p>
          </div>
        </div>
      }
    >
      <VerificationClient />
    </Suspense>
  )
}
