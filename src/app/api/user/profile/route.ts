import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            location,
            targetLocation,
            profession,
            isAfrican,
            isVeteran,
            isInvestor,
            investmentRange,
            willingnessToTeach,
            skillsInventory
        } = body;

        const user = await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                location,
                targetLocation,
                profession,
                isAfrican,
                isVeteran,
                isInvestor,
                investmentRange,
                willingnessToTeach,
                skillsInventory: skillsInventory, // Prisma Json handling
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[PROFILE_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
