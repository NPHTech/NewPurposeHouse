"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
        <section className="py-8 md:py-8">
          <div className="mx-auto">
            <div className="mx-auto max-w-3xl">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-yellow-700">{content.donate.comingSoon.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-center text-muted-foreground">{content.donate.comingSoon.message}</p>

                  <div className="space-y-4">
                    {content.donate.comingSoon.methods.map((method: any, index) => (
                      <Card key={index} className="bg-white">
                        <CardHeader>
                          <CardTitle className="text-lg text-yellow-700">{method.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">{method.description}</p>
                          {method.link && (
                            <Button
                              asChild
                              className="bg-pink-300 hover:bg-pink-400 text-white"
                            >
                              <a
                                href={method.link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {method.link.text}
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="rounded-lg bg-pink-300/10 border border-pink-300/20 p-4 text-sm text-pink-800 text-center">
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
