import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('i18nextLng') || 'en';
    });
    const [notifications, setNotifications] = useState(() => {
        return localStorage.getItem('notifications') !== 'false';
    });

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem('i18nextLng', newLang);
        // Reload to apply translations
        setTimeout(() => window.location.reload(), 500);
    };

    const handleSave = () => {
        localStorage.setItem('notifications', String(notifications));
        toast.success('✅ Settings saved successfully!');
    };

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
                <button className="btn btn-link text-dark p-0" onClick={() => navigate('/admin')}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </button>
                <h5 className="fw-bold mb-0">⚙️ System Settings</h5>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                    
                    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                        <div>
                            <h6 className="fw-bold mb-0">🌙 Dark Mode</h6>
                            <small className="text-muted">Toggle dark theme</small>
                        </div>
                        <div className="form-check form-switch">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={isDark}
                                onChange={toggleTheme}
                                style={{ width: '48px', height: '24px', cursor: 'pointer' }}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                        <div>
                            <h6 className="fw-bold mb-0">🌍 Language</h6>
                            <small className="text-muted">Select your preferred language</small>
                        </div>
                        <select 
                            className="form-select w-auto"
                            value={language}
                            onChange={handleLanguageChange}
                            style={{ maxWidth: '120px', borderRadius: '10px' }}
                        >
                            <option value="en">🇬🇧 English</option>
                            <option value="sw">🇰🇪 Kiswahili</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                        <div>
                            <h6 className="fw-bold mb-0">🔔 Notifications</h6>
                            <small className="text-muted">Receive emergency alerts</small>
                        </div>
                        <div className="form-check form-switch">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={notifications}
                                onChange={() => setNotifications(!notifications)}
                                style={{ width: '48px', height: '24px', cursor: 'pointer' }}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center py-3">
                        <div>
                            <h6 className="fw-bold mb-0">📱 App Version</h6>
                            <small className="text-muted">Current version</small>
                        </div>
                        <span className="badge bg-secondary rounded-pill px-3 py-2">2.0.0</span>
                    </div>

                </div>
            </div>

            <button 
                className="btn btn-danger w-100 py-2 rounded-pill fw-bold mt-4"
                onClick={handleSave}
            >
                <i className="bi bi-check-lg me-2"></i>Save Settings
            </button>

            <button 
                className="btn btn-outline-secondary w-100 mt-3 py-2 rounded-pill"
                onClick={() => navigate('/admin')}
            >
                <i className="bi bi-arrow-left me-2"></i>Back to Admin
            </button>
        </div>
    );
};

export default SettingsPage;