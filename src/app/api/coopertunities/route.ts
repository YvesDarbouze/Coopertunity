import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TAXONOMY_SERVICE } from "@/lib/taxonomy";
import { BACKGROUND_MATCHER } from "@/lib/background_matcher";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Use the session-persisted flag or re-fetch user to confirm privilege
    // For stricter security, re-fetching is better, but session flag is faster.
    // We'll trust the session for now as it's signed.
    // @ts-ignore
    if (!session.user.isAfrican) {
        return new NextResponse("Access Denied: Only African members can post Coopertunities.", { status: 403 });
    }

    try {
        const body = await req.json();
        const {
            title,
            description,
            type,
            sector,
            subSector,
            location,
            latitude,
            longitude,
            investmentAmount,
            compensationType,
            isNonProfit,
            donationLink,
            keywords,
            requiredSkills, // New
            stakeholders
        } = body;

        // Auto-generate SIC Code based on SubSector or Title
        const sicCode = await TAXONOMY_SERVICE.getSicCode(subSector || title);

        // @ts-ignore - stale prisma client
        const coopertunity = await prisma.coopertunity.create({
            data: {
                title,
                description,
                type,
                sector,
                subSector,
                location,
                latitude,
                longitude,
                investmentAmount,
                compensationType,
                isNonProfit,
                donationLink,
                keywords,
                requiredSkills, // New
                sicCode, // New
                stakeholders,
                authorId: session.user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                // landTitleVerified defaults to false
            },
        });

        // Trigger Matchmaking in Background (Fire and Forget)
        BACKGROUND_MATCHER.findMatchesForCoopertunity(coopertunity.id).catch(err => {
            console.error("[BACKGROUND_MATCHING_ERROR]", err);
        });

        return NextResponse.json(coopertunity);
    } catch (error) {
        console.error("[COOPERTUNITY_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const sector = searchParams.get('sector');
        const subSector = searchParams.get('subSector');

        const whereClause: any = {
            status: "OPEN"
        };

        if (type) whereClause.type = type;
        if (sector) whereClause.sector = sector;
        if (subSector) whereClause.subSector = subSector;

        const coopertunities = await prisma.coopertunity.findMany({
            where: whereClause,
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                        isVeteran: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(coopertunities);
    } catch (error) {
        console.error("[COOPERTUNITY_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { id, ...values } = body;

        const existing = await prisma.coopertunity.findUnique({ where: { id } });
        if (!existing) return new NextResponse("Not Found", { status: 404 });

        if (existing.authorId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const updated = await prisma.coopertunity.update({
            where: { id },
            data: { ...values }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[COOPERTUNITY_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return new NextResponse("Unauthorized", { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return new NextResponse("ID Required", { status: 400 });

        const existing = await prisma.coopertunity.findUnique({ where: { id } });
        if (!existing) return new NextResponse("Not Found", { status: 404 });

        if (existing.authorId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const deleted = await prisma.coopertunity.delete({
            where: { id }
        });

        return NextResponse.json(deleted);
    } catch (error) {
        console.error("[COOPERTUNITY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
