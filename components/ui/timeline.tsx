"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface TimelineItem {
  label: string
  color: "yellow"|"pink"
  title: string
  description: string
  image: string
  location: string
}

const timelineItems: TimelineItem[] = [
  {
    label: "A TRANQUIL ENVIRONMENT",
    color: "pink",
    title: " A Safe and Supportive Community",
    description:
      "New Purpose Recovery House stands out due to its holistic approach to recovery, combining evidence-based practices with personalized care. Our focus on empowering women through education, life skills training, and community support ensures a comprehensive and sustainable recovery process that helps women find their purpose and re-enter society as productive individuals.",
    image: "/images/home/family_photo.jpg",
    location: "Houston, TX",
  },
  {
    label: "REBUILDING LIVES",
    color: "yellow",
    title: "Comfortable Living Spaces",
    description:
      "Located in a serene neighborhood of Houston, TX, our facility provides a tranquil and conducive environment for recovery. The house is equipped with modern amenities, comfortable living spaces, and dedicated areas for therapy and group activities, all designed to support the healing process.",
    image: "/images/home/texasneighborhood.jpg",
    location: "Houston, TX",
  },
  {
    label: "COMMUNITY SUPPORT",
    color: "pink",
    title: "Community Partnerships",
    description:
      "New Purpose House works closely with local organizations, employers, treatment providers, and community partners to create a strong support network for our residents. These partnerships help us connect women to employment opportunities, supportive services, counseling resources, and community programs that support long-term stability and successful reintegration.",
    image: "/images/home/community.jpg",
    location: "Houston, TX",
  },
  {
    label: "WE HAVE THE VISION",
    color: "yellow",
    title: "Support for Every Individual",
    description:
      "At New Purpose House, we envision a future where every woman in transition has access to a safe, structured environment that supports her journey toward stability and independence. Our goal is to expand supportive housing opportunities across Texas and beyond, creating spaces where women can rebuild their lives, gain meaningful employment, and rediscover their purpose. By investing in women, we help strengthen families, restore communities, and create lasting change.",
    image: "/images/home/acrosstheworld.jpg",
    location: "Houston, TX",
  },
   {
    label: "A STRUCTURED APPROACH",
    color: "pink",
    title: "Our Services",
    description:
      "New Purpose House serves women in transition who are ready to rebuild their lives with structure, support, and opportunity. Our program provides a stable living environment and access to resources that help women strengthen their independence, develop life skills, gain employment, and move forward with purpose.",
    image: "/images/home/finance.jpg",
    location: "Houston, TX",
  }
]

const colorClasses = {
  yellow: "bg-[#fdf1d3] text-foreground",
  pink: "bg-pink-400 text-background",
}

export function TimelineSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [itemVisible, setItemVisible] = useState<boolean[]>(new Array(timelineItems.length).fill(false))

  // Observer for header section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true)
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -200px 0px'
      }
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current)
      }
    }
  }, [])

  // Observers for each timeline item
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setItemVisible((prev) => {
                  const newState = [...prev]
                  newState[index] = true
                  return newState
                })
              }
            })
          },
          {
            threshold: 0.05,
            rootMargin: '0px 0px -200px 0px'
          }
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  return (
    <section className={"w-full pt-16 px-8"}>
      <div ref={headerRef} className="text-center mb-16">
        <p className={`text-pink-400 text-sm font-bold text-accent uppercase tracking-wider mb-2 transition-all duration-1500 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>We Stand Committed</p>
        <h2 className={`text-[var(--secondary)] text-3xl sm:text-4xl font-bold text-balance transition-all duration-1500 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`} style={{ transitionDelay: '200ms' }}>To Serve Women Rebuilding Their Lives</h2>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Vertical line down the middle */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-pink-400 transform -translate-x-1/2 z-0"></div>
        
        {timelineItems.map((item, index) => (
          <div
            key={index}
            ref={(el) => { itemRefs.current[index] = el }}
            className={`pb-16 grid md:grid-cols-2 items-center 
              transition-all duration-1500 ease-out ${
              index % 2 === 1 ? "md:grid-flow-dense" : ""
            } ${
              itemVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            {/* Content */}
            <div className={index % 2 === 1 ? "md:col-start-2 border-l-2 border-pink-400" : "border-r-2 border-pink-400"}>

            <div className={`flex items-center ${index % 2 === 1 ? '' : 'justify-end'}`}>
              <div className={`bg-pink-400 h-0.5 ${index % 2 === 1 ? 'order-1' : 'order-2'} ${index % 2 === 1 ? 'w-full' : 'w-full ml-4'}`}> </div>
              <div className={`inline-block px-6 py-2 rounded-md font-bold text-sm mb-4 ${colorClasses[item.color]} ${index % 2 === 1 ? 'order-2' : 'order-1'}`}>
                {item.label}
              </div>
            </div>

            <div className={index % 2 === 1 ? "pl-15" : "pr-15"}>
              <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">{item.description}</p>
             
              <div
              className={`relative h-[350px] rounded-lg overflow-hidden shadow-lg ${
                index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""
              }`}
            >
              <Image 
                src={item.image || "/placeholder.svg"} 
                alt={item.title} 
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute bottom-4 left-4 bg-background/90 px-4 py-2 rounded-md z-10">
                <p className="text-sm font-medium">{item.location}</p>
              </div>
              </div>
            </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
