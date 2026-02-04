import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { DB } from '../services/db';
import { GEMINI_API_KEY } from '../utils/constants';
import { PROMPTS } from '../utils/prompts';
import { useAuth } from '../context/AuthContext';
import { Document } from '../types';

export const AdminProposals = ({ clientId }: { clientId: string }) => {
    const { user } = useAuth();
    const [iaPrompt, setIaPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    if (user?.role !== 'admin') {
        return <div className="p-8 text-center text-red-500">Acesso Negado. Apenas administradores.</div>;
    }

    const handleGenerateProposal = async () => {
        setIsGenerating(true);
        try {
            const { callGeminiAPI } = await import('../utils/geminiAPI');
            const bk = await DB.getBaseKnowledge(clientId);
            const fullPrompt = `${PROMPTS.AGE_QUOD_AGIS}\n\nCONTEXTO DO CLIENTE (Base de Conhecimento):\n${bk}\n\nSOLICITAÇÃO DO USUÁRIO:\n${iaPrompt}`;

            const html = await callGeminiAPI(
                [{ role: 'user', text: fullPrompt }],
                { temperature: 0.7 }
            );
            // Save as document
            const newDoc: Document = {
                id: Date.now().toString(),
                title: `Proposta IA - ${new Date().toLocaleDateString()}`,
                type: 'HTML',
                date: new Date().toISOString().split('T')[0],
                content: html
            };
            await DB.saveDocument(clientId, newDoc);
            setIaPrompt('');
            alert('Proposta gerada e salva em Documentos!');
        } catch (e) {
            console.error(e);
            alert('Erro ao gerar proposta.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fade-in max-w-3xl mx-auto p-8">
            <div className="text-center mb-8">
                <div className="inline-block p-4 rounded-full bg-[#00e800]/10 text-[#00e800] mb-4">
                    <Sparkles size={40} />
                </div>
                <h2 className="text-3xl font-bold font-serif">AgeQuodAgis Generator</h2>
                <p className="text-slate-400 mt-2">Criação de Propostas M.A.P.C.A e Contratos via IA</p>
            </div>
            <div className="card-v4 p-8">
                <Input
                    label="Descreva o cenário do cliente ou cole o diagnóstico:"
                    textarea
                    rows={8}
                    value={iaPrompt}
                    onChange={(e: any) => setIaPrompt(e.target.value)}
                    placeholder="Ex: Reunião com a TechSolutions, CNPJ ..., problemas de fluxo de caixa..."
                />
                <div className="flex justify-end gap-4 mt-4">
                    <Button onClick={handleGenerateProposal} disabled={!iaPrompt || isGenerating} className="w-full">
                        {isGenerating ? "Processando..." : "Gerar Proposta Completa"}
                    </Button>
                </div>
                <div className="mt-6 text-xs text-slate-500 text-center">
                    * A IA utilizará a Base de Conhecimento do cliente selecionado para enriquecer a proposta.
                </div>
            </div>
        </div>
    );
};
