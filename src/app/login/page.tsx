"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError("Invalid email or password")
    } else {
      router.push("/")
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

      {/* 💎 Login Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl animate-fadeIn"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white tracking-tight">
          Welcome Back
        </h1>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <label className="block mb-2 text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Enter your email"
          required
        />

        <label className="block mb-2 text-gray-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Enter your password"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-800 hover:text-gray-200 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          Log In
        </button>

        <p className="mt-4 text-center text-gray-300">
          Don’t have an account?{" "}
          <Link href="/register" className="text-green-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}
