import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { date: "asc" },
      include: {
        createdBy: true,
        attendees: true
      },
    })

    return NextResponse.json({ activities }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}
