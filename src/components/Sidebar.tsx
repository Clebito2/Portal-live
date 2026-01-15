import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, FileText, Sparkles, LogOut, ArrowLeft, ChevronLeft, ChevronRight, Brain, Wrench, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ASSETS, CLIENTS_WITH_AGENTS } from '../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
    client: any;
    onChangeClient?: () => void;
}

export const Sidebar = ({ isMobileOpen, setIsMobileOpen, client, onChangeClient }: SidebarProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Iniciar colapsada por padrão
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [imgError, setImgError] = useState(false);

    // Reset error state when client changes
    useEffect(() => {
        setImgError(false);
    }, [client?.id]);

    // Handlers de hover
    const handleMouseEnter = () => {
        setIsCollapsed(false);
    };

    const handleMouseLeave = () => {
        setIsCollapsed(true);
    };

    const menuItems = [
        { id: `/dashboard/${client?.id || ''}`, label: 'Dashboard', icon: LayoutDashboard },
        { id: `/dashboard/${client?.id || ''}/agenda`, label: 'Agenda', icon: Calendar },
        { id: `/dashboard/${client?.id || ''}/documents`, label: 'Documentos', icon: FileText },
    ];

    // Adicionar Agentes para Admin OU clientes autorizados
    const clientHasAgentAccess = client?.id && CLIENTS_WITH_AGENTS.includes(client.id);
    if (user?.role === 'admin' || clientHasAgentAccess) {
        menuItems.push({ id: `/dashboard/${client?.id || ''}/agentes`, label: 'Agentes', icon: Brain });
    }

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMobileOpen(false);
    };

    return (
        <aside
            className={`fixed md:relative z-20 h-full min-h-screen border-r border-white/10 flex flex-col transition-all duration-300 ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 ' + (isCollapsed ? 'md:w-20' : 'md:w-64')}`}
            style={{
                background: 'linear-gradient(180deg, rgba(6, 25, 42, 0.95) 0%, rgba(6, 25, 42, 0.6) 100%)',
                backdropFilter: 'blur(16px)'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Logic to ensure it's not collapsed on mobile when open */}
            {(() => {
                if (isMobileOpen && isCollapsed) setIsCollapsed(false);
                return null;
            })()}
            {/* Textura de Fundo Mais Visível (V6.1) */}
            <div
                className="absolute inset-0 sidebar-texture pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="p-4 flex flex-col h-full relative z-10">
                <div className={`flex items-center justify-between mb-8 ${isCollapsed ? 'flex-col gap-4' : ''}`}>
                    <img src={ASSETS.logoLive} className={`transition-all duration-500 var(--spring-bounce) ${isCollapsed ? 'h-6 opacity-80' : 'h-10'}`} alt="Logo" />
                </div>

                {client && (
                    <div className={`rounded-xl border border-white/5 flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'p-1 justify-center bg-transparent' : 'p-3 bg-white/5 shadow-inner'}`}>
                        <div className="w-12 h-12 rounded-full border border-[#00e800]/30 overflow-hidden flex-shrink-0 flex items-center justify-center p-1 bg-black/40">
                            {!imgError ? (
                                <img
                                    src={client.logo}
                                    className="w-full h-full object-contain p-1 rounded-full"
                                    alt={client.name}
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-800 rounded-full">
                                    {client.id === 'ferramentas' ? <Wrench size={20} /> : <Building2 size={20} />}
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400">Ambiente</p>
                                <p className="font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis text-sm">{client.name}</p>
                            </div>
                        )}
                    </div>
                )}

                <nav className="flex-1 mt-8 space-y-2">
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden ${isActive ? 'text-[#06192a] font-bold shadow-[0_4px_20px_rgba(0,180,216,0.3)] scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'} ${isCollapsed ? 'justify-center' : ''}`}
                                style={isActive ? { background: 'linear-gradient(135deg, #00b4d8 0%, #00e800 100%)' } : {}}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon size={20} className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                {!isCollapsed && <span className="relative z-10">{item.label}</span>}
                            </button>
                        )
                    })}

                    {/* Mobile Only Logout Button inside Nav */}
                    <div className="md:hidden pt-4 mt-4 border-t border-white/5">
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 hover:text-white hover:bg-red-500/10 transition-all duration-300"
                        >
                            <LogOut size={20} className="flex-shrink-0" />
                            <span>Sair do Sistema</span>
                        </button>
                    </div>
                </nav>

                <div className="pt-4 border-t border-white/5 space-y-2">
                    {user?.role === 'admin' && (
                        <button onClick={() => navigate('/admin')} className={`w-full flex items-center gap-2 text-xs text-slate-400 hover:text-white p-3 hover:bg-white/5 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`} title={isCollapsed ? "Voltar" : undefined}>
                            <ArrowLeft size={16} />
                            {!isCollapsed && "Voltar ao Admin"}
                        </button>
                    )}
                    <button onClick={() => logout()} className={`w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 p-3 hover:bg-red-500/10 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`} title={isCollapsed ? "Sair" : undefined}>
                        <LogOut size={16} />
                        {!isCollapsed && "Sair do Sistema"}
                    </button>
                </div>
            </div>
        </aside>
    );
};
