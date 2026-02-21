import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json([]);
    }

    try {
        // 1. Search Users
        const users = await prisma.user.findMany({
            where: {
                stealthMode: false,
                onboarded: true,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { profession: { contains: query, mode: "insensitive" } },
                    { location: { contains: query, mode: "insensitive" } },
                ],
            },
            select: {
                id: true,
                name: true,
                image: true,
                profession: true,
                location: true,
                isAfrican: true,
                isVeteran: true,
            },
            take: 10,
        });

        // 2. Search Coopertunities
        const coopertunities = await prisma.coopertunity.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { location: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                        isVeteran: true,
                    },
                },
            },
            take: 10,
        });

        // 3. Normalize and Combine
        const unifiedResults = [
            ...users.map((u) => ({ ...u, type: "USER" })),
            ...coopertunities.map((c) => ({ ...c, type: "COOP" })),
        ];

        // 4. Sort by relevance or date? Random shuffle for "Discovery" feel?
        // Let's sort simply by putting matches that start with the query first, or just shuffle.
        // For now, simpler: Users first, then deals? Or mixed.
        // Let's mix them.
        const shuffled = unifiedResults.sort(() => 0.5 - Math.random());

        return NextResponse.json(shuffled);

    } catch (error) {
        console.error("Search Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
