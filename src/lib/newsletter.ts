
// Prompt 34: Weekly Newsletter Generator
// Top 5 "Most Viewed" Coopertunities

export interface NewsletterItem {
    id: string;
    title: string;
    description: string;
    views: number;
    link: string;
}

export function generateNewsletter(projects: any[]): string {
    // 1. Sort by Views (Mock logic assuming 'views' property exists or we randomize for now)
    const sortedProjects = [...projects]
        .map(p => ({ ...p, views: p.views || Math.floor(Math.random() * 1000) })) // Mock views if missing
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

    // 2. Generate HTML Output
    let html = `
    <html>
    <body style="font-family: sans-serif; background: #000; color: #fff; padding: 20px;">
        <h1 style="color: #FFD700; text-align: center;">COOPERTUNITY WEEKLY</h1>
        <p style="text-align: center; color: #aaa;">The pulse of the continent, delivered to you.</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        
        <div style="max-width: 600px; margin: 0 auto;">
    `;

    sortedProjects.forEach((p, i) => {
        html += `
            <div style="background: #111; border: 1px solid #333; padding: 20px; margin-bottom: 20px; border-radius: 10px;">
                <div style="color: #4ade80; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">
                    #${i + 1} Trending • ${p.sector}
                </div>
                <h2 style="margin: 0 0 10px 0; font-size: 20px;">
                    <a href="https://coopertunity.com/project/${p.id}" style="color: #fff; text-decoration: none;">${p.title}</a>
                </h2>
                <p style="color: #ccc; font-size: 14px; line-height: 1.5;">${p.description.substring(0, 120)}...</p>
                <div style="margin-top: 15px; text-align: right;">
                    <a href="https://coopertunity.com/project/${p.id}" style="color: #FFD700; text-decoration: none; font-weight: bold; font-size: 14px;">View Opportunity →</a>
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Coopertunity. Building the future together.</p>
        </div>
    </body>
    </html>
    `;

    return html;
}
