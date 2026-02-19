import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            pan: {
                black: "#3D3935", // Pantone Black 7 C (Primary Text/Borders)
                gold: "#FFD700",
                green: "#00FF94",
                red: "#FF4545",
                charcoal: "#3D3935", // Mapping to Pantone Black for consistency
                terracotta: "#E2725B",
                earth: "#8B4513",
            },
            "cloud-dancer": "#F0EEE9", // Paper-like Off-White (Background)
            "mocha-mousse": "#A0A0A0",
            "peach-fuzz": "#FFBE98", // Highlight/Accent (Hover states)
            "deep-brown": "#3D3935",   // Primary Text
            "soft-gray": "#3D3935",    // Borders
            "pure-white": "#FFFFFF",   // Surface Card Backgrounds

            // New Premium Accents (Keep for gradients but prioritize Pantone)
            "electric-purple": "#7B61FF",
            "action-blue": "#2D7FF9",
            "glass-white": "rgba(255, 255, 255, 0.4)", // Adjusted for light mode
            "glass-black": "rgba(61, 57, 53, 0.1)",   // Light mode shadow/glass

            sector: {
                earth: "#CD853F",
                industry: "#A9A9A9",
                service: "#87CEEB",
                knowledge: "#BE93E4",
            }
        },
        fontFamily: {
            heading: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
            body: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        },
    },
    plugins: [],
};
export default config;
