import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAfrican = token?.isAfrican;
        const path = req.nextUrl.pathname;

        // 1. Protect Dashboard and Onboarding
        if (path.startsWith("/dashboard") || path.startsWith("/onboarding")) {
            if (!token) {
                return NextResponse.redirect(new URL("/", req.url));
            }

            // 1a. Enforce Onboarding Flow
            // If they are logged in, but not onboarded, and trying to hit the dashboard => Redirect to onboarding
            if (!token.onboarded && path.startsWith("/dashboard")) {
                return NextResponse.redirect(new URL("/onboarding", req.url));
            }

            // 1b. Prevent looping
            // If they ARE onboarded, but somehow hit the onboarding page => Redirect to dashboard
            if (token.onboarded && path.startsWith("/onboarding")) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

        // 2. Protect Coopertunity Creation (The "Write" Access Gate)
        if (path.startsWith("/coopertunities/create")) {
            if (!isAfrican) {
                // Redirect to a "Restricted Access" page or show error
                return NextResponse.redirect(new URL("/access-denied?reason=identity", req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/onboarding", "/coopertunities/create"],
};
