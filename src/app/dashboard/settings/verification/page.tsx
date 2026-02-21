import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VerificationClient from "./VerificationClient";

export default async function VerificationPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            isVerified: true
        }
    });

    if (!user) {
        redirect("/auth/signin");
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8">
            <h1 className="text-3xl font-heading font-black text-deep-brown mb-2">Trust & Safety</h1>
            <p className="text-gray-600 mb-8 border-b pb-4">Manage your identity verification to build trust in the Pan-African economy.</p>

            <VerificationClient isCurrentlyVerified={user.isVerified} />
        </div>
    );
}
