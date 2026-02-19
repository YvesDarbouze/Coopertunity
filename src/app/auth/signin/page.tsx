import { Suspense } from "react";
import SignInContent from "@/components/auth/SignInContent";

export const dynamic = "force-dynamic";

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cloud-dancer flex items-center justify-center">Loading...</div>}>
            <SignInContent />
        </Suspense>
    );
}
