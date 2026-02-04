import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './pages/LoginScreen';
import { Dashboard } from './pages/Dashboard';
import { DashboardHome } from './components/DashboardHome';
import { Agenda } from './components/Agenda';
import { Documents } from './components/Documents';
import { FerramentasConsultoria } from './components/FerramentasConsultoria';
import { AdminProposals } from './pages/AdminProposals';
import { GlobalStyles } from './styles/GlobalStyles';
import { Agentes } from './components/Agentes';
import { UserManagement } from './components/UserManagement';
import { ClickUpBoard } from './components/ClickUpBoard';

// Wrapper to pass context to components
const RouteWrapper = ({ Component }: { Component: any }) => {
    const context = useOutletContext<any>();
    return context ? <Component {...context} /> : null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-[#06192a] flex items-center justify-center text-white">Carregando...</div>;
    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
};

import { SelectionScreen } from './pages/SelectionScreen';
import { ClientSelection } from './pages/ClientSelection';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/select-client" element={<ProtectedRoute><ClientSelection /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><SelectionScreen /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/dashboard/:clientId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                <Route index element={<RouteWrapper Component={DashboardHome} />} />
                <Route path="agenda" element={<RouteWrapper Component={Agenda} />} />
                <Route path="documents" element={<RouteWrapper Component={Documents} />} />
                <Route path="proposals" element={<RouteWrapper Component={AdminProposals} />} />
                <Route path="projects" element={<RouteWrapper Component={ClickUpBoard} />} />
                <Route path="agentes" element={<RouteWrapper Component={Agentes} />} />
            </Route>
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
};

import { DB } from './services/db';
import { useAutoLogout } from './hooks/useAutoLogout';
import { useTabCloseLogout } from './hooks/useTabCloseLogout';

const AppContent = () => {
    useAutoLogout(); // Ativar auto-logout por inatividade
    useTabCloseLogout(); // Ativar auto-logout ao fechar aba/navegador
    return <AppRoutes />;
};

export const App = () => {
    return (
        <AuthProvider>
            <GlobalStyles />
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
