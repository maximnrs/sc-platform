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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">SportConnect Platform</h1>
      <p className="mt-4 text-lg text-gray-700">
        Connect with sporters, plan activities, and have fun.
      </p>

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
    </main>
  )
}
