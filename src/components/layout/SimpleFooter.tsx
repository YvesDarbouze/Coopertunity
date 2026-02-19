import Link from "next/link";

export default function SimpleFooter() {
    return (
        <footer className="w-full py-12 px-4 bg-white border-t border-gray-100">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-deep-brown font-black font-heading text-xl tracking-tight">
                    COOPERTUNITY
                </div>

                <div className="flex gap-8 text-sm font-bold text-zinc-400">
                    <Link href="#" className="hover:text-deep-brown transition">About</Link>
                    <Link href="#" className="hover:text-deep-brown transition">Contact</Link>
                    <Link href="#" className="hover:text-deep-brown transition">Privacy</Link>
                </div>

                <div className="text-xs text-zinc-300 font-medium">
                    © {new Date().getFullYear()} Coopertunity Inc.
                </div>
            </div>
        </footer>
    );
}
