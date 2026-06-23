import React, { useEffect, useState } from 'react';
import { db, Facility } from '../database/db';
import NearbyMap from '../components/NearbyMap';

const FacilitiesPage: React.FC = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<'all' | 'hospital' | 'police' | 'pharmacy'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadFacilities();
    }, []);

    useEffect(() => {
        filterFacilities();
    }, [type, searchTerm, facilities]);

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
        
        setFilteredFacilities(filtered);
    };

    const getIcon = (t: string) => t === 'hospital' ? '🏥' : t === 'police' ? '👮' : '💊';

    if (loading) {
        return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
    }

    return (
        <div className="container py-3">
            {/* Hero Banner with Stock Image */}
            <div className="bg-primary text-white rounded-3 p-4 mb-4 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/1483/1483508.png" 
                    alt="Facilities" 
                    style={{ width: '60px', marginBottom: '15px' }}
                />
                <h4 className="mb-2">Find Help Near You</h4>
                <p className="mb-0 opacity-75">Locate hospitals, police stations, and pharmacies in your area</p>
            </div>
            
            {/* Search Bar */}
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
            
            {/* Type Filters */}
            <div className="btn-group w-100 mb-3" role="group">
                <button className={`btn ${type === 'all' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setType('all')}>All</button>
                <button className={`btn ${type === 'hospital' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setType('hospital')}>🏥 Hospitals</button>
                <button className={`btn ${type === 'police' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setType('police')}>👮 Police</button>
                <button className={`btn ${type === 'pharmacy' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setType('pharmacy')}>💊 Pharmacies</button>
            </div>
            
            {/* Results Count */}
            <div className="text-muted small mb-2">
                Found {filteredFacilities.length} facilities
            </div>
            
            {/* Facilities List */}
            {filteredFacilities.map(f => (
                <div key={f.id} className="card mb-2 shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-0">{getIcon(f.type)} {f.name}</h6>
                            <small className="text-muted">{f.county} • {f.landmark || 'No landmark'}</small>
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
                    <p className="text-muted">No facilities found</p>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => { setSearchTerm(''); setType('all'); }}>
                        Clear Filters
                    </button>
                </div>
            )}
            
            {/* Nearby Map Component */}
            <NearbyMap />
        </div>
    );
};

export default FacilitiesPage;