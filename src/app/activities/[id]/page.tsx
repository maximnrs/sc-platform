import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

interface ActivityPageProps {
  params: {
    id: string
  }
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
    include: {
      creator: {
        select: { name: true },
      },
    },
  })

  if (!activity) return notFound()

  return (
    <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
      <Link
        href={`/activities`}
        className="text-green-400 hover:underline transition mt-4 inline-block"
      >
        ← Back to activities
      </Link>

      <h1 className="text-4xl font-bold mt-4">{activity.title}</h1>
      <p className="text-green-300 text-lg font-medium italic">{activity.sport}</p>

      <div className="mt-4 space-y-1 text-gray-200 text-lg">
        <p>📍 {activity.location}</p>
        <p>📅 {new Date(activity.date).toLocaleDateString()}</p>
      </div>

      {activity.description && (
        <p className="mt-6 text-gray-100 leading-relaxed">
          {activity.description}
        </p>
      )}

      {activity.creator?.name && (
        <p className="mt-8 text-lg text-gray-400 italic">
          Hosted by <span className="text-gray-200">{activity.creator.name}</span>
        </p>
      )}
    </div>
  )
}
