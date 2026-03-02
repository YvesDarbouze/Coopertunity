import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F0EEE9] flex flex-col items-center justify-center p-6 text-center text-[#3D3935]">
            <h1 className="text-4xl md:text-6xl font-black font-heading mb-4 tracking-tight">
                This path is uncharted.
            </h1>
            <p className="text-lg md:text-xl font-medium mb-8 max-w-lg opacity-80">
                The Coopertunity you are looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/dashboard/explore"
                className="bg-[#3D3935] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-lg"
            >
                Return to the Feed
            </Link>
        </div>
    );
}
