import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequestManagementPage from './pages/Admin/RequestManagementPage';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import ToastProvider from './components/ToastProvider';
import OfflineStatus from './components/OfflineStatus';
import SyncStatus from './components/SyncStatus';
import AppNavigation from './components/AppNavigation';
import { performSync } from './services/syncService';

// Pages
import AmbulanceRequestPage from './pages/AmbulanceRequestPage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RoleRouter from './components/RoleRouter';
import FirstAidDetailPage from './pages/FirstAidDetailPage';
import IncidentsPage from './pages/IncidentsPage';
import PatientsPage from './pages/PatientsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import FirstAidQuiz from './pages/FirstAidQuiz';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import MedicationRequestsPage from './pages/MedicationRequestsPage';
// Admin Pages
import UsersPage from './pages/Admin/UsersPage';
import ContentPage from './pages/Admin/ContentPage';
import AdminFacilitiesPage from './pages/Admin/FacilitiesPage';
import SystemHealthPage from './pages/Admin/SystemHealthPage';
import DataSyncPage from './pages/Admin/DataSyncPage';
import AnalyticsPage from './pages/Admin/AnalyticsPage';
import SubmitFirstAidGuidePage from './pages/SubmitFirstAidGuidePage';

const AppContent: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});

            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data?.type === 'SYNC_TRIGGERED') {
                    performSync();
                }
            });
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <>
            <OfflineStatus isOnline={isOnline} />
            <SyncStatus />

            <div className="pb-5">
                <Routes>
                    <Route path="/" element={<RoleRouter />} />
                    <Route path="/firstaid/:slug" element={<FirstAidDetailPage />} />

                    <Route path="/incidents" element={
                        <ProtectedRoute allowedRoles={['chw', 'admin']}>
                            <IncidentsPage />
                        </ProtectedRoute>
                    } />
                   <Route path="/ambulance-request" element={
    <ProtectedRoute allowedRoles={['chw', 'admin', 'end_user']}>
        <AmbulanceRequestPage />
    </ProtectedRoute>
} />
<Route path="/admin/requests" element={
    <ProtectedRoute allowedRoles={['admin']}>
        <RequestManagementPage />
    </ProtectedRoute>
} />
<Route path="/submit-guide" element={
    <ProtectedRoute allowedRoles={['chw', 'admin']}>
        <SubmitFirstAidGuidePage />
    </ProtectedRoute>
} />
                    <Route path="/patients" element={
                        <ProtectedRoute allowedRoles={['chw', 'admin']}>
                            <PatientsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/medication-requests" element={
    <ProtectedRoute allowedRoles={['chw', 'admin', 'end_user']}>
        <MedicationRequestsPage />
    </ProtectedRoute>
} /> 
                    <Route path="/contacts" element={<EmergencyContactsPage />} />
                    <Route path="/facilities" element={<FacilitiesPage />} />

                    <Route path="/analytics" element={
                        <ProtectedRoute allowedRoles={['chw', 'admin']}>
                            <AnalyticsDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/quiz" element={<FirstAidQuiz />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/users" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <UsersPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/content" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ContentPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/facilities" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminFacilitiesPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/health" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <SystemHealthPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/sync" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <DataSyncPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/analytics" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AnalyticsPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>

            <AppNavigation />
        </>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <ThemeProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/*" element={
                                <ProtectedRoute>
                                    <AppContent />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
            </AuthProvider>
        </ToastProvider>
    );
};

export default App;