import React from 'react';

interface OfflineStatusProps {
    isOnline: boolean;
}

const OfflineStatus: React.FC<OfflineStatusProps> = ({ isOnline }) => {
    if (isOnline) return null;
    
    return (
        <div className="offline-banner">
            <i className="bi bi-wifi-off me-2"></i>
            You are offline. Your data is saved locally.
        </div>
    );
};

export default OfflineStatus;