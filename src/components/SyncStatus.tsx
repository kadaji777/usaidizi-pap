import React, { useEffect, useState } from 'react';
import { db } from '../database/db';

const SyncStatus: React.FC = () => {
    const [pendingCount, setPendingCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        loadPendingCount();
        const interval = setInterval(loadPendingCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadPendingCount = async () => {
        const { patients, contacts, incidents } = await db.getPendingSyncItems();
        setPendingCount(patients.length + contacts.length + incidents.length);
    };

    const handleSync = async () => {
        if (isSyncing || !navigator.onLine) return;
        
        setIsSyncing(true);
        
        // Check if Background Sync is supported
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const registration = await navigator.serviceWorker.ready;
            // TypeScript fix - use any type assertion
            const swRegistration = registration as any;
            if (swRegistration.sync) {
                await swRegistration.sync.register('sync-usaidizi-data');
            }
        }
        
        // Simulate sync delay
        setTimeout(async () => {
            await loadPendingCount();
            setIsSyncing(false);
        }, 2000);
    };

    if (pendingCount === 0) return null;

    return (
        <div className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: 1000 }}>
            <button className="btn btn-warning rounded-pill shadow" onClick={handleSync} disabled={isSyncing}>
                <i className={`bi ${isSyncing ? 'bi-arrow-repeat spin' : 'bi-cloud-arrow-up'} me-1`}></i>
                {isSyncing ? 'Syncing...' : `${pendingCount} pending sync`}
            </button>
        </div>
    );
};

export default SyncStatus;