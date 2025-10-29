"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface User {
  id: string
  name?: string | null
}

interface Activity {
  id: string
  title: string
  sport: string
  location: string
  date: string
  description?: string
  createdBy?: User
  attendees?: User[]
}

export default function ActivitiesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")

    const fetchActivities = async () => {
      const res = await fetch("/api/activities")
      if (res.ok) {
        const data = await res.json()
        setActivities(data.activities)
      }
      setLoading(false)
    }

    fetchActivities()
  }, [session, status, router])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-gray-400">
        Loading activities...
      </main>
    )
  }

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/WHY-DO-IT.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 p-20 max-w-5xl mx-auto animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl italic">Activities</h1>
          <Link
            href={`/activities/create`}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            + Create Activity
          </Link>
        </div>

        {activities.length === 0 ? (
          <p className="text-gray-300">No activities found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <Link href={`/activities/${activity.id}`} key={activity.id}>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:bg-white/20 transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-1">{activity.title}</h2>
                  <p className="text-green-300 font-medium italic">{activity.sport}</p>
                  <div className="mt-3">
                    <p className="text-gray-300 text-sm">
                      📍 <span className="text-gray-200">{activity.location}</span>
                    </p>
                    <p className="text-gray-300 text-sm">
                      📅 <span className="text-gray-200">{new Date(activity.date).toLocaleDateString()}</span>
                    </p>
                  </div>

                  {activity.createdBy?.name && (
                    <p className="mt-4 text-sm text-gray-400 italic">
                      Hosted by <span className="text-gray-200">{activity.createdBy.name}</span>
                    </p>
                  )}

                  {activity.attendees && activity.attendees.length > 0 && (
                    <div className="mt-3 text-sm text-gray-300">
                      Attendees:{" "}
                      {activity.attendees.map((user) => user.name).join(", ")}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link
          href={`/`}
          className="text-green-400 hover:underline transition mt-4 inline-block"
        >
          ← Back to main
        </Link>
      </div>
    </main>
  )
}
