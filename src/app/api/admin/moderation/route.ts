import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Middleware check for admin would go here
function isAdmin(email: string | null | undefined) {
    return email === "admin@coopertunity.africa"; // Simple check for MVP
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !isAdmin(session.user.email)) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const flaggedPosts = await prisma.report.findMany({
            where: { status: "PENDING" },
            include: { reporter: true },
            orderBy: { createdAt: "desc" }
        });

        // Also fetch recent posts for feed inspection
        const recentPosts = await prisma.coopertunity.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { author: true }
        });

        return NextResponse.json({ flagged: flaggedPosts, recent: recentPosts });

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !isAdmin(session.user.email)) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const { targetId, action, type } = await req.json(); // action: BAN_USER, DELETE_POST

        if (action === "BAN_USER") {
            // In a real app, you'd add a 'banned' status or similar
            // For MVP: delete sessions or add a banned flag
            // Let's assume we delete the user for "One-Click Ban" (CAUTION: MVP ONLY)
            // safer: just update title to [BANNED]
            await prisma.user.update({
                where: { id: targetId },
                data: { name: "[BANNED USER]" }
            });
        }

        if (action === "DELETE_POST") {
            await prisma.coopertunity.delete({
                where: { id: targetId }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
