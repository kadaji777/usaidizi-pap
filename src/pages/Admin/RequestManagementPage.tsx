import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface RequestItem {
    id: number;
    status: string;
    requested_at: string;
    patient?: { full_name: string };
    facility?: { name: string };
    medication_name?: string;
    description?: string;
}

const RequestManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<'medication' | 'ambulance'>('medication');
    const [medicationRequests, setMedicationRequests] = useState<RequestItem[]>([]);
    const [ambulanceRequests, setAmbulanceRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [medRes, ambRes] = await Promise.all([
                fetch('/api/v1/medication-requests'),
                fetch('/api/v1/ambulance-requests'),
            ]);
            setMedicationRequests(await medRes.json());
            setAmbulanceRequests(await ambRes.json());
        } catch (e) {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (type: 'medication' | 'ambulance', id: number, status: string) => {
        try {
            const res = await fetch(`/api/v1/${type}-requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error();
            toast.success('Status updated');
            loadData();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const medicationStatuses = ['pending', 'approved', 'fulfilled', 'rejected'];
    const ambulanceStatuses = ['pending', 'dispatched', 'arrived', 'cancelled'];

    const badgeColor = (status: string) => {
        switch (status) {
            case 'fulfilled':
            case 'arrived':
                return 'success';
            case 'approved':
            case 'dispatched':
                return 'info';
            case 'rejected':
            case 'cancelled':
                return 'secondary';
            default:
                return 'warning';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger"></div>
            </div>
        );
    }

    const activeList = tab === 'medication' ? medicationRequests : ambulanceRequests;
    const statusOptions = tab === 'medication' ? medicationStatuses : ambulanceStatuses;

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
                <button className="btn btn-link text-body p-0" onClick={() => navigate('/admin')}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </button>
                <h5 className="fw-bold mb-0">Request Management</h5>
            </div>

            <div className="d-flex rounded-pill p-1 mb-4" style={{ background: 'var(--bs-tertiary-bg, #f1f3f5)' }}>
                <button
                    className={`flex-grow-1 py-2 rounded-pill border-0 fw-semibold ${tab === 'medication' ? 'btn-danger text-white' : 'text-body-secondary bg-transparent'}`}
                    onClick={() => setTab('medication')}
                >
                    Medication
                </button>
                <button
                    className={`flex-grow-1 py-2 rounded-pill border-0 fw-semibold ${tab === 'ambulance' ? 'btn-danger text-white' : 'text-body-secondary bg-transparent'}`}
                    onClick={() => setTab('ambulance')}
                >
                    Ambulance
                </button>
            </div>

            {activeList.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-body-secondary mb-0">No requests yet</p>
                </div>
            ) : (
                activeList.map(r => (
                    <div key={r.id} className="card mb-2 border-0 shadow-sm" style={{ borderRadius: '14px' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <strong>{r.medication_name || r.description}</strong>
                                    <div className="small text-body-secondary">
                                        {r.patient?.full_name || 'No patient specified'}
                                    </div>
                                    <div className="small text-body-secondary">
                                        {r.facility?.name || 'No facility specified'}
                                    </div>
                                    <div className="small text-body-secondary">
                                        {new Date(r.requested_at).toLocaleString()}
                                    </div>
                                </div>
                                <span className={`badge bg-${badgeColor(r.status)} rounded-pill`}>
                                    {r.status}
                                </span>
                            </div>
                            <select
                                className="form-select form-select-sm"
                                style={{ borderRadius: '10px' }}
                                value={r.status}
                                onChange={(e) => updateStatus(tab, r.id, e.target.value)}
                            >
                                {statusOptions.map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default RequestManagementPage;