import React, { useState } from 'react';
import { UserCheck, Brain, Target, Users, Loader2, X, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChatInterface } from './ChatInterface';
import { GeminiEmbed } from './GeminiEmbed';
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from '../utils/constants';
import { PROMPTS } from '../utils/prompts';
import { DB } from '../services/db';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Client } from '../types';

interface Agent {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    route: string;
}

export const Agentes = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { client } = useOutletContext<{ client: Client }>();
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const [isRSChatOpen, setIsRSChatOpen] = useState(false);
    const [isPlurChatOpen, setIsPlurChatOpen] = useState(false);

    // Estados para gerador de propostas
    const [isLoading, setIsLoading] = useState(false);
    const [createPrompt, setCreatePrompt] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
    const [loadingText, setLoadingText] = useState('Processando...');

    const allAgents: Agent[] = [
        {
            id: 'rs',
            title: 'Recrutamento e Seleção',
            description: 'Consultor especializado em processos seletivos, análise de perfil e talent acquisition',
            icon: UserCheck,
            color: 'from-green-500 to-green-600',
            route: '' // Será aberto por modal/estado
        },
        {
            id: 'propostas',
            title: 'Gerador de Propostas IA',
            description: 'Crie propostas comerciais completas usando IA com framework M.A.P.C.A',
            icon: Brain,
            color: 'from-blue-500 to-blue-600',
            route: '' // Será aberto por modal
        },
        {
            id: 'plur_agent',
            title: 'Agente Plur',
            description: 'Assistente Especializado Plur (Gemini Gem)',
            icon: Sparkles,
            color: 'from-purple-500 to-purple-600',
            route: ''
        },
        // Espaço para novos agentes
        {
            id: 'placeholder1',
            title: 'Em Breve',
            description: 'Novos agentes de IA especializados serão adicionados aqui',
            icon: Target,
            color: 'from-slate-600 to-slate-700',
            route: ''
        }
    ];

    // Filtrar agentes: clientes veem apenas R&S, admins veem todos
    const agentes = user?.role === 'admin'
        ? allAgents
        : allAgents.filter(agent =>
            agent.id === 'rs' ||
            agent.id === 'placeholder1' ||
            (client.id === 'plur' && agent.id === 'plur_agent')
        );

    const handleAgentClick = (agent: Agent) => {
        if (agent.id === 'rs') {
            setIsRSChatOpen(true);
        } else if (agent.id === 'plur_agent') {
            setIsPlurChatOpen(true);
        } else if (agent.id === 'propostas') {
            setIsProposalModalOpen(true);
        } else if (agent.route) {
            navigate(agent.route);
        }
    };

    const handleGenerateProposalPreview = async () => {
        setIsLoading(true);
        try {
            const { callGeminiAPI } = await import('../utils/geminiAPI');

            const promptText = `DATA ATUAL: ${new Date().toLocaleDateString('pt-BR')}\n\nSOLICITAÇÃO DE NOVO CLIENTE (${newClientName}):\n${createPrompt}`;

            const text = await callGeminiAPI(
                [{ role: 'user', text: promptText }],
                { systemInstruction: PROMPTS.AGE_QUOD_AGIS }
            );

            setGeneratedProposal(text);
        } catch (e: any) {
            console.error("Gemini Error:", e);
            alert('Erro ao gerar proposta. Detalhes: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveAndSaveClient = async () => {
        if (!generatedProposal) return;
        setIsLoading(true);

        try {
            const clientId = newClientName.toLowerCase().replace(/\s+/g, '-');
            await DB.saveClient({ id: clientId, name: newClientName, logo: '' });
            await DB.saveDashboardHTML(clientId, generatedProposal);

            alert(`✅ Cliente "${newClientName}" criado com sucesso!`);
            setIsProposalModalOpen(false);
            setGeneratedProposal(null);
            setCreatePrompt('');
            setNewClientName('');
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 font-serif bg-gradient-to-r from-[#00e800] to-white bg-clip-text text-transparent">
                    Agentes de IA
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Consultores especializados com inteligência artificial para diferentes áreas de negócio
                </p>
            </div>

            {/* Grid de Agentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentes.map((agente) => (
                    <div
                        key={agente.id}
                        onClick={() => handleAgentClick(agente)}
                        className={`card-v4 p-6 hover:scale-105 transition-all duration-300 group ${(agente.id === 'rs' || agente.id === 'propostas' || agente.id === 'plur_agent' || agente.route) ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    >
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${agente.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <agente.icon size={40} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-[#00e800] transition-colors">
                            {agente.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {agente.description}
                        </p>
                        {(agente.id === 'rs' || agente.id === 'propostas' || agente.id === 'plur_agent' || agente.route) && (
                            <div className="mt-4 text-[#00e800] text-sm font-semibold flex items-center gap-2">
                                Acessar Agente →
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Info Footer */}
            <div className="mt-12 p-6 bg-gradient-to-r from-[#00e800]/10 to-transparent border border-[#00e800]/30 rounded-xl">
                <p className="text-white font-semibold mb-2">💡 Dica Importante</p>
                <p className="text-slate-300 text-sm">
                    Cada agente é especializado em uma área específica. Escolha o agente mais adequado para sua necessidade e tenha respostas precisas e personalizadas.
                </p>
            </div>

            {/* Modal ChatInterface R&S */}
            {isRSChatOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="w-full h-full max-w-5xl max-h-[90vh]">
                        <ChatInterface
                            client={client}
                            onClose={() => setIsRSChatOpen(false)}
                            promptType="RECRUTAMENTO_SELECAO"
                            title="Consultor de R&S - Live Consultoria"
                        />
                    </div>
                </div>
            )}

            {/* Modal ChatInterface Plur (Agora usando Embed) */}
            {isPlurChatOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="w-full h-full max-w-[95vw] max-h-[90vh]">
                        <GeminiEmbed
                            url="https://gemini.google.com/gem/11mYioaYKWK_wC0bOc7U-BGXzsCA0YHaW?usp=sharing"
                            title="Plur Agent - Gemini Especializado"
                            onClose={() => setIsPlurChatOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Modal Gerador de Propostas */}
            {isProposalModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-[#0a253a] border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-blue-600/20 to-transparent">
                            <div className="flex items-center gap-3">
                                <Brain className="text-blue-400" />
                                <h3 className="font-bold text-white">Gerador de Propostas IA</h3>
                            </div>
                            <button onClick={() => setIsProposalModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {!generatedProposal ? (
                                <div className="space-y-6">
                                    <div>
                                        <Input
                                            label="Nome do Cliente / Empresa"
                                            placeholder="Ex: Lojas Goianita"
                                            value={newClientName}
                                            onChange={(e) => setNewClientName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Descreva a necessidade ou contexto do cliente</label>
                                        <textarea
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-40 resize-none"
                                            placeholder="Ex: O cliente precisa reestruturar o time de vendas e implementar um processo de liderança..."
                                            value={createPrompt}
                                            onChange={(e) => setCreatePrompt(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-sm text-slate-300 h-[60vh] overflow-y-auto">
                                        <h4 className="text-green-400 font-bold mb-2">Proposta Gerada (Preview HTML):</h4>
                                        <div className="whitespace-pre-wrap">{generatedProposal}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsProposalModalOpen(false)}>
                                Cancelar
                            </Button>

                            {!generatedProposal ? (
                                <Button
                                    onClick={handleGenerateProposalPreview}
                                    disabled={!createPrompt.trim() || !newClientName.trim() || isLoading}
                                    className="bg-blue-600 hover:bg-blue-500"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" size={18} />
                                            Gerando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Brain size={18} />
                                            Gerar Proposta
                                        </div>
                                    )}
                                </Button>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={() => setGeneratedProposal(null)}>
                                        <RotateCcw size={18} className="mr-2" />
                                        Refazer
                                    </Button>
                                    <Button onClick={handleApproveAndSaveClient} disabled={isLoading} className="bg-green-600 hover:bg-green-500">
                                        {isLoading ? (
                                            <Loader2 className="animate-spin mr-2" />
                                        ) : (
                                            <CheckCircle size={18} className="mr-2" />
                                        )}
                                        Aprovar e Criar Cliente
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
