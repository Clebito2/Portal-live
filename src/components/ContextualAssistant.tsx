import React, { useState, useEffect, useRef } from 'react';
import { Client, User, ChatMessage } from '../types';
import { FloatingChatBubble } from './FloatingChatBubble';
import { useContextData } from '../hooks/useContextData';
import { buildContextusPrompt } from '../utils/promptBuilder';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ContextualAssistantProps {
    client: Client;
    user: User;
    isOpen: boolean;
    onToggle: () => void;
}

export const ContextualAssistant = ({ client, user, isOpen, onToggle }: ContextualAssistantProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rateLimitWarning, setRateLimitWarning] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Carregar dados do contexto (apenas quando aberto)
    const { data: contextData, loading: contextLoading, error: contextError } = useContextData(client.id, isOpen);

    // Rate limiting: 10 mensagens por hora
    const checkRateLimit = (): boolean => {
        const key = `contextus_rate_${user.email}`;
        const now = Date.now();
        const storedData = localStorage.getItem(key);

        if (storedData) {
            const { count, timestamp } = JSON.parse(storedData);
            const hourAgo = now - (60 * 60 * 1000);

            if (timestamp > hourAgo) {
                if (count >= 10) {
                    setRateLimitWarning(true);
                    setTimeout(() => setRateLimitWarning(false), 5000);
                    return false;
                }
                localStorage.setItem(key, JSON.stringify({ count: count + 1, timestamp }));
            } else {
                localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
            }
        } else {
            localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
        }

        return true;
    };

    // Carregar mensagem inicial
    useEffect(() => {
        if (messages.length === 0) {
            const initialMessage = `Olá! Sou o **Contextus**, seu assistente virtual da Live Consultoria.

Posso ajudá-lo a encontrar informações sobre:
- 📊 Status do projeto no dashboard
- 📅 Eventos e reuniões agendadas
- 📄 Documentos disponíveis
- 💬 Histórico de conversas anteriores

Como posso ajudar você hoje?`;

            setMessages([{ role: 'model', text: initialMessage }]);
        }
    }, []);

    // Auto-scroll ao receber novas mensagens
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !contextData) return;

        // Verificar rate limit
        if (!checkRateLimit()) {
            return;
        }

        const userMessage = input.trim();
        const newMessages = [...messages, { role: 'user', text: userMessage }] as ChatMessage[];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Construir prompt com contexto
            const systemInstruction = buildContextusPrompt(client, user, contextData);

            // Chamar Gemini API
            const { callGeminiAPI } = await import('../utils/geminiAPI');

            const response = await callGeminiAPI(
                newMessages.map(m => ({ role: m.role, text: m.text })),
                {
                    systemInstruction,
                    temperature: 0.3 // Respostas mais precisas
                }
            );

            const updatedMessages = [...newMessages, { role: 'model', text: response }] as ChatMessage[];
            setMessages(updatedMessages);

            // Salvar no RAG (TODO: implementar saveContextusMessage em memory.ts)
            // await Memory.saveContextusMessage(client.id, { role: 'user', text: userMessage });
            // await Memory.saveContextusMessage(client.id, { role: 'model', text: response });

        } catch (error: any) {
            console.error('Erro no Contextus:', error);

            let errorMessage = 'Desculpe, ocorreu um erro ao processar sua solicitação. ';

            if (error.message?.includes('404')) {
                errorMessage += 'O modelo de IA não está disponível no momento.';
            } else if (error.message?.includes('403')) {
                errorMessage += 'Erro de autenticação com a API.';
            } else {
                errorMessage += 'Tente novamente em alguns instantes.';
            }

            setMessages([...newMessages, {
                role: 'model',
                text: errorMessage
            }] as ChatMessage[]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FloatingChatBubble isOpen={isOpen} onToggle={onToggle}>
            <div className="flex flex-col h-full">
                {/* Área de mensagens */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                >
                    {/* Loading do contexto */}
                    {contextLoading && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Loader2 className="animate-spin" size={16} />
                            Carregando contexto do projeto...
                        </div>
                    )}

                    {/* Erro ao carregar contexto */}
                    {contextError && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            Erro ao carregar dados: {contextError}
                        </div>
                    )}

                    {/* Mensagens */}
                    {!contextLoading && messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-3 rounded-xl ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                    : 'bg-slate-800 text-slate-100'
                                    }`}
                            >
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading da resposta */}
                    {isLoading && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Loader2 className="animate-spin" size={16} />
                            Contextus está analisando...
                        </div>
                    )}
                </div>

                {/* Rate limit warning */}
                {rateLimitWarning && (
                    <div className="px-4 py-2 bg-yellow-900/30 border-t border-yellow-600/30 text-yellow-400 text-xs">
                        ⚠️ Limite de 10 mensagens por hora atingido. Aguarde um momento.
                    </div>
                )}

                {/* Input área */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                    <textarea
                        className="flex-1 bg-slate-800 border-none rounded-lg px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[48px] max-h-[120px] overflow-y-auto placeholder-slate-500"
                        placeholder="Pergunte sobre o projeto... (Ctrl+Enter para enviar)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        rows={1}
                        disabled={contextLoading || isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || contextLoading || isLoading}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        aria-label="Enviar mensagem"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
            </div>
        </FloatingChatBubble>
    );
};
