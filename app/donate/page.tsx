"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Hero from "@/components/hero"
import CenteredSection from "@/app/centeredSection"
import content from "@/data/content.json"
import { useEffect, useState } from "react"


export default function DonatePage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false)
  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setHeroTitleVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero content={content.donate.hero} heroTitleVisible={heroTitleVisible} donateCardVisible={false} />
        <CenteredSection pageContent={content.donate.sections[0]} />
        {/* Coming Soon Section */}
        <section className="mx-auto max-w-3xl py-16 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">{content.donate.comingSoon.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-center text-muted-foreground">{content.donate.comingSoon.message}</p>

                  <div className="space-y-4">
                    {content.donate.comingSoon.methods.map((method, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{method.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{method.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground text-center">
                    {content.donate.taxInfo}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
