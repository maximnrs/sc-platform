"use client"

import React, { useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Attendee = { id: string; name: string }
type ActivityForClient = {
  id: string
  title: string
  sport: string
  location: string
  description: string
  date: string
  createdById: string
  creatorName: string | null
  attendees: Attendee[]
}

export default function ActivityDetailClient({ activity }: { activity: ActivityForClient }) {
  const { data: session } = useSession()
  const router = useRouter()

  const [attendees, setAttendees] = useState<Attendee[]>(activity.attendees ?? [])
  const [loading, setLoading] = useState(false)
  const userId = session?.user?.id

  const isCreator = userId === activity.createdById
  const isJoined = useMemo(() => attendees.some((a) => a.id === userId), [attendees, userId])

  const initials = (name: string) =>
    name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

  async function handleJoin() {
    if (!session) {
      router.push("/login")
      return
    }
    if (isCreator || isJoined) return

    setLoading(true)
    try {
      const res = await fetch(`/api/activities/${activity.id}/join`, { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setAttendees((prev) => [
          ...prev,
          { id: userId as string, name: session.user?.name ?? (session.user?.email ?? "Unknown") },
        ])
      } else {
        console.error("Join failed", data)
        alert(data?.error ?? data?.message ?? "Failed to join")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to join")
    } finally {
      setLoading(false)
    }
  }

  async function handleLeave() {
    if (!session) {
      router.push("/login")
      return
    }
    if (!isJoined) return

    setLoading(true)
    try {
      const res = await fetch(`/api/activities/${activity.id}/leave`, { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setAttendees((prev) => prev.filter((a) => a.id !== userId))
      } else {
        console.error("Leave failed", data)
        alert(data?.error ?? "Failed to leave")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to leave")
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl animate-fadeIn">
      <Link href="/activities" className="text-sm text-gray-300 hover:text-white underline">
        ← Back to activities
      </Link>

      <header className="mt-4 mb-6">
        <h1 className="text-5xl italic">{activity.title}</h1>
        <p className="mt-2 text-green-500 font-semibold">{activity.sport}</p>
        <div className="mt-3 text-gray-300 text-sm">
          <span>📍 {activity.location}</span>
          <span className="mx-3">•</span>
          <span>📅 {new Date(activity.date).toLocaleDateString()}</span>
        </div>

        {activity.creatorName && (
          <p className="mt-3 text-gray-400 italic text-sm">
            Hosted by <span className="text-gray-200 font-medium">{activity.creatorName}</span>
          </p>
        )}
      </header>

      {/* Description */}
      {activity.description && (
        <section className="prose prose-invert mb-6 text-gray-100">
          <p>{activity.description}</p>
        </section>
      )}

      {/* Join / Leave CTA */}
      <section className="mb-8 flex items-center gap-4">
        {isCreator ? (
          <div className="px-4 py-2 rounded-lg border border-green-600 text-green-600 bg-black/30">
            You are hosting this activity
          </div>
        ) : isJoined ? (
          <button
            onClick={handleLeave}
            disabled={loading}
            className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-60"
          >
            {loading ? "Leaving..." : "Leave Activity"}
          </button>
        ) : (
          <button
            onClick={handleJoin}
            disabled={loading}
            className="px-5 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-60"
          >
            {loading ? "Joining..." : "Join Activity"}
          </button>
        )}

        <div className="ml-auto text-sm text-gray-300">
          Attendees <span className="text-gray-100 font-medium">({attendees.length})</span>
        </div>
      </section>

      {/* Attendees - Middle of page (premium mini cards) */}
      <section className="grid gap-3">
        {attendees.length === 0 ? (
          <p className="text-gray-400">No attendees yet — be the first to join.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {attendees.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/6 hover:bg-white/10 transition"
              >
                {/* Premium initial avatar: dark base + green-600 ring */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(12,12,13,0.9), rgba(20,20,20,0.9))",
                    boxShadow: "inset 0 -6px 14px rgba(0,0,0,0.4)",
                    border: "2px solid rgba(255,255,255,0.06)",
                    position: "relative",
                  }}
                >
                  {/* green ring */}
                  <span
                    className="absolute -inset-[2px] rounded-full pointer-events-none"
                    style={{
                      boxShadow: `0 0 0 2px rgba(0,0,0,0.35), 0 0 0 6px rgba(34,197,94,0.09)`,
                      borderRadius: "9999px",
                    }}
                  />
                  <span className="relative">{initials(a.name)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-gray-100 font-medium truncate">{a.name}</div>
                    {/* optional: small role/label */}
                    {/* <div className="text-xs text-gray-400">Player</div> */}
                  </div>
                  <div className="text-sm text-gray-400">Member</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  )
}