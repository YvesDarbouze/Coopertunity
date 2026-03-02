import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            isAfrican?: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        isAfrican?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        isAfrican?: boolean;
    }
}
