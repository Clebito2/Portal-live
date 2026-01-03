import React, { useState, useEffect } from 'react';
import { DB } from '../services/db';
import { Client } from '../types';
import { INITIAL_DASHBOARDS } from '../utils/initialDashboards';
import { ChatInterface } from './ChatInterface';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';
import { LiveApresentacao } from './LiveApresentacao';

export const DashboardHome = ({ client }: { client: Client }) => {
    const { user } = useAuth();
    const [htmlContent, setHtmlContent] = useState<string | null>(null);

    useEffect(() => {
        loadDashboard();
    }, [client.id]);

    const loadDashboard = async () => {
        const dash = await DB.getDashboardHTML(client.id);
        setHtmlContent(dash || INITIAL_DASHBOARDS[client.id] || getDefaultDashboard(client));
    };

    const getDefaultDashboard = (c: Client) => `
        <style>
            body { font-family: 'Poppins', sans-serif; background: transparent; color: white; padding: 20px; }
            .card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); }
            h1 { color: #00e800; }
        </style>
        <h1>Bem-vindo à ${c.name}</h1>
        <div class="card">
            <h3>Visão Geral</h3>
            <p>Seu dashboard personalizado está pronto para edição.</p>
        </div>
    `;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editHtml, setEditHtml] = useState('');

    const handleOpenEdit = () => {
        setEditHtml(htmlContent || '');
        setIsEditModalOpen(true);
    };

    const handleSaveDashboard = async () => {
        await DB.saveDashboardHTML(client.id, editHtml);
        setHtmlContent(editHtml);
        setIsEditModalOpen(false);
    };

    if (client.id === 'vpclub') { // Show Chat for VP Club (Admins and Clients)
        return (
            <div className="fade-in h-full flex flex-col p-4 md:p-8">
                <ChatInterface user={user} client={client} />
            </div>
        );
    }

    if (client.id === 'ferramentas') { // Show Live Apresentação
        return <LiveApresentacao />;
    }

    return (
        <div className="fade-in h-full flex flex-col p-4 md:p-8 relative">
            {/* Edit Dashboard moved to SelectionScreen */}
            <div className="bg-white rounded-xl flex-1 overflow-hidden relative shadow-2xl">
                <iframe
                    srcDoc={htmlContent || ''}
                    className="w-full h-full border-0"
                    title="Dashboard"
                    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-top-navigation-by-user-activation"
                />
            </div>

            {/* EDIT DASHBOARD MODAL */}
            {/* @ts-ignore */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-[#0a253a] border border-slate-700 rounded-xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-white">Editar HTML do Dashboard</h3>
                            {/* @ts-ignore */}
                            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Fechar</Button>
                        </div>
                        <div className="flex-1 p-4">
                            <textarea
                                className="w-full h-full bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00e800]"
                                value={editHtml}
                                onChange={(e) => setEditHtml(e.target.value)}
                                placeholder="Cole o código HTML aqui..."
                            />
                        </div>
                        <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                            {/* @ts-ignore */}
                            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                            {/* @ts-ignore */}
                            <Button onClick={handleSaveDashboard}>Salvar Alterações</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
