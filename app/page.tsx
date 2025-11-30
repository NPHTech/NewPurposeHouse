"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/data/content.json"
import { ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function HomePage() {
  const missionImageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1.0)
  const [heroTitleVisible, setHeroTitleVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!missionImageRef.current) return

      const rect = missionImageRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate how much of the element is visible
      const elementTop = rect.top
      const elementHeight = rect.height
      
      // When element enters viewport, start zooming
      if (elementTop < windowHeight && elementTop > -elementHeight) {
        // Calculate progress (0 to 1) as element scrolls through viewport
        // 0 = element just entered viewport, 1 = element scrolled past
        const progress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)))
        
        // Scale from 1.0 (normal) to 1.3 (zoomed in) as user scrolls down
        const newScale = 1.0 + (progress * 0.3)
        setScale(newScale)
      } else if (elementTop >= windowHeight) {
        // Element hasn't entered viewport yet, start at normal size
        setScale(1.0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setHeroTitleVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

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
            <div className="container mx-auto relative z-10">
              <div className="mx-auto max-w-3xl text-center">
                <h1 
                  className={`text-4xl font-bold tracking-tight text-balance sm:text-6xl mb-6 drop-shadow-lg transition-opacity duration-1000 ease-in ${
                    heroTitleVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {content.home.hero.title.split(' ').map((word, index) => {
                    const colors = ['text-white', 'text-pink-300', 'text-orange-300']
                    return (
                      <span key={index} className={colors[index % colors.length]}>
                        {word}
                        {index < content.home.hero.title.split(' ').length - 1 && ' '}
                      </span>
                    );
                  })}
                </h1>
                <p className="font-bold text-lg text-white/90 mb-8 text-balance drop-shadow-md">{content.home.hero.subtitle}</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" variant="outline" className=" bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                    <Link href={content.home.hero.secondaryCTA.href}>{content.home.hero.secondaryCTA.text}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

          {/* Mission Section */}
          <section className=" py-16 px-8 relative min-h-[30vh] flex items-center mx-auto bg-white">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-16">
                <div className="my-auto flex-1 text-left">
                  <h2 className="text-5xl font-bold mb-6 text-yellow-700 drop-shadow-lg">{content.home.mission.title}</h2>
                  <p className="text-lg text-black/90 leading-relaxed drop-shadow-md">{content.home.mission.content}</p>
                  <Button asChild className="bg-pink-300 hover:bg-pink-400 text-white mt-16">
                    <Link href={content.home.hero.secondaryCTA.href} className="flex items-center gap-2">
                      {content.home.hero.secondaryCTA.text}
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div 
                  ref={missionImageRef}
                  className="flex-1 w-full md:flex md:justify-center md:items-center overflow-hidden rounded-lg"  
                >
                  <div className="relative w-full h-full overflow-hidden rounded-lg">
                      <Image 
                        src="/NewPurposeImageOne.jpg" 
                        alt="People in a group"
                      width={500}
                      height={500}
                      className="rounded-lg shadow-lg object-cover transition-transform duration-300 ease-out w-full h-full"
                      style={{ 
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center'
                      }}
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {content.home.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  {/* <FontAwesomeIcon icon={byPrefixAndName.fas[`${stat.icon}`]} /> */}
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Services Section */}
        <section className="relative py-16 md:py-16 flex items-center bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-5xl font-bold mb-6 text-yellow-700 drop-shadow-lg">Our Services</h2>
              <p className="text-lg text-black/90 leading-relaxed drop-shadow-md">Our services are tailored for women aged 30 and above who are seeking a comprehensive recovery program. This includes women transitioning from inpatient treatment facilities, those with a history of relapse, and individuals in need of a structured sober living environment.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {content.programs.items.map((service, index) => (
                <Card key={index} className=" flex flex-row text-center bg-pink-300">
                  <div className="flex w-1/2">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={50}
                      height={50}
                      className="rounded-lg shadow-lg object-cover transition-transform duration-300 ease-out w-full h-full"
                    />
                  </div>
                  <div className="flex w-1/2">
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white">{service.description}</p>
                    </CardContent>
                  </div>
                </Card>
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