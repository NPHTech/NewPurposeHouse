import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import content from "@/data/content.json"

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4">{content.programs.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{content.programs.subtitle}</p>
              <p className="text-muted-foreground">{content.programs.intro}</p>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.programs.items.map((program, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">{program.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={program.cta.href}>{program.cta.text}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
