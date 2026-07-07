import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { db, AmbulanceRequest, Patient, Facility } from '../database/db';
import { performSync } from '../services/syncService';

const AmbulanceRequestPage: React.FC = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState<AmbulanceRequest[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [hospitals, setHospitals] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [locating, setLocating] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [formData, setFormData] = useState({
        patient_id: '',
        facility_id: '',
        description: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const pullStatusUpdates = async () => {
        if (!navigator.onLine) return;
        try {
            const res = await fetch('/api/v1/ambulance-requests');
            if (!res.ok) return;
            const serverRequests: { local_uuid: string; status: string }[] = await res.json();
            for (const sr of serverRequests) {
                const local = await db.ambulanceRequests.where('local_uuid').equals(sr.local_uuid).first();
                if (local && local.id !== undefined && local.status !== sr.status) {
                    await db.ambulanceRequests.update(local.id, { status: sr.status as AmbulanceRequest['status'] });
                }
            }
        } catch (e) {
            console.error('Failed to pull ambulance request status updates:', e);
        }
    };

    const loadData = async () => {
        setLoading(true);
        await pullStatusUpdates();
        setRequests(await db.ambulanceRequests.orderBy('requested_at').reverse().toArray());
        setPatients(await db.patients.toArray());
        setHospitals(await db.facilities.where('type').equals('hospital').toArray());
        setLoading(false);
    };

    const captureLocation = () => {
        if (!('geolocation' in navigator)) {
            toast.error(t('ambulance.geolocation_unavailable'));
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocating(false);
                toast.success(t('ambulance.location_captured'));
            },
            () => {
                setLocating(false);
                toast.error(t('ambulance.location_failed'));
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.ambulanceRequests.add({
            local_uuid: crypto.randomUUID(),
            patient_id: parseInt(formData.patient_id) || undefined,
            facility_id: parseInt(formData.facility_id) || undefined,
            description: formData.description,
            latitude: coords?.lat,
            longitude: coords?.lng,
            status: 'pending',
            requested_at: new Date(),
            sync_status: 'pending',
        });
        setShowModal(false);
        setFormData({ patient_id: '', facility_id: '', description: '' });
        setCoords(null);
        toast.success(t('ambulance.request_saved'));

        if (navigator.onLine) {
            await performSync();
        }

        loadData();
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case 'arrived': return 'success';
            case 'dispatched': return 'info';
            case 'cancelled': return 'secondary';
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
                    <i className="bi bi-truck me-2 text-danger"></i>{t('ambulance.title')}
                </h4>
                <button className="btn btn-danger rounded-pill px-3" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-lg me-1"></i>{t('ambulance.request_button')}
                </button>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-truck fs-1 text-body-secondary d-block mb-2"></i>
                    <p className="text-body-secondary mb-0">{t('ambulance.no_requests')}</p>
                </div>
            ) : (
                requests.map(r => (
                    <div key={r.id} className="card mb-2 border-0 shadow-sm" style={{ borderRadius: '14px' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong>
                                        {hospitals.find(f => f.id === r.facility_id)?.name || t('ambulance.no_facility_specified')}
                                    </strong>
                                    {r.patient_id && (
                                        <div className="small text-body-secondary">
                                            {patients.find(p => p.id === r.patient_id)?.full_name}
                                        </div>
                                    )}
                                    <div className="small text-body-secondary">{new Date(r.requested_at).toLocaleString()}</div>
                                    {r.latitude && r.longitude && (
                                        <div className="small text-body-secondary">
                                            <i className="bi bi-geo-alt-fill me-1"></i>
                                            {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                                        </div>
                                    )}
                                    <p className="small mt-1 mb-0">{r.description}</p>
                                </div>
                                <span className={`badge bg-${statusBadgeColor(r.status)} rounded-pill`}>
                                    {t(`ambulance.status_${r.status}`)}
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
                                <h5 className="mb-0">{t('ambulance.modal_title')}</h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                    aria-label={t('common.cancel')}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100 mb-2 rounded-pill"
                                        onClick={captureLocation}
                                        disabled={locating}
                                    >
                                        {locating ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : (
                                            <i className="bi bi-geo-alt-fill me-2"></i>
                                        )}
                                        {coords ? t('ambulance.location_captured_label') : t('ambulance.share_location')}
                                    </button>

                                    <select
                                        className="form-select mb-2"
                                        style={{ borderRadius: '10px' }}
                                        value={formData.facility_id}
                                        onChange={e => setFormData({ ...formData, facility_id: e.target.value })}
                                    >
                                        <option value="">{t('ambulance.select_hospital')}</option>
                                        {hospitals.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
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
                                    <textarea
                                        className="form-control"
                                        style={{ borderRadius: '10px' }}
                                        rows={3}
                                        placeholder={t('ambulance.description_placeholder')}
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-outline-secondary rounded-pill" onClick={() => setShowModal(false)}>
                                        {t('common.cancel')}
                                    </button>
                                    <button type="submit" className="btn btn-danger rounded-pill px-4">
                                        {t('ambulance.request_button')}
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

export default AmbulanceRequestPage;