// src/components/ProtectedRoute.tsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    // Not authorized
    return <Navigate to="/" />;
  }



  return children;
};

export default ProtectedRoute;