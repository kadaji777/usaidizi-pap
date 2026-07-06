import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { db, Patient } from '../database/db';

const PatientsPage: React.FC = () => {
    const { t } = useTranslation();
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
        toast.success(t('patients.saved_success'));
        loadPatients();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('patients.delete_confirm'))) {
            await db.patients.delete(id);
            toast.success(t('patients.deleted_success'));
            loadPatients();
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
                    <i className="bi bi-people me-2 text-danger"></i>{t('patients.title')}
                </h4>
                <button className="btn btn-danger rounded-pill px-3" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-lg me-1"></i>{t('patients.add_button')}
                </button>
            </div>

            {patients.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-person-x fs-1 text-body-secondary d-block mb-2"></i>
                    <p className="text-body-secondary mb-0">{t('patients.no_patients')}</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {patients.map(p => (
                        <div key={p.id} className="card border-0 shadow-sm p-3" style={{ borderRadius: '14px' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-1">{p.full_name}</h6>
                                    <small className="text-body-secondary">
                                        {p.age ? `${p.age} ${t('patients.years')}` : t('patients.age_unknown')} • {p.phone || t('patients.no_phone')}
                                    </small>
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-danger rounded-circle"
                                    style={{ width: '34px', height: '34px' }}
                                    onClick={() => handleDelete(p.id!)}
                                    aria-label={t('common.delete')}
                                >
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
                        <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="modal-header bg-danger text-white border-0">
                                <h5 className="mb-0">{t('patients.modal_title')}</h5>
                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                    aria-label={t('common.cancel')}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        style={{ borderRadius: '10px' }}
                                        placeholder={t('patients.full_name_placeholder')}
                                        required
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        style={{ borderRadius: '10px' }}
                                        placeholder={t('patients.age_placeholder')}
                                        min={0}
                                        max={120}
                                        value={formData.age}
                                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        className="form-control"
                                        style={{ borderRadius: '10px' }}
                                        placeholder={t('patients.phone_placeholder')}
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
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

export default PatientsPage;