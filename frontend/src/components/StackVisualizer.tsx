'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface StepState {
    currentToken: string;
    stackSnapshot: string[];
    queueSnapshot: string[];
    actionDescription: string;
}

interface StackVisualizerProps {
    history: StepState[];
    infix: string;
    postfix: string;
    result: number;
}

// Helper to colorize tokens like a code editor
const Token = ({ value }: { value: string }) => {
    let colorStyle = "text-teal-400 bg-teal-400/10 border-teal-400/20"; // Numbers
    if (['+', '-', '*', '/', '^'].includes(value)) {
        colorStyle = "text-amber-500 bg-amber-500/10 border-amber-500/20"; // Operators
    } else if (['(', ')'].includes(value)) {
        colorStyle = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"; // Parens
    }

    return (
        <span className={`px-3 py-1.5 rounded-md font-mono text-sm border ${colorStyle}`}>
            {value}
        </span>
    );
};

// Helper to categorize the action log
const ActionBadge = ({ action }: { action: string }) => {
    let badge = { text: "INFO", style: "bg-gray-800 text-gray-400" };
    if (action.toLowerCase().includes("push")) badge = { text: "PUSH", style: "bg-[#7c6aff]/20 text-[#7c6aff] border-[#7c6aff]/30" };
    if (action.toLowerCase().includes("pop")) badge = { text: "POP", style: "bg-rose-500/20 text-rose-400 border-rose-500/30" };
    if (action.toLowerCase().includes("queue")) badge = { text: "OUT", style: "bg-teal-500/20 text-teal-400 border-teal-500/30" };
    if (action.toLowerCase().includes("end")) badge = { text: "END", style: "bg-gray-800 text-gray-400 border-gray-700" };

    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border tracking-wider ${badge.style}`}>
            {badge.text}
        </span>
    );
};

export default function StackVisualizer({ history, infix, postfix, result }: StackVisualizerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => {
                    if (prev + 1 >= history.length - 1) {
                        setIsPlaying(false);
                        return history.length - 1;
                    }
                    return prev + 1;
                });
            }, 800);
        }
        return () => clearInterval(interval);
    }, [isPlaying, history.length]);

    if (!history || history.length === 0) return null;

    const step = history[currentIndex];
    const progress = ((currentIndex + 1) / history.length) * 100;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 text-gray-300">
            
            {/* Top Row: Results & Final State */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 bg-[#15171e] border border-[#2b2d36] rounded-xl p-6 shadow-2xl">
                    <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">Evaluated Result</h3>
                    <div className="text-5xl font-mono font-bold text-teal-400">{result}</div>
                </div>
                
                <div className="col-span-1 md:col-span-2 bg-[#15171e] border border-[#2b2d36] rounded-xl p-6 shadow-2xl">
                    <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">Final Postfix</h3>
                    <div className="flex flex-wrap gap-2">
                        {postfix.split(' ').map((t, i) => (
                            <Token key={i} value={t} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Row: Execution Controls & Log */}
            <div className="bg-[#15171e] border border-[#2b2d36] rounded-xl shadow-2xl overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Algorithm Execution</h2>
                        <p className="text-sm text-gray-500 font-mono mt-1">Step {currentIndex + 1} of {history.length}</p>
                    </div>
                    
                    <div className="flex gap-2 bg-[#0d0f14] p-1 rounded-lg border border-[#2b2d36]">
                        <button 
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                            className="px-4 py-2 hover:bg-[#2b2d36] disabled:opacity-30 rounded-md transition-colors"
                        >
                            ◀
                        </button>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="px-8 py-2 bg-[#2b2d36] hover:bg-[#3b3d46] text-white font-semibold rounded-md transition-colors min-w-[100px]"
                        >
                            {isPlaying ? 'Pause' : 'Play ▶'}
                        </button>
                        <button 
                            onClick={() => setCurrentIndex(Math.min(history.length - 1, currentIndex + 1))}
                            disabled={currentIndex === history.length - 1}
                            className="px-4 py-2 hover:bg-[#2b2d36] disabled:opacity-30 rounded-md transition-colors"
                        >
                            ▶
                        </button>
                    </div>
                </div>

                {/* Thin Animated Progress Bar */}
                <div className="w-full h-[2px] bg-[#2b2d36]">
                    <motion.div 
                        className="h-full bg-[#7c6aff]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.3 }}
                    />
                </div>

                {/* Action Log */}
                <div className="p-4 bg-[#11131a] flex items-center gap-4 border-t border-[#2b2d36]">
                    <ActionBadge action={step.actionDescription} />
                    <span className="font-mono text-sm text-gray-300">
                        {step.actionDescription}
                    </span>
                    {step.currentToken && step.currentToken !== "END" && (
                        <div className="ml-auto">
                            <span className="text-xs text-gray-600 mr-2 uppercase">Token:</span>
                            <Token value={step.currentToken} />
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Row: Data Structures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Stack (Vertical visual) */}
                <div className="bg-[#15171e] border border-[#2b2d36] rounded-xl p-6 shadow-2xl flex flex-col h-64">
                    <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">Operator Stack</h3>
                    <div className="flex-1 border-b-2 border-l-2 border-[#2b2d36] rounded-bl-lg bg-[#0d0f14] p-4 flex flex-col-reverse justify-start items-center gap-2 overflow-y-auto">
                        {step.stackSnapshot.length === 0 ? (
                            <span className="text-gray-600 font-mono text-sm italic my-auto">empty</span>
                        ) : (
                            step.stackSnapshot.map((item, i) => (
                                <motion.div key={`${currentIndex}-${i}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                    <Token value={item} />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Queue (Horizontal visual) */}
                <div className="bg-[#15171e] border border-[#2b2d36] rounded-xl p-6 shadow-2xl flex flex-col h-64">
                    <h3 className="text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">Output Queue</h3>
                    <div className="flex-1 border-b-2 border-[#2b2d36] bg-[#0d0f14] p-4 flex flex-wrap content-start gap-2 overflow-y-auto">
                        {step.queueSnapshot.length === 0 ? (
                            <span className="text-gray-600 font-mono text-sm italic m-auto">empty</span>
                        ) : (
                            step.queueSnapshot.map((item, i) => (
                                <motion.div key={`q-${i}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                    <Token value={item} />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}