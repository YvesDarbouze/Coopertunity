import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    isAfrican: false, // Default, updated later
                };
            },
        }),
        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID || "",
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    isAfrican: false,
                };
            },
        }),
    ],
    theme: {
        colorScheme: "light",
    },
    debug: true,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
        // signOut: "/auth/signout", // Optional
        // error: "/auth/error", // Error code passed in query string as ?error=
        // verifyRequest: "/auth/verify-request", // (used for check email message)
        newUser: "/dashboard/settings/profile" // Redirect new users to profile creation
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Data Ingestion Engine: Intercept OAuth sign-ins
            if (account && profile && user.id) {
                try {
                    let draftData: any = {};

                    if (account.provider === 'google') {
                        // Google Profile parsing
                        draftData = {
                            firstName: (profile as any).given_name || null,
                            lastName: (profile as any).family_name || null,
                            email: profile.email || null,
                            avatarUrl: (profile as any).picture || null,
                        };
                    } else if (account.provider === 'linkedin') {
                        // LinkedIn Profile parsing (OpenID Context)
                        draftData = {
                            firstName: (profile as any).given_name || (profile as any).localizedFirstName || null,
                            lastName: (profile as any).family_name || (profile as any).localizedLastName || null,
                            email: profile.email || null,
                            avatarUrl: (profile as any).picture || null,
                            // If extended scopes were requested/provided
                            location: (profile as any).locale?.country || null,
                            headline: (profile as any).headline || null,
                            positions: (profile as any).positions || null,
                        };
                    }

                    if (Object.keys(draftData).length > 0) {
                        // Securely stash into UserDraft
                        await prisma.userDraft.upsert({
                            where: { userId: user.id },
                            update: draftData,
                            create: {
                                userId: user.id,
                                ...draftData
                            }
                        });
                    }
                } catch (error) {
                    console.error("Data Ingestion Error:", error);
                    // Do not block sign in if ingestion fails
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // First time login, extract from user DB object
            if (user) {
                token.id = user.id;
                token.isAfrican = user.isAfrican;
                // NextAuth's User type doesn't have onboarded natively, but if returned from PrismaAdapter it might be there.
                // We'll safely cast it.
                token.onboarded = (user as any).onboarded || false;
            }
            // If the client calls `update({ onboarded: true })`
            if (trigger === "update" && session) {
                if (typeof session?.onboarded === "boolean") {
                    token.onboarded = session.onboarded;
                }
                return { ...token, ...session };
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.isAfrican = token.isAfrican as boolean;
                session.user.onboarded = token.onboarded as boolean;
            }
            return session;
        },
    },
};
