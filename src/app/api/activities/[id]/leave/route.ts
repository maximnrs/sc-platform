import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = await context.params

  try {
    await prisma.activity.update({
      where: { id },
      data: {
        attendees: { disconnect: { id: session.user.id } },
      },
    })

    return NextResponse.json({ message: "Left activity." })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to leave activity" }, { status: 500 })
  }
}