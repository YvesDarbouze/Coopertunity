import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/users/settings
// Unified endpoint for managing Trust & Safety and Privacy toggles
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        // Whitelist exactly what fields users are allowed to patch via this endpoint
        const updateData: any = {};

        if (typeof body.isVerified === "boolean") {
            updateData.isVerified = body.isVerified;
        }

        if (typeof body.stealthMode === "boolean") {
            updateData.stealthMode = body.stealthMode;
        }

        if (typeof body.locationPrivacy === "string") {
            const validOptions = ["EXACT", "CITY", "COUNTRY", "HIDDEN"];
            if (validOptions.includes(body.locationPrivacy)) {
                updateData.locationPrivacy = body.locationPrivacy;
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                isVerified: true,
                stealthMode: true,
                locationPrivacy: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Settings Update Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
