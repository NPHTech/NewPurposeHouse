import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import content from "@/data/content.json"

export default function ApplyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-yellow-700">{content.apply.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{content.apply.subtitle}</p>
              <p className="text-muted-foreground mb-4">{content.apply.intro}</p>
              <div className="rounded-lg bg-pink-300/10 p-4 text-sm text-pink-800 border border-pink-300/20">
                {content.apply.notice}
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-yellow-700">Service Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-8">
                    {content.apply.formSections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2 text-yellow-700">{section.title}</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {section.fields.map((field, fieldIndex) => (
                            <div
                              key={fieldIndex}
                              className={
                                field.type === "textarea" || field.type === "checkbox-group" ? "sm:col-span-2" : ""
                              }
                            >
                              {field.type === "checkbox-group" ? (
                                <div className="space-y-3">
                                  <Label>
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                  </Label>
                                  {field.options?.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <Checkbox id={`${field.name}-${optionIndex}`} />
                                      <label
                                        htmlFor={`${field.name}-${optionIndex}`}
                                        className="text-sm cursor-pointer"
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Label htmlFor={field.name}>
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                  </Label>
                                  {field.type === "textarea" ? (
                                    <Textarea id={field.name} name={field.name} required={field.required} rows={4} />
                                  ) : (
                                    <Input
                                      id={field.name}
                                      name={field.name}
                                      type={field.type}
                                      required={field.required}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Button type="submit" className="w-full bg-pink-300 hover:bg-pink-400 text-white" size="lg">
                      Submit Application
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
