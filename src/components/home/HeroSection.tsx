import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="w-full flex flex-col items-center justify-center py-32 px-4 text-center bg-white">
            <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-5xl md:text-7xl font-black text-deep-brown tracking-tight font-heading leading-[1.1]">
                    Where Africans Find Solutions, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pan-gold to-pan-earth">And Each Other.</span>
                </h1>

                <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    Access the network, capital, and opportunities you need to build the future of the continent.
                </p>

                <div className="pt-4">
                    <Link href="/onboarding" className="inline-flex items-center gap-2 bg-deep-brown text-white font-bold py-4 px-8 rounded-full hover:bg-zinc-800 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                        <span className="uppercase tracking-widest text-sm">Join the Network</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
