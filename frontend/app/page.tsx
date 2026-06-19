"use client";

import { useState } from "react";
import MathInput from "@/components/MathInput";
import StackVisualizer, { StepState } from "@/components/StackVisualizer";

// Upgraded interface to accept the history array
interface EngineResponse {
  status: string;
  infix: string;
  postfix: string;
  result: number;
  history?: StepState[];
  message?: string;
}

export default function Home() {
  const [engineData, setEngineData] = useState<EngineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEvaluation = async (expression: string) => {
    setIsLoading(true);
    setError(null);
    setEngineData(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        throw new Error(data.message || "Evaluation failed");
      }

      setEngineData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during evaluation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Compiler Engine Visualizer
          </h1>
          <p className="text-gray-400">
            Infix to Postfix Lexical Analyzer & Evaluator
          </p>
        </div>

        <MathInput onEvaluate={handleEvaluation} isLoading={isLoading} />

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-center font-mono">
            Error: {error}
          </div>
        )}

        {engineData && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Results Header */}
            <div className="flex justify-between items-center p-6 bg-gray-900 border border-gray-800 rounded-lg shadow-xl">
              <div>
                <h2 className="text-sm text-gray-400 uppercase tracking-wider">
                  Evaluated Result
                </h2>
                <div className="text-4xl font-bold text-green-400">
                  {engineData.result}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-sm text-gray-400 uppercase tracking-wider">
                  Final Postfix
                </h2>
                <div className="text-xl font-mono text-gray-300">
                  {engineData.postfix}
                </div>
              </div>
            </div>

            {/* The Telemetry Visualizer */}
            {engineData.history && (
              <StackVisualizer
                history={engineData.history}
                infix={engineData.infix}
                postfix={engineData.postfix}
                result={engineData.result}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
