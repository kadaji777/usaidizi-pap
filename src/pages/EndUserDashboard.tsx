import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const EndUserDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [greetingKey, setGreetingKey] = useState('dashboard.greeting_morning');
    const [greetingEmoji, setGreetingEmoji] = useState('☀️');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreetingKey('dashboard.greeting_morning');
            setGreetingEmoji('☀️');
        } else if (hour < 18) {
            setGreetingKey('dashboard.greeting_afternoon');
            setGreetingEmoji('🌤️');
        } else {
            setGreetingKey('dashboard.greeting_evening');
            setGreetingEmoji('🌙');
        }
    }, []);

    const emergencyGuides = [
        { name: t('firstaid.burns'), icon: 'bi-droplet', color: '#e74c5e', slug: 'burns' },
        { name: t('firstaid.fractures'), icon: 'bi-bandaid', color: '#f39c12', slug: 'fractures' },
        { name: t('firstaid.choking'), icon: 'bi-lungs', color: '#3498db', slug: 'choking' },
        { name: t('firstaid.seizures'), icon: 'bi-lightning', color: '#9b59b6', slug: 'seizures' },
        { name: t('firstaid.bleeding'), icon: 'bi-droplet-half', color: '#e74c5e', slug: 'severe-bleeding' },
    ];

    const quickActions = [
        { icon: 'bi-telephone', label: t('common.call_999'), action: () => window.location.href = 'tel:999', color: '#dc3545' },
        { icon: 'bi-building', label: t('nav.find_help'), path: '/facilities', color: '#0d6efd' },
        { icon: 'bi-telephone', label: t('nav.contacts'), path: '/contacts', color: '#198754' },
    ];

    return (
        <div className="container pt-5 pb-3" style={{ maxWidth: '480px', margin: '0 auto' }}>

            <div className="mb-4">
                <h5 className="mb-0">{greetingEmoji} {t(greetingKey)}</h5>
                <p className="text-body-secondary small mb-0">
                    {t('dashboard.welcome_back', { name: user?.displayName || t('dashboard.default_user') })}
                </p>
            </div>

            {/* Quick Actions - Clean Grid */}
            <div className="row g-2 mb-5">
                {quickActions.map((action, index) => (
                    <div key={index} className="col-4">
                        <button
                            className="card w-100 py-3 rounded-3 border-0 shadow-sm"
                            onClick={() => {
                                if (action.path) navigate(action.path);
                                if (action.action) action.action();
                            }}
                        >
                            <i className={`${action.icon} fs-4`} style={{ color: action.color }}></i>
                            <small style={{ fontSize: '9px', display: 'block', marginTop: '4px' }}>
                                {action.label}
                            </small>
                        </button>
                    </div>
                ))}
            </div>

            {/* First Aid Guides */}
            <h6 className="fw-bold mb-3">{t('firstaid.guides')}</h6>
            <div className="row g-2">
                {emergencyGuides.map((item, i) => (
                    <div key={i} className="col-6">
                        <div
                            className="card text-center p-3 border-0 shadow-sm"
                            style={{ borderRadius: '12px', cursor: 'pointer' }}
                            onClick={() => navigate(`/firstaid/${item.slug}`)}
                        >
                            <i className={`${item.icon} fs-2`} style={{ color: item.color }}></i>
                            <small className="fw-bold mt-1">{item.name}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EndUserDashboard;