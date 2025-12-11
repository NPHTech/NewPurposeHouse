import { Button } from "@/components/ui/button"

interface TimelineItem {
  label: string
  color: "yellow" | "blue" | "olive" | "bronze"
  title: string
  description: string
  image: string
  location: string
}

const timelineItems: TimelineItem[] = [
  {
    label: "WE HAVE THE INSIGHTS",
    color: "yellow",
    title: "Research For Solutions",
    description:
      "We listen to community members and share their stories and ideas. Their voices help shape real solutions and guide us toward meaningful impact.",
    image: "/community-research-listening-session.jpg",
    location: "Local Communities",
  },
  {
    label: "WE HAVE THE RELATIONSHIPS",
    color: "blue",
    title: "Local Roots, National Impact",
    description:
      "Our leaders are passionate community members. We learn from them every day—turning local wisdom into national action.",
    image: "/community-leader-portrait-smiling.jpg",
    location: "Nationwide",
  },
  {
    label: "WE HAVE THE SCALE",
    color: "olive",
    title: "Comprehensive Distribution",
    description:
      "We're one of the nation's most effective networks. We mobilize resources quickly, safely and reliably to communities where people need it most.",
    image: "/community-outreach-volunteer-smiling-outdoors.jpg",
    location: "Multiple States",
  },
  {
    label: "WE HAVE THE VISION",
    color: "bronze",
    title: "Support for Every Individual",
    description:
      "We help provide comprehensive support and education to people rebuilding their lives. Everyone deserves dignity and opportunity.",
    image: "/person-smiling-hopeful-future-community-center.jpg",
    location: "National Reach",
  },
]

const colorClasses = {
  yellow: "bg-[var(--service-yellow)] text-foreground",
  blue: "bg-[var(--service-blue)] text-foreground",
  olive: "bg-[var(--service-olive)] text-background",
  bronze: "bg-accent text-accent-foreground",
}

export function TimelineSection() {
  return (
    <section className={"w-full py-16 md:py-24 lg:py-32"}>
      <div className="text-center mb-16">
        <p className="text-sm font-bold text-accent uppercase tracking-wider mb-2">What We Do</p>
        <h2 className="text-4xl md:text-5xl font-bold text-balance">To Serve Women Rebuilding Their Lives</h2>
      </div>

      <div className="max-w-5xl mx-auto space-y-24">
        {timelineItems.map((item, index) => (
          <div
            key={index}
            className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
          >
            {/* Content */}
            <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
              <div className={`inline-block px-6 py-2 rounded-md font-bold text-sm mb-4 ${colorClasses[item.color]}`}>
                {item.label}
              </div>
              <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
              <p className="text-lg leading-relaxed text-muted-foreground mb-4">{item.description}</p>
            </div>

            {/* Image */}
            <div
              className={`relative h-[350px] rounded-lg overflow-hidden shadow-lg ${
                index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""
              }`}
            >
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
              <div className="absolute bottom-4 left-4 bg-background/90 px-4 py-2 rounded-md">
                <p className="text-sm font-medium">{item.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          Learn About Our Work
        </Button>
      </div>
    </section>
  )
}
