"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-6 py-1 bg-transparent border-2 border-red-600 text-red-600 text-lg rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
    >
      Log out
    </button>
  )
}
