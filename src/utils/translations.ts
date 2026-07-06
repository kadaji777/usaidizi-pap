import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            'nav.home': 'Home',
            'nav.admin': 'Admin',
            'nav.profile': 'Profile',
            'nav.logs': 'Logs',
            'nav.patients': 'Patients',
            'nav.contacts': 'Contacts',
            'nav.find_help': 'Find Help',
            
            // Common
            'common.emergency': 'Emergency',
            'common.call_999': 'Call 999',
            'common.save': 'Save',
            'common.cancel': 'Cancel',
            'common.delete': 'Delete',
            'common.edit': 'Edit',
            'common.search': 'Search',
            'common.loading': 'Loading...',
            'common.offline': 'You are offline. Data is saved locally.',
            'common.sync': 'Sync',
            'common.syncing': 'Syncing...',
            'common.synced': 'Synced',
            
            // Dashboard
            'dashboard.welcome': 'Welcome back, {name}!',
            'dashboard.incidents': 'Incidents',
            'dashboard.patients': 'Patients',
            'dashboard.facilities': 'Facilities',
            'dashboard.contacts': 'Contacts',
            
            // First Aid
            'firstaid.burns': 'Burns',
            'firstaid.fractures': 'Fractures',
            'firstaid.choking': 'Choking',
            'firstaid.seizures': 'Seizures',
            'firstaid.bleeding': 'Bleeding',
            'firstaid.guides': 'First Aid Guides',
            'firstaid.steps': 'Step-by-Step Instructions',
            'firstaid.dos': 'DO\'s',
            'firstaid.donts': 'DON\'Ts',
            'firstaid.warning': 'Warning Signs',
            
            // Admin
            'admin.panel': 'Admin Panel',
            'admin.users': 'User Management',
            'admin.content': 'Content Management',
            'admin.facilities_manage': 'Facility Management',
            'admin.analytics': 'Analytics',
            'admin.sync': 'Data Sync',
            'admin.health': 'System Health',
            'admin.settings': 'Settings',
            
            // Settings
            'settings.dark_mode': 'Dark Mode',
            'settings.language': 'Language',
            'settings.notifications': 'Notifications',
            'settings.version': 'App Version',
            'settings.save': 'Save Settings',
        }
    },
    sw: {
        translation: {
            // Navigation
            'nav.home': 'Nyumbani',
            'nav.admin': 'Msimamizi',
            'nav.profile': 'Wasifu',
            'nav.logs': 'Rekodi',
            'nav.patients': 'Wagonjwa',
            'nav.contacts': 'Wasiliani',
            'nav.find_help': 'Tafuta Msaada',
            
            // Common
            'common.emergency': 'Dharura',
            'common.call_999': 'Piga 999',
            'common.save': 'Hifadhi',
            'common.cancel': 'Ghairi',
            'common.delete': 'Futa',
            'common.edit': 'Badilisha',
            'common.search': 'Tafuta',
            'common.loading': 'Inapakia...',
            'common.offline': 'Uko nje ya mtandao. Data imehifadhiwa ndani.',
            'common.sync': 'Sawazisha',
            'common.syncing': 'Inasawazisha...',
            'common.synced': 'Imesawazishwa',
            
            // Dashboard
            'dashboard.welcome': 'Karibu tena, {name}!',
            'dashboard.incidents': 'Matukio',
            'dashboard.patients': 'Wagonjwa',
            'dashboard.facilities': 'Vituo',
            'dashboard.contacts': 'Wasiliani',
            
            // First Aid
            'firstaid.burns': 'Miwaka',
            'firstaid.fractures': 'Mivunjiko',
            'firstaid.choking': 'Kukaba',
            'firstaid.seizures': 'Kifafa',
            'firstaid.bleeding': 'Kuvuja Damu',
            'firstaid.guides': 'Miongozo ya Dharura',
            'firstaid.steps': 'Maagizo ya Hatua kwa Hatua',
            'firstaid.dos': 'Fanya Hivi',
            'firstaid.donts': 'Usifanye Hivi',
            'firstaid.warning': 'Ishara za Onyo',
            
            // Admin
            'admin.panel': 'Paneli la Msimamizi',
            'admin.users': 'Usimamizi wa Watumiaji',
            'admin.content': 'Usimamizi wa Maudhui',
            'admin.facilities_manage': 'Usimamizi wa Vituo',
            'admin.analytics': 'Uchambuzi',
            'admin.sync': 'Usawazishaji wa Data',
            'admin.health': 'Afya ya Mfumo',
            'admin.settings': 'Mipangilio',
            
            // Settings
            'settings.dark_mode': 'Hali ya Giza',
            'settings.language': 'Lugha',
            'settings.notifications': 'Arifa',
            'settings.version': 'Toleo la App',
            'settings.save': 'Hifadhi Mipangilio',
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;