import React, { useState, useEffect, useRef } from 'react';

import { Send, X } from 'lucide-react';
import { Client, User, ChatMessage } from '../types';
import { ASSETS, GEMINI_API_KEY } from '../utils/constants';
import { PROMPTS } from '../utils/prompts';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
    user?: User;
    client: Client;
    onClose?: () => void;
    promptType?: keyof typeof PROMPTS;
    title?: string;
}

export const ChatInterface = ({ user, client, onClose, promptType = 'IAGO', title }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load initial context from memory
        const loadContext = async () => {
            const { Memory } = await import('../services/memory');
            const { profile, recentMessages } = await Memory.getContext(client.id, 5);

            // If we have history, show it
            if (recentMessages.length > 0) {
                setMessages(recentMessages);
                return;
            }

            // Otherwise show initial message
            if (messages.length === 0) {
                let initialMessage = '';

                if (promptType === 'RECRUTAMENTO_SELECAO') {
                    // Import constants to check if client has agents access
                    const { CLIENTS_WITH_AGENTS } = await import('../utils/constants');
                    const isClientWithAccess = CLIENTS_WITH_AGENTS.includes(client.id);

                    if (isClientWithAccess && client.name) {
                        // Auto-identify company for clients
                        initialMessage = `Olá! Sou o Consultor de Inteligência em R&S da **Live Consultoria**.\n\nVejo que você está acessando para a empresa **${client.name}**.\n\nPara iniciarmos a personalização dos processos seletivos, por favor, me conte:\n\n**Qual é a principal necessidade ou desafio de R&S que você está enfrentando?**`;
                    } else {
                        // Admin or generic access
                        initialMessage = `Olá. Sou o Consultor de Inteligência em R&S da **Live Consultoria**.\nPara iniciarmos a personalização dos processos, por favor, informe:\n\n**Qual é o nome da empresa (Cliente) para a qual trabalharemos hoje?**`;
                    }
                } else {
                    initialMessage = `Olá${user ? `, ${user.name}` : ''}! Sou o Iago. Seja bem-vindo ao VP Club. Como está sendo sua chegada por aqui?`;
                }

                setMessages([{ role: 'model', text: initialMessage }]);
            }
        };
        loadContext();
    }, []);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);



    const handleSend = async () => {
        if (!input.trim()) return;

        const newMsgs = [...messages, { role: 'user', text: input }];
        setMessages(newMsgs as ChatMessage[]);
        const userInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Load memory context
            const { Memory } = await import('../services/memory');
            const { profile, recentMessages } = await Memory.getContext(client.id, 10);

            // Build enriched prompt with context
            const contextPrompt = Memory.buildContextPrompt(profile, recentMessages, userInput);

            // Call the API
            const { callGeminiAPI } = await import('../utils/geminiAPI');

            // For R&S agent, inject client name into system instruction
            let systemInstruction = PROMPTS[promptType];

            if (promptType === 'RECRUTAMENTO_SELECAO' && client.name) {
                systemInstruction = `${PROMPTS[promptType]}\n\n**CONTEXTO AUTOMÁTICO:** A empresa cliente já foi identificada como "${client.name}". Você NÃO precisa perguntar o nome da empresa novamente. Prossiga diretamente para os modos de trabalho.`;
            } else if (promptType === 'PLUR_AGENT') {
                // Fetch Base Knowledge for Plur
                const { DB } = await import('../services/db');
                const knowledge = await DB.getBaseKnowledge(client.id);
                if (knowledge) {
                    systemInstruction = `${PROMPTS[promptType]}\n\n=== BASE DE CONHECIMENTO (FONTE DE VERDADE) ===\n${knowledge}\n\nUse as informações acima para responder.`;
                }
            }

            const text = await callGeminiAPI(
                newMsgs.map(m => ({ role: m.role as 'user' | 'model', text: m.text })),  // ✅ Histórico completo
                { systemInstruction }
            );

            setMessages([...newMsgs, { role: 'model', text }] as ChatMessage[]);

            // Save both user and model messages to memory
            await Memory.saveMessage(client.id, { role: 'user', text: userInput });
            await Memory.saveMessage(client.id, { role: 'model', text });

        } catch (e: any) {
            console.error(e);
            let errorMsg = e.message || 'Desculpe, tive um problema. Tente novamente.';
            setMessages([...newMsgs, { role: 'model', text: errorMsg }] as ChatMessage[]);
        } finally {
            setIsLoading(false);
        }
    };

    const getAvatar = () => {
        if (promptType === 'IAGO') return ASSETS.iagoAvatar || client.logo;
        return client.logo || ASSETS.logoLive;
    };

    const getSubtitle = () => {
        switch (promptType) {
            case 'RECRUTAMENTO_SELECAO': return 'Consultor de R&S';
            case 'PLUR_AGENT': return 'Assistente Especializado';
            default: return 'Iago - VP Club';
        }
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-[#0a253a] rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="p-4 bg-gradient-to-r from-yellow-600/20 to-transparent border-b border-yellow-600/30 flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500">
                        <img src={getAvatar()} className="w-full h-full object-cover" alt="Assistant" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{title || 'Assistente de Onboarding'}</h3>
                        <p className="text-xs text-yellow-500">{getSubtitle()}</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user' ? 'bg-[#00e800] text-[#06192a]' : 'bg-slate-800 text-white'}`}>
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-slate-500 text-sm ml-4 animate-pulse">{promptType === 'RECRUTAMENTO_SELECAO' ? 'Consultor' : 'Iago'} está digitando...</div>}
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                <textarea
                    className="flex-1 bg-slate-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#00e800] outline-none resize-none min-h-[48px] max-h-[150px] overflow-y-auto"
                    placeholder="Digite sua mensagem... (Ctrl+Enter para enviar)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    rows={1}
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-[#00e800] text-[#06192a] p-3 rounded-lg hover:bg-[#00cc00] transition-colors">
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};
