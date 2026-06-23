import React, { useState, useEffect } from 'react';

const EmergencyAlert: React.FC = () => {
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem('emergencyAlertSeen');
        if (hasSeen) setDismissed(true);
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('emergencyAlertSeen', 'true');
        setDismissed(true);
    };

    if (dismissed) return null;

    return (
        <div className="alert alert-danger alert-dismissible fade show m-3 rounded-3" role="alert" style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
            <div className="d-flex align-items-center">
                <i className="bi bi-megaphone-fill fs-3 me-3"></i>
                <div className="flex-grow-1">
                    <strong>Emergency Tip:</strong> In case of emergency, stay calm and call <strong className="fs-5">999</strong> immediately.
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={handleDismiss}></button>
            </div>
        </div>
    );
};

export default EmergencyAlert;