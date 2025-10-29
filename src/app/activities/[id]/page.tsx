import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ActivityDetailClient from "@/components/ActivityDetailClient"

interface ActivityPageProps {
  params: { id: string }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
    include: {
      createdBy: { select: { id: true, name: true } },
      attendees: { select: { id: true, name: true, email: true } },
    },
  })

  if (!activity) return notFound()

  // Serialize dates to string for passing to client component
  const activityForClient = {
    id: activity.id,
    title: activity.title,
    sport: activity.sport,
    location: activity.location,
    description: activity.description ?? "",
    date: activity.date.toISOString(),
    createdById: activity.createdById,
    creatorName: activity.createdBy?.name ?? null,
    attendees: activity.attendees.map((a) => ({
      id: a.id,
      name: a.name ?? a.email ?? "Unknown",
    })),
  }

  return (
    <main className="min-h-screen relative text-white">
      {/* Background + overlay kept simple so client component controls layout */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/SO-WIN.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 -z-5"></div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <ActivityDetailClient activity={activityForClient} />
      </div>
    </main>
  )
}
