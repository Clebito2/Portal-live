import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface GeminiEmbedProps {
    url: string;
    title: string;
    onClose: () => void;
}

export const GeminiEmbed = ({ url, title, onClose }: GeminiEmbedProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="flex flex-col h-full w-full bg-[#0a253a] rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-3 bg-gradient-to-r from-purple-600/20 to-transparent border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg"
                        alt="Gemini"
                        className="w-8 h-8"
                    />
                    <div>
                        <h3 className="font-bold text-white text-sm md:text-base">{title}</h3>
                        <p className="text-xs text-slate-400 hidden md:block">Powered by Google Gemini</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(url, '_blank')}
                        className="hidden md:flex"
                        title="Abrir em nova aba caso não carregue"
                    >
                        <ExternalLink size={18} />
                    </Button>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-white">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a253a] z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                        <p className="text-slate-300">Carregando interface do Gemini...</p>
                    </div>
                )}

                {hasError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a253a] z-10 p-8 text-center">
                        <div className="bg-red-500/10 p-4 rounded-full mb-4">
                            <ExternalLink size={48} className="text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Não foi possível incorporar o Gemini</h3>
                        <p className="text-slate-400 mb-6 max-w-md">
                            O Google Gemini pode bloquear a exibição dentro de outros sites por motivos de segurança.
                        </p>
                        <Button
                            onClick={() => window.open(url, '_blank')}
                            className="bg-purple-600 hover:bg-purple-500"
                        >
                            Abrir em Nova Aba
                        </Button>
                    </div>
                ) : (
                    <iframe
                        src={url}
                        className="w-full h-full border-none"
                        allow="clipboard-write"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                )}

                {/* Overlay Instruction (Optional) */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full text-xs text-white backdrop-blur-sm pointer-events-none md:hidden">
                    Faça login no Google se necessário
                </div>
            </div>
        </div>
    );
};
