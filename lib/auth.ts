// lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/db"
import prisma from "@/lib/prisma"

// Extend the User type to include gender and theme
declare module "next-auth" {
  interface User {
    gender?: string
    theme?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      gender?: string
      theme?: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get user from database using your Prisma utility
          const user = await getUserByEmail(credentials.email)
                   
          if (!user) {
            return null
          }

          // You'll need to add a getUserWithPassword function to get the password
          // Or modify getUserByEmail to optionally include password
          const userWithPassword = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              gender: true,
              theme: true,
              password: true
            }
          })

          if (!userWithPassword) {
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            userWithPassword.password
          )

          if (!isValidPassword) {
            return null
          }

          // Return user object (without password)
          return {
            id: userWithPassword.id,
            email: userWithPassword.email,
            name: userWithPassword.name,
            gender: userWithPassword.gender,
            theme: userWithPassword.theme,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.gender = user.gender
        token.theme = user.theme
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.gender = token.gender as string
        session.user.theme = token.theme as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Add this line
}

export default NextAuth(authOptions)