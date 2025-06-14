'use client';
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function CounterPage() {
    const [count, setCount] = useState(0);
    const [skipped, setSkipped] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastCounter, setLastCounter] = useState<number | null>(null);

    // 🔁 Sync count to backend every time it changes
    useEffect(() => {
        const syncCount = async () => {
            try {
                await fetch(`${API_BASE_URL}/api/counter/increment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ count }),
                });
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Failed to sync counter.');
            }
        };

        syncCount();
    }, [count]);

    const handleIncrement = () => {
        // if lastCounter is set, that mean current count is from skipped
        if (lastCounter) {
            //reset the count to last number
            setCount(lastCounter + 1);
            setLastCounter(null);
        } else {
            setCount(prev => prev + 1);
        }
    }

    const handleSkip = () => {
        setSkipped(prev => [...prev, count]);
        setCount(prev => prev + 1);
    };

    const handleReset = () => {
        setCount(0);
        setSkipped([]);
    };

    const handleCallSkipped = (index: number) => {
        const newSkipped = [...skipped];
        const called = newSkipped.splice(index, 1)[0];
        alert(`Calling skipped number: ${called}`);
        setLastCounter(count); // save the last counter before calling skipped
        setCount(called);
        setSkipped(newSkipped);
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-blue-50 p-4 flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-indigo-700 mt-4">Counter Dashboard</h1>

            {/* Display */}
            <div className="text-6xl font-bold text-indigo-800 drop-shadow">{count}</div>

            {/* SVG Triangle Button */}
            <button onClick={handleIncrement} className="w-40 h-40 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <polygon
                        points="50,0 0,100 100,100"
                        fill="#4f46e5"
                        className="transition-all hover:fill-indigo-700"
                    />
                    <text
                        x="50%"
                        y="65%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="40"
                        fill="white"
                        fontWeight="bold"
                    >
                        +
                    </text>
                </svg>
            </button>

            {/* Buttons */}
            <div className="flex gap-4 mt-4 flex-wrap justify-center">
                <button
                    onClick={handleSkip}
                    className="bg-yellow-400 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-500 transition"
                >
                    Skip
                </button>
                <button
                    onClick={handleReset}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition"
                >
                    Reset
                </button>
            </div>

            {/* Skipped */}
            {skipped.length > 0 && (
                <div className="w-full max-w-md bg-white rounded-xl shadow p-4 space-y-2">
                    <h2 className="text-xl font-semibold text-gray-700">Skipped List</h2>
                    <ul className="divide-y divide-gray-200">
                        {skipped.map((num, index) => (
                            <li key={index} className="flex justify-between items-center py-2">
                                <span className="text-gray-800">#{num}</span>
                                <button
                                    onClick={() => handleCallSkipped(index)}
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Call
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-md">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-4 text-xs font-bold underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </main>
    );
}
