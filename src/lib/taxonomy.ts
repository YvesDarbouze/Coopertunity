import { EconomicSector } from "@prisma/client";

// Simulation of Financial Modeling Prep API for SIC Codes
// In production, this would fetch from https://financialmodelingprep.com/api/v3/sic_search
export const TAXONOMY_SERVICE = {
    getSicCode: async (keyword: string): Promise<string> => {
        // Mock mapping
        const mockDb: Record<string, string> = {
            "Agriculture": "0100",
            "Mining": "1000",
            "Construction": "1500",
            "Manufacturing": "2000",
            "Transportation": "4000",
            "Wholesale": "5000",
            "Retail": "5200",
            "Finance": "6000",
            "Services": "7000",
            "Technology": "7370",
            "Public Administration": "9100",
        };

        // Simple fuzzy match simulation
        const match = Object.keys(mockDb).find(k =>
            keyword.toLowerCase().includes(k.toLowerCase()) ||
            k.toLowerCase().includes(keyword.toLowerCase())
        );

        return match ? mockDb[match] : "9999"; // Non-classifiable
    },

    mapToSector: (sicCode: string): EconomicSector => {
        const code = parseInt(sicCode);

        if (code < 1500) return "PRIMARY"; // Agriculture, Forestry, Fishing, Mining
        if (code < 4000) return "SECONDARY"; // Construction, Manufacturing
        if (code < 8000) return "TERTIARY"; // Transportation, Wholesale, Retail, Finance, Services
        return "QUATERNARY"; // Public Admin, Non-classifiable (often Knowledge/Gov)
    }
};
