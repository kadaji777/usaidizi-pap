import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('end_user' | 'chw' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    allowedRoles = ['end_user', 'chw', 'admin'] 
}) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadingSpinner />;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (!allowedRoles.includes(user.role || 'end_user')) {
        return <Navigate to="/unauthorized" />;
    }
    
    return <>{children}</>;
};

export default ProtectedRoute;