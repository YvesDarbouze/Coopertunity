"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMatchStatus(matchId: string, status: "ACCEPTED" | "REJECTED") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return { success: false, message: "User not found" };

        // Ensure the match actually belongs to a Coopertunity authored by the current user
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: { coopertunity: true }
        });

        if (!match || match.coopertunity.authorId !== user.id) {
            return { success: false, message: "Not authorized to update this match" };
        }

        await prisma.match.update({
            where: { id: matchId },
            data: { status }
        });

        revalidatePath("/dashboard/manage");
        return { success: true, message: `Applicant ${status.toLowerCase()}` };
    } catch (e) {
        console.error("Error updating match status", e);
        return { success: false, message: "Failed to update status" };
    }
}

export async function updateCoopertunityStatus(coopertunityId: string, status: "DRAFT" | "OPEN" | "IN_PROGRESS" | "CLOSED") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, message: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return { success: false, message: "User not found" };

        const coop = await prisma.coopertunity.findUnique({ where: { id: coopertunityId } });
        if (!coop || coop.authorId !== user.id) return { success: false, message: "Unauthorized" };

        await prisma.coopertunity.update({
            where: { id: coopertunityId },
            data: { status }
        });

        revalidatePath("/dashboard/manage");
        return { success: true, message: "Status updated" };
    } catch (error) {
        return { success: false, message: "Failed to update project status" };
    }
}
