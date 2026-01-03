import React, { useState } from 'react';
import { Wrench, BookOpen, Target, TrendingUp, Users, Lightbulb, UserCheck } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { Agenda } from './Agenda';

export const FerramentasConsultoria = () => {
    const [isRSChatOpen, setIsRSChatOpen] = useState(false);

    const ferramentas = [
        {
            icon: Target,
            title: 'Framework M.A.P.C.A',
            description: 'Metodologia completa para diagnóstico e estruturação de propostas comerciais',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: TrendingUp,
            title: 'Análise de Mercado',
            description: 'Ferramentas de pesquisa e análise competitiva para posicionamento estratégico',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: Users,
            title: 'Gestão de Clientes',
            description: 'Sistema completo de CRM e acompanhamento de jornada do cliente',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: BookOpen,
            title: 'Base de Conhecimento',
            description: 'Biblioteca de templates, cases e melhores práticas de consultoria',
            color: 'from-yellow-500 to-yellow-600'
        },
        {
            icon: Lightbulb,
            title: 'Gerador de Propostas IA',
            description: 'Inteligência artificial para criação automática de propostas personalizadas',
            color: 'from-pink-500 to-pink-600'
        },
        {
            icon: Wrench,
            title: 'Ferramentas Auxiliares',
            description: 'Calculadoras, planilhas e recursos complementares para consultoria',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl mb-6 shadow-2xl p-2 overflow-hidden">
                    <img
                        src="https://raw.githubusercontent.com/Clebito2/Portal-Consultoria/refs/heads/main/ferramentas.png"
                        alt="Ferramentas da Consultoria"
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
                <h1 className="text-4xl font-bold mb-4 font-serif bg-gradient-to-r from-[#00e800] to-white bg-clip-text text-transparent">
                    Ferramentas da Consultoria
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Recursos e metodologias exclusivas para potencializar sua consultoria empresarial
                </p>
            </div>

            {/* Botão de Recrutamento e Seleção em Destaque */}
            <div className="mb-12 flex justify-center">
                <button
                    onClick={() => setIsRSChatOpen(true)}
                    className="bg-[#00e800] text-[#06192a] text-lg px-8 py-4 rounded-lg font-bold shadow-2xl hover:shadow-[#00e800]/50 hover:bg-[#00cc00] transition-all flex items-center gap-2"
                >
                    <UserCheck size={24} /> Recrutamento e Seleção
                </button>
            </div>

            {/* Grid de Ferramentas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {ferramentas.map((ferramenta, index) => (
                    <div
                        key={index}
                        className="card-v4 p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${ferramenta.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <ferramenta.icon size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#00e800] transition-colors">
                            {ferramenta.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {ferramenta.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Seção de Recursos Adicionais */}
            <div className="card-v4 p-8">
                <h2 className="text-2xl font-bold mb-6 text-white font-serif">Recursos em Destaque</h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-[#00e800] transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-[#00e800]/20 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="text-[#00e800]" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">Templates de Propostas</h4>
                            <p className="text-slate-400 text-sm">
                                Acesse nossa biblioteca com mais de 50 templates prontos para diferentes segmentos de mercado
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-[#00e800] transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-[#00e800]/20 flex items-center justify-center flex-shrink-0">
                            <Target className="text-[#00e800]" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">Cases de Sucesso</h4>
                            <p className="text-slate-400 text-sm">
                                Aprenda com projetos reais e estratégias validadas em diferentes indústrias
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-[#00e800] transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-[#00e800]/20 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="text-[#00e800]" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">Dashboards Analíticos</h4>
                            <p className="text-slate-400 text-sm">
                                Visualize métricas e KPIs em tempo real para acompanhamento de resultados
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm">
                    💡 <strong className="text-[#00e800]">Dica:</strong> Explore cada ferramenta para maximizar o potencial da sua consultoria
                </p>
            </div>

            {/* Agenda de Eventos da Consultoria */}
            <div className="mb-12">
                <Agenda clientId="ferramentas" googleCalendarId="ecossistemalive@gmail.com" />
            </div>

            {/* Modal de Chatbot R&S */}
            {isRSChatOpen && (
                <ChatInterface
                    client={{ id: 'ferramentas', name: 'Recrutamento e Seleção', logo: 'https://raw.githubusercontent.com/Clebito2/Portal-Consultoria/refs/heads/main/ferramentas.png' }}
                    onClose={() => setIsRSChatOpen(false)}
                    promptType="RECRUTAMENTO_SELECAO"
                    title="Consultor de R&S - Live Consultoria"
                />
            )}
        </div>
    );
};
