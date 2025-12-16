import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import content from "@/data/content.json"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-sans text-4xl font-bold tracking-tight mb-4">{content.about.title}</h1>
              <p className="text-xl text-muted-foreground">{content.about.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold mb-4">{content.about.mission.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{content.about.mission.content}</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">{content.about.vision.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{content.about.vision.content}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">{content.about.story.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{content.about.story.content}</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.about.values.map((value, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
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
