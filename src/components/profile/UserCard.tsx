import { MapPin, Shield, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface UserCardProps {
    user: any; // Typing strictly would be better with Prisma types
    onClick?: () => void;
}

export default function UserCard({ user, onClick }: UserCardProps) {
    return (
        <div onClick={onClick} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-peach-fuzz transition duration-300 h-full flex flex-col shadow-sm hover:shadow-lg cursor-pointer">
            <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm relative">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-deep-brown/50">
                            {user.name?.charAt(0)}
                        </div>
                    )}
                </div>
                {/* Prompt 33: Verified Badge Logic */}
                <div className="flex gap-1">
                    {user.isVeteran && <Shield className="text-pan-gold w-5 h-5" />}
                    {user.isVerified && <CheckCircle className="text-pan-green w-5 h-5 fill-current" />}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-heading font-black text-deep-brown mb-1">{user.name}</h3>

                {/* Prompt 43: Enlisted Privacy */}
                {user.isVeteran ? (
                    <div className="bg-red-50 border border-red-100 p-2 rounded text-xs text-red-500 flex items-center gap-2 mb-2 font-bold">
                        <Shield size={12} />
                        <span>Restricted Profile (Enlisted)</span>
                    </div>
                ) : (
                    <p className="text-peach-fuzz text-sm font-bold uppercase tracking-wider mb-2">{user.profession}</p>
                )}

                <div className="flex items-center gap-2 text-mocha-mousse/80 text-sm font-medium">
                    <MapPin size={14} />
                    <span>{user.isVeteran ? "Confidential Region" : user.location || "Pan-African"}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {user.isVeteran && <Badge type="VETERAN" size="sm" />}
                {user.isAfrican && <Badge type="INVESTOR" size="sm" label="Diaspora" />}
            </div>

            {/* The original location block is removed as it's now integrated above */}
        </div>
    );
}
