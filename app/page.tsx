"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/data/content.json"
import { ArrowRightIcon } from "lucide-react"
import TestimonialCard from "@/components/ui/testimonialCard"
import ServicesCard from "@/components/ui/servicesCard"
import { DonationCard } from "@/components/donationCard"
import { TimelineSection } from "@/components/ui/timeline"

export default function HomePage() {
  const missionImageRef = useRef<HTMLDivElement>(null)
  const servicesSectionRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1.0)
  const [heroTitleVisible, setHeroTitleVisible] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)

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

  useEffect(() => {
    // Intersection Observer for services section cards animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCardsVisible(true)
          }
        })
      },
      {
        threshold: 0.05, // Trigger when 5% of the section is visible
        rootMargin: '0px 0px -200px 0px' // Trigger earlier, 200px before section enters viewport
      }
    )

    if (servicesSectionRef.current) {
      observer.observe(servicesSectionRef.current)
    }

    return () => {
      if (servicesSectionRef.current) {
        observer.unobserve(servicesSectionRef.current)
      }
    }
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
          <section className="relative px-16 py-20 md:py-32 max-h-[80vh] flex items-center">
            <div className="absolute inset-0 bg-hero-overlay"></div>
            <div className="container mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
                <div className="flex-1 sm:justify-center md:text-center lg:text-left">
                  <h1 
                    className={`text-5xl sm:text-4xl font-bold tracking-tight text-balance sm:text-6xl mb-6 drop-shadow-lg transition-opacity duration-1000 ease-in ${
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
                  <p className="font-bold text-lg text-white/90 mb-4 text-balance drop-shadow-md">{content.home.hero.subtitle}</p>
                  <p className="font-bold text-lg text-white/90 mb-8 text-balance drop-shadow-md">{content.home.hero.subtitle2}</p>
                  <div className="flex flex-row gap-4">
                    <Button asChild size="lg" className="bg-pink-300 hover:bg-pink-400 text-white">
                      <Link href="/apply">Join Us</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-pink-400 text-pink-400 bg-white/30 hover:bg-pink-400 hover:text-white"
                      onClick={() => {
                        window.open('https://buy.stripe.com/8x27sL4Dd3vA1be0XV4F201', '_blank')
                      }}
                    >
                      <Link href="/donate">DONATE</Link>
                    </Button>
                  </div>
                </div>
                
                {/* Donation Card - Right side, hidden on small screens */}
                <div className="hidden lg:block flex-shrink-0">
                  <DonationCard />
                </div>
              </div>
            </div>
          </section>
        </div>

          {/* Mission Section */}
          <section className="py-16 px-4 sm:px-8 lg:px-16 relative min-h-[30vh] flex text-center mx-auto bg-[#f0efeb]">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-16">
                <div className="my-auto flex-1">
                  <h2 className="text-4xl font-bold mb-6 text-yellow-700 drop-shadow-lg">{content.home.mission.title}</h2>
                  <p className="text-lg text-black/90 leading-relaxed drop-shadow-md">{content.home.mission.content}</p>
                </div>
              </div>
            </div>
          </section>

        {/* Mission Image Section */}
        <section 
          className="px-4 sm:px-8 lg:px-16 pt-16 relative min-h-[30vh] flex items-center mx-auto"
          style={{
            backgroundImage: "url('/images/home/floralprint.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-[#f0efeb] p-8 sm:p-12 lg:p-16 rounded-t-lg">
              {/* Text Content */}
              <div className="text-left my-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-yellow-700">
                  {content.home.mission.title2}
                </h2>
                <p className="text-base sm:text-lg text-black/80 leading-relaxed mb-8">
                  {content.home.mission.content}
                </p>
                <button className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-3 rounded-md transition-colors flex items-center gap-2">
                  {content.home.hero.secondaryCTA.text}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Image Container with Brown Background */}
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Image with scale animation */}
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
          </div>
        </section>

        {/* Stats Section */}
        <section className=" py-16 px-4 sm:px-8 lg:px-16 bg-primary text-white">
          <div className="container mx-auto">
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
              {content.home.stats.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center justify-center ${index !== content.home.stats.length - 1 ? 'border-r-2 border-white' : ''}`}>
                  {/* <FontAwesomeIcon icon={byPrefixAndName.fas[`${stat.icon}`]} /> */}
                  <Image src={stat.icon} alt={stat.label} width={50} height={50} />
                  <h3 className="text-2xl font-bold text-white">{stat.label}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <TimelineSection />


        {/* Services Section */}
        <section ref={servicesSectionRef} className="py-16 px-4 sm:px-8 lg:px-16 md:py-16 flex items-center bg-white">
          <div className="container mx-auto">
            <div className=" py-16 mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold mb-6 text-yellow-700 drop-shadow-lg">Our Services</h2>
              <p className="text-lg text-black/90 leading-relaxed drop-shadow-md">Our services are tailored for women aged 30 and above who are seeking a comprehensive recovery program. This includes women transitioning from inpatient treatment facilities, those with a history of relapse, and individuals in need of a structured sober living environment.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
              {content.programs.items.map((service, index) => (
                <ServicesCard key={index} service={service} index={index} cardsVisible={cardsVisible} />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
                <div className="flex flex-col items-center justify-center">
                  <Button asChild variant="outline" className="bg-pink-300 hover:bg-pink-400 text-white mt-16 px-8 py-6">
                    <Link href="/programs">View All Programs</Link>
                  </Button>
                </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 sm:px-8 lg:px-16 relative min-h-[30vh] flex items-center mx-auto bg-[#f0efeb]">
             <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-16">
                <div className="my-auto flex-1 text-left">
                  <h2 className="text-4xl font-bold mb-6 text-yellow-700 drop-shadow-lg">{content.home.testimonials.title}</h2>
                  <p className="text-lg text-black/90 leading-relaxed drop-shadow-md">{content.home.testimonials.content}</p>

                <div className="mt-12 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                  {
                  content.home.testimonials.items.slice(0, 2).map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} index={index} cardsVisible={cardsVisible} />
                  ))}
                </div>
                  
                <div className="flex flex-col items-center justify-center">
                  <Button asChild variant="outline" className="bg-pink-300 hover:bg-pink-400 text-white mt-16 px-8 py-6">
                    <Link href="/programs">Learn more</Link>
                  </Button>
                </div>
                </div>
              </div>
            </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-4 sm:px-8 lg:px-16 md:py-24 bg-white">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-yellow-700 drop-shadow-lg">{content.home.callToAction.title}</h2>
              <p className="text-lg text-muted-foreground">{content.home.callToAction.content}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {content.home.callToAction.buttons.map((button, index) => (
                <Button
                  key={index}
                  asChild
                  size="lg"
                  variant={index === 0 ? "default" : "outline"}
                  className={index === 0 ? "bg-pink-300 hover:bg-pink-400 text-white" : ""}
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