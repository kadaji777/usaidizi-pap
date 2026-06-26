import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/custom.scss';
// Usaidizi Pap! Main Application
// Auth
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';

// Pages
import HomePage from './pages/HomePage';
import FirstAidDetailPage from './pages/FirstAidDetailPage';
import IncidentsPage from './pages/IncidentsPage';
import PatientsPage from './pages/PatientsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import FirstAidQuiz from './pages/FirstAidQuiz';
import ProfilePage from './pages/ProfilePage';

// Components
import OfflineStatus from './components/OfflineStatus';
import SyncStatus from './components/SyncStatus';
import ToastProvider from './components/ToastProvider';
import DarkModeToggle from './components/DarkModeToggle';
import LanguageSwitcher from './components/LanguageSwitcher';
import VoiceAssistant from './components/VoiceAssistant';
import SOSButton from './components/SOSButton';
import ExportData from './components/ExportData';
import MedicationReminder from './components/MedicationReminder';
import FloatingActionButton from './components/FloatingActionButton';

const AppContent: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
        }
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <>
            <OfflineStatus isOnline={isOnline} />
            <DarkModeToggle />
            <LanguageSwitcher />
            <SyncStatus />
            <VoiceAssistant />
            
            {/* SOS Button */}
            <div className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: 1000, bottom: '70px' }}>
                <SOSButton />
            </div>
            
            {/* Floating Action Button */}
            <FloatingActionButton />
            
            {/* Main Content */}
            <div className="pb-5">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/firstaid/:slug" element={<FirstAidDetailPage />} />
                    <Route path="/incidents" element={<IncidentsPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/contacts" element={<EmergencyContactsPage />} />
                    <Route path="/facilities" element={<FacilitiesPage />} />
                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/quiz" element={<FirstAidQuiz />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </div>
            
            {/* Bottom Navigation Bar */}
            <nav className="navbar fixed-bottom navbar-light bg-white border-top py-2 shadow">
                <div className="container-fluid justify-content-around">
                    <NavLink to="/" className={({ isActive }) => 
                        `nav-link text-center ${isActive ? 'text-danger' : 'text-secondary'}`
                    }>
                        <i className="bi bi-house-door fs-5 d-block"></i>
                        <small>Home</small>
                    </NavLink>
                    
                    <NavLink to="/incidents" className={({ isActive }) => 
                        `nav-link text-center ${isActive ? 'text-danger' : 'text-secondary'}`
                    }>
                        <i className="bi bi-journal-text fs-5 d-block"></i>
                        <small>Logs</small>
                    </NavLink>
                    
                    <NavLink to="/patients" className={({ isActive }) => 
                        `nav-link text-center ${isActive ? 'text-danger' : 'text-secondary'}`
                    }>
                        <i className="bi bi-people fs-5 d-block"></i>
                        <small>Patients</small>
                    </NavLink>
                    
                    <NavLink to="/contacts" className={({ isActive }) => 
                        `nav-link text-center ${isActive ? 'text-danger' : 'text-secondary'}`
                    }>
                        <i className="bi bi-telephone fs-5 d-block"></i>
                        <small>Contacts</small>
                    </NavLink>
                    
                    <div className="dropdown">
                        <button 
                            className="nav-link text-secondary text-center bg-transparent border-0" 
                            data-bs-toggle="dropdown"
                        >
                            <i className="bi bi-grid-3x3-gap-fill fs-5 d-block"></i>
                            <small>More</small>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end mb-2">
                            <li>
                                <NavLink to="/facilities" className="dropdown-item">
                                    <i className="bi bi-building me-2"></i> Find Help
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/analytics" className="dropdown-item">
                                    <i className="bi bi-graph-up me-2"></i> Analytics
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/quiz" className="dropdown-item">
                                    <i className="bi bi-question-circle me-2"></i> Training Quiz
                                </NavLink>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <ExportData />
                            </li>
                            <li>
                                <MedicationReminder />
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <NavLink to="/profile" className="dropdown-item">
                                    <i className="bi bi-person-circle me-2"></i> Profile
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/*" element={
                            <PrivateRoute>
                                <AppContent />
                            </PrivateRoute>
                        } />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ToastProvider>
    );
};

export default App;