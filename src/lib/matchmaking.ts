import { User, Coopertunity, EconomicSector } from "@prisma/client";

interface MatchCandidate {
    user: User;
    coopertunity: Coopertunity;
}

export const MATCHMAKING_ENGINE = {
    calculateUtilityScore: (candidate: MatchCandidate): number => {
        const { user, coopertunity } = candidate;
        let score = 0;

        // 1. Sector Match (40%)
        // If user has a matching sector or their SIC code falls in the same range
        const userSector = (user as any).sector;
        // If user sector is not explicitly set, we could infer from profession/SIC, 
        // but assuming it's set or we skip.
        if (userSector === (coopertunity as any).sector) {
            score += 0.4;
        }

        // 2. Location Match (30%)
        // Check if user's target location matches coopertunity location
        // Simple string inclusion check for MVP
        if (coopertunity.location && user.targetLocation) {
            const target = user.targetLocation.toLowerCase();
            const oppLocation = coopertunity.location.toLowerCase();

            if (oppLocation.includes(target) || target.includes(oppLocation)) {
                score += 0.3;
            }
        }

        // 3. Skill Match (20%)
        // Overlap between User.skillsInventory and Coopertunity.requiredSkills
        // skillsInventory is Json, need to cast safely
        const userSkills = (user.skillsInventory as string[]) || [];
        const requiredSkills = (coopertunity as any).requiredSkills || [];

        if (requiredSkills.length > 0) {
            const matchCount = requiredSkills.filter((skill: string) =>
                userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()))
            ).length;

            // Calculate percentage matched, capped at 1.0 (though it contributes 0.2 to total)
            const matchRatio = Math.min(matchCount / requiredSkills.length, 1);
            score += (matchRatio * 0.2);
        }

        // 4. Role/Intent Match (10%)
        // If Coopertunity needs teaching and User is willing to teach
        if (coopertunity.willingnessToTeach && user.willingnessToTeach) {
            score += 0.1;
        }

        return parseFloat(score.toFixed(2));
    }
};
