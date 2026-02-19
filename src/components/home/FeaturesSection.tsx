import { Users, Briefcase, TrendingUp } from "lucide-react";

const features = [
    {
        icon: <Users className="w-8 h-8 text-pan-gold" />,
        title: "Network",
        description: "Connect with a global community of professionals, diasporans, and local experts dedicated to African growth."
    },
    {
        icon: <Briefcase className="w-8 h-8 text-pan-green" />,
        title: "Opportunity",
        description: "Discover curated contracts, jobs, and partnership opportunities across 54 nations."
    },
    {
        icon: <TrendingUp className="w-8 h-8 text-pan-earth" />,
        title: "Impact",
        description: "Deploy capital and skills where they matter most. Track your contribution to the continent's development."
    }
];

export default function FeaturesSection() {
    return (
        <section className="w-full py-24 px-4 bg-cloud-dancer">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4 bg-gray-50 rounded-full mb-2">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-deep-brown font-heading">{feature.title}</h3>
                            <p className="text-zinc-500 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
