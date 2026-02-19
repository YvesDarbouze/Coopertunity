"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function sendConnectionRequest(targetUserId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, message: "Not authenticated" };
    }

    const sender = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!sender) {
        return { success: false, message: "User not found" };
    }

    if (sender.id === targetUserId) {
        return { success: false, message: "Cannot connect with yourself" };
    }

    // Check if request already exists
    const existingRequest = await prisma.connectionRequest.findFirst({
        where: {
            OR: [
                { senderId: sender.id, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: sender.id }
            ]
        }
    });

    if (existingRequest) {
        return { success: false, message: "Connection request already exists" };
    }

    try {
        await prisma.connectionRequest.create({
            data: {
                senderId: sender.id,
                receiverId: targetUserId,
                status: "PENDING"
            }
        });

        revalidatePath("/dashboard/matches");
        revalidatePath(`/profile/${targetUserId}`);
        return { success: true, message: "Request sent" };
    } catch (error) {
        console.error("Error sending connection request:", error);
        return { success: false, message: "Failed to send request" };
    }
}

export async function getConnectionStatus(targetUserId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { status: "Please Sign In" };
    }

    const sender = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!sender) return { status: "Error" };

    if (sender.id === targetUserId) return { status: "You" };

    const request = await prisma.connectionRequest.findFirst({
        where: {
            OR: [
                { senderId: sender.id, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: sender.id }
            ]
        }
    });

    if (!request) return { status: "Connect" };

    if (request.status === "PENDING") {
        return request.senderId === sender.id ? { status: "Pending" } : { status: "Accept" };
    }

    return { status: request.status }; // ACCEPTED, REJECTED
}
