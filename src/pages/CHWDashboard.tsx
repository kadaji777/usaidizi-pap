import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../database/db';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { performSync } from '../services/syncService';

const CHWDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        incidents: 0,
        patients: 0,
        pendingSync: 0
    });
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        loadStats();
        const handler = () => loadStats();
        window.addEventListener('usaidizi-sync-complete', handler);
        return () => window.removeEventListener('usaidizi-sync-complete', handler);
    }, []);

    const loadStats = async () => {
        const incidents = await db.incidentLogs.count();
        const patients = await db.patients.count();
        const pending = await db.getPendingSyncItems();
        setStats({
            incidents,
            patients,
            pendingSync:
                pending.patients.length +
                pending.contacts.length +
                pending.incidents.length +
                pending.medicationRequests.length +
                pending.ambulanceRequests.length
        });
    };

    const emergencyGuides = [
        { name: t('firstaid.burns'), icon: 'bi-droplet', color: '#e74c5e', slug: 'burns' },
        { name: t('firstaid.fractures'), icon: 'bi-bandaid', color: '#f39c12', slug: 'fractures' },
        { name: t('firstaid.choking'), icon: 'bi-lungs', color: '#3498db', slug: 'choking' },
        { name: t('firstaid.seizures'), icon: 'bi-lightning', color: '#9b59b6', slug: 'seizures' },
        { name: t('firstaid.bleeding'), icon: 'bi-droplet-half', color: '#e74c5e', slug: 'severe-bleeding' },
    ];

    // Trimmed to the 4 things a CHW does most often in the field.
    // Find Help / Contacts / Medication / Ambulance moved to "More Services".
    const mainActions = [
        { icon: 'bi-journal-plus', label: t('dashboard.log_incident'), path: '/incidents', color: '#e74c5e' },
        { icon: 'bi-person-plus', label: t('dashboard.add_patient'), path: '/patients', color: '#2ecc71' },
        { icon: 'bi-capsule', label: t('medication.title'), path: '/medication-requests', color: '#9b59b6' },
        { icon: 'bi-truck', label: t('ambulance.title'), path: '/ambulance-request', color: '#0d6efd' },
    ];

    const moreServices = [
        { icon: 'bi-building', label: t('nav.find_help'), path: '/facilities' },
        { icon: 'bi-telephone', label: t('nav.contacts'), path: '/contacts' },
        { icon: 'bi-journal-medical', label: t('dashboard.submit_guide'), path: '/submit-guide' },
    ];

    const handleSync = async () => {
        if (!navigator.onLine) {
            toast(t('sync.unavailable'), { icon: '⚠️' });
            return;
        }

        setSyncing(true);
        try {
            const ok = await performSync();
            if (ok) {
                toast.success(t('sync.success'));
                await loadStats();
            } else {
                toast.error(t('sync.failed'));
            }
        } catch (error) {
            toast.error(t('sync.failed'));
        } finally {
            setSyncing(false);
        }

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const swRegistration = registration as any;
                if (swRegistration.sync) {
                    await swRegistration.sync.register('sync-usaidizi-data');
                }
            } catch {
                // Non-critical — the direct sync above already ran.
            }
        }
    };

    return (
        <div className="container pt-5 pb-3" style={{ maxWidth: '480px', margin: '0 auto' }}>

            <div className="mb-4">
                <h5 className="mb-0">👋 {user?.displayName || t('dashboard.default_user')}</h5>
                <p className="text-body-secondary small mb-0">{t('dashboard.chw_role')}</p>
            </div>

            <div className="row g-2 mb-3">
                <div className="col-4">
                    <div className="card text-center p-3 border-0 shadow-sm" style={{ borderRadius: '12px', borderTop: '3px solid #e74c5e' }}>
                        <h3 className="text-danger mb-0">{stats.incidents}</h3>
                        <small className="text-body-secondary">{t('dashboard.incidents')}</small>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card text-center p-3 border-0 shadow-sm" style={{ borderRadius: '12px', borderTop: '3px solid #2ecc71' }}>
                        <h3 className="text-success mb-0">{stats.patients}</h3>
                        <small className="text-body-secondary">{t('dashboard.patients')}</small>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card text-center p-3 border-0 shadow-sm" style={{ borderRadius: '12px', borderTop: '3px solid #ffc107' }}>
                        <h3 className="text-warning mb-0">{stats.pendingSync}</h3>
                        <small className="text-body-secondary">{t('dashboard.pending_sync')}</small>
                    </div>
                </div>
            </div>

            <button
                className="btn btn-outline-primary w-100 py-2 rounded-pill mb-5"
                onClick={handleSync}
                disabled={syncing}
            >
                {syncing ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                    <i className="bi bi-cloud-sync me-2"></i>
                )}
                {t('dashboard.sync_data')}
            </button>

            <h6 className="fw-bold mb-3">{t('dashboard.quick_actions')}</h6>
            <div className="row g-2 mb-4">
                {mainActions.map((action, index) => (
                    <div key={index} className="col-3">
                        <button
                            className="card w-100 py-3 rounded-3 border-0 shadow-sm"
                            onClick={() => navigate(action.path)}
                        >
                            <i className={`${action.icon} fs-4`} style={{ color: action.color }}></i>
                            <small style={{ fontSize: '9px', display: 'block', marginTop: '4px' }}>
                                {action.label}
                            </small>
                        </button>
                    </div>
                ))}
            </div>

            <div className="d-flex flex-wrap gap-2 mb-5">
                {moreServices.map((service, index) => (
                    <button
                        key={index}
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                        onClick={() => navigate(service.path)}
                    >
                        <i className={`${service.icon} me-1`}></i>{service.label}
                    </button>
                ))}
            </div>

            <h6 className="fw-bold mb-3">{t('firstaid.guides')}</h6>
            <div
                className="d-flex gap-2 overflow-auto pb-2"
                style={{
                    scrollbarWidth: 'none',
                    scrollSnapType: 'x mandatory',
                    maskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
                }}
            >
                {emergencyGuides.map((item, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 text-center"
                        style={{ width: '70px', cursor: 'pointer', scrollSnapAlign: 'start' }}
                        onClick={() => navigate(`/firstaid/${item.slug}`)}
                    >
                        <div className="card border-0 shadow-sm p-2" style={{ borderRadius: '12px' }}>
                            <i className={`${item.icon} fs-2`} style={{ color: item.color }}></i>
                            <small style={{ fontSize: '9px', display: 'block', marginTop: '4px' }}>
                                {item.name}
                            </small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CHWDashboard;