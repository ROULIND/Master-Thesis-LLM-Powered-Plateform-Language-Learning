// src/components/RequireAuth.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function RequireAuth({ children }) {
  const [userChecked, setUserChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUserChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!userChecked) return null; // Or a loading spinner

  return isAuthenticated ? children : <Navigate to="/users/login" replace />;
}
