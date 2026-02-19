
// Prompt 30: Automated Matching Notifications
// This logic simulates the email notification system.

import { TAXONOMY } from "./taxonomy_data";

interface MatchEvent {
    userId: string;
    userName: string;
    userEmail: string;
    userSkills: string[];
    projectId: string;
    projectTitle: string;
    projectNeeds: string[];
    posterEmail: string;
}

export async function checkAndNotifyMatch(match: MatchEvent) {
    // 1. Identify Overlap
    const overlappingSkills = match.userSkills.filter(skill =>
        match.projectNeeds.some(need => need.toLowerCase() === skill.toLowerCase())
    );

    if (overlappingSkills.length > 0) {
        console.log(`[MATCH FOUND] ${match.userName} matched with project "${match.projectTitle}" on skills: ${overlappingSkills.join(", ")}`);

        // 2. Simulate Sending Email to User (Candidate)
        await sendEmail({
            to: match.userEmail,
            subject: `Coopertunity Match: Your skills are needed for ${match.projectTitle}`,
            body: `Hello ${match.userName},\n\nGood news! Your skill in ${overlappingSkills.join(", ")} is a direct match for the project "${match.projectTitle}".\n\nLogin to apply now.`
        });

        // 3. Simulate Sending Email to Poster (Project Owner)
        await sendEmail({
            to: match.posterEmail,
            subject: `Coopertunity Candidate Found: ${match.userName}`,
            body: `Hello,\n\nWe found a candidate, ${match.userName}, who matches your needs for "${match.projectTitle}".\n\nMatched Skills: ${overlappingSkills.join(", ")}.`
        });

        return true;
    }

    return false;
}

// Mock Email Sender
async function sendEmail(params: { to: string; subject: string; body: string }) {
    console.log("--- SIMULATED EMAIL ---");
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(`Body: ${params.body}`);
    console.log("-----------------------");
    return Promise.resolve();
}
