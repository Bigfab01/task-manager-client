// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove the token from localStorage on logout
        localStorage.removeItem('token');
        // Redirect user to the login page
        navigate('/login');
    }, [navigate]);

    return null;  // You can return a loading indicator here if you'd like
};

export default Logout;
