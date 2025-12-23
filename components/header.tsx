"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import content from "@/data/content.json"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Home page sections for dropdown - these should navigate to home page with hash
  const homeSections = [
    { label: "Mission", href: "/#mission-section" },
    { label: "Services", href: "/#services-section" },
  ]
  
  // Main navigation items (excluding home page sections and Home)
  // Contact is also a home page section, so it should link to /#contact-section
  const mainNavLinks = content.navigation.links
    .filter(
      (link) => link.href !== "#mission-section" && link.href !== "#services-section" && link.href !== "/"
    )
    .map((link) => {
      // If it's a contact section link, make sure it goes to home page
      if (link.href === "#contact-section") {
        return { ...link, href: "/#contact-section" }
      }
      return link
    })

  return (
    <header className="font-mono sticky top-0 z-50 w-full border-b border-border bg-background/95 px-4 md:px-32 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo / Site Name */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={content.site.logo} alt={content.site.name} width={100} height={100} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {/* Home dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-primary focus:outline-none">
              Home
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">Home</Link>
              </DropdownMenuItem>
              {homeSections.map((section) => (
                <DropdownMenuItem key={section.href} asChild>
                  <Link href={section.href} className="cursor-pointer">{section.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Donate and Contact links */}
          {mainNavLinks.map((link) => (
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
            {/* Home link */}
            <Link
              href="/"
              className="rounded-md px-2 py-2 text-sm font-bold text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            {/* Home page sections */}
            {homeSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="rounded-md px-2 py-2 pl-6 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                {section.label}
              </Link>
            ))}
            {/* Other main links */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-bold text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Apply Now button for mobile */}
            <Link
              href="/apply"
              className="rounded-md px-2 py-2 text-sm font-bold bg-pink-300 hover:bg-pink-400 text-white text-center transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
