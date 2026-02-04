import React from 'react';

// Map client IDs to their specific ClickUp board URLs
const BOARD_URLS: Record<string, string> = {
    'The_Catalyst': 'https://sharing.clickup.com/90132992147/b/h/4-901313000175-2/ea9b2a23b1093ea',
    'ferramentas': 'https://sharing.clickup.com/90132599284/b/h/4-901313051793-2/1144076073c4189'
};

interface ClickUpBoardProps {
    clientId: string;
}

export const ClickUpBoard = ({ clientId }: ClickUpBoardProps) => {
    const boardUrl = BOARD_URLS[clientId];

    if (!boardUrl) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                <p>Nenhum quadro configurado para este cliente.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#06192a] text-white p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00b4d8] to-[#00e800]">
                    Projetos
                </h1>
                <p className="text-slate-400">Acompanhe o status dos projetos no quadro abaixo.</p>
            </div>

            <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl ring-1 ring-white/5 relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00b4d8]/20 to-[#00e800]/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                <div className="relative h-full w-full bg-[#0f172a] rounded-2xl">
                    <iframe
                        className="clickup-embed w-full h-full border-0"
                        src={boardUrl}
                        title={`ClickUp Board - ${clientId}`}
                        style={{ background: 'transparent' }}
                    ></iframe>
                </div>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
                <p>Desenvolvido com ClickUp &bull; Ecossistema Live</p>
            </div>
        </div>
    );
};
