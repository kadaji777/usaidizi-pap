import React, { useEffect, useState } from 'react';
import { db } from '../database/db';
import CountUp from 'react-countup';

const StatsCounter: React.FC = () => {
    const [stats, setStats] = useState({ incidents: 0, patients: 0, contacts: 0, facilities: 0 });
    useEffect(() => { Promise.all([db.incidentLogs.count(), db.patients.count(), db.emergencyContacts.count(), db.facilities.count()]).then(([incidents, patients, contacts, facilities]) => setStats({ incidents, patients, contacts, facilities })); }, []);
    const items = [
        { icon: '📋', value: stats.incidents, label: 'Incidents Logged', color: 'danger' },
        { icon: '👥', value: stats.patients, label: 'Patients', color: 'primary' },
        { icon: '📞', value: stats.contacts, label: 'Emergency Contacts', color: 'success' },
        { icon: '🏥', value: stats.facilities, label: 'Facilities', color: 'info' }
    ];
    return (
        <div className="bg-light py-4 my-4 rounded">
            <div className="container"><h5 className="text-center mb-4">Your Impact</h5><div className="row text-center">{items.map((item, i) => (<div key={i} className="col-6 col-md-3 mb-3"><div className="display-4">{item.icon}</div><h3 className={`text-${item.color} mb-0`}><CountUp end={item.value} duration={2.5} /></h3><small className="text-muted">{item.label}</small></div>))}</div></div>
        </div>
    );
};

export default StatsCounter;