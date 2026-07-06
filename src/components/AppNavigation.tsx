import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const AppNavigation: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const role = user?.role || 'end_user';

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `nav-link text-center ${isActive ? 'text-danger' : 'text-secondary'}`;

    // Admin navigation
    if (role === 'admin') {
        return (
            <nav className="navbar fixed-bottom bg-body border-top py-2 shadow-sm">
                <div className="container-fluid justify-content-around">
                    <NavLink to="/admin" className={linkClass}>
                        <i className="bi bi-gear fs-5 d-block"></i>
                        <small>{t('nav.admin')}</small>
                    </NavLink>
                    <NavLink to="/profile" className={linkClass}>
                        <i className="bi bi-person-circle fs-5 d-block"></i>
                        <small>{t('nav.profile')}</small>
                    </NavLink>
                </div>
            </nav>
        );
    }

    // CHW navigation — trimmed to 4 core items
    if (role === 'chw') {
        const chwLinks = [
            { icon: 'bi-house-door', label: t('nav.home'), path: '/' },
            { icon: 'bi-people', label: t('nav.patients'), path: '/patients' },
            { icon: 'bi-journal-text', label: t('nav.logs'), path: '/incidents' },
            { icon: 'bi-person-circle', label: t('nav.profile'), path: '/profile' },
        ];
        return (
            <nav className="navbar fixed-bottom bg-body border-top py-2 shadow-sm">
                <div className="container-fluid justify-content-around">
                    {chwLinks.map((link, index) => (
                        <NavLink key={index} to={link.path} className={linkClass}>
                            <i className={`${link.icon} fs-5 d-block`}></i>
                            <small>{link.label}</small>
                        </NavLink>
                    ))}
                </div>
            </nav>
        );
    }

    // End User navigation
    const endUserLinks = [
        { icon: 'bi-house-door', label: t('nav.home'), path: '/' },
        { icon: 'bi-person-circle', label: t('nav.profile'), path: '/profile' },
    ];

    return (
        <nav className="navbar fixed-bottom bg-body border-top py-2 shadow-sm">
            <div className="container-fluid justify-content-around">
                {endUserLinks.map((link, index) => (
                    <NavLink key={index} to={link.path} className={linkClass}>
                        <i className={`${link.icon} fs-5 d-block`}></i>
                        <small>{link.label}</small>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default AppNavigation;