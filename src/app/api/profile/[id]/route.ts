import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        bio: true,
        sport: true,
        location: true,
        createdActivities: {
          select: {
            id: true,
            title: true,
            sport: true,
            location: true,
            date: true,
            description: true,
            createdById: true,
          },
        },
        activities: {
          select: {
            id: true,
            title: true,
            sport: true,
            location: true,
            date: true,
            description: true,
            createdById: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
