"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Hero from "@/components/hero"
import CenteredSection from "@/app/centeredSection"
import content from "@/data/content.json"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"


export default function ProgramsPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false)
  const [programsVisible, setProgramsVisible] = useState(false)
  const programsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setHeroTitleVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setProgramsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (programsRef.current) {
      observer.observe(programsRef.current)
    }

    return () => {
      if (programsRef.current) {
        observer.unobserve(programsRef.current)
      }
    }
  }, [])
  
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero content={(content as any).programs.hero} heroTitleVisible={heroTitleVisible} donateCardVisible={false} />
        <CenteredSection pageContent={(content as any).programs.sections[0]} />
        
        {/* Programs Section */}
        <section ref={programsRef} className="pt-16 px-8 pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-yellow-700 mb-4">
                {content.home.programs.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {content.home.programs.intro}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-0">
              {content.home.programs.items.map((program: any, index: number) => {
                const isOdd = index % 2 === 0 // 0-indexed: 0, 2, 4 are odd rows (1st, 3rd, 5th)
                
                return (
                  <div
                    key={index}
                    className={`grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-0 transition-all duration-1500 ease-out ${
                      programsVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-20'
                    }`}
                    style={{
                      transitionDelay: `${index * 150}ms`
                    }}
                  >
                    {/* Image Section */}
                    <div className={`p-2 flex items-center justify-center ${
                      isOdd ? 'md:order-1' : 'md:order-3'
                    }`}>
                      <div className="relative w-full h-64 md:h-80">
                        <Image
                          src={program.image}
                          alt={program.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Pink Divider */}
                    <div className="hidden md:block w-full bg-pink-300 md:order-2" />

                    {/* Content Section */}
                    <div className={`p-2 flex flex-col justify-center ${
                      isOdd ? 'md:order-3' : 'md:order-1'
                    }`}>
                      <h3 className="text-2xl md:text-3xl font-bold text-yellow-700 mb-4">
                        {program.title}
                      </h3>
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {program.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
