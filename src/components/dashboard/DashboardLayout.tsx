"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Briefcase, Users, FileText, Menu, X, Settings, LogOut, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const SidebarItem = ({
    icon: Icon,
    label,
    href,
    isActive,
}: {
    icon: any;
    label: string;
    href: string;
    isActive?: boolean;
}) => (
    <Link
        href={href}
        className={cn(
            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
            isActive
                ? "bg-pan-gold text-pan-black font-medium"
                : "text-gray-300 hover:bg-pan-black hover:text-white"
        )}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </Link>
);

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cloud-dancer flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-pan-deep-brown text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Logo / Brand */}
                    <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                        <h1 className="text-2xl font-heading font-bold text-pan-gold">
                            Coopertunity
                        </h1>
                        <button
                            className="lg:hidden text-gray-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <SidebarItem
                            icon={LayoutDashboard}
                            label="Dashboard"
                            href="/dashboard"
                            isActive={true}
                        />
                        <SidebarItem
                            icon={Briefcase}
                            label="Coopertunities"
                            href="/dashboard/coopertunities"
                        />
                        <SidebarItem
                            icon={Users}
                            label="My Network"
                            href="/dashboard/network"
                        />
                        <SidebarItem
                            icon={FileText}
                            label="Applications"
                            href="/dashboard/applications"
                        />
                        <SidebarItem
                            icon={MessageCircle}
                            label="Inbox"
                            href="/dashboard/inbox"
                        />
                    </nav>

                    {/* Footer Actions */}
                    <div className="px-4 py-4 border-t border-gray-700 space-y-1">
                        <div className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2 px-4">Account Settings</div>
                        <SidebarItem
                            icon={Settings}
                            label="Profile details"
                            href="/dashboard/settings/profile"
                        />
                        <SidebarItem
                            icon={Settings}
                            label="Trust & Verification"
                            href="/dashboard/settings/verification"
                        />
                        <SidebarItem
                            icon={Settings}
                            label="Privacy & Visibility"
                            href="/dashboard/settings/privacy"
                        />
                        <div className="pt-4 mt-2 border-t border-gray-700">
                            <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-pan-red/20 hover:text-pan-red transition-colors">
                                <LogOut className="w-5 h-5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-pan-deep-brown"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-heading font-bold text-lg text-pan-deep-brown">
                        Dashboard
                    </span>
                    <div className="w-6" /> {/* Spacer for centering */}
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
