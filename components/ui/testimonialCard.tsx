import { ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// TODO: Fix the type for testimonials it should not be any
const TestimonialCard = ({ testimonial, index, cardsVisible }: { testimonial: any, index: number, cardsVisible: boolean }) => {
  return (
    <Card 
        key={index} 
        className={`flex flex-col md:flex-row shadow-lg transition-all duration-1500 ease-out ${
        cardsVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-20'
        }`}
        style={{
        transitionDelay: `${index * 250}ms` // Stagger animation for each card
        }}
  >
    <div className="flex w-full md:w-1/2 overflow-hidden">
      <Image
        src={testimonial.thumbnail}
        alt={testimonial.title}
        width={50}
        height={50}
        className="rounded-t-lg md:rounded-l-lg md:rounded-r-none shadow-lg object-cover transition-transform duration-300 ease-out w-full h-full hover:scale-110"
      />
    </div>

    <div className="flex w-full md:w-1/2 flex-col justify-center text-amber-950 py-8">
      <CardTitle>{testimonial.title}</CardTitle>
      <CardContent>
        <p>{testimonial.content}</p>
      </CardContent>
      {
        screen.width < 768 ? (
          <Button asChild variant="outline" className="bg-[#877563] hover:bg-pink-400 text-white mt-4 px-8 py-6">
            <Link href="/testimonials" className="flex items-center gap-2">
              {testimonial.primaryCTA.text}
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </Button>
        ) : null
      }
    </div>
  </Card>
  )
}

export default TestimonialCard