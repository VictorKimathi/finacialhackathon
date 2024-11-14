"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../provider/auth-provider'; // Assuming this provides the token

const Profile = () => {
    const { getToken } = useAuth();  // Getting token from the auth provider
    const [user, setUser] = useState(null); // State to hold user data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // State to hold error messages

    const onLogout = () => {
        // Logic for logging out (e.g., clearing the token, redirecting to login)
        console.log("Logging out...");
        // Clear token and navigate to login page if using routing (e.g., React Router)
        // Example: localStorage.removeItem('authToken');
        // window.location.href = '/login';
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/profileview', {
                    headers: {
                        "Authorization": `Token ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                });
                setUser(response.data); // Set the user data in state
                setLoading(false); // Stop loading
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Error loading user profile. Please try again later.');
                setLoading(false); // Stop loading in case of error
            }
        };

        fetchUserProfile();
    }, [getToken]); // Run effect when component mounts (getToken is stable)

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
                {error}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
                Error loading user profile.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="max-w-sm w-full rounded-lg shadow-md p-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                    <img
                        src={user.avatar || "/default-avatar.png"}  // Fallback to default avatar if no avatar
                        alt="User avatar"
                        className="w-24 h-24 rounded-full border-2 border-blue-500 mb-4"
                    />
                    <h2 className="text-2xl font-semibold text-gray-100">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>

                {/* Profile Information */}
                <div className="mt-6 space-y-4">
                    {user.name && (
                        <div className="flex items-center">
                            <span className="font-medium text-gray-100 w-1/3">Name:</span>
                            <span className="text-gray-100">{user.name}</span>
                        </div>
                    )}
                    {user.email && (
                        <div className="flex items-center">
                            <span className="font-medium text-gray-100 w-1/3">Email:</span>
                            <span className="text-gray-100">{user.email}</span>
                        </div>
                    )}
                    {/* Additional user info fields can go here */}
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
