"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

export function ApplyBanner() {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="sticky top-16 z-40 w-full bg-pink-300 border-b border-pink-400/20">
      <div className="container mx-auto px-4 md:px-32">
        <div className="flex items-center justify-between py-3">
          <p className="text-sm md:text-base font-semibold text-white flex-1 text-center md:[text-shadow:none] [text-shadow:0_0_2px_rgba(244,114,182,1),0_0_4px_rgba(244,114,182,0.8)]">
            Recovery is possible.{" "}
            <Link 
              href="/apply" 
              className="underline text-white hover:text-white hover:drop-shadow-[0_0_8px_rgba(244,114,182,1)] transition-all"
            >
              Join us and begin your journey today.
            </Link>
          </p>
          <button
            onClick={handleDismiss}
            className="ml-4 flex-shrink-0 p-1 hover:bg-pink-400/20 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
