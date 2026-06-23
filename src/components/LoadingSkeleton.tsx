import React from 'react';

const LoadingSkeleton: React.FC = () => {
    return (
        <div className="container py-3">
            <div className="placeholder-glow">
                <div className="placeholder rounded bg-secondary mb-3" style={{ height: '200px' }}></div>
                <div className="placeholder rounded bg-secondary mb-3" style={{ height: '60px' }}></div>
                <div className="row g-3">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="col-6">
                            <div className="placeholder rounded bg-secondary" style={{ height: '120px' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;