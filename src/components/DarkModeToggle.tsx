import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DarkModeToggle: React.FC = () => {
    const { t } = useTranslation();
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) return stored === 'true';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', String(isDark));
    }, [isDark]);

    return (
        <div className="d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center gap-2">
                <i className={`bi bi-${isDark ? 'moon-stars-fill' : 'sun-fill'} fs-5 text-danger`}></i>
                <span>{t('settings.dark_mode')}</span>
            </div>
            <div className="form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={isDark}
                    onChange={() => setIsDark(!isDark)}
                    style={{ width: '2.5em', height: '1.4em', cursor: 'pointer' }}
                    aria-label={t('settings.dark_mode')}
                />
            </div>
        </div>
    );
};

export default DarkModeToggle;