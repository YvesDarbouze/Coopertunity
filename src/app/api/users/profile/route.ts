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

        // Expanded to handle full onboarding DNA payload
        const updateData: any = {};

        if (typeof body.onboarded === "boolean") {
            updateData.onboarded = body.onboarded;
        }

        if (body.profession) {
            updateData.profession = body.profession;
        }

        if (body.targetLocation) {
            updateData.targetLocation = body.targetLocation;
        }

        if (Array.isArray(body.skillsInventory)) {
            // Prisma Json type accepts arrays natively in Prisma Client
            updateData.skillsInventory = body.skillsInventory;
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Profile Update Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
