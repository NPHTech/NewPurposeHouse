import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import content from "@/data/content.json"

export default function DonatePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4">{content.donate.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{content.donate.subtitle}</p>
              <p className="text-muted-foreground">{content.donate.intro}</p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">{content.donate.impact.title}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {content.donate.impact.examples.map((example, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-2xl text-emerald-700">{example.amount}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 bg-muted/30">
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
