import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { createUser, getUserByEmail } from "@/lib/db"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  gender: z.enum(["male", "female", "other", "MALE", "FEMALE", "OTHER"])
    .transform((val) => val.toUpperCase() as "MALE" | "FEMALE" | "OTHER")
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password, gender } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create user using Prisma (password hashing is handled in createUser function)
    const user = await createUser(email, name, password, gender)

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        theme: user.theme,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid input", 
        details: error.errors 
      }, { status: 400 })
    }

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ 
          error: "User with this email already exists" 
        }, { status: 400 })
      }
    }

    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}