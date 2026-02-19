import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ _error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { isAfrican } = body;

        if (typeof isAfrican !== 'boolean') {
            return NextResponse.json({ _error: "Invalid input" }, { status: 400 });
        }

        // Update user profile
        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { isAfrican }
        });

        return NextResponse.json({ success: true, user });

    } catch (error) {
        console.error("Gatekeeper Error:", error);
        return NextResponse.json({ _error: "Internal Server Error" }, { status: 500 });
    }
}
