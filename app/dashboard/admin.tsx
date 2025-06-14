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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/list`, { credentials: 'include' });
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    async function createCounter(){
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
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message);
        }
    }

    async function updateCounter(){
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ old_username: editingUsername, new_username: newUsername, password: newPassword }),
            });

            if (!res.ok) throw new Error(await res.text());

            setEditingUsername(null);
            setNewUsername('');
            setNewPassword('');
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername || !newPassword) return;

        // check if editing or creating
        if (editingUsername) {
            await updateCounter();
        } else {
            await createCounter();
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-blue-50 p-6">
            <h1 className="text-4xl font-bold text-indigo-700 drop-shadow-sm text-center mb-10">
                Admin Dashboard
            </h1>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Wrap p in a div to control its behavior in flex */}
                    <div className="sm:flex-none">
                        <p className="text-lg font-medium text-gray-700 sm:text-sm">Add/Edit counter</p>
                    </div>
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
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition shadow sm:flex-none"
                    >
                        Submit
                    </button>
                </form>
                {errorMessage && (
                    <div className='flex justify-between items-center px-4 py-2 bg-red-100 border border-red-200 rounded-md'>
                        <p className="text-sm text-red-700">{errorMessage}</p>
                        <button onClick={() => setErrorMessage(null)} className="text-xs text-red-600 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Dismiss 
                        </button>
                    </div>
                )}
                {/* User Table */}
                <div>
                {loading ? (
                    <p className="text-center text-indigo-600 font-medium">Loading...</p>
                ) : (
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Username</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Password</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(users).map((user) => (
                                <tr key={user.username} className="hover:bg-indigo-50 transition">
                                    <td className="border px-4 py-2 w-2/4 text-gray-800">{user.username}</td>
                                    <td className="border px-4 py-2 w-1/4 text-gray-800">
                                        {user.username !== "admin" ? user.password : "************"}
                                    </td>
                                    <td className="border px-4 w-1/4">
                                        {user.username === "admin" ? (
                                            <div className="relative inline-block group">
                                                <button
                                                    className={
                                                        "text-sm mr-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline" +
                                                        (editingUsername === user.username ? " text-red-600" : " text-blue-600")
                                                    }
                                                    disabled={true} 
                                                    
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="text-sm text-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                                                    disabled={true} 
                                                >
                                                    Delete
                                                </button>

                                                {/* --- Tooltip --- */}
                                                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 
                                                                absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2
                                                                px-3 py-2 text-xs text-white bg-gray-700 rounded-lg shadow-sm whitespace-nowrap
                                                                transition-opacity duration-300">
                                                    Admin cannot be changed from here, refer to manual for more info.
                                                   
                                                    <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 
                                                                    border-x-8 border-x-transparent border-t-8 border-t-gray-700"></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    className={
                                                        "text-sm hover:underline mr-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline" +
                                                        (editingUsername === user.username ? " text-red-600" : " text-blue-600")
                                                    }
                                                    onClick={() => {
                                                        if (editingUsername === user.username) {
                                                            setEditingUsername(null);
                                                            setNewUsername('');
                                                            setNewPassword('');
                                                        } else {
                                                            setEditingUsername(user.username);
                                                            setNewUsername(user.username);
                                                            setNewPassword(user.password!);
                                                        }
                                                    }}
                                                >
                                                    {editingUsername === user.username ? " Cancel" : " Edit"}
                                                </button>

                                                <button className="text-sm text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline">
                                                    Delete
                                                </button>
                                            </>
                                        )}
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
