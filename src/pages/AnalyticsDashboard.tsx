import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { db, IncidentLog, Patient, EmergencyContact } from '../database/db';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalyticsDashboard: React.FC = () => {
    const [incidents, setIncidents] = useState<IncidentLog[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        setIncidents(await db.incidentLogs.toArray());
        setPatients(await db.patients.toArray());
        setContacts(await db.emergencyContacts.toArray());
        setLoading(false);
    };

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
        }],
    };

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
        datasets: [{ label: 'Incidents', data: counts, backgroundColor: '#dc3545', borderRadius: 8 }],
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <div className="container py-3">
            <h4 className="mb-3"><i className="bi bi-graph-up me-2 text-danger"></i>Analytics Dashboard</h4>
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="card bg-primary text-white shadow-sm"><div className="card-body text-center">
                        <i className="bi bi-journal-text fs-2"></i><h3 className="mb-0">{incidents.length}</h3><small>Total Incidents</small>
                    </div></div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card bg-success text-white shadow-sm"><div className="card-body text-center">
                        <i className="bi bi-people fs-2"></i><h3 className="mb-0">{patients.length}</h3><small>Patients</small>
                    </div></div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card bg-info text-white shadow-sm"><div className="card-body text-center">
                        <i className="bi bi-telephone fs-2"></i><h3 className="mb-0">{contacts.length}</h3><small>Emergency Contacts</small>
                    </div></div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card bg-warning text-dark shadow-sm"><div className="card-body text-center">
                        <i className="bi bi-exclamation-triangle fs-2"></i><h3 className="mb-0">{severityCounts.critical}</h3><small>Critical Cases</small>
                    </div></div>
                </div>
            </div>
            <div className="row g-3">
                <div className="col-md-6"><div className="card shadow-sm"><div className="card-header bg-white"><strong>Severity Distribution</strong></div><div className="card-body"><Pie data={pieData} /></div></div></div>
                <div className="col-md-6"><div className="card shadow-sm"><div className="card-header bg-white"><strong>Incidents (Last 6 Months)</strong></div><div className="card-body"><Bar data={barData} options={{ responsive: true }} /></div></div></div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;