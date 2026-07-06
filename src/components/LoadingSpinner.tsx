import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner;