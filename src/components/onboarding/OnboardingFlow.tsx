"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Bell, User, Globe, Heart } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Welcome to Coopertunity",
        description: "Where Africans find purpose, solutions, and each other.",
        icon: <Globe className="w-24 h-24 text-peach-fuzz" />,
        bgGradient: "from-peach-fuzz/20 to-cloud-dancer",
    },
    {
        id: 2,
        title: "Connect & Grow",
        description: "Join a thriving community of innovators and changemakers across the diaspora.",
        icon: <User className="w-24 h-24 text-pan-green" />,
        bgGradient: "from-pan-green/10 to-cloud-dancer",
    },
    {
        id: 3,
        title: "Stay Updated",
        description: "Enable notifications to never miss an opportunity or connection.",
        icon: <Bell className="w-24 h-24 text-pan-gold" />,
        bgGradient: "from-pan-gold/20 to-cloud-dancer",
    },
];

export default function OnboardingFlow() {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.push("/dashboard");
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <div className="fixed inset-0 overflow-hidden flex flex-col bg-cloud-dancer">
            <div className="flex-1 relative">
                <AnimatePresence initial={false} custom={currentStep}>
                    <motion.div
                        key={currentStep}
                        custom={currentStep}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br ${steps[currentStep].bgGradient}`}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-12 p-8 bg-white/50 backdrop-blur-sm rounded-full shadow-xl border border-white/20"
                        >
                            {steps[currentStep].icon}
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-4xl md:text-5xl font-heading font-black text-deep-brown mb-6"
                        >
                            {steps[currentStep].title}
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg md:text-xl text-deep-brown/80 font-medium max-w-md leading-relaxed"
                        >
                            {steps[currentStep].description}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="p-8 z-10 bg-white/10 backdrop-blur-md pb-12">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                        ? "w-8 bg-deep-brown"
                                        : "w-2 bg-deep-brown/20"
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="group flex items-center gap-2 bg-deep-brown text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                    >
                        {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                        {currentStep === steps.length - 1 ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        )}
                    </button>
                </div>
                {currentStep > 0 && (
                    <button
                        onClick={handleBack}
                        className="absolute left-8 bottom-12 text-sm text-deep-brown/50 hover:text-deep-brown font-bold"
                    >
                        Back
                    </button>
                )}
            </div>
        </div>
    );
}
