import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/data/content.json"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Fixed Background Image Container */}
        <div 
          className="fixed-hero-banner"
          style={{ '--hero-image': `url('${content.home.hero.image}')` } as React.CSSProperties}
        >
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 min-h-screen flex items-center">
            <div className="absolute inset-0 bg-hero-overlay"></div>
            <div className="container relative z-10">
              <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl mb-6 text-white drop-shadow-lg">
                  {content.home.hero.title}
                </h1>
                <p className="text-lg text-white/90 mb-8 text-balance drop-shadow-md">{content.home.hero.subtitle}</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white">
                    <Link href={content.home.hero.primaryCTA.href}>{content.home.hero.primaryCTA.text}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                    <Link href={content.home.hero.secondaryCTA.href}>{content.home.hero.secondaryCTA.text}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="relative py-16 md:py-24 min-h-[60vh] flex items-center bg-white">
            <div className="absolute inset-0"></div>
            <div className="container relative z-10">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold mb-6 text-black drop-shadow-lg">{content.home.mission.title}</h2>
                <p className="text-lg text-black/90 leading-relaxed drop-shadow-md">{content.home.mission.content}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {content.home.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-emerald-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{content.home.callToAction.title}</h2>
              <p className="text-lg text-muted-foreground">{content.home.callToAction.content}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {content.home.callToAction.buttons.map((button, index) => (
                <Button
                  key={index}
                  asChild
                  size="lg"
                  variant={index === 0 ? "default" : "outline"}
                  className={index === 0 ? "bg-emerald-700 hover:bg-emerald-800 text-white" : ""}
                >
                  <Link href={button.href}>{button.text}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
