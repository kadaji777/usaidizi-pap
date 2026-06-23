import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../database/db';
import CountUp from 'react-countup';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ incidents: 0, patients: 0, contacts: 0 });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setStats({
            incidents: await db.incidentLogs.count(),
            patients: await db.patients.count(),
            contacts: await db.emergencyContacts.count(),
        });
    };

    return (
        <div className="container py-3">
            {/* Profile Header */}
            <div className="card bg-danger text-white mb-4 border-0">
                <div className="card-body text-center">
                    <div className="display-1 mb-2">👤</div>
                    <h4>{user?.name}</h4>
                    <p className="mb-0 opacity-75">{user?.email}</p>
                    <small className="opacity-50">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</small>
                </div>
            </div>

            {/* Stats Section */}
            <h6 className="text-muted mb-3">Your Activity</h6>
            <div className="row g-3 mb-4">
                <div className="col-4">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <i className="bi bi-journal-text fs-2 text-danger"></i>
                            <h3 className="mb-0"><CountUp end={stats.incidents} duration={2} /></h3>
                            <small className="text-muted">Incidents</small>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <i className="bi bi-people fs-2 text-success"></i>
                            <h3 className="mb-0"><CountUp end={stats.patients} duration={2} /></h3>
                            <small className="text-muted">Patients</small>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card text-center shadow-sm">
                        <div className="card-body">
                            <i className="bi bi-telephone fs-2 text-primary"></i>
                            <h3 className="mb-0"><CountUp end={stats.contacts} duration={2} /></h3>
                            <small className="text-muted">Contacts</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Info */}
            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <h6 className="mb-3"><i className="bi bi-info-circle me-2 text-danger"></i>App Information</h6>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                        <small className="text-muted">Version</small>
                        <small>2.0.0</small>
                    </div>
                    <div className="d-flex justify-content-between py-2 border-bottom">
                        <small className="text-muted">Offline Storage</small>
                        <small className="text-success">✓ Enabled</small>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                        <small className="text-muted">Background Sync</small>
                        <small className="text-success">✓ Active</small>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <button className="btn btn-outline-danger w-100 py-2" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>Sign Out
            </button>

            <div className="text-center mt-3">
                <small className="text-muted">Usaidizi Pap! - Saving Lives, One Click at a Time</small>
            </div>
        </div>
    );
};

export default ProfilePage;