// Simulation of Indeed Open API / Job Library
// In production, this would fetch from a standardized job taxonomy API

export const JOB_LIBRARY_SERVICE = {
    searchTitles: async (query: string): Promise<string[]> => {
        // Mock database of standardized titles
        const allTitles = [
            "Agricultural Engineer",
            "Agronomist",
            "Blockchain Developer",
            "Civil Engineer",
            "Community Manager",
            "Data Scientist",
            "Electrical Engineer",
            "Financial Analyst",
            "Geologist",
            "Investment Banker",
            "Logistics Coordinator",
            "Marine Biologist",
            "Mining Engineer",
            "Nurse Practitioner",
            "Petroleum Engineer",
            "Project Manager",
            "Renewable Energy Specialist",
            "Software Engineer",
            "Solar Technician",
            "Supply Chain Manager",
            "Teacher",
            "Urban Planner",
            "Veterinarian",
            "Water Resource Manager",
            "Web Developer"
        ];

        if (!query) return [];

        return allTitles.filter(title =>
            title.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
    },

    isValidTitle: (title: string): boolean => {
        // simple validation, in real world would check against full DB
        return title.length > 2;
    }
};
