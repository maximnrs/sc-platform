"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateActivityPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [sport, setSport] = useState("") // 🆕 added
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    const res = await fetch("/api/activities/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, sport, location, date, description }),
    })

    if (res.ok) {
      setMessage("✅ Activity created successfully!")
      setTimeout(() => router.push(`/activities`), 1500)
    } else {
      const data = await res.json()
      setError(data.error || "Failed to create activity")
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

      {/* 💎 Create Activity Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl animate-fadeIn"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white tracking-tight">
          Create New Activity
        </h1>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-400 mb-4 text-center">{message}</p>}

        {/* 🏷️ Title */}
        <label className="block mb-2 text-gray-300">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Enter activity title"
          required
        />

        {/* 🏅 Sport */}
        <label className="block mb-2 text-gray-300">Sport</label>
        <input
          type="text"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="e.g. Golf, Tennis, Football"
          required
        />

        {/* 📍 Location */}
        <label className="block mb-2 text-gray-300">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Enter location"
          required
        />

        {/* 📅 Date */}
        <label className="block mb-2 text-gray-300">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />

        {/* 📝 Description */}
        <label className="block mb-2 text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Describe the activity (optional)"
          rows={4}
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-800 hover:text-gray-200 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          Create Activity
        </button>
      </form>
    </main>
  )
}
