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

        // Expanded to handle full onboarding DNA payload and Duty Flags
        const updateData: any = {};

        // Final Publish hook: if onboarded is true, ingest draft data
        if (typeof body.onboarded === "boolean") {
            updateData.onboarded = body.onboarded;

            if (body.onboarded === true) {
                // Fetch the temporary draft box
                const draft = await prisma.userDraft.findUnique({
                    where: { userId: session.user.id }
                });

                if (draft) {
                    // Combine names, overwrite main location, overwrite image
                    const fName = draft.firstName || "";
                    const lName = draft.lastName || "";
                    updateData.name = `${fName} ${lName}`.trim() || undefined;
                    updateData.location = draft.location;
                    updateData.image = draft.avatarUrl;
                }
            }
        }

        // DNA Fields
        if (body.profession !== undefined) updateData.profession = body.profession;
        if (body.targetLocation !== undefined) updateData.targetLocation = body.targetLocation;
        if (Array.isArray(body.skillsInventory)) updateData.skillsInventory = body.skillsInventory;

        // Duty Flags
        if (typeof body.willingnessToTeach === "boolean") updateData.willingnessToTeach = body.willingnessToTeach;
        if (typeof body.isInvestor === "boolean") updateData.isInvestor = body.isInvestor;
        if (body.investmentRange !== undefined) updateData.investmentRange = body.investmentRange;
        if (typeof body.isVeteran === "boolean") updateData.isVeteran = body.isVeteran;

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
