import React, { useRef, useEffect } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

interface FloatingChatBubbleProps {
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

export const FloatingChatBubble = ({ isOpen, onToggle, children }: FloatingChatBubbleProps) => {
    const chatRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            {/* Backdrop invisível para capturar cliques fora (Z-40) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            <div className="fixed bottom-6 right-6 z-50">
                {/* Botão do balão (quando fechado) */}
                {!isOpen && (
                    <button
                        ref={buttonRef}
                        onClick={onToggle}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
                        aria-label="Abrir Contextus"
                    >
                        <MessageCircle size={32} className="text-white group-hover:rotate-12 transition-transform" />
                        {/* Badge de notificação (opcional futuro) */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </button>
                )}

                {/* Janela do chat (quando aberto) - Z-50 (acima do backdrop) */}
                {isOpen && (
                    <div
                        ref={chatRef}
                        className="w-96 h-[600px] bg-[#0a253a] rounded-xl shadow-2xl border border-slate-700 flex flex-col transition-all duration-300 ease-in-out animate-slide-in relative z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Sparkles className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Contextus</h3>
                                    <p className="text-xs text-slate-400">Assistente Virtual</p>
                                </div>
                            </div>
                            <button
                                onClick={onToggle}
                                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                                aria-label="Fechar Contextus"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Conteúdo do chat */}
                        <div className="flex-1 overflow-hidden">
                            {children}
                        </div>
                    </div>
                )}

                {/* CSS para animação (inline para garantir funcionamento) */}
                <style>{`
                    @keyframes slide-in {
                        from {
                            opacity: 0;
                            transform: translateY(20px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    .animate-slide-in {
                        animation: slide-in 0.3s ease-out;
                    }
                `}</style>
            </div>
        </>
    );
};
