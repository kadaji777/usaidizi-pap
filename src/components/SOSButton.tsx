import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { db } from '../database/db';

const SOSButton: React.FC = () => {
    const [sending, setSending] = useState(false);

    const getLocation = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) reject(new Error('Geolocation not supported'));
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const sendSOS = async () => {
        setSending(true);
        toast.loading('Getting your location...', { id: 'sos' });
        try {
            const position = await getLocation();
            const mapsUrl = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
            const message = `EMERGENCY SOS! I need immediate medical assistance. My location: ${mapsUrl}`;
            
            const contacts = await db.emergencyContacts.toArray();
            if (contacts.length > 0 && window.confirm('Send SOS to your emergency contacts?')) {
                for (const contact of contacts) {
                    window.open(`sms:${contact.phone}?body=${encodeURIComponent(message)}`, '_blank');
                }
                toast.success('SOS triggered!', { id: 'sos' });
            }
            if (window.confirm('Call emergency services (999)?')) window.location.href = 'tel:999';
        } catch (error) {
            toast.error('Could not get location. Enable location services.', { id: 'sos' });
        }
        setSending(false);
    };

    return (
        <button className={`btn rounded-circle shadow-lg ${sending ? 'btn-secondary' : 'btn-danger'} sos-button`} onClick={sendSOS} disabled={sending}>
            <i className="bi bi-sos fs-2"></i><div className="small">SOS</div>
        </button>
    );
};

export default SOSButton;