"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Hero from "@/components/hero"
import CenteredSection from "@/app/centeredSection"
import content from "@/data/content.json"
import { useEffect, useState } from "react"
import Link from "next/link"


export default function NewsletterPage() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setHeroTitleVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim()
  }

  
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero content={(content as any).newsletter.hero} heroTitleVisible={heroTitleVisible} donateCardVisible={false} />
        <CenteredSection pageContent={(content as any).newsletter.sections[0]} />
        
        {/* Articles Section */}
        <section className="py-8 md:py-8">
          <div className="mx-auto">
            <div className="mx-auto max-w-3xl">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-yellow-700">Latest Announcements & Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    {(content as any).newsletter.articles.map((article: any, index: number) => {
                      const isLong = article.description.length > 150
                      const truncatedText = truncateText(article.description)
                      
                      return (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <h3 className="text-xl font-bold text-yellow-700 mb-3">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                            {isLong ? truncatedText : article.description}
                            {isLong && (
                              <>
                                <span>... </span>
                                <Link
                                  href={article.url}
                                  className="text-pink-400 hover:text-pink-500 font-semibold underline cursor-pointer"
                                >
                                  Read more
                                </Link>
                              </>
                            )}
                          </p>
                        </div>
                      )
                    })}
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
