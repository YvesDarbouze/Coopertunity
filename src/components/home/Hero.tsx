"use client";

import { motion } from "framer-motion";
import SearchBar from "@/components/ui/SearchBar";

export default function Hero() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-cloud-dancer">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/africa-network.svg')] opacity-5 bg-center bg-no-repeat bg-cover mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cloud-dancer/50 to-cloud-dancer"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-4xl mx-auto space-y-8 w-full"
            >
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-deep-brown font-heading">
                    <span className="block text-peach-fuzz drop-shadow-sm">Africa for the Africans</span>
                    <span className="block text-2xl md:text-5xl mt-4 font-light text-mocha-mousse leading-normal">
                        Where Africans find purpose, and each other.
                    </span>
                </h1>

                <p className="mt-6 max-w-2xl mx-auto text-xl text-deep-brown/80 font-medium">
                    Connect with opportunities, investments, and development projects across the continent.
                </p>

                <div className="mt-10 w-full sticky top-4 z-50">
                    <SearchBar />
                </div>

                <div className="mt-12 flex justify-center gap-4">
                    <button className="bg-deep-brown hover:bg-mocha-mousse text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Explore Coopertunities
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
