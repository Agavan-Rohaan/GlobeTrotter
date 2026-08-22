import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component that enforces authentication standard across the app.
 * If user has a valid JWT token, renders children.
 * Otherwise redirects user directly to /login.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
