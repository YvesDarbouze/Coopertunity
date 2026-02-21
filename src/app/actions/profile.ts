"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- Basic Info ---

export async function updateProfileInfo(data: {
    name?: string;
    location?: string;
    profession?: string;
    isVeteran?: boolean;
    willingnessToTeach?: boolean;
    residenceStatus?: string;
    sector?: "PRIMARY" | "SECONDARY" | "TERTIARY" | "QUATERNARY" | null;
    subSectors?: string[];
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: data.name,
                location: data.location,
                profession: data.profession,
                isVeteran: data.isVeteran,
                willingnessToTeach: data.willingnessToTeach,
                residenceStatus: data.residenceStatus,
                sector: data.sector,
                subSectors: data.subSectors
            }
        });
        revalidatePath("/profile");
        return { success: true, message: "Profile updated" };
    } catch (e) {
        return { success: false, message: "Failed to update profile" };
    }
}

// --- Skills ---

export async function updateSkills(skills: string[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    try {
        // Storing as JSON array in existing 'skillsInventory' field
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                skillsInventory: skills
            }
        });
        revalidatePath("/profile");
        return { success: true, message: "Skills updated" };
    } catch (e) {
        return { success: false, message: "Failed to update skills" };
    }
}

// --- Work Experience ---

export async function addWorkExperience(data: {
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, message: "User not found" };

    try {
        await prisma.workExperience.create({
            data: {
                userId: user.id,
                ...data
            }
        });
        revalidatePath("/profile");
        return { success: true, message: "Experience added" };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to add experience" };
    }
}

export async function deleteWorkExperience(id: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    // Verify ownership
    const exp = await prisma.workExperience.findUnique({ where: { id } });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!exp || !user || exp.userId !== user.id) {
        return { success: false, message: "Unauthorized" };
    }

    await prisma.workExperience.delete({ where: { id } });
    revalidatePath("/profile");
    return { success: true, message: "Experience deleted" };
}

// --- Education ---

export async function addEducation(data: {
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: Date;
    endDate?: Date;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { success: false, message: "User not found" };

    try {
        await prisma.education.create({
            data: {
                userId: user.id,
                ...data
            }
        });
        revalidatePath("/profile");
        return { success: true, message: "Education added" };
    } catch (e) {
        return { success: false, message: "Failed to add education" };
    }
}

export async function deleteEducation(id: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    const edu = await prisma.education.findUnique({ where: { id } });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!edu || !user || edu.userId !== user.id) {
        return { success: false, message: "Unauthorized" };
    }

    await prisma.education.delete({ where: { id } });
    revalidatePath("/profile");
    return { success: true, message: "Education deleted" };
}
