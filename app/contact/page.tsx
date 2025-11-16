import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import content from "@/data/content.json"

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4">{content.contact.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{content.contact.subtitle}</p>
              <p className="text-muted-foreground">{content.contact.intro}</p>
            </div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{content.contact.information.address.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {content.contact.information.address.value}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{content.contact.information.phone.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{content.contact.information.phone.value}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{content.contact.information.email.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{content.contact.information.email.value}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{content.contact.information.hours.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {content.contact.information.hours.value}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form (Placeholder) */}
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    {content.contact.formFields.map((field, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={field.name}>
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea id={field.name} name={field.name} required={field.required} rows={4} />
                        ) : (
                          <Input id={field.name} name={field.name} type={field.type} required={field.required} />
                        )}
                      </div>
                    ))}
                    <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                      Send Message
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Note: This is a placeholder form. Submission functionality coming soon.
                    </p>
                  </form>
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
