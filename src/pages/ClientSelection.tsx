import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ASSETS, MOCK_CLIENTS } from '../utils/constants';
import { Client } from '../types';
import { DB } from '../services/db';
import { LogOut } from 'lucide-react';

export const ClientSelection = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [availableClients, setAvailableClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadClients = async () => {
            if (!user || user.role !== 'client' || !user.clientIds) {
                // If no clientIds, redirect to appropriate page
                if (user?.role === 'admin') navigate('/admin');
                else if (user?.clientId) navigate(`/dashboard/${user.clientId}`);
                else navigate('/login');
                return;
            }

            try {
                // Get all clients to match with IDs
                // Optimization: In a large app we would query 'whereIn', but here we fetch all or filter MOCK
                // Get all clients to match with IDs
                const dbClients = await DB.getClients();
                // FIX: Merge DB clients with MOCK clients to ensure all are available
                // Use a Map to deduplicate by ID, preferring DB data
                const clientMap = new Map<string, Client>();
                MOCK_CLIENTS.forEach(c => clientMap.set(c.id, c));
                dbClients.forEach(c => clientMap.set(c.id, c));

                const allClients = Array.from(clientMap.values());

                // Filter clients that user has access to
                const userClients = allClients.filter(c => user.clientIds?.includes(c.id));
                setAvailableClients(userClients);
            } catch (error) {
                console.error("Error loading clients:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadClients();
    }, [user, navigate]);

    const handleSelectClient = (clientId: string) => {
        navigate(`/dashboard/${clientId}`);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-[#06192a] flex items-center justify-center text-white">Carregando permissões...</div>;
    }

    return (
        <div className="min-h-screen text-white flex flex-col relative overflow-hidden bg-[#06192a]">
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <button onClick={logout} className="absolute top-6 right-6 text-red-400 hover:text-red-300 flex gap-2 items-center"><LogOut size={16} /> Sair</button>

                <div className="text-center mb-12">
                    <img src={ASSETS.logoLive} className="h-16 mx-auto mb-6" alt="Logo Live" />
                    <h1 className="text-3xl font-bold font-serif mb-2">Bem-vindo(a), {user?.name.split(' ')[0]}</h1>
                    <p className="text-slate-400">Selecione o ambiente que deseja acessar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl w-full">
                    {availableClients.map((client) => (
                        <div
                            key={client.id}
                            onClick={() => handleSelectClient(client.id)}
                            className="card-v4 p-8 flex flex-col items-center justify-center group relative overflow-hidden cursor-pointer min-h-[240px] transition-all hover:-translate-y-2"
                        >
                            {/* Logo Background */}
                            <div
                                className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                style={{
                                    backgroundImage: `url(${client.logo})`,
                                    filter: 'grayscale(100%)',
                                    transform: 'scale(1.2)'
                                }}
                            />

                            {/* Icon/Logo Foreground */}
                            <div className="relative z-20 mb-6 p-4 rounded-full bg-black/40 border border-white/10 group-hover:border-[#00e800]/50 transition-colors shadow-2xl">
                                <img src={client.logo} alt={client.name} className="w-16 h-16 object-contain" />
                            </div>

                            {/* Client Name */}
                            <h3 className="font-bold text-2xl group-hover:text-[#00e800] transition-colors z-10 text-center drop-shadow-lg text-white relative">
                                {client.name}
                            </h3>

                            <p className="text-xs text-slate-500 mt-2 relative z-10 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                Acessar Dashboard
                            </p>

                            {/* Hover Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#00e800]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00e800] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
