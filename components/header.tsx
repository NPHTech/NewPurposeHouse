import Link from "next/link"
import { Button } from "@/components/ui/button"
import content from "@/data/content.json"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold">{content.site.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {content.navigation.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Link href="/donate">Donate</Link>
        </Button>
      </div>
    </header>
  )
}
