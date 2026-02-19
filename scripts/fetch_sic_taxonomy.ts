import { writeFile } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Financial Modeling Prep API URL
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
const API_KEY = process.env.FMP_API_KEY;

// Coopertunity Taxonomy: 4 Economic Sectors
enum EconomicSector {
    PRIMARY = 'PRIMARY',       // Extraction: Agriculture, Mining, Fishing
    SECONDARY = 'SECONDARY',   // Manufacturing: Construction, Processing, Utilities
    TERTIARY = 'TERTIARY',     // Services: Retail, Transport, Hospitality, Finance
    QUATERNARY = 'QUATERNARY', // Knowledge: IT, R&D, Consulting, Education
}

// Mapping Logic (SIC Code Ranges to Sectors)
// SIC Codes are 4-digit. Range Mapping based on OSHA/SEC standard groupings.
function mapSicToSector(sicCode: string): EconomicSector {
    const code = parseInt(sicCode, 10);

    // A: Agriculture, Forestry, Fishing (0100-0999)
    if (code >= 100 && code <= 999) return EconomicSector.PRIMARY;

    // B: Mining (1000-1499)
    if (code >= 1000 && code <= 1499) return EconomicSector.PRIMARY;

    // C: Construction (1500-1799)
    if (code >= 1500 && code <= 1799) return EconomicSector.SECONDARY;

    // D: Manufacturing (2000-3999)
    if (code >= 2000 && code <= 3999) return EconomicSector.SECONDARY;

    // E: Transportation, Communications, Electric, Gas, Sanitary Services (4000-4999)
    if (code >= 4000 && code <= 4999) return EconomicSector.TERTIARY;

    // F: Wholesale Trade (5000-5199)
    if (code >= 5000 && code <= 5199) return EconomicSector.TERTIARY;

    // G: Retail Trade (5200-5999)
    if (code >= 5200 && code <= 5999) return EconomicSector.TERTIARY;

    // H: Finance, Insurance, Real Estate (6000-6799)
    if (code >= 6000 && code <= 6799) return EconomicSector.TERTIARY;

    // I: Services (7000-8999)
    // Parsing sub-sectors for Quaternary distinction
    if (code >= 7370 && code <= 7379) return EconomicSector.QUATERNARY; // Computer Programming, Data
    if (code >= 8200 && code <= 8299) return EconomicSector.QUATERNARY; // Educational Services
    if (code >= 8700 && code <= 8799) return EconomicSector.QUATERNARY; // Engineering, Accounting, Research, Management

    if (code >= 7000 && code <= 8999) return EconomicSector.TERTIARY; // General Services (Hotels, Auto Repair, etc.)

    // J: Public Administration (9100-9729)
    if (code >= 9100 && code <= 9729) return EconomicSector.TERTIARY;

    // K: Nonclassifiable (9900-9999)
    return EconomicSector.TERTIARY; // Default fallback
}

interface FMPProfile {
    symbol: string;
    companyName: string;
    sicCode: string;
    industry: string;
    sector: string;
}

async function fetchAndMapTaxonomy() {
    if (!API_KEY) {
        console.error('Error: FMP_API_KEY is not set in .env');
        return;
    }

    try {
        console.log('Fetching stock list to gather industry data...');
        // Fetching a list of symbols to get coverage (using a subset or stock screener if needed for all sectors)
        // For this script, we'll try to fetch a stock list which contains SIC codes if available, or fetch profiles.
        // FMP "Stock List" endpoint usually fits: /stock-screener?limit=1000

        // Note: Fetching ALL SIC codes directly is better if endpoint exists, but usually we map from companies or use a standard list.
        // We will simulate fetching a representative list of companies to build our Taxonomy Tree.

        const response = await fetch(`${FMP_BASE_URL}/stock-screener?limit=500&apikey=${API_KEY}`);
        const data: FMPProfile[] = await response.json();

        const taxonomyMap = new Map<string, { sector: EconomicSector, industries: Set<string> }>();

        data.forEach(company => {
            if (company.sicCode) {
                const sector = mapSicToSector(company.sicCode);

                if (!taxonomyMap.has(company.sicCode)) {
                    taxonomyMap.set(company.sicCode, { sector, industries: new Set() });
                }

                if (company.industry) {
                    taxonomyMap.get(company.sicCode)?.industries.add(company.industry);
                }
            }
        });

        // Transform map to output JSON
        const output = Array.from(taxonomyMap.entries()).map(([sicCode, details]) => ({
            sicCode,
            sector: details.sector,
            industries: Array.from(details.industries)
        }));

        const outputPath = path.join(process.cwd(), 'docs/taxonomy_mapping.json');
        await writeFile(outputPath, JSON.stringify(output, null, 2));

        console.log(`Successfully mapped ${output.length} SIC categories to Coopertunity Sectors.`);
        console.log(`Saved to ${outputPath}`);

    } catch (error) {
        console.error('Failed to fetch or map data:', error);
    }
}

fetchAndMapTaxonomy();
