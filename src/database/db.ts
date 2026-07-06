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
    latitude?: number;  // Add this
    longitude?: number; // Add this
    operating_hours?: string;
}


class UsaidiziDatabase extends Dexie {
    firstAidTopics!: Table<FirstAidTopic>;
    patients!: Table<Patient>;
    emergencyContacts!: Table<EmergencyContact>;
    incidentLogs!: Table<IncidentLog>;
    facilities!: Table<Facility>;

    constructor() {
        super('UsaidiziPapDB');
        this.version(2).stores({
            firstAidTopics: '++id, title, slug, category',
            patients: '++id, local_uuid, full_name, sync_status',
            emergencyContacts: '++id, local_uuid, patient_id, name, is_primary, sync_status',
            incidentLogs: '++id, local_uuid, patient_id, topic_id, incident_timestamp, sync_status',
            facilities: '++id, name, type, county'
        });
    }

    async getPendingSyncItems() {
        const patients = await this.patients.where('sync_status').equals('pending').toArray();
        const contacts = await this.emergencyContacts.where('sync_status').equals('pending').toArray();
        const incidents = await this.incidentLogs.where('sync_status').equals('pending').toArray();
        return { patients, contacts, incidents };
    }
}

export const db = new UsaidiziDatabase();