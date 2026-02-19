"use client";

import HeroSearch from "@/components/home/HeroSearch";
import IntelFolderGrid from "@/components/home/IntelFolderGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <HeroSearch />
      <IntelFolderGrid />
    </main>
  );
}
