import { EconomicSector, CoopertunityType } from "@prisma/client";

interface UserProfile {
    id: string;
    location?: string | null;
    targetLocation?: string | null; // Where they want to go
    profession?: string | null;
    skillsInventory?: any; // JSONB
    isVeteran: boolean;
    isInvestor?: boolean; // New field
    investmentRange?: string | null; // New field
    willingnessToTeach?: boolean; // Inferred from user data or not present
}

interface CoopertunityData {
    id: string;
    type: CoopertunityType;
    sector: EconomicSector;
    location?: string | null;
    willingnessToTeach: boolean;
    expertiseNeeded?: string[]; // Assuming this field exists logic-wise
}

export function calculateMatchScore(user: UserProfile, coopertunity: CoopertunityData): number {
    let score = 0;

    // 1. Skill Match (30 pts)
    // Determine real overlap between user skills and project needs
    const userSkills: string[] = Array.isArray(user.skillsInventory) ? user.skillsInventory : [];
    const neededSkills: string[] = coopertunity.expertiseNeeded || [];

    if (userSkills.length > 0 && neededSkills.length > 0) {
        // Find intersection
        const matchingSkills = userSkills.filter(skill =>
            neededSkills.some(needed => needed.toLowerCase() === skill.toLowerCase())
        );

        if (matchingSkills.length > 0) {
            // Base score for having ANY match
            score += 15;
            // Bonus for multiple matches (up to 15 more pts)
            score += Math.min(matchingSkills.length * 5, 15);
        }
    } else if (userSkills.length > 0) {
        // Fallback: If project lists no specific skills, give small credit for having a profile
        score += 5;
    }

    // 2. Location Alignment (30 pts) - Increased importance
    // Priority: Target Location > Current Location
    if (coopertunity.location) {
        const opLocation = coopertunity.location.toLowerCase();

        // Match Target Location (High Value: 30pts)
        if (user.targetLocation && opLocation.includes(user.targetLocation.toLowerCase())) {
            score += 30;
        }
        // Match Current Location (Secondary Value: 10pts)
        else if (user.location && opLocation.includes(user.location.toLowerCase())) {
            score += 10;
        }
    }


    // 3. Investor Status (20 pts)
    // High value for capital-intensive projects
    if (user.isInvestor && (coopertunity.type === "DEAL" || coopertunity.type === "LAND_DEAL")) {
        score += 20;

        // Bonus for having defined range
        if (user.investmentRange) {
            score += 5;
        }
    }

    // 4. Willingness to Teach (10 pts)
    // If it's a PROJECT needing a stakeholder/skills, and user wants to teach
    if ((coopertunity.type === "PROJECT" || coopertunity.type === "ROLE") && user.willingnessToTeach) {
        score += 10;
    }

    // 5. Veteran Status (10 pts)
    // Boost for secure/logistics roles (Often Land Deals or huge Projects)
    if (user.isVeteran && (coopertunity.type === "DEAL" || coopertunity.type === "LAND_DEAL")) {
        score += 10;
    }


    // 6. Industry Relevance (5 pts)
    // Infer sector from profession string (Mock)
    score += 5; // Baseline

    return Math.min(score, 100);
}
