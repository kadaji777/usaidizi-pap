import React, { useEffect, useState } from 'react';
import { db, Facility } from '../database/db';
import NearbyMap from '../components/NearbyMap';
import { distanceKm } from '../utils/geo';
import toast from 'react-hot-toast';

const FacilitiesPage: React.FC = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<'all' | 'hospital' | 'police' | 'pharmacy'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [userLat, setUserLat] = useState<number | null>(null);
    const [userLng, setUserLng] = useState<number | null>(null);
    const [locating, setLocating] = useState(false);
    const [sortByDistance, setSortByDistance] = useState(false);

    useEffect(() => {
        loadFacilities();
    }, []);

    useEffect(() => {
        filterFacilities();
    }, [type, searchTerm, facilities, sortByDistance, userLat, userLng]);

    const loadFacilities = async () => {
        let local = await db.facilities.toArray();
        if (local.length === 0 && navigator.onLine) {
            try {
                const res = await fetch('/api/v1/facilities');
                const data = await res.json();
                await db.facilities.bulkAdd(data);
                local = data;
            } catch (error) {
                console.error(error);
            }
        }
        setFacilities(local);
        setLoading(false);
    };

    const enableNearMe = () => {
        if (!('geolocation' in navigator)) {
            toast.error('Location services not available on this device');
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLat(pos.coords.latitude);
                setUserLng(pos.coords.longitude);
                setSortByDistance(true);
                setLocating(false);
                toast.success('Sorted by distance!');
            },
            () => {
                setLocating(false);
                toast.error('Could not get your location');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const filterFacilities = () => {
        let filtered = [...facilities];

        if (type !== 'all') {
            filtered = filtered.filter(f => f.type === type);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(f =>
                f.name.toLowerCase().includes(term) ||
                f.county.toLowerCase().includes(term) ||
                (f.landmark && f.landmark.toLowerCase().includes(term))
            );
        }

        if (sortByDistance && userLat !== null && userLng !== null) {
            filtered = filtered
                .map(f => ({
                    ...f,
                    _distance: (f.latitude !== undefined && f.longitude !== undefined)
                        ? distanceKm(userLat, userLng, f.latitude, f.longitude)
                        : Infinity,
                }))
                .sort((a, b) => a._distance - b._distance);
        }

        setFilteredFacilities(filtered);
    };

    const getIcon = (t: string) => t === 'hospital' ? '🏥' : t === 'police' ? '👮' : '💊';

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
    }

    return (
        <div className="container py-3">
            <div className="bg-primary text-white rounded-3 p-4 mb-4 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/1483/1483508.png"
                    alt="Facilities"
                    style={{ width: '60px', marginBottom: '15px' }}
                />
                <h4 className="mb-2">Find Help Near You</h4>
                <p className="mb-0 opacity-75">Locate hospitals, police stations, and pharmacies in your area</p>
            </div>

            <button
                className={`btn w-100 mb-3 rounded-pill ${sortByDistance ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={enableNearMe}
                disabled={locating}
            >
                {locating ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                    <i className="bi bi-geo-alt-fill me-2"></i>
                )}
                {sortByDistance ? 'Sorted by Distance ✓' : 'Sort by Distance from Me'}
            </button>

            <div className="input-group mb-3">
                <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                </span>
                <input type="text" className="form-control"
                       placeholder="Search by name, county, or landmark..."
                       value={searchTerm}
                       onChange={e => setSearchTerm(e.target.value)} />
                {searchTerm && (
                    <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                )}
            </div>

            <div className="btn-group w-100 mb-3" role="group">
                <button className={`btn ${type === 'all' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setType('all')}>All</button>
                <button className={`btn ${type === 'hospital' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setType('hospital')}>🏥 Hospitals</button>
                <button className={`btn ${type === 'police' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setType('police')}>👮 Police</button>
                <button className={`btn ${type === 'pharmacy' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setType('pharmacy')}>💊 Pharmacies</button>
            </div>

            <div className="text-body-secondary small mb-2">
                Found {filteredFacilities.length} facilities
            </div>

            {filteredFacilities.map((f: any) => (
                <div key={f.id} className="card mb-2 shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-0">{getIcon(f.type)} {f.name}</h6>
                            <small className="text-body-secondary">
                                {f.county} • {f.landmark || 'No landmark'}
                                {sortByDistance && f._distance !== undefined && f._distance !== Infinity && (
                                    <> • <span className="text-danger fw-semibold">{f._distance.toFixed(1)} km away</span></>
                                )}
                            </small>
                        </div>
                        {f.phone && (
                            <button className="btn btn-success btn-sm" onClick={() => window.location.href = `tel:${f.phone}`}>
                                <i className="bi bi-telephone"></i> Call
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {filteredFacilities.length === 0 && (
                <div className="text-center py-5">
                    <p className="text-body-secondary">No facilities found</p>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => { setSearchTerm(''); setType('all'); }}>
                        Clear Filters
                    </button>
                </div>
            )}

            <NearbyMap facilities={facilities} userLat={userLat} userLng={userLng} />
        </div>
    );
};

export default FacilitiesPage;