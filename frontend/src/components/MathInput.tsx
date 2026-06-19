'use client';

import { useState, FormEvent } from 'react';

interface MathInputProps {
    onEvaluate: (expression: string) => void;
    isLoading: boolean;
}

export default function MathInput({ onEvaluate, isLoading }: MathInputProps) {
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            onEvaluate(input.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
            <div className="flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., 3 + 5 * ( 2 - 1 )"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                    {isLoading ? 'Compiling...' : 'Evaluate'}
                </button>
            </div>
        </form>
    );
}