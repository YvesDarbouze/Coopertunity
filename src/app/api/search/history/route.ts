import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const history = await prisma.searchHistory.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 5
        });
        return NextResponse.json(history);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { query } = await req.json();
        if (!query) return new NextResponse("Missing query", { status: 400 });

        const saved = await prisma.searchHistory.create({
            data: {
                userId: session.user.id,
                query
            }
        });
        return NextResponse.json(saved);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
