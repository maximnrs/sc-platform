import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
  const { id } = params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        createdActivities: true,
        activities: true,        // Joined activities
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...user,
      joinedActivities: user.activities,
      activities: undefined,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
