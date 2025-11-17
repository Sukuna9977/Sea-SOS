import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = false;
  if (token) {
    isAuthenticated = true;
  } else {
    isAuthenticated = false;
  }


  useEffect(() => {
    console.log("PrivateRoute mounted");
    console.log("PrivateRoute: isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    console.log("PrivateRoute: redirecting to /auth/sign-in");
    return <Navigate to="/auth/sign-in" />;
  }

  return <Component />;
};

export default PrivateRoute;
