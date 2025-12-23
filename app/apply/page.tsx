"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Hero from "@/components/hero"
import CenteredSection from "@/app/centeredSection"
import content from "@/data/content.json"
import { useEffect, useState } from "react"


export default function ApplyPage() {

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
        <Hero content={content.apply.hero} heroTitleVisible={heroTitleVisible} donateCardVisible={false} />
        <CenteredSection pageContent={content.apply.sections[0]} />
        <div className="pt-16 px-16 relative text-left flex mx-auto max-w-4xl">
          <p className="text-muted-foreground mb-8">{content.apply.sections[0].notice}</p>
        </div>
        {/* Application Form */}
        <section className="py-8 md:py-8">
          <div className="mx-auto">
            <div className="mx-auto max-w-3xl">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-yellow-700">New Purpose House – Application for Services</CardTitle>
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
