import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component that enforces authentication standard across the app.
 * If user has a valid token or dev secret bypass, renders children.
 * Otherwise redirects user to /login.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const devBypass = localStorage.getItem('dev_bypass') === 'true';

  if (!token && !devBypass) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
