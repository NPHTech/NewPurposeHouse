import Link from "next/link"
import content from "@/data/content.json"

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#fda5d6] px-16">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{content.site.name}</h3>
            <p className="text-sm text-white">{content.footer.tagline}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {(content.footer as any).links.map((link: any) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-pink-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              {content.footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-pink-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white">
          <p>{content.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
