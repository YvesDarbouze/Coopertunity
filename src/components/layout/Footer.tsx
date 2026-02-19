export default function Footer() {
    return (
        <footer className="w-full bg-deep-brown py-8 border-t border-mocha-mousse/20 text-cloud-dancer/60 text-sm">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="font-heading font-bold text-peach-fuzz">COOPERTUNITY</div>
                <div className="flex gap-6">
                    <a href="/about" className="hover:text-peach-fuzz transition">About</a>
                    <a href="/terms" className="hover:text-peach-fuzz transition">Terms</a>
                    <a href="/privacy" className="hover:text-peach-fuzz transition">Privacy</a>
                    <a href="/contact" className="hover:text-peach-fuzz transition">Contact</a>
                </div>
                <div>&copy; {new Date().getFullYear()}</div>
            </div>
        </footer>
    );
}
