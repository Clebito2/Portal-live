import { useState, useEffect } from 'react';
import { DB } from '../services/db';
import { Event, Document } from '../types';
import { extractIframeMetadata, IframeMetadata } from '../utils/iframeExtractor';

export interface ContextData {
    dashboardHTML: string | null;
    dashboardTextContent: string; // Texto extraído do HTML (sem tags)
    iframes: IframeMetadata[]; // Metadados dos iframes
    events: Event[];
    documents: Document[];
    knowledgeBase: string;
    otherAgentsConversations: any[];
}

export function useContextData(clientId: string, isOpen: boolean) {
    const [data, setData] = useState<ContextData | null>(null);
    const [loading, setLoading] = useState(false); // Começar false, só carregar quando abrir
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Só carregar dados quando o chat estiver aberto
        if (!isOpen || !clientId) {
            return;
        }

        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                // Pequeno delay para garantir que Firebase Auth está pronto
                await new Promise(resolve => setTimeout(resolve, 500));

                const [
                    dashboardHTML,
                    events,
                    documents,
                    knowledgeBase,
                    otherAgentsConversations
                ] = await Promise.all([
                    DB.getDashboardHTML(clientId).catch(() => null),
                    DB.getEvents(clientId).catch(() => []),
                    DB.getDocuments(clientId).catch(() => []),
                    DB.getBaseKnowledge(clientId).catch(() => ''),
                    (async () => {
                        try {
                            const { Memory } = await import('../services/memory');
                            return await Memory.getAllConversations(clientId, 20);
                        } catch (e) {
                            console.warn('Não foi possível carregar conversas anteriores:', e);
                            return [];
                        }
                    })()
                ]);

                // Extrair metadados de iframes e texto do HTML
                const iframes = dashboardHTML ? extractIframeMetadata(dashboardHTML) : [];

                // Extrair texto limpo (sem tags HTML)
                let dashboardTextContent = '';
                if (dashboardHTML) {
                    let text = dashboardHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
                    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
                    text = text.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
                    text = text.replace(/<[^>]+>/g, ' ');
                    text = text.replace(/\s+/g, ' ').trim();
                    dashboardTextContent = text.length > 3000 ? text.substring(0, 3000) + '...' : text;
                }

                setData({
                    dashboardHTML,
                    dashboardTextContent,
                    iframes,
                    events,
                    documents,
                    knowledgeBase,
                    otherAgentsConversations
                });
            } catch (e: any) {
                console.error('Erro ao carregar contexto:', e);
                // Mostrar mensagem mais amigável
                if (e.code === 'permission-denied') {
                    setError('Aguarde, carregando dados...');
                } else {
                    setError('Não foi possível carregar alguns dados. Você ainda pode usar o Contextus.');
                }

                // Mesmo com erro, definir dados vazios para permitir uso
                setData({
                    dashboardHTML: null,
                    dashboardTextContent: '',
                    iframes: [],
                    events: [],
                    documents: [],
                    knowledgeBase: '',
                    otherAgentsConversations: []
                });
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [clientId, isOpen]); // Adicionar isOpen como dependência

    return { data, loading, error };
}
