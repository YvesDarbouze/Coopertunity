import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Coopertunity",
    description: "Manage your Pan-African network, track opportunities, and view your active deal flow.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
