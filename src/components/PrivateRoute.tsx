import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;