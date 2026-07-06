import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EmptyPlaceholderProps {
    icon: string;
    title: string;
    message: string;
    buttonText?: string;
    buttonAction?: () => void;
}

const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({
    icon,
    title,
    message,
    buttonText = 'Go Back',
    buttonAction
}) => {
    const navigate = useNavigate();

    return (
        <div className="container py-5 text-center" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div className="card border-0 shadow-sm p-5 rounded-4">
                <div className="display-1 mb-3">{icon}</div>
                <h4 className="fw-bold">{title}</h4>
                <p className="text-muted">{message}</p>
                <button 
                    className="btn btn-outline-danger rounded-pill mt-3"
                    onClick={buttonAction || (() => navigate('/admin'))}
                >
                    <i className="bi bi-arrow-left me-2"></i>{buttonText}
                </button>
            </div>
        </div>
    );
};

export default EmptyPlaceholder;