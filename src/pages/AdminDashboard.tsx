import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        incidents: 0,
        patients: 0,
        facilities: 0,
        contacts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch('/api/v1/admin/stats');
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error('Failed to load admin stats:', e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const adminModules = [
        {
            icon: 'bi-people',
            title: 'User Management',
            desc: 'Manage all users',
            path: '/admin/users',
            color: '#4a6cf7'
        },
        {
            icon: 'bi-book',
            title: 'First Aid Content',
            desc: 'Update guides',
            path: '/admin/content',
            color: '#2ecc71'
        },
        {
            icon: 'bi-building',
            title: 'Facilities',
            desc: 'Manage facilities',
            path: '/admin/facilities',
            color: '#e74c5e'
        },
        {
            icon: 'bi-graph-up',
            title: 'Analytics',
            desc: 'Full analytics',
            path: '/admin/analytics',
            color: '#f39c12'
        },
        {
            icon: 'bi-cloud-sync',
            title: 'Data Sync',
            desc: 'Sync dashboard',
            path: '/admin/sync',
            color: '#9b59b6'
        },
        {
            icon: 'bi-server',
            title: 'System Health',
            desc: 'System status',
            path: '/admin/health',
            color: '#2ecc71'
        },
        {
    icon: 'bi-clipboard-check',
    title: 'Request Management',
    desc: 'Medication & ambulance',
    path: '/admin/requests',
    color: '#e67e22'
},
    ];

    const quickStats = [
        { label: 'Incidents', value: stats.incidents, icon: 'bi-journal-text', color: 'e74c5e' },
        { label: 'Patients', value: stats.patients, icon: 'bi-people', color: '2ecc71' },
        { label: 'Facilities', value: stats.facilities, icon: 'bi-building', color: '3498db' },
        { label: 'Contacts', value: stats.contacts, icon: 'bi-telephone', color: 'f39c12' },
    ];

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>

            <div className="mb-4">
                <h5 className="fw-bold mb-0">
                    <i className="bi bi-shield-lock me-2 text-danger"></i>Admin Panel
                </h5>
                <p className="text-body-secondary small mb-0">
                    Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
                </p>
            </div>

            {error && (
                <div className="alert alert-warning small mb-3" role="alert">
                    Couldn't reach the server — showing may be out of date.
                    <button className="btn btn-sm btn-link p-0 ms-2" onClick={loadStats}>Retry</button>
                </div>
            )}

            <div className="row g-2 mb-4">
                {quickStats.map((stat, index) => (
                    <div key={index} className="col-3">
                        <div className="card border-0 shadow-sm text-center p-2" style={{ borderRadius: '12px' }}>
                            <i className={`${stat.icon} fs-4`} style={{ color: `#${stat.color}` }}></i>
                            <h5 className="fw-bold mb-0">{loading ? '–' : stat.value}</h5>
                            <small className="text-body-secondary" style={{ fontSize: '9px' }}>{stat.label}</small>
                        </div>
                    </div>
                ))}
            </div>

            <h6 className="fw-bold mb-3">
                <i className="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>Admin Modules
            </h6>
            <div className="row g-2">
                {adminModules.map((module, index) => (
                    <div key={index} className="col-6">
                        <div
                            className="card border-0 shadow-sm p-3 text-center"
                            style={{
                                borderRadius: '14px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onClick={() => navigate(module.path)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: `${module.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 8px'
                            }}>
                                <i className={`${module.icon} fs-4`} style={{ color: module.color }}></i>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600 }}>
                                {module.title}
                            </div>
                            <small className="text-body-secondary" style={{ fontSize: '10px' }}>
                                {module.desc}
                            </small>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '14px' }}>
                <div className="card-body">
                    <h6 className="fw-bold mb-3">
                        <i className="bi bi-server me-2 text-success"></i>System Status
                    </h6>
                    <div className="d-flex justify-content-between py-1 border-bottom">
                        <small className="text-body-secondary">API Status</small>
                        <span className={`badge rounded-pill px-3 ${error ? 'bg-danger' : 'bg-success'}`}>
                            {error ? 'Offline' : 'Online'}
                        </span>
                    </div>
                    <div className="d-flex justify-content-between py-1 border-bottom">
                        <small className="text-body-secondary">Storage Used</small>
                        <small>~50MB</small>
                    </div>
                    <div className="d-flex justify-content-between py-1">
                        <small className="text-body-secondary">Database</small>
                        <span className={`badge rounded-pill px-3 ${error ? 'bg-danger' : 'bg-success'}`}>
                            {error ? 'Disconnected' : 'Connected'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;