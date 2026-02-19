
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { suggestion } = await req.json();
        // Prompt 44: Suggest a Category
        // In reality, this would save to a database for Admin review
        console.log(`[CATEGORY SUGGESTION] ${suggestion}`);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ _error: "Failed to submit suggestion" }, { status: 500 });
    }
}
