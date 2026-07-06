// FirstAidGuide Hub component for Usaidizi Pap!
// Contributed by Peter Onyango Atonga

import React from 'react';
import { useNavigate } from 'react-router-dom';

const FirstAidGuide = () => {
    const navigate = useNavigate();

    // The complete emergency categories for the presentation hub
    const categories = [
        {
            title: 'Burn Injury',
            slug: 'burn',
            icon: 'bi-fire',
            description: 'Thermal burn protocol to stop tissue damage and manage acute pain.',
            badge: 'Thermal'
        },
        {
            title: 'Snake Bite',
            slug: 'snake-bite',
            icon: 'bi-capsule',
            description: 'Immobilization and stabilization steps to slow down venom circulation.',
            badge: 'Envenomation'
        },
        {
            title: 'Broken Bone / Fracture',
            slug: 'fracture',
            icon: 'bi-activity',
            description: 'Splinting and stabilization methods for closed or open bone trauma.',
            badge: 'Trauma'
        },
        {
            title: 'Choking',
            slug: 'choking',
            icon: 'bi-exclamation-triangle',
            description: 'Airway clearance protocols including back blows and abdominal thrusts.',
            badge: 'Respiratory'
        },
        {
            title: 'Bleeding / Deep Wound',
            slug: 'bleeding',
            icon: 'bi-droplet-half',
            description: 'Direct pressure and hemorrhage control techniques to avoid blood loss shock.',
            badge: 'Trauma'
        }
    ];

    return (
        <div className="container py-4 text-start text-white">
            <div className="d-flex align-items-center mb-2">
                <i className="bi bi-heart-pulse-fill text-danger fs-3 me-2"></i>
                <h2 className="mb-0 fw-bold">Emergency First Aid Hub</h2>
            </div>
            <p className="text-muted mb-4">
                Select an emergency type below to access real-world medical guidelines immediately.
            </p>

            <div className="row">
                {categories.map((cat, index) => (
                    <div key={index} className="col-md-6 col-12 mb-3">
                        <div 
                            className="card h-100 border-0 bg-dark text-white shadow-sm hover-shadow transition-all text-start" 
                            style={{ 
                                cursor: 'pointer', 
                                borderLeft: '4px solid #dc3545',
                                background: '#1e1e24' 
                            }} 
                            onClick={() => navigate(`/firstaid/${cat.slug}`)}
                        >
                            <div className="card-body d-flex flex-column justify-content-between p-4">
                                <div>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title text-danger fw-bold mb-0">
                                            <i className={`bi ${cat.icon} me-2`}></i>{cat.title}
                                        </h5>
                                        <span className="badge bg-secondary px-2 py-1 small">{cat.badge}</span>
                                    </div>
                                    <p className="card-text text-muted small mt-2">{cat.description}</p>
                                </div>
                                <div className="text-end mt-3">
                                    <span className="text-danger small fw-bold">
                                        Open Protocol <i className="bi bi-chevron-right ms-1"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FirstAidGuide;