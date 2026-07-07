import { db } from '../database/db';

const API_BASE = '/api/v1';
async function syncAmbulanceRequests() {
    const pending = await db.ambulanceRequests.where('sync_status').equals('pending').toArray();
    for (const req of pending) {
        try {
            const { id, sync_status, patient_id, ...payload } = req;
            let patient_local_uuid: string | undefined;
            if (patient_id) {
                const patient = await db.patients.get(patient_id);
                patient_local_uuid = patient?.local_uuid;
            }
            const res = await fetch(`${API_BASE}/ambulance-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, patient_local_uuid }),
            });
            if (res.ok && id !== undefined) {
                await db.ambulanceRequests.update(id, { sync_status: 'synced' });
            }
        } catch (e) {
            console.error('Failed to sync ambulance request', req.local_uuid, e);
        }
    }
}
async function syncPatients() {
    const pending = await db.patients.where('sync_status').equals('pending').toArray();
    for (const patient of pending) {
        try {
            const { id, sync_status, ...payload } = patient;
            const res = await fetch(`${API_BASE}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok && id !== undefined) {
                await db.patients.update(id, { sync_status: 'synced' });
            }
        } catch (e) {
            console.error('Failed to sync patient', patient.local_uuid, e);
        }
    }
}

async function syncContacts() {
    const pending = await db.emergencyContacts.where('sync_status').equals('pending').toArray();
    for (const contact of pending) {
        try {
            const { id, sync_status, patient_id, ...payload } = contact;
            let patient_local_uuid: string | undefined;
            if (patient_id) {
                const patient = await db.patients.get(patient_id);
                patient_local_uuid = patient?.local_uuid;
            }
            const res = await fetch(`${API_BASE}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, patient_local_uuid }),
            });
            if (res.ok && id !== undefined) {
                await db.emergencyContacts.update(id, { sync_status: 'synced' });
            }
        } catch (e) {
            console.error('Failed to sync contact', contact.local_uuid, e);
        }
    }
}

async function syncIncidents() {
    const pending = await db.incidentLogs.where('sync_status').equals('pending').toArray();
    for (const incident of pending) {
        try {
            const { id, sync_status, patient_id, ...payload } = incident;
            let patient_local_uuid: string | undefined;
            if (patient_id) {
                const patient = await db.patients.get(patient_id);
                patient_local_uuid = patient?.local_uuid;
            }
            const res = await fetch(`${API_BASE}/incidents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, patient_local_uuid }),
            });
            if (res.ok && id !== undefined) {
                await db.incidentLogs.update(id, { sync_status: 'synced' });
            }
        } catch (e) {
            console.error('Failed to sync incident', incident.local_uuid, e);
        }
    }
}

/**
 * Runs the actual sync: uploads every pending patient, contact, and incident
 * to the backend, then marks each as synced locally on success.
 * Returns false immediately if offline, without touching anything.
 */
export async function performSync(): Promise<boolean> {
    if (!navigator.onLine) return false;
    await syncPatients();
    await syncContacts();
    await syncIncidents();
    await syncMedicationRequests();
    await syncAmbulanceRequests();
    window.dispatchEvent(new Event('usaidizi-sync-complete'));
    return true;
}
async function syncMedicationRequests() {
    const pending = await db.medicationRequests.where('sync_status').equals('pending').toArray();
    for (const req of pending) {
        try {
            const { id, sync_status, patient_id, ...payload } = req;
            let patient_local_uuid: string | undefined;
            if (patient_id) {
                const patient = await db.patients.get(patient_id);
                patient_local_uuid = patient?.local_uuid;
            }
            const res = await fetch(`${API_BASE}/medication-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, patient_local_uuid }),
            });
            if (res.ok && id !== undefined) {
                await db.medicationRequests.update(id, { sync_status: 'synced' });
            }
        } catch (e) {
            console.error('Failed to sync medication request', req.local_uuid, e);
        }
    }
}