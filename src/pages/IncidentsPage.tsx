import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { db, IncidentLog, Patient, FirstAidTopic } from '../database/db';

const IncidentsPage: React.FC = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [incidents, setIncidents] = useState<IncidentLog[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [topics, setTopics] = useState<FirstAidTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        patient_id: '',
        topic_id: '',
        description: '',
        severity: 'medium'
    });

    useEffect(() => {
        if (location.state?.newIncident) setShowModal(true);
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setIncidents(await db.incidentLogs.toArray());
        setPatients(await db.patients.toArray());
        setTopics(await db.firstAidTopics.toArray());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await db.incidentLogs.add({
            local_uuid: crypto.randomUUID(),
            patient_id: parseInt(formData.patient_id) || undefined,
            topic_id: parseInt(formData.topic_id) || undefined,
            incident_timestamp: new Date(),
            description: formData.description,
            severity: formData.severity,
            sync_status: 'pending'
        });
        setShowModal(false);
        setFormData({ patient_id: '', topic_id: '', description: '', severity: 'medium' });
        toast.success(t('incidents.saved_success'));
        loadData();
    };

    const severityBadgeColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'danger';
            case 'high': return 'warning';
            case 'low': return 'success';
            default: return 'info';
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
                    <i className="bi bi-journal-text me-2 text-danger"></i>{t('incidents.title')}
                </h4>
                <button className="btn btn-danger rounded-pill px-3" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-lg me-1"></i>{t('incidents.log_button')}
                </button>
            </div>

            {incidents.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-journal-x fs-1 text-body-secondary d-block mb-2"></i>
                    <p className="text-body-secondary mb-0">{t('incidents.no_incidents')}</p>
                </div>
            ) : (
                incidents.map(i => (
                    <div key={i.id} className="card mb-2 border-0 shadow-sm" style={{ borderRadius: '14px' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong>{topics.find(t2 => t2.id === i.topic_id)?.title || t('incidents.emergency_default')}</strong>
                                    <div className="small text-body-secondary">
                                        {patients.find(p => p.id === i.patient_id)?.full_name || t('patients.age_unknown')}
                                    </div>
                                    <div className="small text-body-secondary">{new Date(i.incident_timestamp).toLocaleString()}</div>
                                    <p className="small mt-1 mb-0">{i.description.substring(0, 100)}</p>
                                </div>
                                <span className={`badge bg-${severityBadgeColor(i.severity)} rounded-pill`}>
                                    {t(`incidents.severity_${i.severity}`)}
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
                                <h5 className="mb-0">{t('incidents.modal_title')}</h5>
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
                                        value={formData.patient_id}
                                        onChange={e => setFormData({ ...formData, patient_id: e.target.value })}
                                    >
                                        <option value="">{t('incidents.select_patient')}</option>
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                                    </select>
                                    <select
                                        className="form-select mb-2"
                                        style={{ borderRadius: '10px' }}
                                        value={formData.topic_id}
                                        onChange={e => setFormData({ ...formData, topic_id: e.target.value })}
                                        required
                                    >
                                        <option value="">{t('incidents.select_type')}</option>
                                        {topics.map(topic => <option key={topic.id} value={topic.id}>{topic.title}</option>)}
                                    </select>
                                    <textarea
                                        className="form-control mb-2"
                                        style={{ borderRadius: '10px' }}
                                        rows={3}
                                        placeholder={t('incidents.description_placeholder')}
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                    <select
                                        className="form-select"
                                        style={{ borderRadius: '10px' }}
                                        value={formData.severity}
                                        onChange={e => setFormData({ ...formData, severity: e.target.value })}
                                    >
                                        <option value="low">{t('incidents.severity_low')}</option>
                                        <option value="medium">{t('incidents.severity_medium')}</option>
                                        <option value="high">{t('incidents.severity_high')}</option>
                                        <option value="critical">{t('incidents.severity_critical')}</option>
                                    </select>
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

export default IncidentsPage;