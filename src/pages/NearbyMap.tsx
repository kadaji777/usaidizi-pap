import React from 'react';
import { Facility } from '../database/db';
import { distanceKm, formatDistance, googleMapsDirectionsUrl } from '../utils/geo';

interface NearbyMapProps {
    facilities: Facility[];
    userLat: number | null;
    userLng: number | null;
}

const NearbyMap: React.FC<NearbyMapProps> = ({ facilities, userLat, userLng }) => {
    if (userLat === null || userLng === null) {
        return null;
    }

    const withDistance = facilities
        .filter(f => f.latitude !== undefined && f.longitude !== undefined)
        .map(f => ({
            ...f,
            distance: distanceKm(userLat, userLng, f.latitude!, f.longitude!),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

    if (withDistance.length === 0) {
        return (
            <div className="alert alert-warning small mt-3" role="alert">
                <i className="bi bi-geo-alt me-2"></i>
                No facilities have location data yet — an admin needs to add coordinates.
            </div>
        );
    }

    const getIcon = (t: string) => (t === 'hospital' ? '🏥' : t === 'police' ? '👮' : '💊');

    return (
        <div className="card border-0 shadow-sm mt-3" style={{ borderRadius: '14px' }}>
            <div className="card-body">
                <h6 className="fw-bold mb-3">
                    <i className="bi bi-geo-alt-fill text-danger me-2"></i>Nearest to You
                </h6>
                {withDistance.map(f => (
                    <div key={f.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div>
                            <div className="fw-semibold">{getIcon(f.type)} {f.name}</div>
                            <small className="text-body-secondary">{formatDistance(f.distance)} away</small>
                        </div>
                        
                            href={googleMapsDirectionsUrl(f.latitude!, f.longitude!)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                        >
                            <i className="bi bi-signpost-2 me-1"></i>Directions
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NearbyMap;