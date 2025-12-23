"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VideoModal } from "@/components/ui/videoModal"

// TODO: Fix the type for testimonials it should not be any
const TestimonialCard = ({ testimonial, index, cardsVisible }: { testimonial: any, index: number, cardsVisible: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isEven = index % 2 === 0
  
  const handleCardClick = () => {
    setIsModalOpen(true)
  }
  
  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`group bg-white/95 backdrop-blur-sm flex flex-col items-center gap-4 md:gap-6 p-6 md:p-8 shadow-lg rounded-2xl transition-all duration-1500 ease-out cursor-pointer hover:shadow-xl ${
          cardsVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-20'
        }`}
        style={{
          transitionDelay: `${index * 250}ms`
        }}
      >
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <div className="w-60 h-60 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-gray-200">
          <Image
            src={testimonial.thumbnail || "/placeholder-user.jpg"}
            alt={testimonial.name || testimonial.title}
            width={200}
            height={200}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            unoptimized
          />
        </div>
      </div>

      {/* Text Content - Centered */}
      <div className="w-full text-center">
        <p className="text-base md:text-lg text-black mb-4 leading-relaxed">
          "{testimonial.content}"
        </p>
        <p className="text-sm font-semibold text-black uppercase tracking-wide mb-4">
          {testimonial.name || testimonial.title}
          {testimonial.age && `, AGE ${testimonial.age}`}
        </p>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-pink-400 hover:text-pink-500 transition-colors">
            Hear her story
            <ArrowRightIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
      </div>
      
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={testimonial.video}
        title={testimonial.name || testimonial.title}
      />
    </>
  )
}

export default TestimonialCard