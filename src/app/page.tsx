"use client"

import { useSession } from "next-auth/react"
import LogoutButton from "@/components/LogoutButton"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
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
          <source src="/videos/So-Win-Nike_Media_b0Ezn5pZE7o_001_1080p.mp4" type="video/mp4" />
        </video>

      {session ? (
        <>
          <p className="mt-6 text-xl text-gray-800">
            Welcome back, <span className="font-semibold">{session.user?.name}</span>!
          </p>
          <LogoutButton />
        </>
      ) : (
        <>
          <a
            href="/register"
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Register
          </a>
          <a
            href="/login"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Already have an account? Login
          </a>
        </>
      )}
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
    </main>
  )
}
