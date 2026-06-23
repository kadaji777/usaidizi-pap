import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton: React.FC = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const actions = [
        { icon: '📋', label: 'Log Incident', path: '/incidents', color: 'danger' },
        { icon: '👤', label: 'Add Patient', path: '/patients', color: 'success' },
        { icon: '📞', label: 'Add Contact', path: '/contacts', color: 'primary' },
        { icon: '🚑', label: 'Emergency Call', action: () => window.location.href = 'tel:999', color: 'warning' },
    ];

    return (
        <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050, bottom: '70px' }}>
            {open && (
                <div className="mb-2 d-flex flex-column gap-2 align-items-end">
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            className={`btn btn-${action.color} rounded-circle shadow-lg d-flex align-items-center justify-content-center`}
                            style={{ width: '48px', height: '48px' }}
                            onClick={() => {
                                if (action.path) navigate(action.path);
                                if (action.action) action.action();
                                setOpen(false);
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{action.icon}</span>
                        </button>
                    ))}
                </div>
            )}
            <button
                className={`btn ${open ? 'btn-secondary' : 'btn-danger'} rounded-circle shadow-lg d-flex align-items-center justify-content-center`}
                style={{ width: '56px', height: '56px', transition: 'all 0.3s' }}
                onClick={() => setOpen(!open)}
            >
                <i className={`bi ${open ? 'bi-x-lg' : 'bi-plus-lg'} fs-4`}></i>
            </button>
        </div>
    );
};

export default FloatingActionButton;