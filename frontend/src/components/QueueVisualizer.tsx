'use client';

interface QueueVisualizerProps {
    postfixString: string;
}

export default function QueueVisualizer({ postfixString }: QueueVisualizerProps) {
    if (!postfixString) return null;

    // Split the space-separated string from the C++ engine back into an array
    const tokens = postfixString.split(' ');

    return (
        <div className="w-full space-y-2">
            <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2">
                Output Queue (Postfix)
            </h3>
            
            <div className="flex flex-wrap gap-2 p-4 bg-gray-900 rounded-lg border border-gray-800 min-h-20 items-center">
                {tokens.map((token, index) => (
                    <div 
                        key={index}
                        className="px-4 py-2 bg-blue-900/50 border border-blue-500 text-blue-100 font-mono text-lg rounded shadow-sm animate-pulse-once"
                    >
                        {token}
                    </div>
                ))}
            </div>
        </div>
    );
}