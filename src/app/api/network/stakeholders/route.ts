import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const body = await req.json();
        const { name } = body;

        if (!name) return new NextResponse("Stakeholder name required", { status: 400 });

        const stakeholder = await prisma.stakeholder.create({
            data: {
                name,
                ownerId: user.id
            }
        });

        return NextResponse.json(stakeholder);

    } catch (e) {
        console.error("Failed to create stakeholder:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const body = await req.json();
        const { stakeholderId, memberIds } = body;

        if (!stakeholderId || !Array.isArray(memberIds)) {
            return new NextResponse("Invalid payload", { status: 400 });
        }

        // Verify the user owns this Stakeholder
        const stakeholder = await prisma.stakeholder.findUnique({ where: { id: stakeholderId } });
        if (!stakeholder || stakeholder.ownerId !== user.id) {
            return new NextResponse("Unauthorized to modify this Stakeholder", { status: 403 });
        }

        // Replace members array purely by ID mapping
        const updatedStakeholder = await prisma.stakeholder.update({
            where: { id: stakeholderId },
            data: {
                members: {
                    set: memberIds.map((id: string) => ({ id })) // Replace entirely
                }
            },
            include: {
                members: {
                    select: { id: true, name: true, profession: true, image: true, location: true }
                }
            }
        });

        return NextResponse.json(updatedStakeholder);

    } catch (e) {
        console.error("Failed to update stakeholder members:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
