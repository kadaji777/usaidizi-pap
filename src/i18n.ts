import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './translations/en.json';
import swTranslations from './translations/sw.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslations },
            sw: { translation: swTranslations }
        },
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
    });

export default i18n;