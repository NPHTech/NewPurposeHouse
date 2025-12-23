export type PageHero = {
    image: string
    title: string
    subtitle: string
    subtitle2: string
    primaryCTA: { text: string; href: string }
    secondaryCTA: { text: string; href: string }
}

export type PageSection = {
  title: string
  subtitle?: string
  content: string
  primaryCTA?: { text: string; href: string }
  secondaryCTA?: { text: string; href: string }
}

export type PageCallToAction = {
    title: string
    content: string
    buttons: { text: string; href: string }[]
}

export type PageFooter = {
  tagline: string
  social: { platform: string; url: string }[]
  quickLinks: { label: string; href: string }[]
  copyright: string
}

export type PageContent = {
  hero: PageHero
  sections: PageSection[]
  callToAction: PageCallToAction
  footer: PageFooter
}