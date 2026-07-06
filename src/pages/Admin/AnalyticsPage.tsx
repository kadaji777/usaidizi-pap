import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface IncidentRecord {
    id: number;
    severity: string;
    incident_timestamp: string;
}

const AnalyticsPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
    const [stats, setStats] = useState({
        incidents: 0,
        patients: 0,
        contacts: 0,
        facilities: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(false);
        try {
            const [statsRes, incidentsRes] = await Promise.all([
                fetch('/api/v1/admin/stats'),
                fetch('/api/v1/admin/incidents'),
            ]);
            if (!statsRes.ok || !incidentsRes.ok) throw new Error('Request failed');
            setStats(await statsRes.json());
            setIncidents(await incidentsRes.json());
        } catch (e) {
            console.error('Failed to load analytics:', e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Severity distribution
    const severityCounts = {
        low: incidents.filter(i => i.severity === 'low').length,
        medium: incidents.filter(i => i.severity === 'medium').length,
        high: incidents.filter(i => i.severity === 'high').length,
        critical: incidents.filter(i => i.severity === 'critical').length,
    };

    const pieData = {
        labels: ['Low', 'Medium', 'High', 'Critical'],
        datasets: [{
            data: [severityCounts.low, severityCounts.medium, severityCounts.high, severityCounts.critical],
            backgroundColor: ['#0dcaf0', '#ffc107', '#fd7e14', '#dc3545'],
            borderWidth: 0,
        }],
    };

    // Last 6 months
    const getLast6Months = () => {
        const months = [];
        const counts = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(month.toLocaleString('default', { month: 'short' }));
            const count = incidents.filter(incident => {
                const incDate = new Date(incident.incident_timestamp);
                return incDate.getMonth() === month.getMonth() && incDate.getFullYear() === month.getFullYear();
            }).length;
            counts.push(count);
        }
        return { months, counts };
    };

    const { months, counts } = getLast6Months();

    const barData = {
        labels: months,
        datasets: [{
            label: 'Incidents',
            data: counts,
            backgroundColor: '#e74c5e',
            borderRadius: 8,
        }],
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger"></div>
            </div>
        );
    }

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>

            <div className="d-flex align-items-center gap-3 mb-4">
                <button className="btn btn-link text-body p-0" onClick={() => navigate('/admin')}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </button>
                <h5 className="fw-bold mb-0">📊 Advanced Analytics</h5>
            </div>

            {error && (
                <div className="alert alert-warning small mb-3" role="alert">
                    Couldn't reach the server — data may be incomplete.
                    <button className="btn btn-sm btn-link p-0 ms-2" onClick={loadData}>Retry</button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="row g-2 mb-4">
                <div className="col-3">
                    <div className="card border-0 shadow-sm text-center p-2 rounded-3">
                        <h5 className="text-danger mb-0">{stats.incidents}</h5>
                        <small className="text-body-secondary">Incidents</small>
                    </div>
                </div>
                <div className="col-3">
                    <div className="card border-0 shadow-sm text-center p-2 rounded-3">
                        <h5 className="text-success mb-0">{stats.patients}</h5>
                        <small className="text-body-secondary">Patients</small>
                    </div>
                </div>
                <div className="col-3">
                    <div className="card border-0 shadow-sm text-center p-2 rounded-3">
                        <h5 className="text-primary mb-0">{stats.contacts}</h5>
                        <small className="text-body-secondary">Contacts</small>
                    </div>
                </div>
                <div className="col-3">
                    <div className="card border-0 shadow-sm text-center p-2 rounded-3">
                        <h5 className="text-info mb-0">{stats.facilities}</h5>
                        <small className="text-body-secondary">Facilities</small>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="card border-0 shadow-sm mb-3 rounded-4">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">Severity Distribution</h6>
                    <div style={{ maxHeight: '250px' }}>
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4 rounded-4">
                <div className="card-body">
                    <h6 className="fw-bold mb-3">Incidents (Last 6 Months)</h6>
                    <div style={{ maxHeight: '250px' }}>
                        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </div>
            </div>

            <button className="btn btn-outline-secondary w-100 py-2 rounded-pill" onClick={() => navigate('/admin')}>
                <i className="bi bi-arrow-left me-2"></i>Back to Admin
            </button>
        </div>
    );
};

export default AnalyticsPage;