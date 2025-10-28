import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        createdActivities: true,
        activities: true, // joined activities
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}