import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        // Right now, this endpoint only handles the onboarded flag, but can be expanded
        const updateData: any = {};
        if (typeof body.onboarded === "boolean") {
            updateData.onboarded = body.onboarded;
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: { id: true, onboarded: true }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Profile Update Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
