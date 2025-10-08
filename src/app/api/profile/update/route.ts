import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { bio, sport, location } = await req.json()

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { bio, sport, location },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
