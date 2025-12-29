"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Hero from "@/components/hero"
import content from "@/data/content.json"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"


export default function NewsletterArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const [heroTitleVisible, setHeroTitleVisible] = useState(false)
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setHeroTitleVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Find the article matching the slug
    const articles = (content as any).newsletter?.articles || []
    const foundArticle = articles.find((art: any) => {
      // Extract slug from URL (e.g., "/newsletter/September-2025" -> "September-2025")
      const articleSlug = art.url.replace("/newsletter/", "")
      return articleSlug === slug
    })
    
    if (foundArticle) {
      setArticle(foundArticle)
    }
  }, [slug])

  if (!article) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="py-16 px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold text-yellow-700 mb-4">Article Not Found</h1>
              <p className="text-muted-foreground mb-6">The newsletter article you're looking for doesn't exist.</p>
              <Button
                asChild
                className="bg-pink-300 hover:bg-pink-400 text-white"
              >
                <Link href="/newsletter">Back to Newsletter</Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  // Create hero content for the article
  const articleHero = {
    image: (content as any).newsletter.hero.image,
    title: article.title,
    subtitle: "Newsletter Article",
    intro: article.description
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero content={articleHero} heroTitleVisible={heroTitleVisible} donateCardVisible={false} />
        
        {/* Newsletter Image Section */}
        <section className="py-8 md:py-8">
          <div className="mx-auto">
            <div className="mx-auto max-w-5xl px-8">
              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-yellow-700">{article.title}</CardTitle>
                    <Button
                      asChild
                      variant="outline"
                      className="border-pink-300 text-pink-400 hover:bg-pink-50"
                    >
                      <Link href="/newsletter">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Newsletter
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full">
                    {article.pdf ? (
                      <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                        <div className="relative w-full aspect-auto">
                          <Image
                            src={article.pdf}
                            alt={article.title}
                            width={1200}
                            height={1600}
                            className="w-full h-auto object-contain"
                            unoptimized
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Newsletter image not available.</p>
                        <Button
                          asChild
                          className="bg-pink-300 hover:bg-pink-400 text-white"
                        >
                          <Link href="/newsletter">Back to Newsletter</Link>
                        </Button>
                      </div>
                    )}
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

