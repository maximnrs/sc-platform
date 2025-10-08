"use client"

import { useSession } from "next-auth/react"
import LogoutButton from "@/components/LogoutButton"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* 🔥 Background Video */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/WHY-DO-IT.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* 💬 Text Content */}
      <div className="relative z-10 text-center px-4 animate-fadeIn">
        <h1 className="text-5xl md:text-7xl text-white tracking-tight drop-shadow-lg">
          <span className="font-extrabold">Sport</span><em>Connect</em>
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-2xl mx-auto">
          Connect with youth, <em>through sports.</em>
        </p>
        <p className="mt-2 text-md md:text-base max-w-2xl mx-auto">
          Discover. Play. Rejoice.
        </p>

        {session ? (
          <div className="mt-8 space-y-4">
            <a
              href={`/profile/${session.user.id}`}
              className="px-4 py-2 bg-white text-black rounded-full mt-4 inline-block hover:bg-gray-200 transition"
            >
              View Profile
            </a>
            <a
              href="/profile/edit"
              className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </a>
            <p className="text-gray-100 text-lg">
              Welcome back, <span className="font-semibold">{session.user?.name}</span>!
            </p>
            <LogoutButton />
          </div>
        ) : (
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-6 py-3 bg-green-600 text-white text-lg rounded-full hover:bg-transparent hover:text-green-600 hover:border-2 hover:border-green-600 border-transparent border-2 transition-all duration-300 shadow-lg"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-6 py-3 bg-transparent border-2 border-white text-white text-lg rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Login
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
