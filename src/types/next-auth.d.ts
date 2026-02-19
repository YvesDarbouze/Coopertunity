import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            isAfrican?: boolean
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        isAfrican?: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        isAfrican?: boolean
    }
}
