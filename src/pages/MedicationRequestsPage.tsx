import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { db, MedicationRequest, Patient, Facility } from '../database/db';

const MedicationRequestsPage: React.FC = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState<MedicationRequest[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [pharmacies, setPharmacies] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        patient_id: '',
        facility_id: '',
        medication_name: '',
        notes: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setRequests(await db.medicationRequests.orderBy('requested_at').reverse().toArray());
        setPatients(await db.patients.toArray());
        setPharmacies(await db.facilities.where('type').equals('pharmacy').toArray());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.facility_id) {
            toast.error(t('medication.select_pharmacy_required'));
            return;
        }
        await db.medicationRequests.add({
            local_uuid: crypto.randomUUID(),
            patient_id: parseInt(formData.patient_id) || undefined,
            facility_id: parseInt(formData.facility_id),
            medication_name: formData.medication_name,
            notes: formData.notes || undefined,
            status: 'pending',
            requested_at: new Date(),
            sync_status: 'pending',
        });
        setShowModal(false);
        setFormData({ patient_id: '', facility_id: '', medication_name: '', notes: '' });
        toast.success(t('medication.request_saved'));
        loadData();
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'fulfilled': return 'success';
            case 'approved': return 'info';
            case 'rejected': return 'danger';
            default: return 'warning';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger"></div>
            </div>
        );
    }

    return (
        <div className="container pt-4 pb-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">
                    <i className="bi bi-capsule me-2 text-danger"></i>{t('medication.title')}
                </h4>
                <button className="btn btn-danger rounded-pill px-3" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-lg me-1"></i>{t('medication.request_button')}
                </button>
            </div>

            {pharmacies.length === 0 && (
                <div className="alert alert-warning small mb-3" role="alert">
                    {t('medication.no_pharmacies_warning')}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-capsule fs-1 text-body-secondary d-block mb-2"></i>
                    <p className="text-body-secondary mb-0">{t('medication.no_requests')}</p>
                </div>
            ) : (
                requests.map(r => (
                    <div key={r.id} className="card mb-2 border-0 shadow-sm" style={{ borderRadius: '14px' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong>{r.medication_name}</strong>
                                    <div className="small text-body-secondary">
                                        {pharmacies.find(f => f.id === r.facility_id)?.name || t('medication.unknown_pharmacy')}
                                    </div>
                                    {r.patient_id && (
                                        <div className="small text-body-secondary">
                                            {patients.find(p => p.id === r.patient_id)?.full_name}
                                        </div>
                                    )}
                                    <div className="small text-body-secondary">{new Date(r.requested_at).toLocaleString()}</div>
                                    {r.notes && <p className="small mt-1 mb-0">{r.notes}</p>}
                                </div>
                                <span className={`badge bg-${statusBadgeColor(r.status)} rounded-pill`}>
                                    {t(`medication.status_${r.status}`)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="modal-header bg-danger text-white border-0">
                                <h5 className="mb-0">{t('medication.modal_title')}</h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                    aria-label={t('common.cancel')}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <select
                                        className="form-select mb-2"
                                        style={{ borderRadius: '10px' }}
                                        value={formData.facility_id}
                                        onChange={e => setFormData({ ...formData, facility_id: e.target.value })}
                                        required
                                    >
                                        <option value="">{t('medication.select_pharmacy')}</option>
                                        {pharmacies.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    </select>
                                    <select
                                        className="form-select mb-2"
                                        style={{ borderRadius: '10px' }}
                                        value={formData.patient_id}
                                        onChange={e => setFormData({ ...formData, patient_id: e.target.value })}
                                    >
                                        <option value="">{t('incidents.select_patient')}</option>
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        style={{ borderRadius: '10px' }}
                                        placeholder={t('medication.medication_name_placeholder')}
                                        required
                                        value={formData.medication_name}
                                        onChange={e => setFormData({ ...formData, medication_name: e.target.value })}
                                    />
                                    <textarea
                                        className="form-control"
                                        style={{ borderRadius: '10px' }}
                                        rows={3}
                                        placeholder={t('medication.notes_placeholder')}
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => setShowModal(false)}>
                                        {t('common.cancel')}
                                    </button>
                                    <button type="submit" className="btn btn-danger rounded-pill px-4">
                                        {t('common.save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicationRequestsPage;