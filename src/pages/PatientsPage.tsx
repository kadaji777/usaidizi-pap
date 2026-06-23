import React, { useEffect, useState } from 'react';
import { db, Patient } from '../database/db';

const PatientsPage: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', age: '', phone: '' });

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        setLoading(true);
        setPatients(await db.patients.toArray());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.patients.add({
            local_uuid: crypto.randomUUID(),
            full_name: formData.full_name,
            age: parseInt(formData.age) || undefined,
            phone: formData.phone || undefined,
            sync_status: 'pending'
        });
        setShowModal(false);
        setFormData({ full_name: '', age: '', phone: '' });
        loadPatients();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this patient?')) {
            await db.patients.delete(id);
            loadPatients();
        }
    };

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
    }

    return (
        <div className="container py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4><i className="bi bi-people me-2 text-danger"></i>Patients</h4>
                <button className="btn btn-danger" onClick={() => setShowModal(true)}>+ Add</button>
            </div>
            
            {patients.length === 0 ? (
                <div className="text-center py-5"><p className="text-muted">No patients added yet</p></div>
            ) : (
                <div className="list-group">
                    {patients.map(p => (
                        <div key={p.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-1">{p.full_name}</h6>
                                    <small className="text-muted">{p.age} yrs • {p.phone || 'No phone'}</small>
                                </div>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id!)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5>Add Patient</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <input type="text" className="form-control mb-2" placeholder="Full Name" required
                                           value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                                    <input type="number" className="form-control mb-2" placeholder="Age"
                                           value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                                    <input type="tel" className="form-control" placeholder="Phone"
                                           value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-danger">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientsPage;