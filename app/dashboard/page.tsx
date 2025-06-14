"use client";

import { useEffect, useState } from "react";
import AdminPage from "./admin";
import CounterPage from "./counter";

export default function DashboardPage() {
    const [role, setRole] = useState("");
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const role = sessionStorage.getItem("RoleInfo");
        setRole(role || "");
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

    if (role === "admin") {
        return <AdminPage />;
    } else if (role === "counter") {
        return (
            <CounterPage />
        );
    } else {
        return (
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-6">
                <p className="text-xl text-center text-gray-500">Access Denied</p>
            </div>
        )
    }
}