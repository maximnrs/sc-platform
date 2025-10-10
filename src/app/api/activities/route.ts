import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, sport, location, date, description } = await req.json()

  if (!title || !sport || !location || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const newActivity = await prisma.activity.create({
      data: {
        title,
        sport,
        location,
        date: new Date(date),
        description,
        createdBy: session.user.id,
      },
    })

    return NextResponse.json(
      { message: "Activity created!", activity: newActivity },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
