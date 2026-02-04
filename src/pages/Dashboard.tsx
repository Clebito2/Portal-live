import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { MOCK_CLIENTS, ASSETS, ADMIN_ONLY_CLIENTS } from '../utils/constants';
import { Menu, LogOut } from 'lucide-react';
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
            // Updated Security: Check if targetId is in allowed clientIds
            // Updated Security: Check if targetId is in allowed clientIds
            const allowedClients = user.clientIds || [user.clientId];

            // DEBUG: Hardcode allowance for testing if needed, but logic should hold.
            // Check strict equality
            const isAllowed = allowedClients.some(id => id === targetId) || user.clientId === targetId;

            if (!isAllowed) {
                // Try to redirect to primary client if available
                if (user.clientId) {
                    navigate(`/dashboard/${user.clientId}`);
                } else if (allowedClients.length > 0) {
                    navigate(`/dashboard/${allowedClients[0]}`);
                } else {
                    navigate('/login');
                }
                return;
            }
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

            // SECURITY CHECK REMOVED: Redundant and incorrect for multi-client users.
            // The check at the top of useEffect already handles permissions via 'allowedClients'.
            // if (user && user.role === 'client' && targetId !== user.clientId) ...
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
                {/* Floating Menu Button for Mobile */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="md:hidden fixed top-4 right-4 z-40 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-[#00e800] transition-colors shadow-lg"
                >
                    <Menu size={24} />
                </button>

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
