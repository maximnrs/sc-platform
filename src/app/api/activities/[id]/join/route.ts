import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const activityId = params.id
  const userId = session.user.id

  // Check if already joined
  const existing = await prisma.activity.findFirst({
    where: {
      id: activityId,
      attendees: {
        some: { id: userId },
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: "Already joined" }, { status: 400 })
  }

  // Add relation
  await prisma.activity.update({
    where: { id: activityId },
    data: {
      attendees: {
        connect: { id: userId },
      },
    },
  })

  return NextResponse.json({ message: "Joined successfully" })
}
