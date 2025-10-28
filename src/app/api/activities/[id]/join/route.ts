import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: activityId } = await context.params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    await prisma.activity.update({
      where: { id: activityId },
      data: { attendees: { connect: { id: session.user.id } } },
    })

    return NextResponse.json({ message: "Joined activity" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to join activity" }, { status: 500 })
  }
}
