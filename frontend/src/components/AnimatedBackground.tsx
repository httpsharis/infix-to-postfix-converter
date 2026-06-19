'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function AnimatedBackground({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen bg-black overflow-hidden selection:bg-blue-500/30">
            {/* Top Left Glowing Orb */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/40 blur-[120px] pointer-events-none z-0"
            />
            
            {/* Bottom Right Glowing Orb */}
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-900/30 blur-[120px] pointer-events-none z-0"
            />

            {/* Application Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}