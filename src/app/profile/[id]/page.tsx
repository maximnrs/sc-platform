"use client";

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

interface Activity {
  id: string;
  title: string;
  location: string;
  date: string;
}

interface User {
  id: string;
  name?: string;
  bio?: string;
  sport?: string;
  location?: string;
  image?: string;
  activities?: Activity[];
}

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      const res = await fetch(`/api/profile/${id}`);
      const data = await res.json();
      setUser(data);
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>User not found.</p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* optional background video reuse */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/WHY-DO-IT.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="z-10 text-center px-4 animate-fadeIn">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Profile picture"}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-white/40"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-white/10 flex items-center justify-center text-4xl font-bold">
            {user.name?.charAt(0) || "?"}
          </div>
        )}

        <h1 className="text-4xl font-bold">{user.name || "Username not set"}</h1>
        <p className="mt-2 text-gray-300">{user.sport || "Sport not set"}</p>
        <p className="text-gray-400">{user.location || "Location unknown"}</p>
        <p className="mt-4 max-w-lg mx-auto text-gray-200">{user.bio || "No bio yet."}</p>

        <h2 className="mt-10 text-2xl font-semibold">Activities</h2>
        <div className="mt-4 space-y-3">
          {user.activities && user.activities.length > 0 ? (
            user.activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white/10 p-4 rounded-lg border border-white/10 max-w-md mx-auto"
              >
                <p className="text-lg font-semibold">{activity.title}</p>
                <p className="text-gray-300">{activity.location}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No activities yet.</p>
          )}
        </div>
        <div className="mt-10">
          <Link
            href="/profile/edit"
            className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mx-4"
          >
            Edit Profile
          </Link>
          <Link
            href="/"
            className="text-green-400 hover:underline transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
