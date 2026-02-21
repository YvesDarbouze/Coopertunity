import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileEditor from "@/components/profile/ProfileEditor";

export const dynamic = 'force-dynamic';

export default async function ProfileSettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            workHistory: {
                orderBy: { startDate: 'desc' }
            },
            education: {
                orderBy: { startDate: 'desc' }
            }
        }
    });

    if (!user) return <div>User not found</div>;

    // Transform data to match client props if necessary
    // Prisma returns Date objects, which verify nicely locally but ensure no JSON serialization issues if strict.
    // Client components can take Date objects in Next.js App Router props.

    return (
        <main className="min-h-screen bg-cloud-dancer pb-20">
            <div className="bg-cloud-dancer border-b border-pan-black/10 px-8 py-12">
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-pan-black tracking-tight mb-2 font-heading">
                            Edit Profile
                        </h1>
                        <p className="text-pan-black/60 font-medium">
                            Update your professional DNA and define your role in the Pan-African economy.
                        </p>
                    </div>

                    {/* Data Export Action */}
                    <a
                        href="/dashboard/cv-print"
                        target="_blank"
                        className="flex items-center gap-2 bg-pan-gold/20 text-deep-brown px-6 py-3 rounded-full font-bold hover:bg-pan-gold hover:text-white transition-all shrink-0 w-fit"
                    >
                        <i data-lucide="download" className="w-5 h-5"></i>
                        Download My CV
                    </a>
                </div>
            </div>

            <div className="mt-8 px-4">
                <ProfileEditor
                    user={{
                        name: user.name,
                        location: user.location,
                        profession: user.profession,
                        skillsInventory: (user.skillsInventory as string[]) || [],
                        isVeteran: user.isVeteran,
                        willingnessToTeach: user.willingnessToTeach,
                        residenceStatus: user.residenceStatus || "UNKNOWN",
                        sector: user.sector,
                        subSectors: user.subSectors || []
                    }}
                    workHistory={user.workHistory}
                    education={user.education}
                />
            </div>
        </main>
    );
}
