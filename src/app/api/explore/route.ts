import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { EconomicSector, Prisma } from "@prisma/client";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) return new NextResponse("User not found", { status: 404 });

        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const type = searchParams.get('type') || 'POSTS'; // 'POSTS' | 'USERS'
        const sector = searchParams.get('sector') as EconomicSector | null;
        const location = searchParams.get('location');

        // ------------- POSTS SEARCH -------------
        if (type === 'POSTS') {
            const whereClause: Prisma.CoopertunityWhereInput = {
                status: "OPEN"
            };

            if (sector) {
                whereClause.sector = sector;
            }

            if (location) {
                whereClause.location = {
                    contains: location,
                    mode: 'insensitive'
                };
            }

            if (q) {
                whereClause.OR = [
                    { title: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { keywords: { has: q } },
                    { requiredSkills: { has: q } }
                ];
            } else if (!q && !sector && !location && currentUser.sector) {
                // "For You" Fallback for Posts
                whereClause.sector = currentUser.sector;
                // We could also mix in targetLocation here
            }

            const posts = await prisma.coopertunity.findMany({
                where: whereClause,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            profession: true,
                            isVeteran: true,
                            location: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 50 // Limit results
            });

            return NextResponse.json({ results: posts, type: 'POSTS' });
        }

        // ------------- USERS SEARCH -------------
        if (type === 'USERS') {
            const whereClause: Prisma.UserWhereInput = {
                id: { not: currentUser.id }, // Don't return self
                stealthMode: false, // Exclude high-net-worth stealth individuals
                onboarded: true // Exclude incomplete drafted profiles
            };

            if (sector) {
                // If the user has a sector, match it
                whereClause.sector = sector;
            }

            if (location) {
                whereClause.location = {
                    contains: location,
                    mode: 'insensitive'
                };
            }

            if (q) {
                whereClause.OR = [
                    { name: { contains: q, mode: 'insensitive' } },
                    { profession: { contains: q, mode: 'insensitive' } },
                    // Assuming skillsInventory is JSON, searching inside JSON with Prisma string contains is limited, 
                    // but we can search titles (string[])
                    { titles: { has: q } }
                ];
            }

            const users = await prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    image: true,
                    profession: true,
                    location: true,
                    sector: true,
                    subSectors: true,
                    residenceStatus: true,
                    isVeteran: true,
                    skillsInventory: true,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 50
            });

            // If skillsInventory needs to be searched, we might need a post-filter or raw query, 
            // but for now relying on titles/profession/name is a solid MVP.

            return NextResponse.json({ results: users, type: 'USERS' });
        }

        return new NextResponse("Invalid search type", { status: 400 });

    } catch (e) {
        console.error("Explore API Error:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
