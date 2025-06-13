"use client";

import { useEffect, useState } from "react";
import AdminPage from "./admin";

export default function DashboardPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const role = sessionStorage.getItem("RoleInfo");
        setIsAdmin(role === "admin");
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-6">
                    <p className="text-xl text-center text-gray-500">Loading dashboard...</p>
                </div>
            </main>
        );
    }

    if (isAdmin) {
        return <AdminPage />;
    } else {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-6">
                    <h1 className="text-2xl font-bold text-center text-indigo-600">Dashboard</h1>
                    <p className="text-sm text-gray-600 text-center">This is a placeholder for the dashboard content.</p>
                    <button>Test</button>
                </div>
            </main>
        );
    }
}