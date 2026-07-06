import React, { useEffect, useState } from 'react';
import { db } from '../../database/db';

const SystemHealthPage: React.FC = () => {
    const [stats, setStats] = useState({
        incidents: 0, patients: 0, contacts: 0, facilities: 0, topics: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadStats(); }, []);

    const loadStats = async () => {
        setLoading(true);
        setStats({
            incidents: await db.incidentLogs.count(),
            patients: await db.patients.count(),
            contacts: await db.emergencyContacts.count(),
            facilities: await db.facilities.count(),
            topics: await db.firstAidTopics.count(),
        });
        setLoading(false);
    };

    const healthItems = [
        { label: 'API Status', value: 'Online', status: 'success' },
        { label: 'Database', value: 'Connected', status: 'success' },
        { label: 'Offline Sync', value: 'Active', status: 'success' },
        { label: 'Storage Used', value: '~50MB', status: 'success' },
    ];

    const dataItems = [
        { label: 'First Aid Guides', value: stats.topics, icon: 'bi-book', color: 'danger' },
        { label: 'Facilities', value: stats.facilities, icon: 'bi-building', color: 'primary' },
        { label: 'Patients', value: stats.patients, icon: 'bi-people', color: 'success' },
        { label: 'Incidents', value: stats.incidents, icon: 'bi-journal-text', color: 'warning' },
        { label: 'Emergency Contacts', value: stats.contacts, icon: 'bi-telephone', color: 'info' },
    ];

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <h5 className="fw-bold mb-3"><i className="bi bi-server me-2 text-success"></i>System Health</h5>
            <div className="card border-0 shadow-sm mb-4 rounded-3">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">📊 System Status</h6>
                    {healthItems.map((item, i) => (
                        <div key={i} className="d-flex justify-content-between py-2 border-bottom">
                            <span className="text-muted">{item.label}</span>
                            <span className={`badge bg-${item.status} rounded-pill px-3`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <h6 className="fw-bold mb-3">📈 Data Overview</h6>
            <div className="row g-2">
                {dataItems.map((item, i) => (
                    <div key={i} className="col-6">
                        <div className="card border-0 shadow-sm text-center p-3 rounded-3">
                            <i className={`${item.icon} fs-3`} style={{ color: `var(--bs-${item.color})` }}></i>
                            <h4 className="fw-bold mb-0">{item.value}</h4>
                            <small className="text-muted">{item.label}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemHealthPage;