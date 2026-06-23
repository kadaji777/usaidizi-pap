import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
    { title: 'First Aid Guides', description: 'Step-by-step instructions for 5 emergencies', color: 'danger', path: '/firstaid/burns', image: 'https://cdn-icons-png.flaticon.com/512/2731/2731440.png' },
    { title: 'Incident Logs', description: 'Track all emergency incidents', color: 'primary', path: '/incidents', image: 'https://cdn-icons-png.flaticon.com/512/2910/2910791.png' },
    { title: 'Patients', description: 'Store patient information', color: 'success', path: '/patients', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    { title: 'Emergency Contacts', description: 'Quick access to emergency numbers', color: 'warning', path: '/contacts', image: 'https://cdn-icons-png.flaticon.com/512/3095/3095584.png' },
    { title: 'Find Help', description: 'Locate hospitals and pharmacies', color: 'info', path: '/facilities', image: 'https://cdn-icons-png.flaticon.com/512/1483/1483508.png' },
    { title: 'Analytics', description: 'View statistics and insights', color: 'secondary', path: '/analytics', image: 'https://cdn-icons-png.flaticon.com/512/2103/2103452.png' }
];

const FeatureCards: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="container py-4">
            <h3 className="text-center mb-4"><i className="bi bi-star-fill text-warning me-2"></i>Key Features</h3>
            <div className="row g-4">
                {features.map((feature, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-0 cursor-pointer" onClick={() => navigate(feature.path)} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div className="card-body text-center">
                                <img src={feature.image} alt={feature.title} style={{ width: '70px', height: '70px', marginBottom: '15px' }} />
                                <h5 className="card-title">{feature.title}</h5>
                                <p className="card-text text-muted small">{feature.description}</p>
                                <button className={`btn btn-outline-${feature.color} btn-sm`}>Explore <i className="bi bi-arrow-right"></i></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FeatureCards;