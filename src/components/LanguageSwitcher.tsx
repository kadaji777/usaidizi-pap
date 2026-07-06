import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { t, i18n } = useTranslation();

    const setLanguage = (lang: 'en' | 'sw') => {
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
    };

    return (
        <div className="d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center gap-2">
                <i className="bi bi-translate fs-5 text-danger"></i>
                <span>{t('settings.language')}</span>
            </div>
            <div className="btn-group" role="group" aria-label={t('settings.language')}>
                <button
                    type="button"
                    className={`btn btn-sm ${i18n.language === 'en' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setLanguage('en')}
                >
                    EN
                </button>
                <button
                    type="button"
                    className={`btn btn-sm ${i18n.language === 'sw' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setLanguage('sw')}
                >
                    SW
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;