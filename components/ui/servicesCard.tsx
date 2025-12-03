import { ArrowRightIcon, Heart, Users, Home, Sparkles, Shield, HandHeart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const ServicesCard = ({ service, index, cardsVisible }: { service: any, index: number, cardsVisible: boolean }) => {
  // Array of icons to cycle through
  const icons = [Heart, Users, Home, Sparkles, Shield, HandHeart]
  const IconComponent = icons[index % icons.length]

  return (
    <Card 
    key={index} 
    className={`flex flex-col md:flex-row text-center shadow-lg transition-all duration-1500 ease-out ${
    cardsVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-20'
    }`}
    style={{
    transitionDelay: `${index * 250}ms` // Stagger animation for each card
    }}
>

<div className="flex w-full flex-col justify-center items-center text-amber-950 py-8">
  <div className="mb-4">
    <IconComponent className="w-12 h-12 text-pink-300" />
  </div>
  <CardTitle>{service.title}</CardTitle>
  <CardContent>
    <p>{service.description}</p>
  </CardContent>
</div>
</Card>
  )
}

export default ServicesCard