import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
  // Check if the user is authenticated by looking for the token in localStorage
  const token = localStorage.getItem('token');

  // If the token exists, render the children (the protected component)
  // If not, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the token to check the user's role and expiration
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;

    // Check if the token is expired
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token'); // Remove expired token
      return <Navigate to="/login" replace />;
    }

    // If a required role is specified, check if the user has that role
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/dashboard" replace />;
    }

    // If all checks pass, render the children
    return children;
  } catch (error) {
    // If token is invalid, remove it and redirect to login
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;