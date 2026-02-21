"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import HeroSearch from "@/components/home/HeroSearch";
import IntelFolderGrid from "@/components/home/IntelFolderGrid";
import FeaturesSection from "@/components/home/FeaturesSection";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Automatically route authenticated users to the dashboard
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-cloud-dancer flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pan-gold animate-spin" />
      </div>
    );
  }

  if (status === "authenticated") {
    return null; // Prevent flash of content while routing
  }

  return (
    <main className="min-h-screen bg-black overflow-x-hidden pt-20">
      {/* The Header is globally styled and absolute positioned for the dark landing theme */}
      <Header />

      <HeroSearch />
      <FeaturesSection />
      <IntelFolderGrid />

      <footer className="w-full bg-black py-12 border-t border-white/10 mt-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-heading font-black text-white tracking-widest uppercase mb-4">Coopertunity</h2>
          <p className="text-gray-400 text-sm font-medium">Empowering the Pan-African Digital Economy.</p>
        </div>
      </footer>
    </main>
  );
}
