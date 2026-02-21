import WizardForm from "@/components/coopertunity/WizardForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreateCoopertunityPage() {
    const session = await getServerSession(authOptions);

    // Observer Shield: Observers cannot post or create deals
    if (session?.user?.isAfrican === false) {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-start pt-20 p-4 pb-32">
            <WizardForm />
        </main>
    );
}
