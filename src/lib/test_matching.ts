
import { calculateMatchScore } from './matching';
import { EconomicSector, CoopertunityType } from '@prisma/client';

// Mock types since we might not have full Prisma client in this standalone script context easily
// checking against the file content I saw earlier, I'll need to cast or mock these if I run it with ts-node
// But for now, let's just use the imported types if available, otherwise define minimal mocks.

const mockUser = {
    id: "user-diaspora",
    location: "New York, USA",
    targetLocation: "Accra, Ghana",
    profession: "Civil Engineer",
    skillsInventory: ["Engineering", "Urban Planning"],
    isVeteran: false,
    isInvestor: true,
    investmentRange: "growth",
    willingToTeach: true,
    willingnessToTeach: true // accommodating potential interface mismatch during dev
};

const mockOppAccra = {
    id: "opp-accra",
    type: "LAND_DEAL" as CoopertunityType,
    sector: "CONSTRUCTION" as EconomicSector,
    location: "Accra, Ghana",
    willingnessToTeach: false,
    expertiseNeeded: ["Investment"]
};

const mockOppNY = {
    id: "opp-ny",
    type: "SKILLS_REQUEST" as CoopertunityType,
    sector: "TECHNOLOGY" as EconomicSector,
    location: "New York, USA",
    willingnessToTeach: false,
    expertiseNeeded: ["Engineering"]
};

console.log("--- Starting Matching Test ---");

// Test 1: Location Matching (Target vs Current)
const scoreAccra = calculateMatchScore(mockUser as any, mockOppAccra as any);
const scoreNY = calculateMatchScore(mockUser as any, mockOppNY as any);

console.log(`Score for Accra Opportunity (Target Location): ${scoreAccra}`);
console.log(`Score for NY Opportunity (Current Location): ${scoreNY}`);

if (scoreAccra > scoreNY) {
    console.log("PASS: Target location scored higher (or equal if logic adjusted).");
} else {
    console.log("FAIL/INFO: Local location scored higher. (Expected before fix)");
}

// Test 2: Investor Matching
const investorScore = calculateMatchScore({ ...mockUser, isInvestor: true } as any, { ...mockOppAccra, type: "LAND_DEAL" } as any);
const nonInvestorScore = calculateMatchScore({ ...mockUser, isInvestor: false } as any, { ...mockOppAccra, type: "LAND_DEAL" } as any);

console.log(`Investor Score for Land Deal: ${investorScore}`);
console.log(`Non-Investor Score for Land Deal: ${nonInvestorScore}`);

if (investorScore > nonInvestorScore) {
    console.log("PASS: Investor status boosted score.");
} else {
    console.log("FAIL/INFO: Investor status did not boost score. (Expected before fix)");
}
