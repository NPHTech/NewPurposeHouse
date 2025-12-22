"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DonationCard } from "@/components/ui/donationCard"

// TODO: Add type for content
interface HeroProps {
  content: any
  heroTitleVisible: boolean
  donateCardVisible?: boolean
}

const Hero = ({ content, heroTitleVisible, donateCardVisible }: HeroProps) => {
  // Get some default values if the content is not provided
  const heroImage = content.hasOwnProperty('image')? content.image : ''
  const heroTitle = content.hasOwnProperty('title') ? content.title : ''
  const heroSubtitle = content.hasOwnProperty('subtitle') ? content.subtitle : ''
  const heroSubtitle2 = content.hasOwnProperty('subtitle2') ? content.subtitle2 : ''
  console.log(heroImage, heroTitle, heroSubtitle, heroSubtitle2)
  return (
    <div 
       className="fixed-hero-banner"
       style={{ '--hero-image': `url('${heroImage}')` } as React.CSSProperties}
     >
       {/* Hero Section */}
       <section className="relative pt-16 pb-16 px-8 md:px-8 min-h-[90vh] flex items-center">
         <div className="absolute inset-0 bg-hero-overlay"></div>
         <div className="container mx-auto relative z-10">
           <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
             <div className="flex-1 sm:justify-center md:text-center lg:text-left">
               <h1 
                 className={`text-5xl sm:text-4xl font-bold tracking-tight text-balance sm:text-6xl mb-6 drop-shadow-lg transition-opacity duration-1000 ease-in ${
                   heroTitleVisible ? 'opacity-100' : 'opacity-0'
                 }`}
               >
                 {heroTitle.split(' ').map((word: string, index: number) => {
                   const colors = ['text-white', 'text-pink-300', 'text-orange-300']
                   return (
                     <span key={index} className={colors[index % colors.length]}>
                       {word}
                       {index < heroTitle.split(' ').length - 1 && ' '}
                     </span>
                   );
                 })}
               </h1>
               <p className="font-bold text-lg text-white/90 mb-4 text-balance drop-shadow-md">{heroSubtitle}</p>
               <p className="font-bold text-lg text-white/90 mb-8 text-balance drop-shadow-md">{heroSubtitle2}</p>
               <div className="flex flex-row gap-4">
                 <Button asChild size="lg" className="border-2 border-color-secondary bg-pink-300 hover:bg-pink-400 text-white">
                   <Link href="/apply">Join Us</Link>
                 </Button>
                 <Button
                   size="lg"
                   variant="outline"
                   className="border-2 border-color-secondary text-white bg-orange-300 hover:bg-pink-400 hover:text-white"
                   onClick={() => {
                     window.open('https://buy.stripe.com/8x27sL4Dd3vA1be0XV4F201', '_blank')
                   }}
                 >
                   <Link href="/donate">DONATE</Link>
                 </Button>
               </div>
             </div>
             
             {/* Donation Card - Right side, hidden on small screens */}
             {donateCardVisible && (
               <div className="hidden lg:block flex-shrink-0">
                 <DonationCard />
               </div>
             )}
           </div>
         </div>
       </section>
     </div>
  )
}

export default Hero