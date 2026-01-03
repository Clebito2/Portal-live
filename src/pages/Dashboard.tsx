import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { MOCK_CLIENTS, ASSETS, ADMIN_ONLY_CLIENTS } from '../utils/constants';
import { Menu } from 'lucide-react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Client } from '../types';
import { DB } from '../services/db';
import { ContextualAssistant } from '../components/ContextualAssistant';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { clientId } = useParams();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState<Client | null>(null);

    // Estado do Contextus (persistido no localStorage)
    const [isContextusOpen, setIsContextusOpen] = useState(() => {
        const saved = localStorage.getItem('contextus_open');
        return saved === 'true';
    });

    // Salvar estado do Contextus
    useEffect(() => {
        localStorage.setItem('contextus_open', String(isContextusOpen));
    }, [isContextusOpen]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        let targetId = clientId;

        // Security: Clients can only access their own dashboard
        if (user.role === 'client') {
            if (user.clientId && user.clientId !== clientId) {
                navigate(`/dashboard/${user.clientId}`);
                return;
            }
            targetId = user.clientId;
        }

        if (targetId) {
            // Try to fetch from DB first
            DB.getClient(targetId).then(client => {
                if (client) {
                    setCurrentClient(client);
                } else {
                    // Fallback strategies

                    // 1. Check ADMIN_ONLY_CLIENTS (Ferramentas, etc)
                    const adminClient = ADMIN_ONLY_CLIENTS.find(c => c.id === targetId);
                    if (adminClient) {
                        setCurrentClient(adminClient);
                        return;
                    }

                    // 2. Check Mock Clients
                    const c = MOCK_CLIENTS.find(c => c.id === targetId);
                    if (c) {
                        setCurrentClient(c);
                    } else {
                        // 3. Generic Fallback
                        setCurrentClient({
                            id: targetId,
                            name: targetId.charAt(0).toUpperCase() + targetId.slice(1),
                            logo: ASSETS.logoLive
                        });
                    }
                }
            });

            // SECURITY: Validate client isolation
            if (user && user.role === 'client' && targetId !== user.clientId) {
                console.warn('[SECURITY] Cliente tentando acessar dashboard de outro cliente. Redirecionando...');
                navigate(`/dashboard/${user.clientId}`);
                return;
            }
        } else {
            // Fallback if no ID
            if (user.role === 'admin') navigate('/admin');
        }
    }, [user, clientId, navigate]);

    const handleChangeClient = () => {
        // Simple cycle for now, or could open a modal
        if (!user || user.role !== 'admin') return;
        const idx = MOCK_CLIENTS.findIndex(c => c.id === currentClient?.id);
        const next = MOCK_CLIENTS[(idx + 1) % MOCK_CLIENTS.length];
        setCurrentClient(next);
    };

    if (!user || !currentClient) return null;

    return (
        <div className="min-h-screen flex relative">
            <Sidebar
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                client={currentClient}
                onChangeClient={handleChangeClient}
            />

            <main className="flex-1 overflow-hidden flex flex-col h-screen relative">
                {/* Header Mobile - Glassmorphism */}
                <div className="md:hidden p-4 flex justify-between items-center border-b border-white/10 relative z-30"
                    style={{ background: 'var(--live-glass)', backdropFilter: 'var(--glass-blur)' }}>
                    <img src={ASSETS.logoLive} className="h-6" alt="Logo" />
                    <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-white hover:text-[#00e800] transition-colors"><Menu /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <Outlet context={{ clientId: currentClient.id, client: currentClient }} />
                </div>
            </main>

            {/* Contextus - Disponível em todas as abas */}
            {user && currentClient && (
                <ContextualAssistant
                    client={currentClient}
                    user={user}
                    isOpen={isContextusOpen}
                    onToggle={() => setIsContextusOpen(!isContextusOpen)}
                />
            )}
        </div>
    );
};
