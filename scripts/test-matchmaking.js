
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Only run this script if you have the new schema applied
async function main() {
    console.log("Creating test users and coopertunities for matchmaking...");

    try {
        // 1. Create a "Plumber" user - matching Secondary Sector
        const plumber = await prisma.user.create({
            data: {
                email: `plumber-${Date.now()}@test.com`,
                name: "Kwame Plumber",
                targetLocation: "Accra",
                sector: "SECONDARY", // Construction
                skillsInventory: ["Plumbing", "Pipe Fitting"],
                willingnessToTeach: true,
            }
        });

        // 2. Create a "Plumbing Project" coopertunity
        const project = await prisma.coopertunity.create({
            data: {
                title: "Large Scale Housing Project",
                description: "Need plumbing leadership for 50 unit complex.",
                type: "PROJECT",
                sector: "SECONDARY",
                location: "Accra, Ghana",
                authorId: plumber.id, // Self-authored for simplicity, usually different
                requiredSkills: ["Plumbing", "Leadership"],
                willingnessToTeach: true,
            }
        });

        // 3. Calculate Match Score (Simulating the logic from matchmaking.ts)
        // We can't import the TS library directly in this JS script easily without strict setup, 
        // so we'll implement a lightweight version here or call the API if running server.
        // For this script, we'll verify the data exists and calculating effectively "by eye".

        console.log("User Created:", plumber.id);
        console.log("Project Created:", project.id);
        console.log("Expected Match Factors:");
        console.log("- Sector: SECONDARY == SECONDARY (+0.4)");
        console.log("- Location: Accra matches Accra (+0.3)");
        console.log("- Skills: Plumbing matches Plumbing (+0.1)");
        console.log("- Role: Willingness to Teach both true (+0.1)");
        console.log("Expected Score: ~0.9");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
