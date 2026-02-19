export const TAXONOMY = {
    // Prompt 32: Primary Sector Skills (Agriculture & Mining)
    PRIMARY_SECTOR_SKILLS: [
        "Soil Agronomy", "Geological Surveying", "Crop Rotation Planning", "Irrigation Systems Management",
        "Open-Pit Mining Operations", "Mineral Exploration", "Hydrogeology", "Agricultural Engineering",
        "Livestock Management", "Sustainable Forestry", "Aquaculture", "Permaculture Design",
        "Seismic Data Analysis", "Drilling Operations", "Mine Safety Compliance", "Heavy Machinery Operation",
        "Seed Genetics", "Pest Control Management", "Organic Farming Certification", "Land Surveying",
        "Water Resource Management", "Blasting & Explosives", "Gemology", "Metallurgical Assaying",
        "Farm Mechanization", "Agroforestry", "Soil Conservation", "Remote Sensing (GIS)",
        "Harvest Logistics", "Grain Storage Management", "Vegetation Mapping", "Environmental Impact Assessment",
        "Subsurface Mapping", "Geochemical Analysis", "Reforestation", "Fisheries Management",
        "Poultry Science", "Veterinary Medicine (Large Animal)", "Beekeeping (Apiculture)", "Horticulture",
        "Vineyard Management", "Cocoa Production", "Coffee Agronomy", "Rubber Tapping Logistics",
        "Palm Oil Processing", "Solar Irrigation", "Biofuel Production", "Composting Systems",
        "Underground Mining", "Quarry Management"
    ],

    // Prompt 31: Secondary Sector Skills (Manufacturing)
    SECONDARY_SECTOR_SKILLS: [
        "CNC Machining", "Textile Weaving", "Chemical Processing", "Injection Molding",
        "Welding & Fabrication", "Industrial Automation", "Supply Chain Optimization", "Quality Control (QA/QC)",
        "Lean Manufacturing", "CAD/CAM Design", "3D Printing / Additive Mfg", "Food Processing Technology",
        "Assembly Line Management", "Robotics Engineering", "Electrical Systems Installation", "HVAC Manufacturing",
        "Leather Tanning", "Garment Pattern Making", "Packaging Design", "Beverage Bottling",
        "Pharmaceutical Formulation", "Steel Smelting", "Aluminum Extrusion", "Ceramic Production",
        "Furniture Joinery", "Automotive Assembly", "Circuit Board (PCB) Assembly", "Solar Panel Fab",
        "Battery Technology", "Plastic Recycling Processes", "Industrial Fermentation", "Precision Grinding",
        "Laser Cutting", "Metal Casting", "Die Casting", "Hydraulic Systems",
        "Pneumatic Systems", "Process Engineering", "Inventory Management (JIT)", "Production Scheduling",
        "Maintenance Reliability", "Boiler Operations", "Water Treatment (Industrial)", "Textile Dyeing",
        "Footwear Manufacturing", "Paper & Pulp Processing", "Glass Blowing/Molding", "Cement Production",
        "Brick Manufacturing", "Modular Construction"
    ],

    // Prompt 34: Mining Industry Keywords
    MINING_KEYWORDS: [
        "Gold", "Lithium", "Rights Acquisition", "Exploration License", "Coltan",
        "Cobalt", "Bauxite", "Rare Earth Elements", "Small-Scale Mining (ASM)", "Joint Venture",
        "Concession", "Feasibility Study", "Environmental Permit", "Copper", "Diamond",
        "Platinum Group Metals", "Tailings Management", "Refining", "Off-take Agreement", "Sovereign Wealth"
    ],

    // Prompt 38: Tertiary Sector Service Categories (Diaspora Focused)
    TERTIARY_SERVICE_CATEGORIES: [
        "Remittance Banking", "Medical Tourism", "Cultural Education", "Repatriation Logistics",
        "Legal Counsel (Land/Property)", "Diaspora Investment Funds", "Ancestral Tourism", "Genealogy Services",
        "Remote Healthcare (Telemedicine)", "Pan-African Media/Streaming", "Cross-Border Fintech", "Import/Export Compliance",
        "Real Estate Development", "Virtual Education / E-Learning", "Hospitality & Eco-Tourism", "Tech Outsourcing (BPO)",
        "Renewable Energy Consulting", "Agri-Business Consulting", "Art & Artifact Curation", "Language Translation Services"
    ],

    // Prompt 40: Non-Profit Request Template
    NON_PROFIT_TEMPLATE: {
        fields: [
            { name: "Problem to Solve", type: "textarea", placeholder: "What specific issue is this project addressing?" },
            { name: "Beneficiaries", type: "text", placeholder: "Who will directly benefit?" },
            { name: "Resources Needed", type: "tags", placeholder: "Funds, Skills, Equipment, etc." },
            { name: "Impact Metric", type: "text", placeholder: "How will you measure success?" },
            { name: "Timeline", type: "text", placeholder: "Estimated duration of the project." }
        ]
    },



    // Phase 3 Retrofit Industries
    // Phase 3: Sector Classification
    INDUSTRIES: {
        PRIMARY: [
            { id: "AGRICULTURE", label: "Agriculture", icon: "Wheat" },
            { id: "MINING", label: "Mining", icon: "Pickaxe" },
            { id: "FISHING", label: "Fishing", icon: "Fish" },
            { id: "FORESTRY", label: "Forestry", icon: "TreePine" },
            { id: "OIL_GAS", label: "Oil & Gas", icon: "Flame" }
        ],
        SECONDARY: [
            { id: "MANUFACTURING", label: "Manufacturing", icon: "Factory" },
            { id: "CONSTRUCTION", label: "Construction", icon: "HardHat" },
            { id: "ENERGY_PRODUCTION", label: "Energy Production", icon: "Zap" },
            { id: "TEXTILES", label: "Textiles", icon: "Shirt" }
        ],
        TERTIARY: [
            { id: "EDUCATION", label: "Education", icon: "GraduationCap" },
            { id: "HEALTHCARE", label: "Healthcare", icon: "Stethoscope" },
            { id: "FINANCE", label: "Finance", icon: "Landmark" },
            { id: "TOURISM", label: "Tourism/Hospitality", icon: "Plane" }
        ],
        QUATERNARY: [
            { id: "IT_TECH", label: "IT/Tech", icon: "Cpu" },
            { id: "RESEARCH", label: "Research", icon: "Microscope" },
            { id: "CONSULTANCY", label: "Consultancy", icon: "Briefcase" },
            { id: "MEDIA", label: "Media", icon: "Clapperboard" }
        ]
    },

    // Prompt 25: Standardized Lists
    CAREERS: [
        "Software Engineer", "Civil Engineer", "Mining Engineer",
        "Agronomist", "Veterinarian", "Nurse", "Doctor", "Surgeon",
        "Architect", "Accountant", "Financial Analyst", "Teacher",
        "Professor", "Researcher", "Data Scientist", "Product Manager",
        "Project Manager", "Electrician", "Plumber", "Mechanic",
        "Pilot", "Geologist", "Surveyor", "Legal Counsel"
    ],
    SKILLS: [
        "Trauma Surgery", "Pediatrics", "Emergency Care",
        "React", "Node.js", "Python", "Irrigation Systems",
        "Soil Analysis", "Gold Assaying", "Heavy Machinery",
        "Structural Analysis", "CAD Design", "Financial Modeling",
        "Grant Writing", "Public Speaking", "Curriculum Design",
        "Hydrogeology", "Seismic Interpretation"
    ]
};
