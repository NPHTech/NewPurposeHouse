import { useState } from "react"
import { useRef } from "react"
import type PageSection from "@/data/content.json"
import type { PageSection as PageSectionType } from "@/types/data"
import { useEffect } from "react"
// TODO: Why did this have to be translated to a type using "as"

const CenteredSection = ({pageContent}: {pageContent: PageSectionType})=> {
  const [sectionVisible, setSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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
    const cleanup1 = createObserver(sectionRef, setSectionVisible)

    return () => {
      cleanup1()
    }
  }, [])

  console.log(pageContent)

  return (
      <section ref={sectionRef} className="pt-16 pb-16 px-8 relative min-h-[30vh] flex text-center mx-auto bg-[#fdf1d3]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="my-auto flex-1">
            <h2 className={`text-4xl font-bold mb-6 text-yellow-700 transition-all duration-1500 ease-out ${
              sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>{pageContent.title}</h2>
            <p className={`text-lg text-black/90 leading-relaxed transition-all duration-1500 ease-out ${
              sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`} style={{ transitionDelay: '200ms' }}>{pageContent.content}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CenteredSection