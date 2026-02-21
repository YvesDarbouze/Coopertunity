import ManagerView from "@/components/dashboard/ManagerView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Coopertunities | Manager",
    description: "Manage your active opportunities, review applicants, and track funding.",
};

export default function ManagePage() {
    return <ManagerView />;
}
