"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Activity {
  id: string
  title: string
  sport: string
  location: string
  date: string
  description?: string
  creator?: {
    name?: string | null
  }
}

export default function ActivitiesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) router.push("/login")  // redirect if not logged in

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
      <main className="flex min-h-screen items-center justify-center text-white">
        Loading activities...
      </main>
    )
  }

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/SO-WIN.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Activities</h1>

        {activities.length === 0 ? (
          <p className="text-gray-300">No activities found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl"
              >
                <h2 className="text-2xl font-semibold mb-2">{activity.title}</h2>
                <p className="text-green-300 font-medium">{activity.sport}</p>
                <p className="text-gray-300 mt-1">{activity.location}</p>
                <p className="text-gray-400 mt-2 text-sm">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
