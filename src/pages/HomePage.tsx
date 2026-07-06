import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../database/db';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [greeting, setGreeting] = useState('');
    const [stats, setStats] = useState({ incidents: 0, patients: 0, contacts: 0 });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('☀️ Good Morning');
        else if (hour < 18) setGreeting('🌤️ Good Afternoon');
        else setGreeting('🌙 Good Evening');
        loadStats();
    }, []);

    const loadStats = async () => {
        setStats({
            incidents: await db.incidentLogs.count(),
            patients: await db.patients.count(),
            contacts: await db.emergencyContacts.count(),
        });
    };

    const quickActions = [
        { icon: 'bi-journal-plus', label: 'Log Incident', path: '/incidents', color: '#dc3545' },
        { icon: 'bi-person-plus', label: 'Add Patient', path: '/patients', color: '#198754' },
        { icon: 'bi-telephone-plus', label: 'Emergency Call', action: () => window.location.href = 'tel:999', color: '#ffc107' },
        { icon: 'bi-building', label: 'Find Help', path: '/facilities', color: '#0d6efd' },
    ];

    const emergencyGuides = [
        { name: 'Burns', icon: 'bi-droplet', color: '#dc3545', slug: 'burns' },
        { name: 'Fractures', icon: 'bi-bone', color: '#ffc107', slug: 'fractures' },
        { name: 'Choking', icon: 'bi-lungs', color: '#0dcaf0', slug: 'choking' },
        { name: 'Seizures', icon: 'bi-lightning', color: '#0d6efd', slug: 'seizures' },
        { name: 'Bleeding', icon: 'bi-droplet-half', color: '#dc3545', slug: 'severe-bleeding' },
    ];

    const features = [
        { icon: 'bi-book', title: 'First Aid Guides', desc: '5 emergencies with diagrams', path: '/firstaid/burns' },
        { icon: 'bi-journal-text', title: 'Incident Logs', desc: 'Track all emergencies', path: '/incidents' },
        { icon: 'bi-people', title: 'Patients', desc: 'Store patient info', path: '/patients' },
        { icon: 'bi-telephone', title: 'Emergency Contacts', desc: 'Quick access numbers', path: '/contacts' },
        { icon: 'bi-building', title: 'Find Help', desc: 'Locate nearby facilities', path: '/facilities' },
        { icon: 'bi-graph-up', title: 'Analytics', desc: 'View your statistics', path: '/analytics' },
    ];

    return (
        <div className="container" style={{ maxWidth: '480px', padding: '16px', margin: '0 auto' }}>

            {/* Welcome Banner */}
            {user && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-success text-white px-3 py-2 rounded-3 mb-3 text-center"
                    style={{ fontSize: '13px' }}
                >
                    <i className="bi bi-person-circle me-2"></i>
                    {greeting}, {user.displayName || user.email?.split('@')[0] || 'User'}! 👋
                </motion.div>
            )}

            {/* Hero Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white rounded-4 p-4 mb-3"
                style={{
                    background: 'linear-gradient(135deg, #dc3545, #a71d2a)',
                    boxShadow: '0 4px 20px rgba(220, 53, 69, 0.3)'
                }}
            >
                <div className="d-flex align-items-center gap-3 mb-2">
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px'
                    }}>
                        <i className="bi bi-heart-pulse"></i>
                    </div>
                    <div>
                        <h1 className="h5 mb-0 fw-bold">Usaidizi Pap!</h1>
                        <small style={{ opacity: 0.8, fontSize: '11px' }}>Emergency First Aid Response</small>
                    </div>
                </div>

                <p className="mb-3" style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.5' }}>
                    Your personal emergency response companion. Get instant first aid guidance, even without internet.
                </p>

                <div className="d-flex gap-2 flex-wrap">
                    <button
                        className="btn btn-light btn-sm fw-semibold"
                        onClick={() => navigate('/firstaid/burns')}
                        style={{ borderRadius: '10px', fontSize: '12px', padding: '8px 16px' }}
                    >
                        <i className="bi bi-book me-1"></i> View Guides
                    </button>
                    <button
                        className="btn btn-outline-light btn-sm fw-semibold"
                        onClick={() => navigate('/quiz')}
                        style={{ borderRadius: '10px', fontSize: '12px', padding: '8px 16px' }}
                    >
                        <i className="bi bi-question-circle me-1"></i> Take Quiz
                    </button>
                    <button
                        className="btn btn-outline-light btn-sm fw-semibold"
                        onClick={() => window.location.href = 'tel:999'}
                        style={{ borderRadius: '10px', fontSize: '12px', padding: '8px 16px' }}
                    >
                        <i className="bi bi-sos me-1"></i> SOS 999
                    </button>
                </div>
            </motion.div>

            {/* Quick Actions - 2x2 Grid */}
            <div className="row g-2 mb-3">
                {quickActions.map((action, index) => (
                    <div key={index} className="col-3">
                        <button
                            className="w-100 py-3 rounded-3 border-0"
                            style={{
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => {
                                if (action.path) navigate(action.path);
                                if (action.action) action.action();
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                            }}
                        >
                            <div style={{ fontSize: '22px', color: action.color }}>
                                <i className={action.icon}></i>
                            </div>
                            <div style={{ fontSize: '10px', marginTop: '4px', color: '#495057' }}>
                                {action.label}
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {/* Emergency Guides */}
            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0" style={{ fontSize: '14px' }}>
                        <i className="bi bi-heart-pulse me-2 text-danger"></i>Emergency Guides
                    </h6>
                    <button
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={() => navigate('/firstaid/burns')}
                        style={{ fontSize: '12px', textDecoration: 'none' }}
                    >
                        See all →
                    </button>
                </div>
                <div className="d-flex gap-2 overflow-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {emergencyGuides.map((item, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 text-center"
                            style={{ width: '72px', cursor: 'pointer' }}
                            onClick={() => navigate(`/firstaid/${item.slug}`)}
                        >
                            <div style={{
                                background: '#ffffff',
                                borderRadius: '12px',
                                padding: '12px 0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                border: '1px solid #f0f0f0'
                            }}>
                                <div style={{ fontSize: '24px', color: item.color }}>
                                    <i className={item.icon}></i>
                                </div>
                                <div style={{ fontSize: '9px', fontWeight: 500, marginTop: '4px', color: '#495057' }}>
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats - Clean Horizontal */}
            <div className="bg-light rounded-3 px-3 py-2 mb-3" style={{ background: '#f8f9fa' }}>
                <div className="d-flex justify-content-around align-items-center">
                    <div className="text-center">
                        <div className="fw-bold text-danger" style={{ fontSize: '20px' }}>{stats.incidents}</div>
                        <div className="text-muted" style={{ fontSize: '10px' }}>Incidents</div>
                    </div>
                    <div className="text-center">
                        <div className="fw-bold text-success" style={{ fontSize: '20px' }}>{stats.patients}</div>
                        <div className="text-muted" style={{ fontSize: '10px' }}>Patients</div>
                    </div>
                    <div className="text-center">
                        <div className="fw-bold text-primary" style={{ fontSize: '20px' }}>{stats.contacts}</div>
                        <div className="text-muted" style={{ fontSize: '10px' }}>Contacts</div>
                    </div>
                </div>
            </div>

            {/* Features - 2 Column Grid */}
            <div className="mb-3">
                <h6 className="fw-bold mb-2" style={{ fontSize: '14px' }}>
                    <i className="bi bi-star-fill text-warning me-2"></i>Key Features
                </h6>
                <div className="row g-2">
                    {features.map((feature, i) => (
                        <div key={i} className="col-6">
                            <div
                                className="p-2 rounded-3 d-flex align-items-center gap-2"
                                style={{
                                    background: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    border: '1px solid #f0f0f0',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(feature.path)}
                            >
                                <div style={{ fontSize: '18px', color: '#dc3545', minWidth: '28px' }}>
                                    <i className={feature.icon}></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{feature.title}</div>
                                    <div style={{ fontSize: '10px', color: '#6c757d' }}>{feature.desc}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="text-white rounded-3 p-3 text-center" style={{
                background: 'linear-gradient(135deg, #dc3545, #a71d2a)',
                boxShadow: '0 4px 16px rgba(220, 53, 69, 0.25)'
            }}>
                <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>Ready to be prepared?</h6>
                <p className="mb-2" style={{ fontSize: '12px', opacity: 0.9 }}>Save first aid guides offline today!</p>
                <button
                    className="btn btn-light fw-semibold btn-sm"
                    style={{ borderRadius: '10px', fontSize: '12px', padding: '6px 20px' }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <i className="bi bi-arrow-down me-1"></i> Get Started
                </button>
            </div>
        </div>
    );
};

export default HomePage;