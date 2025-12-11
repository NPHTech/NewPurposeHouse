import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DonationCard() {
  return (
    <Card className="max-w-[350px] p-8 border-4 border-primary bg-white">
      <div className="flex flex-col gap-2 text-left">

        <h2 className="font-serif font-bold text-pink-400 text-xl">
          DONATE NOW!
        </h2>
      
        <p className="text-xs md:text-sm text-foreground">
          Help us to provide opportunities to women in need of a fresh start.
        </p>
        
        {/* Image */}
        <div className="w-full max-w-[180px]">
          <Image
            src="/NewPurposeImageOne.jpg"
            alt="Donation"
            width={180}
            height={120}
            className="w-full h-auto object-cover rounded"
            unoptimized
          />
        </div>
      </div>
    </Card>
  )
}

