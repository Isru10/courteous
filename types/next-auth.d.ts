declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      avatarUrl?: string
    }
  }

  interface User {
    role: string
    avatarUrl?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    avatarUrl?: string
  }
}
