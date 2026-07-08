import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../database/db';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import DarkModeToggle from '../components/DarkModeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [stats, setStats] = useState({ incidents: 0, patients: 0, contacts: 0, medicationRequests: 0, ambulanceRequests: 0 });
    const [serverStats, setServerStats] = useState({ incidents: 0, patients: 0, facilities: 0, contacts: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState({
        displayName: user?.displayName || '',
        phone: '',
        bio: '',
        location: '',
    });
    const [loading, setLoading] = useState(true);

    const userRole = user?.role || 'end_user';

    const roleKeys: Record<string, string> = {
        end_user: 'profile.role_end_user',
        chw: 'profile.role_chw',
        admin: 'profile.role_admin',
    };

    useEffect(() => {
        loadStats();
        loadUserProfile();
    }, []);

    const loadStats = async () => {
        setStats({
            incidents: await db.incidentLogs.count(),
            patients: await db.patients.count(),
            contacts: await db.emergencyContacts.count(),
            medicationRequests: await db.medicationRequests.count(),
            ambulanceRequests: await db.ambulanceRequests.count(),
        });

        if (userRole === 'admin' && navigator.onLine) {
            try {
                const res = await fetch('/api/v1/admin/stats');
                if (res.ok) setServerStats(await res.json());
            } catch (e) {
                console.error('Failed to load admin server stats:', e);
            }
        }

        setLoading(false);
    };

    const loadUserProfile = () => {
        const savedProfile = localStorage.getItem(`profile_${user?.uid}`);
        const savedPic = localStorage.getItem(`profile_pic_${user?.uid}`);
        if (savedPic) setProfilePic(savedPic);
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setProfile({
                    displayName: parsed.displayName || user?.displayName || '',
                    phone: parsed.phone || '',
                    bio: parsed.bio || '',
                    location: parsed.location || '',
                });
            } catch (e) {
                console.error('Error loading profile');
            }
        } else {
            setProfile({
                displayName: user?.displayName || '',
                phone: '',
                bio: '',
                location: '',
            });
        }
    };

    const handleSaveProfile = async () => {
        localStorage.setItem(`profile_${user?.uid}`, JSON.stringify(profile));
        setIsEditing(false);
        toast.success(t('profile.updated_success'));
    };

    const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setProfilePic(base64);
                localStorage.setItem(`profile_pic_${user?.uid}`, base64);
                toast.success(t('profile.pic_updated_success'));
            };
            reader.readAsDataURL(file);
        }
    };

    const displayName = profile.displayName || user?.displayName || user?.email?.split('@')[0] || t('profile.default_user');
    const roleName = t(roleKeys[userRole] || roleKeys.end_user);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-danger"></div>
            </div>
        );
    }

    return (
        <div className="container py-3" style={{ maxWidth: '480px', margin: '0 auto' }}>

            {/* Profile Header — same shape for everyone, but the badge/tagline differs */}
            <div
                className="card text-white mb-4 border-0"
                style={{
                    background: userRole === 'admin'
                        ? 'linear-gradient(145deg, #2c3e50, #1a252f)'
                        : userRole === 'chw'
                        ? 'linear-gradient(145deg, #e74c5e, #c0392b)'
                        : 'linear-gradient(145deg, #3498db, #2471a3)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
            >
                <div className="card-body text-center py-4">
                    <div className="position-relative d-inline-block mb-2">
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt={t('profile.picture_alt')}
                                className="rounded-circle border border-3 border-white"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div
                                className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center mx-auto"
                                style={{ width: '80px', height: '80px', fontSize: '40px' }}
                            >
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {isEditing && (
                            <button
                                className="btn btn-light btn-sm rounded-circle position-absolute bottom-0 end-0"
                                onClick={() => fileInputRef.current?.click()}
                                style={{ width: '30px', height: '30px', padding: 0 }}
                                aria-label={t('profile.change_picture')}
                            >
                                <i className="bi bi-camera"></i>
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="d-none"
                            accept="image/*"
                            onChange={handleProfilePicUpload}
                        />
                    </div>

                    {isEditing ? (
                        <input
                            type="text"
                            className="form-control form-control-lg text-center fw-bold mx-auto"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                            style={{ borderRadius: '12px', maxWidth: '300px' }}
                        />
                    ) : (
                        <h4 className="mb-0">{displayName}</h4>
                    )}

                    <p className="mb-0 opacity-75 small">{user?.email}</p>

                    <div className="mt-2">
                        <span className="badge bg-white text-dark px-3 py-1 rounded-pill">
                            {roleName}
                        </span>
                    </div>

                    <small className="opacity-50 d-block mt-2">
                        {t('profile.member_since', {
                            date: user?.metadata?.creationTime
                                ? new Date(user.metadata.creationTime).toLocaleDateString()
                                : new Date().toLocaleDateString(),
                        })}
                    </small>
                </div>
            </div>

            <div className="d-flex gap-2 mb-4">
                {isEditing ? (
                    <>
                        <button className="btn btn-success flex-grow-1 py-2 rounded-pill" onClick={handleSaveProfile}>
                            <i className="bi bi-check-lg me-2"></i>{t('profile.save_changes')}
                        </button>
                        <button
                            className="btn btn-outline-secondary py-2 rounded-pill"
                            onClick={() => { setIsEditing(false); loadUserProfile(); }}
                        >
                            {t('common.cancel')}
                        </button>
                    </>
                ) : (
                    <button className="btn btn-outline-danger w-100 py-2 rounded-pill" onClick={() => setIsEditing(true)}>
                        <i className="bi bi-pencil me-2"></i>{t('common.edit')}
                    </button>
                )}
            </div>

            {isEditing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '14px' }}>
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">{t('profile.additional_info')}</h6>
                            <div className="mb-3">
                                <label className="form-label small text-body-secondary">{t('profile.phone_number')}</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder={t('profile.phone_placeholder')}
                                    value={profile.phone || ''}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-body-secondary">{t('profile.location')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('profile.location_placeholder')}
                                    value={profile.location || ''}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>
                            <div className="mb-0">
                                <label className="form-label small text-body-secondary">{t('profile.bio')}</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    placeholder={t('profile.bio_placeholder')}
                                    value={profile.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    style={{ borderRadius: '10px' }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── ROLE-SPECIFIC CONTENT ─────────────────────────── */}

            {userRole === 'admin' && (
                <>
                    <h6 className="text-body-secondary mb-3">{t('profile.system_overview')}</h6>
                    <div className="row g-3 mb-4">
                        <div className="col-6">
                            <div className="card text-center shadow-sm p-3 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-journal-text fs-2 text-danger"></i>
                                <h3 className="mb-0">{serverStats.incidents}</h3>
                                <small className="text-body-secondary">{t('profile.total_incidents')}</small>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card text-center shadow-sm p-3 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-people fs-2 text-success"></i>
                                <h3 className="mb-0">{serverStats.patients}</h3>
                                <small className="text-body-secondary">{t('profile.total_patients')}</small>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card text-center shadow-sm p-3 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-building fs-2 text-primary"></i>
                                <h3 className="mb-0">{serverStats.facilities}</h3>
                                <small className="text-body-secondary">{t('profile.total_facilities')}</small>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card text-center shadow-sm p-3 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-telephone fs-2 text-info"></i>
                                <h3 className="mb-0">{serverStats.contacts}</h3>
                                <small className="text-body-secondary">{t('profile.total_contacts')}</small>
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn btn-outline-primary w-100 py-2 rounded-pill mb-4"
                        onClick={() => navigate('/admin')}
                    >
                        <i className="bi bi-speedometer2 me-2"></i>{t('profile.go_to_admin_panel')}
                    </button>
                </>
            )}

            {userRole === 'chw' && (
                <>
                    <h6 className="text-body-secondary mb-3">{t('profile.your_activity')}</h6>
                    <div className="row g-2 mb-3">
                        <div className="col-4">
                            <div className="card text-center shadow-sm p-2 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-journal-text fs-2 text-danger"></i>
                                <h3 className="mb-0">{stats.incidents}</h3>
                                <small className="text-body-secondary">{t('dashboard.incidents')}</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-center shadow-sm p-2 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-people fs-2 text-success"></i>
                                <h3 className="mb-0">{stats.patients}</h3>
                                <small className="text-body-secondary">{t('dashboard.patients')}</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-center shadow-sm p-2 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-telephone fs-2 text-primary"></i>
                                <h3 className="mb-0">{stats.contacts}</h3>
                                <small className="text-body-secondary">{t('nav.contacts')}</small>
                            </div>
                        </div>
                    </div>
                    <div className="row g-2 mb-4">
                        <div className="col-6">
                            <div className="card text-center shadow-sm p-2 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-capsule fs-2 text-info"></i>
                                <h3 className="mb-0">{stats.medicationRequests}</h3>
                                <small className="text-body-secondary">{t('medication.title')}</small>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card text-center shadow-sm p-2 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-truck fs-2 text-warning"></i>
                                <h3 className="mb-0">{stats.ambulanceRequests}</h3>
                                <small className="text-body-secondary">{t('ambulance.title')}</small>
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn btn-outline-danger w-100 py-2 rounded-pill mb-4"
                        onClick={() => navigate('/submit-guide')}
                    >
                        <i className="bi bi-journal-medical me-2"></i>{t('dashboard.submit_guide')}
                    </button>
                </>
            )}

            {userRole === 'end_user' && (
                <>
                    <h6 className="text-body-secondary mb-3">{t('profile.your_activity')}</h6>
                    <div className="row g-2 mb-4">
                        <div className="col-6">
                            <div className="card text-center shadow-sm p-2 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-capsule fs-2 text-info"></i>
                                <h3 className="mb-0">{stats.medicationRequests}</h3>
                                <small className="text-body-secondary">{t('medication.title')}</small>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card text-center shadow-sm p-2 border-0" style={{ borderRadius: '14px' }}>
                                <i className="bi bi-truck fs-2 text-warning"></i>
                                <h3 className="mb-0">{stats.ambulanceRequests}</h3>
                                <small className="text-body-secondary">{t('ambulance.title')}</small>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Settings — same for everyone */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '14px' }}>
                <div className="card-body">
                    <h6 className="fw-bold mb-2">{t('settings.title')}</h6>
                    <DarkModeToggle />
                    <hr className="my-1" />
                    <LanguageSwitcher />
                </div>
            </div>

            <button
                className="btn btn-outline-danger w-100 py-2 rounded-pill"
                onClick={() => { if (window.confirm(t('profile.logout_confirm'))) logout(); }}
            >
                <i className="bi bi-box-arrow-right me-2"></i>{t('profile.sign_out')}
            </button>
            <div className="text-center mt-3">
                <small className="text-body-secondary">{t('profile.tagline')}</small>
            </div>
        </div>
    );
};

export default ProfilePage;