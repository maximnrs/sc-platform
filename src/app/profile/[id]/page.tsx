"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import LogoutButton from "@/components/LogoutButton"

interface Activity {
  id: string
  title: string
  sport?: string
  location: string
  date: string
}

interface User {
  id: string
  name?: string
  bio?: string
  sport?: string
  location?: string
  createdActivities?: Activity[]
  joinedActivities?: Activity[]
}

export default function ProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchProfile = async () => {
      const res = await fetch(`/api/profile/${id}`)
      const data = await res.json()
      setUser(data)
      setLoading(false)
    }
    fetchProfile()
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-gray-400">Loading profile...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>User not found.</p>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      <div className="z-10 text-center px-4 animate-fadeIn">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "Profile picture"}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-white/40"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-white/10 flex items-center justify-center text-3xl font-bold border-2 border-green-600/40">
            {user.name?.charAt(0) || "?"}
          </div>
        )}

        <h1 className="text-4xl italic">{user.name || "Username not set"}</h1>
        <p className="mt-2 text-gray-300">{user.sport || "Sport not set"}</p>
        <p className="text-gray-400">📍{user.location || "Location unknown"}</p>
        <p className="mt-4 max-w-lg mx-auto text-gray-200">{user.bio || "No bio yet."}</p>

        <h2 className="mt-6 text-2xl italic">Created Activities</h2>
        <div className="mt-1 space-y-3">
          {user.createdActivities && user.createdActivities.length > 0 ? (
            user.createdActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white/10 p-4 rounded-lg border border-white/10 max-w-md mx-auto"
              >
                <p className="text-lg font-semibold">{activity.title}</p>
                <p className="text-green-500 italic">{activity.sport}</p>
                <p className="text-gray-300">📍{activity.location}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No created activities yet.</p>
          )}
        </div>

        <h2 className="mt-6 text-2xl italic">Joined Activities</h2>
        <div className="mt-1 space-y-3">
          {user.joinedActivities && user.joinedActivities.length > 0 ? (
            user.joinedActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white/10 p-4 rounded-lg border border-white/10 max-w-md mx-auto"
              >
                <p className="text-lg font-semibold">{activity.title}</p>
                <p className="text-green-500 italic">{activity.sport}</p>
                <p className="text-gray-300">📍{activity.location}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No joined activities yet.</p>
          )}
        </div>

        <div className="space-x-4 mb-6">
          <Link
            href="/profile/edit"
            className="mt-6 inline-block px-6 py-1 bg-green-600 text-white text-lg rounded-full hover:bg-transparent hover:text-green-600 hover:border-2 hover:border-green-600 border-transparent border-2 transition-all duration-300 shadow-lg"
          >
            Edit Profile
          </Link>
          <LogoutButton />
        </div>
        <Link href="/" className="text-green-400 hover:underline transition">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
