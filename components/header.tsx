"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import content from "@/data/content.json"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 px-4 md:px-32 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo / Site Name */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold">{content.site.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {content.navigation.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <Button asChild className="bg-pink-300 hover:bg-pink-400 text-white">
            <Link href="/apply">Apply Now</Link>
          </Button>
        </nav>

        {/* Mobile CTA + Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Button asChild size="sm" className="bg-pink-300 hover:bg-pink-400 text-white">
            <Link href="/apply">Apply Now</Link>
          </Button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <div className="space-y-1">
              <span
                className={`block h-0.5 w-5 bg-foreground transition-transform ${
                  isOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-foreground transition-opacity ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-foreground transition-transform ${
                  isOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 py-3">
            {content.navigation.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
