import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PrivacyClient from "./PrivacyClient";

export default async function PrivacyPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            stealthMode: true,
            locationPrivacy: true
        }
    });

    if (!user) {
        redirect("/auth/signin");
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8">
            <h1 className="text-3xl font-heading font-black text-deep-brown mb-2">Privacy & Visibility</h1>
            <p className="text-gray-600 mb-8 border-b pb-4">Control how your profile and location are displayed to the Pan-African network.</p>

            <PrivacyClient
                initialStealth={user.stealthMode}
                initialLocationPrivacy={user.locationPrivacy}
            />
        </div>
    );
}
