import React, { useState, useEffect } from 'react';
import { db, Facility } from '../database/db';

const NearbyMap: React.FC = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        loadFacilities();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                err => console.log('Geolocation error:', err)
            );
        }
    }, []);

    const loadFacilities = async () => {
        const all = await db.facilities.toArray();
        setFacilities(all);
    };

    const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    const facilitiesWithLocation = facilities.filter(f => f.latitude && f.longitude);
    
    const sorted = facilitiesWithLocation.map(f => ({
        ...f,
        distance: userLocation ? getDistance(userLocation.lat, userLocation.lng, f.latitude!, f.longitude!) : null
    })).sort((a, b) => (a.distance || 999) - (b.distance || 999));

    if (sorted.length === 0) return null;

    return (
        <div className="card mt-3 shadow-sm">
            <div className="card-header bg-danger text-white">
                <i className="bi bi-map me-2"></i>Nearby Facilities
            </div>
            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {!userLocation && <div className="alert alert-warning small">Enable location to see distances</div>}
                {sorted.map(f => (
                    <div key={f.id} className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                        <div>
                            <strong>{f.type === 'hospital' ? '🏥' : f.type === 'police' ? '👮' : '💊'} {f.name}</strong>
                            <div className="small text-muted">{f.landmark || f.county}</div>
                        </div>
                        <div className="text-end">
                            {f.distance !== null && (
                                <span className="badge bg-primary me-2">
                                    {f.distance < 1 ? `${Math.round(f.distance * 1000)}m` : `${f.distance.toFixed(1)}km`}
                                </span>
                            )}
                            {f.phone && (
                                <button className="btn btn-sm btn-success" onClick={() => window.location.href = `tel:${f.phone}`}>
                                    <i className="bi bi-telephone"></i>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NearbyMap;