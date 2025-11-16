import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import content from "@/data/content.json"

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4">{content.faq.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{content.faq.subtitle}</p>
              <p className="text-muted-foreground">{content.faq.intro}</p>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {content.faq.items.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
