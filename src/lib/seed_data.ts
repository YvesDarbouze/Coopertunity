import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GOLD_STANDARD_PROJECTS = [
    {
        title: "Solar Farm in Namibia",
        description: "A 50MW solar PV plant project seeking equity partners and technical consultants. We have secured 100 hectares of land near Windhoek and completed the preliminary environmental impact assessment. Looking for partners with experience in arid climate solar installations.",
        type: "PROJECT",
        sector: "SECONDARY",
        subSector: "Zap", // Energy
        location: "Windhoek, Namibia",
        keywords: ["Solar", "Renewable Energy", "Infrastructure", "Investment", "Namibia", "Green Tech", "Sustainability", "Power", "Grid", "Development", "Equity", "Partnership"],
        matchScore: 98,
        authorName: "Kofi Mensah",
        authorImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        title: "Tech Hub in Lagos",
        description: "Establishing a state-of-the-art co-working and incubation space for fintech startups in Yaba. We need mentors, angel investors, and a lead architect to design a sustainable workspace.",
        type: "PROJECT",
        sector: "QUATERNARY",
        subSector: "Cpu", // Tech
        location: "Lagos, Nigeria",
        keywords: ["Tech", "Incubator", "Fintech", "Startups", "Lagos", "Nigeria", "Innovation", "Hub", "Mentorship", "Co-working", "Investment", "Architecture"],
        matchScore: 95,
        authorName: "Amara Okeke",
        authorImage: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        title: "Organic Cocoa Export Cooperative",
        description: "Connecting smallholder cocoa farmers in Ghana directly to premium chocolate makers in Europe and the US. Seeking logistics experts and fair trade certification consultants.",
        type: "DEAL",
        sector: "PRIMARY",
        subSector: "Sprout", // Agriculture
        location: "Kumasi, Ghana",
        keywords: ["Cocoa", "Agriculture", "Export", "Fair Trade", "Ghana", "Logistics", "Supply Chain", "Organic", "Farming", "Trade", "Cooperative", "Chocolate"],
        matchScore: 92,
        authorName: "Kwame Nkrumah Jr.",
        authorImage: "https://randomuser.me/api/portraits/men/11.jpg"
    },
    {
        title: "Pan-African Telemedicine Platform",
        description: "Scaling a telemedicine app that connects rural patients with urban specialists. We are looking for a CTO with healthcare experience and Series A funding.",
        type: "PROJECT",
        sector: "TERTIARY",
        subSector: "Stethoscope", // Health
        location: "Nairobi, Kenya",
        keywords: ["HealthTech", "Telemedicine", "Kenya", "Healthcare", "App", "Scale-up", "CTO", "Investment", "Medical", "Digital Health", "Access", "Pan-African"],
        matchScore: 89,
        authorName: "Wangari Maathai II",
        authorImage: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
        title: "Sustainable Housing Development",
        description: "A 200-unit eco-friendly housing development in Kigali using locally sourced materials. Seeking a structural engineer and green building certification expert.",
        type: "PROJECT",
        sector: "SECONDARY",
        subSector: "Home", // Construction/Real Estate - mapped loosely
        location: "Kigali, Rwanda",
        keywords: ["Housing", "Real Estate", "Sustainable", "Construction", "Kigali", "Rwanda", "Green Building", "Urban Planning", "Engineering", "Development", "Eco-friendly", "Architecture"],
        matchScore: 94,
        authorName: "Jean-Pierre Ndayishimiye",
        authorImage: "https://randomuser.me/api/portraits/men/55.jpg"
    }
];

async function main() {
    console.log("Seeding Gold Standard Projects...");

    // Create a dummy user for these projects if not exists
    const seedUser = await prisma.user.upsert({
        where: { email: "featured@coopertunity.africa" },
        update: {},
        create: {
            email: "featured@coopertunity.africa",
            name: "Coopertunity Featured",
            image: "https://github.com/shadcn.png",
            location: "Pan-African",
            isAfrican: true
        }
    });


    // Create specific Diaspora Users for Testing

    // 1. Diaspora Dave: Civil Engineer in NY, wants to go to Accra. Not an Investor.
    const diasporaDave = await prisma.user.upsert({
        where: { email: "dave.diaspora@example.com" },
        update: {},
        create: {
            email: "dave.diaspora@example.com",
            name: "Diaspora Dave",
            image: "https://randomuser.me/api/portraits/men/1.jpg",
            location: "New York, USA",
            targetLocation: "Accra, Ghana",
            profession: "Civil Engineer",
            isAfrican: true,
            isVeteran: false,
            isInvestor: false,
            willingnessToTeach: true,
            skillsInventory: ["Engineering", "Project Management"]
        }
    });

    // 2. Investor Ivy: Capital allocator in London, wants to go to Lagos.
    const investorIvy = await prisma.user.upsert({
        where: { email: "ivy.investor@example.com" },
        update: {},
        create: {
            email: "ivy.investor@example.com",
            name: "Investor Ivy",
            image: "https://randomuser.me/api/portraits/women/2.jpg",
            location: "London, UK",
            targetLocation: "Lagos, Nigeria",
            profession: "Investment Banker",
            isAfrican: true,
            isVeteran: false,
            isInvestor: true,
            investmentRange: "growth",
            willingnessToTeach: false,
            skillsInventory: ["Finance", "Due Diligence"]
        }
    });

    // 3. Veteran Vic: Logistics expert in DC, wants to go to Windhoek.
    const veteranVic = await prisma.user.upsert({
        where: { email: "vic.veteran@example.com" },
        update: {},
        create: {
            email: "vic.veteran@example.com",
            name: "Veteran Vic",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            location: "Washington DC, USA",
            targetLocation: "Windhoek, Namibia",
            profession: "Logistics Manager",
            isAfrican: true,
            isVeteran: true,
            isInvestor: false,
            willingnessToTeach: true,
            skillsInventory: ["Logistics", "Security"]
        }
    });

    for (const project of GOLD_STANDARD_PROJECTS) {
        await prisma.coopertunity.create({
            data: {
                title: project.title,
                description: project.description,
                type: project.type as any,
                sector: project.sector as any,
                subSector: project.subSector,
                location: project.location,
                keywords: project.keywords,
                authorId: seedUser.id,
                status: "OPEN",
                // Ensure specific fields match for testing
                willingnessToTeach: false,
                investmentAmount: project.type === "DEAL" || project.type === "LAND_DEAL" ? 50000 : 0
            }
        });
    }

    console.log("Seeding complete! Created Diaspora Dave, Investor Ivy, Veteran Vic.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
