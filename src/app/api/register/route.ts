import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })
    return new Response(JSON.stringify({ message: "User created", user }), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 })
  }
}
