import Dexie, { Table } from 'dexie';

export interface FirstAidTopic {
    id?: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    steps: string[] | string;
    dos: string[] | string;
    donts: string[] | string;
    warning_signs: string;
}
export interface AmbulanceRequest {
    id?: number;
    local_uuid: string;
    patient_id?: number;
    facility_id?: number; // hospital-type Facility, optional if none nearby/known
    description: string;
    latitude?: number;
    longitude?: number;
    status: 'pending' | 'dispatched' | 'arrived' | 'cancelled';
    requested_at: Date;
    sync_status: 'pending' | 'synced';
}
export interface Patient {
    id?: number;
    local_uuid: string;
    full_name: string;
    age?: number;
    phone?: string;
    gender?: string;
    blood_group?: string;
    allergies?: string;
    sync_status: 'pending' | 'synced';
}

export interface EmergencyContact {
    id?: number;
    local_uuid: string;
    patient_id?: number;
    name: string;
    phone: string;
    relationship: string;
    is_primary: boolean;
    sync_status: 'pending' | 'synced';
}

export interface IncidentLog {
    id?: number;
    local_uuid: string;
    patient_id?: number;
    topic_id?: number;
    incident_timestamp: Date;
    description: string;
    severity: string;
    sync_status: 'pending' | 'synced';
}

export interface Facility {
    id?: number;
    name: string;
    type: string;
    county: string;
    landmark?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    operating_hours?: string;
}

export interface MedicationRequest {
    id?: number;
    local_uuid: string;
    patient_id?: number;
    facility_id: number; // pharmacy-type Facility
    medication_name: string;
    notes?: string;
    status: 'pending' | 'approved' | 'fulfilled' | 'rejected';
    requested_at: Date;
    sync_status: 'pending' | 'synced';
}

class UsaidiziDatabase extends Dexie {
    firstAidTopics!: Table<FirstAidTopic>;
    patients!: Table<Patient>;
    emergencyContacts!: Table<EmergencyContact>;
    incidentLogs!: Table<IncidentLog>;
    facilities!: Table<Facility>;
    medicationRequests!: Table<MedicationRequest>;

    constructor() {
        super('UsaidiziPapDB');

        this.version(2).stores({
            firstAidTopics: '++id, title, slug, category',
            patients: '++id, local_uuid, full_name, sync_status',
            emergencyContacts: '++id, local_uuid, patient_id, name, is_primary, sync_status',
            incidentLogs: '++id, local_uuid, patient_id, topic_id, incident_timestamp, sync_status',
            facilities: '++id, name, type, county'
        });

        // v3: add medicationRequests table. All prior tables must be re-listed
        // (Dexie requirement), even though their schema hasn't changed.
        this.version(3).stores({
            firstAidTopics: '++id, title, slug, category',
            patients: '++id, local_uuid, full_name, sync_status',
            emergencyContacts: '++id, local_uuid, patient_id, name, is_primary, sync_status',
            incidentLogs: '++id, local_uuid, patient_id, topic_id, incident_timestamp, sync_status',
            facilities: '++id, name, type, county',
            medicationRequests: '++id, local_uuid, patient_id, facility_id, status, sync_status'
        });
// v4: fix missing requested_at index on medicationRequests
        // (needed for .orderBy('requested_at') queries).
        this.version(4).stores({
            firstAidTopics: '++id, title, slug, category',
            patients: '++id, local_uuid, full_name, sync_status',
            emergencyContacts: '++id, local_uuid, patient_id, name, is_primary, sync_status',
            incidentLogs: '++id, local_uuid, patient_id, topic_id, incident_timestamp, sync_status',
            facilities: '++id, name, type, county',
            medicationRequests: '++id, local_uuid, patient_id, facility_id, status, requested_at, sync_status'
        });
// v5: add ambulanceRequests table.
        this.version(5).stores({
            firstAidTopics: '++id, title, slug, category',
            patients: '++id, local_uuid, full_name, sync_status',
            emergencyContacts: '++id, local_uuid, patient_id, name, is_primary, sync_status',
            incidentLogs: '++id, local_uuid, patient_id, topic_id, incident_timestamp, sync_status',
            facilities: '++id, name, type, county',
            medicationRequests: '++id, local_uuid, patient_id, facility_id, status, requested_at, sync_status',
            ambulanceRequests: '++id, local_uuid, patient_id, facility_id, status, requested_at, sync_status'
        });
    }

    async getPendingSyncItems() {
        const patients = await this.patients.where('sync_status').equals('pending').toArray();
        const contacts = await this.emergencyContacts.where('sync_status').equals('pending').toArray();
        const incidents = await this.incidentLogs.where('sync_status').equals('pending').toArray();
        const medicationRequests = await this.medicationRequests.where('sync_status').equals('pending').toArray();
        const ambulanceRequests = await this.ambulanceRequests.where('sync_status').equals('pending').toArray();
        return { patients, contacts, incidents, medicationRequests, ambulanceRequests };
    }
}

export const db = new UsaidiziDatabase();