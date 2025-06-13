'use client';
import { useState, useEffect, useCallback } from 'react';

export interface User {
    username: string;
    password?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export default function AdminPage() {
    const [users, setUsers] = useState<Record<string, User>>({});
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [editingUsername, setEditingUsername] = useState<string | null>(null);
    const [editedUsernameValue, setEditedUsernameValue] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/list`, { credentials: 'include' });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername || !newPassword) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });

            if (!res.ok) throw new Error(await res.text());

            setNewUsername('');
            setNewPassword('');
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-blue-50 p-6">
            <h1 className="text-4xl font-bold text-indigo-700 drop-shadow-sm text-center mb-10">
                Admin Dashboard
            </h1>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <input
                        type="text"
                        placeholder="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="flex-1 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-1 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition shadow"
                    >
                        Submit
                    </button>
                </form>

                {/* User Table */}
                <div>
                    {loading ? (
                        <p className="text-center text-indigo-600 font-medium">Loading...</p>
                    ) : (
                        <table className="w-full table-auto border-collapse border border-gray-200">
                            <thead className="bg-indigo-50">
                                <tr>
                                    <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Username</th>
                                    <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(users).map((user) => (
                                    <tr key={user.username} className="hover:bg-indigo-50 transition">
                                        <td className="border px-4 py-2 w-3/4 text-gray-800">{user.username}</td>
                                        <td className="border px-4 w-1/4">
                                            <button className="text-sm text-blue-600 hover:underline mr-4">Edit</button>
                                            <button className="text-sm text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:none" 
                                             disabled={user.username == "admin"}>Delete</button>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}
