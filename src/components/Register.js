// src/components/Register.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);  // Store error message
    const navigate = useNavigate();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');  // Redirect to dashboard if token exists
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);  // Reset error message on each form submit
        if (!email || !password || !name) {
            setError('Please fill in all fields');  // Validation check
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { email, password, name });
            navigate('/dashboard');  // Redirect to login page after successful registration
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Registration failed. Please try again.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}  {/* Display error message */}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-600">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
