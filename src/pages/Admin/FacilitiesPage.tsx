import React, { useEffect, useState } from 'react';
import { db, Facility } from '../../database/db';
import toast from 'react-hot-toast';

const AdminFacilitiesPage: React.FC = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'hospital',
        county: 'Kajiado',
        landmark: '',
        phone: '',
        operating_hours: '',
    });

    useEffect(() => { loadFacilities(); }, []);

    const loadFacilities = async () => {
        setLoading(true);
        setFacilities(await db.facilities.toArray());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const facilityData = {
            name: formData.name,
            type: formData.type as any,
            county: formData.county,
            landmark: formData.landmark,
            phone: formData.phone,
            operating_hours: formData.operating_hours,
        };
        if (editingFacility?.id) {
            await db.facilities.update(editingFacility.id, facilityData);
            toast.success('Facility updated!');
        } else {
            await db.facilities.add(facilityData);
            toast.success('Facility added!');
        }
        setShowModal(false);
        setEditingFacility(null);
        setFormData({ name: '', type: 'hospital', county: 'Kajiado', landmark: '', phone: '', operating_hours: '' });
        loadFacilities();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this facility?')) {
            await db.facilities.delete(id);
            toast.success('Facility deleted!');
            loadFacilities();
        }
    };

    const handleEdit = (facility: Facility) => {
        setEditingFacility(facility);
        setFormData({
            name: facility.name,
            type: facility.type,
            county: facility.county,
            landmark: facility.landmark || '',
            phone: facility.phone || '',
            operating_hours: facility.operating_hours || '',
        });
        setShowModal(true);
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'hospital': return '🏥';
            case 'police': return '👮';
            default: return '💊';
        }
    };

    const getTypeBadge = (type: string) => {
        switch(type) {
            case 'hospital': return 'bg-danger';
            case 'police': return 'bg-primary';
            default: return 'bg-success';
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0"><i className="bi bi-building me-2 text-info"></i>Facilities</h5>
                <button className="btn btn-danger btn-sm rounded-pill" onClick={() => { setEditingFacility(null); setFormData({ name: '', type: 'hospital', county: 'Kajiado', landmark: '', phone: '', operating_hours: '' }); setShowModal(true); }}>
                    <i className="bi bi-plus-lg me-1"></i>Add Facility
                </button>
            </div>

            {facilities.length === 0 ? (
                <div className="text-center py-5"><i className="bi bi-building fs-1 text-muted"></i><p className="text-muted mt-2">No facilities found</p></div>
            ) : (
                facilities.map(f => (
                    <div key={f.id} className="card border-0 shadow-sm mb-2 rounded-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span>{getTypeIcon(f.type)}</span>
                                        <h6 className="mb-0">{f.name}</h6>
                                        <span className={`badge ${getTypeBadge(f.type)} text-capitalize`}>{f.type}</span>
                                    </div>
                                    <small className="text-muted">{f.county}</small>
                                    {f.landmark && <div className="small text-muted">{f.landmark}</div>}
                                    {f.phone && <small className="text-muted">{f.phone}</small>}
                                </div>
                                <div>
                                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(f)}><i className="bi bi-pencil"></i></button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id!)}><i className="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h6 className="modal-title">{editingFacility ? 'Edit Facility' : 'Add Facility'}</h6>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3"><label className="form-label small fw-bold">Name</label><input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Type</label>
                                        <select className="form-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                            <option value="hospital">Hospital</option><option value="police">Police Station</option><option value="pharmacy">Pharmacy</option>
                                        </select>
                                    </div>
                                    <div className="mb-3"><label className="form-label small fw-bold">County</label>
                                        <select className="form-select" value={formData.county} onChange={(e) => setFormData({...formData, county: e.target.value})}>
                                            <option value="Kajiado">Kajiado</option><option value="Machakos">Machakos</option>
                                        </select>
                                    </div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Landmark</label><input type="text" className="form-control" value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Phone</label><input type="tel" className="form-control" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                                    <div className="mb-3"><label className="form-label small fw-bold">Operating Hours</label><input type="text" className="form-control" placeholder="e.g., 8am-8pm" value={formData.operating_hours} onChange={(e) => setFormData({...formData, operating_hours: e.target.value})} /></div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-danger">{editingFacility ? 'Update' : 'Add'} Facility</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFacilitiesPage;