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
import { DonationCard } from "@/components/ui/donationCard"
import { TimelineSection } from "@/components/ui/timeline"
import Hero from "@/components/hero"
import { ApplyBanner } from "@/components/applyBanner"
import dynamic from "next/dynamic"
const CenteredSection = dynamic(() => import('./centeredSection'))

//TODO: Create a type for the home page client props
type HomePageClientProps = {
  content: any
}

export default function HomePageClient({ content }: HomePageClientProps) {
  const missionImageRef = useRef<HTMLDivElement>(null)
  const servicesSectionRef = useRef<HTMLDivElement>(null)
  const missionSectionRef = useRef<HTMLDivElement>(null)
  const statsSectionRef = useRef<HTMLDivElement>(null)
  const testimonialsSectionRef = useRef<HTMLDivElement>(null)
  const ctaSectionRef = useRef<HTMLDivElement>(null)
  const newsletterRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1.0)
  const [heroTitleVisible, setHeroTitleVisible] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [missionVisible, setMissionVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [testimonialsVisible, setTestimonialsVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const [newsletterVisible, setNewsletterVisible] = useState(false)

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

  // Helper function to create intersection observers
  const createObserver = (ref: React.RefObject<HTMLElement | null>, setVisible: (value: boolean) => void) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -200px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }

  useEffect(() => {
    const cleanup1 = createObserver(missionSectionRef, setMissionVisible)
    const cleanup2 = createObserver(statsSectionRef, setStatsVisible)
    const cleanup3 = createObserver(testimonialsSectionRef, setTestimonialsVisible)
    const cleanup4 = createObserver(ctaSectionRef, setCtaVisible)
    const cleanup5 = createObserver(newsletterRef, setNewsletterVisible)

    return () => {
      cleanup1()
      cleanup2()
      cleanup3()
      cleanup4()
      cleanup5()
    }
  }, [])

  return (
    <>
      <Header />
      <ApplyBanner />
      <main className="flex-1">
        <Hero content={content.hero} heroTitleVisible={heroTitleVisible} donateCardVisible={true} />
          {/* Mission Section */}
          <section id="mission-section" ref={missionSectionRef} className="pt-16 pb-32 px-8 lg:px-32 md:px-8 sm:px-8 relative min-h-[30vh] flex text-center mx-auto bg-[#f0efeb]">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-16">
                <div className="my-auto flex-1">
                  <h2 className={`text-4xl font-bold mb-6 text-yellow-700 transition-all duration-1500 ease-out ${
                    missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}>{content.mission.title}</h2>
                  <p className={`text-lg text-black/90 leading-relaxed transition-all duration-1500 ease-out ${
                    missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`} style={{ transitionDelay: '200ms' }}>{content.mission.content}</p>
                </div>
              </div>
            </div>
          </section>

        {/* Mission Image Section */}
        <section 
          className="about-section pt-16 px-8 relative min-h-[30vh] flex items-center mx-auto"
          style={{
            backgroundImage: `url(${content.mission.image2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-[#f0efeb] p-8 sm:p-12 lg:p-16 rounded-t-lg">
              {/* Text Content */}
              <div className="text-left my-auto">
                <h2 className={`text-3xl sm:text-4xl font-bold mb-6 text-yellow-700 transition-all duration-1500 ease-out ${
                  missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}>
                  {content.mission.title2}
                </h2>
                <p className={`text-base sm:text-lg text-black/80 leading-relaxed mb-8 transition-all duration-1500 ease-out ${
                  missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`} style={{ transitionDelay: '200ms' }}>
                  {content.mission.content}
                </p>
                <button className={`bg-pink-300 hover:bg-pink-400 text-white px-6 py-3 rounded-md transition-all duration-1500 ease-out flex items-center gap-2 ${
                  missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`} style={{ transitionDelay: '400ms' }}>
                  {content.hero.secondaryCTA.text}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Image Container with Brown Background */}
              <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Image with scale animation */}
                <div 
                  ref={missionImageRef}
                  className={`flex-1 w-full md:flex md:justify-center md:items-center overflow-hidden rounded-lg transition-all duration-1500 ease-out ${
                    missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: '300ms' }}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-lg">
                      <Image 
                        src={content.mission.image}
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
        <section ref={statsSectionRef} className="pt-16 pb-16 px-8 bg-primary text-white">
          <div className="container mx-auto">
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
              {content.stats.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center justify-center transition-all duration-1500 ease-out ${
                  index !== content.stats.length - 1 ? 'lg:border-r-2 md:border-r-none sm:border-r-none border-white' : ''
                } ${
                  statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Image src={stat.icon} alt={stat.label} width={100} height={50} />
                  <h3 className="text-2xl font-bold text-white">{stat.label}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <TimelineSection />
        
        <div 
          ref={newsletterRef}
          className="text-center py-16 px-8"
          style={{
            backgroundImage: `url(${content.timeline.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <Button 
            size="lg" 
            className={`bg-accent text-accent-foreground hover:bg-pink-400 transition-all duration-1500 ease-out ${
              newsletterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            Subscribe to Our Newsletter
          </Button>
        </div>

        {/* Services Section */}
        <section id="services-section" ref={servicesSectionRef} className="services-section pt-16 pb-16 px-8 flex items-center bg-white">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className={`text-4xl font-bold mb-8 text-yellow-700 transition-all duration-1500 ease-out ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}>Our Services</h2>
              <p className={`text-lg text-black/90 mb-8 leading-relaxed transition-all duration-1500 ease-out ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`} style={{ transitionDelay: '200ms' }}>Our services are tailored for women aged 30 and above who are seeking a comprehensive recovery program. This includes women transitioning from inpatient treatment facilities, those with a history of relapse, and individuals in need of a structured sober living environment.</p>
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
        <section 
          ref={testimonialsSectionRef} 
          className="pt-16 pb-16 px-8 relative min-h-[60vh] flex items-center mx-auto"
          style={{
            backgroundImage: `url(${content.timeline.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          
          {/* Faded overlay */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className={`text-4xl font-bold mb-12 text-center text-yellow-700 transition-all duration-1500 ease-out ${
                testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}>{content.testimonials.title}</h2>
              <p className={`text-lg text-black/90 mb-8 leading-relaxed transition-all duration-1500 ease-out ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`} style={{ transitionDelay: '200ms' }}>Our services are tailored for women aged 30 and above who are seeking a comprehensive recovery program. This includes women transitioning from inpatient treatment facilities, those with a history of relapse, and individuals in need of a structured sober living environment.</p>
               
              <div className="space-y-6">
                {content.testimonials.items.slice(0, 2).map((testimonial, index) => (
                  <TestimonialCard key={index} testimonial={testimonial} index={index} cardsVisible={testimonialsVisible} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="contact-section" ref={ctaSectionRef} className="pt-16 pb-16 px-8 bg-white">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className={`text-3xl font-bold mb-4 text-yellow-700 transition-all duration-1500 ease-out ${
                ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}>{content.callToAction.title}</h2>
              <p className={`text-lg text-muted-foreground transition-all duration-1500 ease-out ${
                ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`} style={{ transitionDelay: '200ms' }}>{content.callToAction.content}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {content.callToAction.buttons.map((button, index) => (
                <Button
                  key={index}
                  asChild
                  size="lg"
                  variant={index === 0 ? "default" : "outline"}
                  className={`transition-all duration-1500 ease-out ${
                    index === 0 ? "bg-pink-300 hover:bg-pink-400 text-white" : ""
                  } ${
                    ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
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

// Home Page Client is converted to a client component so that it retains it's interactivity. It is now a child of the ap/page compoene tso that the whole home page is rendered on the server side before being served to the client to be displayed in the Dom