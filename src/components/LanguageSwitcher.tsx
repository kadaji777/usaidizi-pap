import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'sw' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <button
            className="btn btn-sm btn-outline-secondary rounded-circle position-fixed"
            style={{ top: '70px', right: '15px', zIndex: 1000, width: '40px', height: '40px' }}
            onClick={toggleLanguage}
        >
            {i18n.language === 'en' ? '🇰🇪' : '🇬🇧'}
        </button>
    );
};

export default LanguageSwitcher;