import React from 'react';
import { Search, Shield, Cog } from 'lucide-react';

export const LiveApresentacao = () => {
    return (
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
            {/* Título e Introdução */}
            <div className="mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif bg-gradient-to-r from-[#00e800] to-white bg-clip-text text-transparent">
                    LiVe Consultoria
                </h1>
                <div className="space-y-6 text-lg text-slate-300 leading-relaxed max-w-4xl mx-auto">
                    <p>
                        Na <strong className="text-[#00e800]">LiVe Consultoria</strong>, não acreditamos em gestão estática.
                        Nosso nome reflete exatamente o nosso DNA: <strong>estar presente, estar ativo, estar em constante movimento.</strong>
                    </p>
                    <p>
                        Liderados pelo consultor <strong className="text-white">Luiz Portal</strong>, operamos com um propósito claro:
                        transformar pessoas e impulsionar empresas através de uma filosofia de alta performance que une
                        <strong className="text-[#00e800]"> Atitude, Clareza e Ação</strong>.
                    </p>
                    <p>
                        Ao contrário das consultorias tradicionais que entregam relatórios teóricos e se afastam, nós atuamos como
                        <strong className="text-white"> parceiros de execução</strong>. Nossa metodologia proprietária transforma
                        diagnósticos em resultados através de três pilares fundamentais:
                    </p>
                </div>
            </div>

            {/* Os 3 Pilares */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Pilar 1 */}
                <div className="card-v4 p-8 text-center hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Search size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-[#00e800]">O Diagnóstico Preciso</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Não baseamos o futuro da sua empresa em "achismos". Antes de qualquer ação, utilizamos nossa
                        <strong className="text-white"> matriz de Maturidade × Impacto</strong> para analisar dados, processos e pessoas,
                        identificando exatamente onde o esforço gerará o maior resultado.
                    </p>
                </div>

                {/* Pilar 2 */}
                <div className="card-v4 p-8 text-center hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <Shield size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-[#00e800]">Liderança e Cultura Antifrágil</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Acreditamos que <strong className="text-white">CNPJs são movidos por CPFs</strong>. Através de treinamentos de
                        Liderança Antifrágil, preparamos gestores e equipes para não apenas suportarem as crises, mas
                        <strong className="text-white"> crescerem diante dos desafios</strong>, criando uma cultura de desenvolvimento contínuo.
                    </p>
                </div>

                {/* Pilar 3 */}
                <div className="card-v4 p-8 text-center hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Cog size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-[#00e800]">Vendas e Processos Eficientes</h3>
                    <p className="text-slate-300 leading-relaxed">
                        Uma empresa precisa de <strong className="text-white">fluxo</strong>. Otimizamos processos com visão de engenharia
                        e treinamos times comerciais com técnicas de alta performance, garantindo que a estrutura interna
                        suporte o <strong className="text-white">crescimento agressivo das vendas</strong>.
                    </p>
                </div>
            </div>

            {/* Fechamento */}
            <div className="card-v4 p-10 text-center bg-gradient-to-r from-[#00e800]/10 to-transparent border-2 border-[#00e800]">
                <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                    Seja reestruturando a gestão ou treinando times de elite, nosso foco é <span className="text-[#00e800]">elevar a régua</span>.
                </p>
                <p className="text-2xl md:text-3xl font-bold mt-4 text-[#00e800]">
                    Na LiVe, nós não apenas apontamos o caminho.<br />
                    Nós construímos a estrada com você.
                </p>
            </div>
        </div>
    );
};
