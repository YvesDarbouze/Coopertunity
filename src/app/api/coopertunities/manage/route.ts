import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Fetch all Coopertunities authored by this user, including their matches (applications)
        const myCoopertunities = await prisma.coopertunity.findMany({
            where: {
                authorId: user.id
            },
            include: {
                matches: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profession: true,
                                location: true,
                                image: true,
                                skillsInventory: true
                            }
                        }
                    },
                    orderBy: {
                        score: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(myCoopertunities);
    } catch (error) {
        console.error("Error fetching managed coopertunities:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
