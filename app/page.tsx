import HomePageClient  from '@/app/HomePageClient'
import content from '@/data/content.json'

export default async function HomePage() {
  return <HomePageClient content={content.home} />
}