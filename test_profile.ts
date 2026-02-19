
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Testing Profile Updates...");

    // 1. Get a user
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log("No user found.");
        return;
    }
    console.log(`Testing with user: ${user.email}`);

    // 2. Add Work Experience
    const work = await prisma.workExperience.create({
        data: {
            userId: user.id,
            title: "Software Engineer",
            company: "Tech Corp",
            startDate: new Date("2020-01-01"),
            current: true,
            description: "Building cool stuff."
        }
    });
    console.log("Added Work Experience:", work.id);

    // 3. Add Education
    const edu = await prisma.education.create({
        data: {
            userId: user.id,
            school: "University of Life",
            degree: "Bachelor of Science",
            startDate: new Date("2016-01-01"),
            endDate: new Date("2020-01-01")
        }
    });
    console.log("Added Education:", edu.id);

    // 4. Verify Fetch
    const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { workHistory: true, education: true }
    });

    console.log("Work History Count:", updatedUser?.workHistory.length);
    console.log("Education Count:", updatedUser?.education.length);

    // Clean up
    await prisma.workExperience.delete({ where: { id: work.id } });
    await prisma.education.delete({ where: { id: edu.id } });
    console.log("Cleaned up test data.");
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
