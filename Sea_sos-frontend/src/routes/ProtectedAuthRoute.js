import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

const ProtectedAuthRoute = ({ element }) => {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  /**
   * Check if the token is valid.
   * Returns `true` if the token exists, is decodable, and has not expired.
   */
  const isTokenValid = () => {
    if (!token) return false; // No token means not valid
    try {
      const { exp } = jwtDecode(token); // Decode the token and get expiry
      return exp * 1000 > Date.now(); // Check if expiry time is in the future
    } catch (error) {
      return false; // Invalid token format or decoding error
    }
  };

  // Redirect to dashboard if user is authenticated and token is valid
  if (isAuthenticated && isTokenValid()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, allow access to the specified route
  return element;
};

export default ProtectedAuthRoute;
