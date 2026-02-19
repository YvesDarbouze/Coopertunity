
const { calculateMatchScore } = require('./matching');

// Mock user
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
    willingnessToTeach: true
};

// Mock opportunities
const mockOppAccra = {
    id: "opp-accra",
    type: "LAND_DEAL",
    sector: "CONSTRUCTION",
    location: "Accra, Ghana",
    willingnessToTeach: false,
    expertiseNeeded: ["Investment"]
};

const mockOppNY = {
    id: "opp-ny",
    type: "SKILLS_REQUEST",
    sector: "TECHNOLOGY",
    location: "New York, USA",
    willingnessToTeach: false,
    expertiseNeeded: ["Engineering"]
};

console.log("--- Starting Matching Test ---");

// Test 1: Location Matching (Target vs Current)
// Note: Types are stripped so this assumes the function handles missing properties gracefully or we mock enough.
const scoreAccra = calculateMatchScore(mockUser, mockOppAccra);
const scoreNY = calculateMatchScore(mockUser, mockOppNY);

console.log(`Score for Accra Opportunity (Target Location): ${scoreAccra}`);
console.log(`Score for NY Opportunity (Current Location): ${scoreNY}`);

if (scoreAccra > scoreNY) {
    console.log("PASS: Target location scored higher.");
} else {
    console.log("FAIL/INFO: Local location scored higher (or equal).");
}

// Test 2: Investor Matching
// We manually toggle isInvestor to see if it makes a difference
const investorScore = calculateMatchScore({ ...mockUser, isInvestor: true }, { ...mockOppAccra, type: "LAND_DEAL" });
const nonInvestorScore = calculateMatchScore({ ...mockUser, isInvestor: false }, { ...mockOppAccra, type: "LAND_DEAL" });

console.log(`Investor Score for Land Deal: ${investorScore}`);
console.log(`Non-Investor Score for Land Deal: ${nonInvestorScore}`);

if (investorScore > nonInvestorScore) {
    console.log("PASS: Investor status boosted score.");
} else {
    console.log("FAIL/INFO: Investor status did not boost score.");
}
