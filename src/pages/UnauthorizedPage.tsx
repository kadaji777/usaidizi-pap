import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
        }}>
            <div className="text-center">
                <div className="display-1 mb-3">🚫</div>
                <h1 className="text-white">Unauthorized Access</h1>
                <p className="text-white-50 mb-4">
                    You don't have permission to view this page.<br />
                    Your current role: <strong>{user?.role || 'Unknown'}</strong>
                </p>
                <button 
                    className="btn btn-danger btn-lg" 
                    onClick={() => navigate('/')}
                >
                    <i className="bi bi-house-door me-2"></i>Go Home
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;