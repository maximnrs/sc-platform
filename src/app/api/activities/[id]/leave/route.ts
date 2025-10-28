import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const activityId = params.id
  const userId = session.user.id

  // Remove relation
  await prisma.activity.update({
    where: { id: activityId },
    data: {
      attendees: {
        disconnect: { id: userId },
      },
    },
  })

  return NextResponse.json({ message: "Left successfully" })
}
