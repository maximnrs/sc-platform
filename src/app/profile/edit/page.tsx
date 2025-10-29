"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [sport, setSport] = useState("")
  const [location, setLocation] = useState("")
  const [message, setMessage] = useState("")

  // Load user data from session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, sport, location }),
    })

    if (res.ok) {
      setMessage("✅ Profile updated successfully!")
      setTimeout(() => router.push(`/profile/${session?.user.id}`), 1500)
    } else {
      setMessage("❌ Failed to update profile.")
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
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

      {/* 🖤 Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 💎 Edit Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl animate-fadeIn"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Edit Your Profile
        </h1>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Name */}
        <label className="block mb-2 text-gray-300">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Your name"
          required
        />

        {/* Bio */}
        <label className="block mb-2 text-gray-300">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Tell something about yourself..."
          rows={3}
        />

        {/* Sport */}
        <label className="block mb-2 text-gray-300">Sport</label>
        <input
          type="text"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Your main sport"
        />

        {/* Location */}
        <label className="block mb-2 text-gray-300">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Where are you based?"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          Save Changes
        </button>

        <p className="mt-4 text-center text-gray-300">
          <Link
            href={`/profile/${session?.user.id}`}
            className="text-green-400 hover:underline transition"
          >
            ← Back to profile
          </Link>
        </p>
      </form>
    </main>
  )
}
