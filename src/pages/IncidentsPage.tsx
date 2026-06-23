import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db, IncidentLog, Patient, FirstAidTopic } from '../database/db';

const IncidentsPage: React.FC = () => {
    const location = useLocation();
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
        loadData();
    };

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
    }

    return (
        <div className="container py-3">
            <div className="d-flex justify-content-between mb-3">
                <h4><i className="bi bi-journal-text me-2 text-danger"></i>Incident Logs</h4>
                <button className="btn btn-danger" onClick={() => setShowModal(true)}>+ Log</button>
            </div>
            
            {incidents.length === 0 ? (
                <div className="text-center py-5"><p className="text-muted">No incidents logged</p></div>
            ) : (
                incidents.map(i => (
                    <div key={i.id} className="card mb-2">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <strong>{topics.find(t => t.id === i.topic_id)?.title || 'Emergency'}</strong>
                                    <div className="small text-muted">{new Date(i.incident_timestamp).toLocaleString()}</div>
                                    <p className="small mt-1">{i.description.substring(0, 100)}</p>
                                </div>
                                <span className={`badge bg-${i.severity === 'critical' ? 'danger' : i.severity === 'high' ? 'warning' : 'info'}`}>
                                    {i.severity}
                                </span>
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
                                <h5>Log Incident</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <select className="form-select mb-2" value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})}>
                                        <option value="">Select Patient</option>
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                                    </select>
                                    <select className="form-select mb-2" value={formData.topic_id} onChange={e => setFormData({...formData, topic_id: e.target.value})}>
                                        <option value="">Select Emergency Type</option>
                                        {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                    </select>
                                    <textarea className="form-control mb-2" rows={3} placeholder="Description" required
                                              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                    <select className="form-select" value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
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

export default IncidentsPage;