import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, EmergencyContact, Patient } from '../database/db';

const EmergencyContactsPage: React.FC = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
    const [formData, setFormData] = useState({
        patient_id: '',
        name: '',
        phone: '',
        relationship: '',
        is_primary: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setContacts(await db.emergencyContacts.toArray());
        setPatients(await db.patients.toArray());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const contactData = {
            local_uuid: editingContact?.local_uuid || crypto.randomUUID(),
            patient_id: formData.patient_id ? parseInt(formData.patient_id) : undefined,
            name: formData.name,
            phone: formData.phone,
            relationship: formData.relationship,
            is_primary: formData.is_primary,
            sync_status: 'pending' as const
        };
        
        // If this is primary, unset others
        if (formData.is_primary && contactData.patient_id) {
            const existing = await db.emergencyContacts.where('patient_id').equals(contactData.patient_id).toArray();
            for (const c of existing) {
                if (c.is_primary && c.id !== editingContact?.id) {
                    await db.emergencyContacts.update(c.id!, { is_primary: false, sync_status: 'pending' });
                }
            }
        }
        
        if (editingContact?.id) {
            await db.emergencyContacts.update(editingContact.id, contactData);
        } else {
            await db.emergencyContacts.add(contactData);
        }
        
        setShowModal(false);
        setEditingContact(null);
        setFormData({ patient_id: '', name: '', phone: '', relationship: '', is_primary: false });
        loadData();
        
        // Trigger sync
               if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const registration = await navigator.serviceWorker.ready;
            const swRegistration = registration as any;
            if (swRegistration.sync) {
                swRegistration.sync.register('sync-usaidizi-data');
            }
        }   
};

    const handleDelete = async (contact: EmergencyContact) => {
        if (window.confirm(`Delete ${contact.name}? This cannot be undone.`)) {
            await db.emergencyContacts.delete(contact.id!);
            loadData();
        }
    };

    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const openEditModal = (contact: EmergencyContact) => {
        setEditingContact(contact);
        setFormData({
            patient_id: contact.patient_id?.toString() || '',
            name: contact.name,
            phone: contact.phone,
            relationship: contact.relationship,
            is_primary: contact.is_primary
        });
        setShowModal(true);
    };

    const openNewModal = () => {
        setEditingContact(null);
        setFormData({
            patient_id: '',
            name: '',
            phone: '',
            relationship: '',
            is_primary: false
        });
        setShowModal(true);
    };

    const getPatientName = (patientId?: number) => {
        if (!patientId) return 'General';
        const p = patients.find(p => p.id === patientId);
        return p?.full_name || 'Unknown';
    };

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
    }

    // Group contacts
    const patientContacts = contacts.filter(c => c.patient_id);
    const generalContacts = contacts.filter(c => !c.patient_id);

    return (
        <div className="container py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>
                    <i className="bi bi-telephone me-2 text-danger"></i>
                    Emergency Contacts
                </h4>
                <button className="btn btn-danger" onClick={openNewModal}>
                    <i className="bi bi-plus-lg"></i> Add
                </button>
            </div>

            {/* Quick Emergency Numbers */}
            <div className="card bg-danger text-white mb-4 border-0">
                <div className="card-body text-center">
                    <h6 className="mb-2">Quick Emergency Numbers</h6>
                    <div className="d-flex justify-content-around">
                        <button className="btn btn-light text-danger" onClick={() => handleCall('999')}>
                            <i className="bi bi-telephone"></i> 999
                        </button>
                        <button className="btn btn-light text-danger" onClick={() => handleCall('112')}>
                            <i className="bi bi-telephone"></i> 112
                        </button>
                        <button className="btn btn-light text-danger" onClick={() => handleCall('911')}>
                            <i className="bi bi-telephone"></i> 911
                        </button>
                    </div>
                </div>
            </div>

            {/* General Contacts */}
            {generalContacts.length > 0 && (
                <>
                    <h6 className="text-muted mb-2">General Contacts</h6>
                    {generalContacts.map(c => (
                        <div key={c.id} className="card mb-2 shadow-sm">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">{c.name}</h6>
                                    <small className="text-muted">{c.relationship} • {c.phone}</small>
                                    {c.is_primary && <span className="badge bg-danger ms-2">Primary</span>}
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-success me-1" onClick={() => handleCall(c.phone)}>
                                        <i className="bi bi-telephone"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEditModal(c)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Patient Contacts */}
            {patients.map(patient => {
                const patientContactsList = contacts.filter(c => c.patient_id === patient.id);
                if (patientContactsList.length === 0) return null;
                
                return (
                    <div key={patient.id} className="mt-3">
                        <h6 className="text-muted mb-2">
                            <i className="bi bi-person-circle me-1"></i>
                            {patient.full_name}
                        </h6>
                        {patientContactsList.map(c => (
                            <div key={c.id} className="card mb-2 shadow-sm">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">{c.name}</h6>
                                        <small className="text-muted">{c.relationship} • {c.phone}</small>
                                        {c.is_primary && <span className="badge bg-danger ms-2">Primary</span>}
                                    </div>
                                    <div>
                                        <button className="btn btn-sm btn-success me-1" onClick={() => handleCall(c.phone)}>
                                            <i className="bi bi-telephone"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEditModal(c)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="btn btn-sm btn-outline-danger mt-1" onClick={() => {
                            setFormData({ ...formData, patient_id: patient.id!.toString() });
                            setEditingContact(null);
                            setShowModal(true);
                        }}>
                            <i className="bi bi-plus"></i> Add Contact for {patient.full_name}
                        </button>
                    </div>
                );
            })}

            {contacts.length === 0 && (
                <div className="text-center py-5">
                    <i className="bi bi-telephone fs-1 text-muted"></i>
                    <p className="text-muted mt-2">No emergency contacts added</p>
                    <button className="btn btn-outline-danger" onClick={openNewModal}>
                        Add Your First Contact
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5>{editingContact ? 'Edit Contact' : 'New Emergency Contact'}</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Associated Patient (Optional)</label>
                                        <select className="form-select" value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})}>
                                            <option value="">General (No patient association)</option>
                                            {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name *</label>
                                        <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phone Number *</label>
                                        <input type="tel" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Relationship *</label>
                                        <input type="text" className="form-control" required value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} placeholder="e.g., Spouse, Parent, Sibling" />
                                    </div>
                                    <div className="mb-3 form-check">
                                        <input type="checkbox" className="form-check-input" id="isPrimary" checked={formData.is_primary} onChange={e => setFormData({...formData, is_primary: e.target.checked})} />
                                        <label className="form-check-label" htmlFor="isPrimary">Primary Emergency Contact</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-danger">{editingContact ? 'Update' : 'Save'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyContactsPage;