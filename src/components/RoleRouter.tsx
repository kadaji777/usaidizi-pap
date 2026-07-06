import React from 'react';
import { useAuth } from '../context/AuthContext';
import EndUserDashboard from '../pages/EndUserDashboard';
import CHWDashboard from '../pages/CHWDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import LoadingSpinner from './LoadingSpinner';

const RoleRouter: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    const role = user?.role || 'end_user';

    switch (role) {
        case 'admin':
            return <AdminDashboard />;  // Admin goes directly to Admin Dashboard
        case 'chw':
            return <CHWDashboard />;
        default:
            return <EndUserDashboard />;
    }
};

export default RoleRouter;