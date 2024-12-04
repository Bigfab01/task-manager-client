import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ element }) => {
  // Check if the token exists in localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    // If the token doesn't exist, redirect to the login page
    return <Navigate to="/" />;
  }
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />} // Protected route
        />
      </Routes>
    </Router>
  );
}

export default App;
