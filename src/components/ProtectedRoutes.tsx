// src/components/ProtectedRoute.js

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the import if your firebase config is in a different location

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show a loading state while checking auth status
  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  // If not authenticated, redirect to the Sign In page
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;
