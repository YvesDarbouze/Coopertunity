import Badge from "@/components/ui/Badge";
import { User } from "lucide-react";

interface VeteranProfileProps {
    user: any; // Ideally typed with Prisma User
}

export default function VeteranProfileView({ user }: VeteranProfileProps) {
    return (
        <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            {/* Header with Veteran Flag */}
            <div className="flex items-start justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-emerald-100 shadow-inner">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-black text-deep-brown">{user.name}</h1>
                        <p className="text-mocha-mousse font-body text-lg mb-2">{user.profession || "Professional"}</p>
                        <div className="flex gap-2">
                            {user.isVeteran && <Badge type="VETERAN" size="md" label="Former Soldier" />}
                            {user.isAfrican && <Badge type="INVESTOR" size="md" label="African Descent" />} // reusing investor style for simplicity or create customized ID badge
                        </div>
                    </div>
                </div>
            </div>

            {/* Military Specifics */}
            {user.isVeteran && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 mb-8">
                    <h3 className="text-emerald-800 font-heading font-bold text-xl mb-4 flex items-center gap-2">
                        Military Service Record
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-emerald-900 font-bold text-sm uppercase mb-2">Specialized Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {/* Mock skills for now, would come from JSONB */}
                                <span className="px-3 py-1 bg-white text-emerald-800 border border-emerald-100 rounded-full text-xs font-bold">Logistic Support</span>
                                <span className="px-3 py-1 bg-white text-emerald-800 border border-emerald-100 rounded-full text-xs font-bold">Emergency Medicine</span>
                                <span className="px-3 py-1 bg-white text-emerald-800 border border-emerald-100 rounded-full text-xs font-bold">Strategic Planning</span>
                            </div>
                        </div>

                        {/* Willingness to Join Pan-African Military */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-pan-gold rounded-xl shadow-md text-deep-brown">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-deep-brown font-bold text-sm uppercase mb-1">Pan-African Defense</h4>
                                <p className="text-mocha-mousse text-sm font-medium">
                                    Indicated willingness to participate in continental defense initiatives.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* General Bio */}
            <div className="prose prose-stone max-w-none">
                <p className="text-mocha-mousse font-body text-lg leading-relaxed">
                    {user.bio || "No biography provided yet."}
                </p>
            </div>

        </div>
    );
}

// Helper icon
function Shield({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    )
}
