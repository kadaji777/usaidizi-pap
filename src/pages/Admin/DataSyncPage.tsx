import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../database/db';
import toast from 'react-hot-toast';

const DataSyncPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
    const [lastSync, setLastSync] = useState<string>(() => {
        return localStorage.getItem('lastSyncTime') || 'Never';
    });

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncStatus('syncing');
        toast.loading('Syncing data...', { id: 'sync' });

        try {
            // Get all pending items
            const pending = await db.getPendingSyncItems();
            const totalPending = pending.patients.length + pending.contacts.length + pending.incidents.length;

            if (totalPending === 0) {
                toast.success('All data is already synced! ✅', { id: 'sync' });
                setSyncStatus('success');
                setIsSyncing(false);
                return;
            }

            // Simulate sync delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mark all as synced
            for (const patient of pending.patients) {
                await db.patients.update(patient.id!, { sync_status: 'synced' });
            }
            for (const contact of pending.contacts) {
                await db.emergencyContacts.update(contact.id!, { sync_status: 'synced' });
            }
            for (const incident of pending.incidents) {
                await db.incidentLogs.update(incident.id!, { sync_status: 'synced' });
            }

            const now = new Date().toLocaleString();
            localStorage.setItem('lastSyncTime', now);
            setLastSync(now);
            setSyncStatus('success');
            toast.success(`✅ Synced ${totalPending} items successfully!`, { id: 'sync' });

        } catch (error) {
            console.error('Sync error:', error);
            setSyncStatus('error');
            toast.error('❌ Sync failed. Please try again.', { id: 'sync' });
        }

        setIsSyncing(false);
    };

    const getSyncStats = async () => {
        const pending = await db.getPendingSyncItems();
        return {
            patients: pending.patients.length,
            contacts: pending.contacts.length,
            incidents: pending.incidents.length,
            total: pending.patients.length + pending.contacts.length + pending.incidents.length
        };
    };

    const [stats, setStats] = useState({ patients: 0, contacts: 0, incidents: 0, total: 0 });

    React.useEffect(() => {
        getSyncStats().then(setStats);
    }, []);

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
            
            <div className="d-flex align-items-center gap-3 mb-4">
                <button 
                    className="btn btn-link text-dark p-0"
                    onClick={() => navigate('/admin')}
                >
                    <i className="bi bi-arrow-left fs-4"></i>
                </button>
                <h5 className="fw-bold mb-0">Data Sync</h5>
            </div>

            {/* Sync Status Card */}
            <div className="card border-0 shadow-sm mb-4 rounded-4">
                <div className="card-body text-center p-4">
                    <div className="display-1 mb-3">🔄</div>
                    <h6 className="fw-bold">Sync Status</h6>
                    <p className="text-muted small">
                        Last sync: <strong>{lastSync}</strong>
                    </p>
                    <div className={`badge ${syncStatus === 'success' ? 'bg-success' : syncStatus === 'error' ? 'bg-danger' : syncStatus === 'syncing' ? 'bg-warning' : 'bg-secondary'} rounded-pill px-3 py-2`}>
                        {syncStatus === 'idle' && 'Ready to Sync'}
                        {syncStatus === 'syncing' && 'Syncing...'}
                        {syncStatus === 'success' && '✅ Synced'}
                        {syncStatus === 'error' && '❌ Error'}
                    </div>
                </div>
            </div>

            {/* Pending Items */}
            <h6 className="fw-bold mb-3">Pending Sync Items</h6>
            <div className="row g-2 mb-4">
                <div className="col-4">
                    <div className="card border-0 shadow-sm text-center p-3 rounded-3">
                        <span className="fs-2">👤</span>
                        <h5 className="fw-bold mb-0">{stats.patients}</h5>
                        <small className="text-muted">Patients</small>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card border-0 shadow-sm text-center p-3 rounded-3">
                        <span className="fs-2">📞</span>
                        <h5 className="fw-bold mb-0">{stats.contacts}</h5>
                        <small className="text-muted">Contacts</small>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card border-0 shadow-sm text-center p-3 rounded-3">
                        <span className="fs-2">📋</span>
                        <h5 className="fw-bold mb-0">{stats.incidents}</h5>
                        <small className="text-muted">Incidents</small>
                    </div>
                </div>
            </div>

            {/* Sync Button */}
            <button 
                className="btn btn-danger w-100 py-3 rounded-pill fw-bold"
                onClick={handleSync}
                disabled={isSyncing}
            >
                {isSyncing ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Syncing...
                    </>
                ) : (
                    <>
                        <i className="bi bi-cloud-sync me-2"></i>
                        Sync Now ({stats.total} pending)
                    </>
                )}
            </button>

            {/* Back Button */}
            <button 
                className="btn btn-outline-secondary w-100 mt-3 py-2 rounded-pill"
                onClick={() => navigate('/admin')}
            >
                <i className="bi bi-arrow-left me-2"></i>Back to Admin
            </button>
        </div>
    );
};

export default DataSyncPage;