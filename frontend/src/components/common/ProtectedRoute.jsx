import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user }   = useAuth();
  const location   = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user)    return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/"     replace />;
  return children;
};
