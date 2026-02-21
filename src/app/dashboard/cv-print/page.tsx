import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CVPrintClient from "./CVPrintClient";

export default async function CVPrintPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            email: true,
            profession: true,
            location: true,
            skillsInventory: true,
            isVeteran: true,
            isAfrican: true,
            sector: true
        }
    });

    if (!user) {
        redirect("/dashboard");
    }

    return <CVPrintClient user={user} />;
}
