// lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { getUserWithPasswordByEmail, createUser, getUserByEmail } from "@/lib/db"

// Extend the User type to include gender and theme
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name?: string
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

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    gender?: string
    theme?: string
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
          // Get user with password from database
          const user = await getUserWithPasswordByEmail(credentials.email)
          
          if (!user || !user.password) {
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValidPassword) {
            return null
          }

          // Return user object (without password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            gender: user.gender,
            theme: user.theme,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await getUserByEmail(user.email!)
          
          if (!existingUser) {
            // Create new user for Google sign-in
            const newUser = await createUser(
              user.email!,
              user.name || "Google User",
              // Generate a random password for Google users (they won't use it)
              Math.random().toString(36).slice(-8),
              undefined // gender is optional
            )
            
            // Update the user object with the new user data
            user.id = newUser.id
            user.gender = newUser.gender
            user.theme = newUser.theme
          } else {
            // Update user object with existing user data
            user.id = existingUser.id
            user.gender = existingUser.gender
            user.theme = existingUser.theme
          }
          
          return true
        } catch (error) {
          console.error("Google sign-in error:", error)
          return false
        }
      }
      
      return true
    },
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
        session.user.id = token.id
        session.user.gender = token.gender
        session.user.theme = token.theme
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions)