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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setHeroTitleVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Collect all form data
    const data: any = {}
    
    // Collect regular form fields
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("servicesNeeded-")) {
        // Skip checkbox group - we'll handle it separately
        continue
      } else {
        data[key] = value.toString()
      }
    }

    // Collect checked services from checkboxes
    const serviceCheckboxes = form.querySelectorAll('input[type="checkbox"]')
    const checkedServices: string[] = []
    serviceCheckboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement
      if (input.checked && input.id.startsWith("servicesNeeded-")) {
        const label = input.nextElementSibling?.textContent
        if (label) {
          checkedServices.push(label.trim())
        }
      }
    })
    if (checkedServices.length > 0) {
      data.servicesNeeded = checkedServices
    }

    console.log("Submitting form data:", data)
    console.log("Data keys:", Object.keys(data))
    
    // Validate that we have at least some data
    if (Object.keys(data).length === 0) {
      setSubmitStatus({ type: "error", message: "Please fill out the form before submitting." })
      setIsSubmitting(false)
      return
    }

    try {
      const jsonBody = JSON.stringify(data)
      console.log("JSON body being sent:", jsonBody)
      
      const response = await fetch("/api/email-admin-new-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonBody,
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({ type: "success", message: "Application submitted successfully! We'll be in touch soon." })
        form.reset()
      } else {
        setSubmitStatus({ type: "error", message: result.error || "Failed to submit application. Please try again." })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus({ type: "error", message: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

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
                  <form onSubmit={onSubmit} className="space-y-8">
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
                                      <Checkbox id={`${field.name}-${optionIndex}`} name={`${field.name}-${optionIndex}`} />
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

                    {submitStatus && (
                      <div
                        className={`p-4 rounded-md ${
                          submitStatus.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {submitStatus.message}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-pink-300 hover:bg-pink-400 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
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
