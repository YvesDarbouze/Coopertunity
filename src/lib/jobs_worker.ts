import { prisma } from "@/lib/prisma";

// This is a simulated background worker.
// in a real app, this would be a CRON job or a separate service.

export async function fetchJobsWorker() {
    console.log("[JOBS_WORKER] Starting job fetch...");

    // Mock Data mimicking Indeed/Google Jobs API response
    const mockJobs = [
        {
            title: "Agricultural Manager",
            company: "GreenFields Ghana",
            location: "Accra, Ghana",
            description: "Oversee large-scale cocoa production.",
            url: "https://indeed.com/mock-job-1",
            source: "Indeed"
        },
        {
            title: "Solar Engineer",
            company: "SunPower Kenya",
            location: "Nairobi, Kenya",
            description: "Design and implement solar grid systems.",
            url: "https://google.com/jobs/mock-job-2",
            source: "Google Jobs"
        },
        {
            title: "Fintech Product Owner",
            company: "PayStack",
            location: "Lagos, Nigeria",
            description: "Lead product development for payment solutions.",
            url: "https://indeed.com/mock-job-3",
            source: "Indeed"
        }
    ];

    let count = 0;

    for (const job of mockJobs) {
        // Check if job exists to avoid duplicates
        const existing = await prisma.jobListing.findFirst({
            where: {
                title: job.title,
                company: job.company
            }
        });

        if (!existing) {
            await prisma.jobListing.create({
                data: {
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    description: job.description,
                    url: job.url,
                    source: job.source,
                    postedAt: new Date()
                }
            });
            count++;
        }
    }

    console.log(`[JOBS_WORKER] Finished. Added ${count} new jobs.`);
    return count;
}
