import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id: activityId } = context.params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    // Connect user to activity (many-to-many)
    await prisma.activity.update({
      where: { id: activityId },
      data: {
        attendees: {
          connect: { id: session.user.id },
        },
      },
    })

    return NextResponse.json({ message: "Joined activity!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to join activity" }, { status: 500 })
  }
}
