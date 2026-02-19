import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request) {
    try {
        // Fetch Top 3 Projects (Logic: most views or random high quality for MVP)
        const topProjects = await prisma.coopertunity.findMany({
            where: { type: "PROJECT" },
            take: 3,
            orderBy: { createdAt: "desc" }, // Should be views/likes in real app
            include: { author: true }
        });

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: 'Georgia', serif; color: #333;">
                <h1 style="color: #D4AF37; text-align: center;">Your Weekly Bridge Home</h1>
                <p style="text-align: center;">Discover the top Coopertunities this week.</p>
                
                ${topProjects.map(p => `
                    <div style="border: 1px solid #ddd; padding: 20px; margin: 20px auto; max-width: 600px; border-radius: 8px;">
                        <h2 style="color: #006B3C;">${p.title}</h2>
                        <p><strong>By ${p.author.name}</strong> • ${p.location || "Pan-African"}</p>
                        <p>${p.description.substring(0, 150)}...</p>
                        <a href="https://coopertunity.africa/coopertunity/${p.id}" style="color: #D4AF37; text-decoration: none; font-weight: bold;">View Project &rarr;</a>
                    </div>
                `).join('')}
                
                <footer style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
                    &copy; 2026 Coopertunity. Building the bridge.
                </footer>
            </body>
            </html>
        `;

        return new NextResponse(emailHtml, {
            headers: { "Content-Type": "text/html" }
        });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
