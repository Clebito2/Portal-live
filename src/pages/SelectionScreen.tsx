import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DB } from '../services/db';
import { SecurityDiagnosis } from '../components/SecurityDiagnosis';
import { useAuth } from '../context/AuthContext';
import { ASSETS, GEMINI_API_KEY, MOCK_CLIENTS, ADMIN_ONLY_CLIENTS } from '../utils/constants';
import { PROMPTS } from '../utils/prompts';
import { Client, Document } from '../types';
import { LogOut, Briefcase, RefreshCw, Github, Loader2, X, RotateCcw, CheckCircle, Wrench, Users, ShieldAlert } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { AdminUpdatesModal } from '../components/AdminUpdatesModal';

// 🛡️ VALIDAÇÃO DE HTML GERADO PELA IA
interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

function validateGeneratedHTML(generatedHTML: string, originalHTML: string): ValidationResult {
    const errors: string[] = [];

    // 1. Verificar se não está vazio
    if (!generatedHTML || generatedHTML.trim().length < 50) {
        errors.push('❌ HTML gerado está vazio ou muito pequeno');
        return { isValid: false, errors };
    }

    // 2. Verificar se tem estrutura HTML básica
    const hasHtmlTag = generatedHTML.includes('<html') || generatedHTML.includes('<!DOCTYPE');
    const hasBodyTag = generatedHTML.includes('<body');

    if (!hasHtmlTag || !hasBodyTag) {
        errors.push('❌ HTML não tem estrutura básica (<html> e <body> faltando)');
    }

    // 3. Verificar se não é apenas erro/mensagem da IA
    const looksLikeError = generatedHTML.toLowerCase().includes('desculpe') ||
        generatedHTML.toLowerCase().includes('não consigo') ||
        generatedHTML.toLowerCase().includes('erro ao');
    if (looksLikeError && generatedHTML.length < 500) {
        errors.push('❌ IA retornou mensagem de erro em vez de HTML válido');
    }

    // ✅ VALIDAÇÃO SIMPLIFICADA: Apenas 3 checks básicos
    // Removidas validações restritivas de:
    // - Contagem de tags (muitos falsos positivos)
    // - Verificação de conteúdo do body (muito restritivo)
    // - Verificação de sistema de abas (bloqueava updates válidos)

    return {
        isValid: errors.length === 0,
        errors
    };
}

export const SelectionScreen = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Create New Client State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createPrompt, setCreatePrompt] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
    const [loadingText, setLoadingText] = useState('Processando...');

    // Update Dashboard State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateClientId, setUpdateClientId] = useState('');
    const [updateInstruction, setUpdateInstruction] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateButtonText, setUpdateButtonText] = useState('🔄 Atualizando...');

    const loadingPhrases = [
        "🔍 Analisando dados da empresa...",
        "🧠 Estruturando diagnóstico M.A.P.C.A...",
        "🎨 Aplicando Design System Live V3...",
        "📊 Calculando projeções e investimentos...",
        "✨ Finalizando proposta premium..."
    ];

    const updateLoadingPhrases = [
        "🔄 Atualizando dashboard...",
        "🎨 Aplicando novos estilos...",
        "🤖 A IA está trabalhando...",
        "☕ Peraí que eu espirrei...",
        "⏳ Espera só mais um tiquim...",
        "🚀 Já tá quase pronto!",
        "💡 Tendo uma ideia genial...",
        "🎯 Ajustando os detalhes...",
        "✨ Polindo o resultado...",
        "🔮 Consultando a bola de cristal..."
    ];

    useEffect(() => {
        if (isLoading) {
            let i = 0;
            const interval = setInterval(() => {
                setLoadingText(loadingPhrases[i % loadingPhrases.length]);
                i++;
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    useEffect(() => {
        if (isUpdating) {
            let i = 0;
            const interval = setInterval(() => {
                setUpdateButtonText(updateLoadingPhrases[i % updateLoadingPhrases.length]);
                i++;
            }, 15000); // 15 segundos
            return () => clearInterval(interval);
        } else {
            setUpdateButtonText('🔄 Atualizando...');
        }
    }, [isUpdating]);

    // Manual Client CRUD State
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientForm, setClientForm] = useState({ name: '', id: '', logo: '' });

    // Security Diagnosis Modal
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

    // Admin Updates State
    const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState(false);
    const [recentUpdates, setRecentUpdates] = useState<any[]>([]);

    useEffect(() => {
        loadClients();
        checkForUpdates();
    }, []);

    const checkForUpdates = async () => {
        if (user?.role === 'admin' && user.email) {
            console.log("🔍 Verificando atualizações para:", user.email);
            const lastSeen = await DB.getAdminLastSeen(user.email);
            console.log("📅 Último acesso registrado:", lastSeen);

            if (lastSeen) {
                const updates = await DB.getAllUpdates(lastSeen);
                console.log("🆕 Atualizações encontradas:", updates.length);
                if (updates.length > 0) {
                    setRecentUpdates(updates);
                    setIsUpdatesModalOpen(true);
                }
            } else {
                console.log("ℹ️ Primeiro acesso com este sistema de notificações. Registrando data atual.");
            }
            // DB.updateAdminLastSeen(user.email); // REMOVIDO: Só atualizamos ao clicar em "Entendido"
        }
    };

    const handleAcknowledgeUpdates = async () => {
        if (user?.email) {
            await DB.updateAdminLastSeen(user.email);
            setIsUpdatesModalOpen(false);
        }
    };

    const loadClients = async () => {
        let list = await DB.getClients();
        if (!list || list.length === 0) {
            console.warn("DB returned empty client list. Using Mock fallback.");
            list = MOCK_CLIENTS;
        }

        // Não incluir ADMIN_ONLY_CLIENTS no grid (Ferramentas acessado só por botão)
        setClients(list);
    };

    const handleSelectClient = (clientId: string) => {
        navigate(`/dashboard/${clientId}`);
    };

    const handleExport = () => {
        const code = document.documentElement.outerHTML;
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portal-live.html';
        a.click();
    };

    const getApiKey = () => GEMINI_API_KEY || '';

    const handleGenerateProposalPreview = async () => {
        const apiKey = getApiKey();
        if (!apiKey) {
            alert("ERRO CRÍTICO: Chave de API do Gemini não encontrada. Configure a chave no arquivo constants.ts ou .env.local.");
            return;
        }

        setIsLoading(true);
        try {
            const { callGeminiAPI } = await import('../utils/geminiAPI');

            const text = await callGeminiAPI(
                [
                    {
                        role: 'user',
                        text: `DATA ATUAL: ${new Date().toLocaleDateString('pt-BR')}\n\nSOLICITAÇÃO DE NOVO CLIENTE (${newClientName}):\n${createPrompt}`
                    }
                ],
                {
                    systemInstruction: PROMPTS.AGE_QUOD_AGIS,
                    temperature: 0.7,
                    maxOutputTokens: 16384
                }
            );

            setGeneratedProposal(text);
        } catch (e: any) {
            console.error("Gemini Error:", e);
            let msg = 'Erro ao gerar proposta.';
            if (e.message && e.message.includes('503')) msg += ' O modelo está sobrecarregado. Tente novamente em alguns instantes.';
            else if (e.message) msg += ` Detalhes: ${e.message}`;
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveAndSaveClient = async () => {
        if (!generatedProposal) return;
        setIsLoading(true);

        try {
            const cleanName = newClientName.trim() || "Nova Empresa";
            const clientId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');

            const newClient: Client = {
                id: clientId,
                name: cleanName,
                logo: ASSETS.logoLive // Default logo
            };

            await DB.saveClient(newClient);

            const newDoc: Document = {
                id: Date.now().toString(),
                title: `Proposta Inicial - ${new Date().toLocaleDateString()}`,
                type: 'HTML',
                date: new Date().toISOString().split('T')[0],
                content: generatedProposal
            };
            await DB.saveDocument(clientId, newDoc);

            // NEW: Set the generated proposal as the initial Dashboard HTML
            await DB.saveDashboardHTML(clientId, generatedProposal, user?.name);

            loadClients();
            setIsCreateModalOpen(false);
            setCreatePrompt('');
            setNewClientName('');
            setGeneratedProposal(null);
            alert(`Cliente ${cleanName} cadastrado com sucesso e proposta salva!`);
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar dados.');
        } finally {
            setIsLoading(false);
        }
    };

    // Manual CRUD Handlers
    const openClientModal = (client?: Client) => {
        if (client) {
            setEditingClient(client);
            setClientForm({ name: client.name, id: client.id, logo: client.logo || '' });
        } else {
            setEditingClient(null);
            setClientForm({ name: '', id: '', logo: '' });
        }
        setIsClientModalOpen(true);
    };

    const handleSaveClient = async () => {
        if (!clientForm.name || !clientForm.id) {
            alert("Nome e ID são obrigatórios.");
            return;
        }
        setIsLoading(true);
        try {
            const clientToSave: Client = {
                id: clientForm.id,
                name: clientForm.name,
                logo: clientForm.logo || ASSETS.logoLive
            };
            await DB.saveClient(clientToSave);
            loadClients();
            setIsClientModalOpen(false);
        } catch (e) {
            console.error(e);
            alert("Erro ao salvar cliente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClient = async (e: React.MouseEvent, clientId: string) => {
        e.stopPropagation();
        if (window.confirm("Tem certeza que deseja excluir este cliente? Isso não pode ser desfeito.")) {
            setIsLoading(true);
            try {
                // @ts-ignore
                await DB.deleteClient(clientId);
                loadClients();
            } catch (e) {
                console.error(e);
                alert("Erro ao excluir cliente.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    // AI Dashboard Update - usando estados já declarados no topo
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);

    const handleGenerateDashboardUpdate = async () => {
        if (!updateClientId || !updateInstruction) {
            alert("Selecione um cliente e digite as instruções.");
            return;
        }

        const apiKey = getApiKey();
        if (!apiKey) {
            alert("Erro: Chave de API não encontrada.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Get current HTML
            setIsUpdating(true);
            const currentHtml = await DB.getDashboardHTML(updateClientId) || '';

            // 2. Call AI with fallback
            const { callGeminiAPI } = await import('../utils/geminiAPI');

            // Obter data atual no formato brasileiro
            const today = new Date();
            const brazilDate = today.toLocaleDateString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const prompt = `
# ROLE (PERSONA)
Você é um Engenheiro Front-End Sênior e Especialista em Data Visualization. Você atua como o motor de renderização do "Sistema Live V3". Sua responsabilidade é manipular código HTML/JS legado com precisão cirúrgica.
Nível de Senioridade: Staff Engineer (foco em estabilidade e consistência visual).

# CONTEXTO [C]
Você recebe o código-fonte HTML completo de um dashboard de consultoria existente e uma solicitação de atualização.
O sistema opera em um ambiente React, mas o conteúdo do dashboard é HTML puro renderizado em iframe.
O ambiente visual é "Dark Mode Corporativo" com acentos em Verde Neon.
**DATA ATUAL (Horário de Brasília):** ${brazilDate}

# DESIGN SYSTEM "LIVE V3" (DIRETRIZES VISUAIS)
Você deve seguir estritamente esta paleta e estilo. Não invente cores fora deste espectro:
1.  **Cores Principais:**
    * Fundo Global: \`#06192a\` (Deep Navy)
    * Acento/Destaque: \`#00e800\` (Neon Green - Usar para botões primários, ícones ativos, highlights)
    * Texto Principal: \`#ffffff\` ou \`#f1f5f9\` (Slate 50)
    * Texto Secundário: \`#94a3b8\` (Slate 400)
    * Cards/Containers: \`rgba(255, 255, 255, 0.05)\` com borda sutil \`#1e293b\`.
2.  **Tipografia:** Fonte sem serifa limpa (system-ui, sans-serif). Títulos sóbrios.
3.  **Estilo de Componentes:**
    * Botões: Bordas arredondadas (rounded-md), hover transitions suaves.
    * Gráficos: Use Chart.js via CDN se necessário. Fundo transparente, linhas em \`#00e800\`.

# AÇÃO [A]
Sua tarefa é ler o HTML atual, interpretar o pedido do usuário e retornar **apenas o HTML atualizado**, sem markdown, sem explicações.

## PROTOCOLO DE EXECUÇÃO
1.  **Análise de Integridade:** Verifique a estrutura de abas (\`tab-btn\` e \`tab-content\`).
2.  **Injeção de Recursos:** Se o usuário pedir gráficos, verifique se o CDN do Chart.js está no \`<head>\`. Se não, adicione: \`<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\`.
3.  **Tratamento de Erros:** Se encontrar erros no código antigo (tags abertas, scripts quebrados), **IGNORE-OS**. Não tente refatorar. Apenas insira o novo conteúdo solicitado de forma isolada e segura.
4.  **Atualização Automática de Data:** Analise o HTML atual e verifique se existe algum campo de "última atualização", "atualizado em", "data de atualização" ou similar. Se encontrar, atualize a data para **${brazilDate}** mantendo o formato e contexto original. Se NÃO houver esse campo, NÃO adicione.
5.  **Execução da Mudança:** Insira o novo conteúdo mantendo a estrutura de navegação intacta.

# FORMATO [F]
Saída: STRING ÚNICA contendo o HTML Completo (\`<!DOCTYPE html>...</html>\`).
Regra de Ouro: O código deve ser válido para renderização imediata em um \`iframe\`.

# TOM DE VOZ
No conteúdo gerado (títulos, textos, labels): Corporativo, Sóbrio, Analítico e Direto. Evite gírias, exclamações excessivas ou linguagem de marketing agressiva. Foco em dados e clareza.

# RESTRIÇÕES E SEGURANÇA [S]
1.  **Santuário das Abas:** JAMAIS remova os IDs, classes (\`tab-btn\`, \`tab-content\`) ou funções JS (\`openTab\`) existentes. Isso quebra a navegação.
2.  **Bloqueio de Refatoração:** Não reescreva CSS ou JS que não esteja relacionado à solicitação atual.
3.  **Estilo:** Nunca use fundo branco (\`#ffffff\`) para o corpo da página. Mantenha o tema dark \`#06192a\`.
4.  **Scripts:** Scripts novos devem ser adicionados antes do fechamento do \`</body>\`.

# EXEMPLOS (FEW-SHOT)

## Exemplo 1: Adicionar Gráfico de Faturamento
**Solicitação:** "Crie uma aba Financeiro com gráfico de barras"
**Ação da IA:**
1. Adiciona botão \`<button class="tab-btn" onclick="openTab('financeiro')">Financeiro</button>\`.
2. Adiciona container \`<div id="financeiro" class="tab-content" style="display:none">\`.
3. Dentro do container, adiciona \`<canvas id="chartFin"></canvas>\`.
4. Adiciona script do Chart.js no final, configurando o gráfico com cores do tema (\`#00e800\`).

## Exemplo 2: Modificar Texto
**Solicitação:** "Mude o título da aba Visão Geral para 'Dashboard Executivo'"
**Ação da IA:**
1. Busca o elemento \`<h1>\` ou o botão da aba correspondente.
2. Altera apenas o texto interno.
3. Mantém todas as tags e atributos intactos.

---
# INÍCIO DO PROCESSAMENTO

HTML ATUAL:
\`\`\`html
${currentHtml || '<h1>Dashboard Vazio</h1>'}
\`\`\`

SOLICITAÇÃO DO USUÁRIO:
"${updateInstruction}"
            `;

            let text = await callGeminiAPI(
                [{ role: 'user', text: prompt }],
                { temperature: 0.7, maxOutputTokens: 16384 }
            );

            // Clean markdown if present
            text = text.replace(/```html/g, '').replace(/```/g, '');

            // 🛡️ VALIDAÇÃO AUTOMÁTICA DO HTML (NOVO)
            const validation = validateGeneratedHTML(text, currentHtml);

            if (!validation.isValid) {
                console.error('❌ Validação falhou:', validation.errors);
                alert(`⚠️ A IA gerou HTML com problemas:\n\n${validation.errors.join('\n')}\n\nTente novamente ou use comandos mais específicos.`);
                setIsLoading(false);
                setIsUpdating(false);
                return;
            }

            // Se passou na validação, exibe preview
            setPreviewHtml(text);

        } catch (e: any) {
            console.error(e);
            alert(`Erro na IA: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveDashboardUpdate = async () => {
        if (!updateClientId || !previewHtml) return;
        await DB.saveDashboardHTML(updateClientId, previewHtml, user?.name);
        alert("Dashboard atualizado com sucesso!");
        setIsUpdateModalOpen(false);
        setPreviewHtml(null);
        setUpdateInstruction('');
        setIsUpdating(false);
    };

    return (
        <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
            {/* V6 Environment managed by Global Styles & Index.html */}

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <button onClick={logout} className="absolute top-6 right-6 text-red-400 hover:text-red-300 flex gap-2 items-center"><LogOut size={16} /> Sair</button>
                <div className="text-center mb-8">
                    <img src={ASSETS.logoLive} className="h-12 mx-auto mb-3" alt="Logo Live" />
                    <h1 className="text-2xl font-bold font-serif">Painel Administrativo</h1>
                    <p className="text-slate-400 text-sm">Selecione um ambiente para acessar ou gerenciar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl w-full">
                    {clients.map((client: Client) => (
                        <div key={client.id} onClick={() => handleSelectClient(client.id)} className="card-v4 p-6 flex flex-col items-center justify-center group relative overflow-hidden cursor-pointer min-h-[200px]">
                            {/* Logo como Background com Visibilidade Aumentada */}
                            <div
                                className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                                style={{
                                    backgroundImage: `url(${client.logo})`,
                                    filter: 'grayscale(10%)'
                                }}
                            />

                            {/* Botões de Ação (Hover) */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button onClick={(e) => { e.stopPropagation(); openClientModal(client); }} className="p-1 bg-black/40 text-blue-400 rounded hover:bg-blue-500 hover:text-white backdrop-blur-md border border-white/10"><RefreshCw size={14} /></button>
                                <button onClick={(e) => handleDeleteClient(e, client.id)} className="p-1 bg-black/40 text-red-400 rounded hover:bg-red-500 hover:text-white backdrop-blur-md border border-white/10"><X size={14} /></button>
                            </div>

                            {/* Nome do Cliente (com contraste reforçado) */}
                            <h3 className="font-bold text-xl group-hover:text-[#00e800] transition-colors z-10 text-center drop-shadow-[0_2px_12px_rgba(0,0,0,1)] text-white relative">
                                {client.name}
                            </h3>

                            {/* Overlay de gradiente para garantir contraste no texto */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none" />

                            {/* Gradiente de Hover Neon */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#00e800]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex gap-4 flex-wrap justify-center">
                    {/* @ts-ignore */}
                    <Button variant="primary" onClick={() => openClientModal()}>
                        <Briefcase size={18} /> Novo Cliente
                    </Button>
                    {/* @ts-ignore */}
                    <Button variant="ghost" onClick={() => setIsUpdateModalOpen(true)} className="border border-slate-700 hover:border-[#00e800]">
                        <RefreshCw size={18} /> Atualizar Dashboard
                    </Button>
                    {/* @ts-ignore */}
                    <Button variant="ghost" onClick={() => navigate('/admin/users')} className="border border-slate-700 hover:border-[#00e800]">
                        <Users size={18} /> Gerenciar Usuários
                    </Button>
                    {/* @ts-ignore */}
                    <Button variant="secondary" onClick={() => navigate('/dashboard/ferramentas')} className="border border-[#00e800] hover:bg-[#00e800] hover:text-[#06192a]">
                        <Wrench size={18} /> Ferramentas da Consultoria
                    </Button>
                    {/* @ts-ignore */}
                    <Button variant="ghost" onClick={() => setIsSecurityModalOpen(true)} className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
                        <ShieldAlert size={18} /> Diagnóstico de Segurança
                    </Button>
                </div>

                {/* CREATE/EDIT CLIENT MODAL */}
                <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title={editingClient ? "Editar Cliente" : "Novo Cliente"}>
                    <div className="space-y-4">
                        <Input label="Nome da Empresa" value={clientForm.name} onChange={(e: any) => setClientForm({ ...clientForm, name: e.target.value })} placeholder="Ex: TechSolutions" />
                        <Input label="ID do Cliente (URL)" value={clientForm.id} onChange={(e: any) => setClientForm({ ...clientForm, id: e.target.value })} placeholder="Ex: techsolutions" disabled={!!editingClient} />
                        <Input label="URL do Logo" value={clientForm.logo} onChange={(e: any) => setClientForm({ ...clientForm, logo: e.target.value })} placeholder="https://..." />
                        {/* @ts-ignore */}
                        <Button className="w-full" onClick={handleSaveClient} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Salvar Cliente"}
                        </Button>
                    </div>
                </Modal>

                {/* AI PROPOSAL MODAL */}
                <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); setGeneratedProposal(null); }} title="Gerar Proposta e Novo Cliente" maxWidth="max-w-5xl">
                    {!generatedProposal ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800 rounded-lg text-sm text-slate-300 mb-4">
                                <p className="mb-2"><strong className="text-[#00e800]">Instruções:</strong></p>
                                <ul className="list-disc ml-4">
                                    <li>Insira o nome oficial da empresa.</li>
                                    <li>Cole o diagnóstico, reunião ou dados brutos. A IA usará o framework M.A.P.C.A para gerar a proposta.</li>
                                    <li>Você poderá <strong>revisar e aprovar</strong> a proposta antes de salvar.</li>
                                </ul>
                            </div>
                            <Input label="Nome da Empresa (Novo Cliente)" value={newClientName} onChange={(e: any) => setNewClientName(e.target.value)} placeholder="Ex: TechSolutions Ltda" />
                            <Input label="Diagnóstico/Contexto para a Proposta" textarea rows={6} value={createPrompt} onChange={(e: any) => setCreatePrompt(e.target.value)} placeholder="Descreva o cenário, dores e dados da empresa..." />
                            {/* @ts-ignore */}
                            {/* @ts-ignore */}
                            <Button className="w-full" onClick={handleGenerateProposalPreview} disabled={!createPrompt || !newClientName || isLoading}>
                                {isLoading ? <><Loader2 className="animate-spin" /> {loadingText}</> : "Gerar Preview da Proposta"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[75vh]">
                            <div className="flex justify-between items-center mb-4 p-4 bg-slate-900 border border-slate-700 rounded-lg">
                                <div>
                                    <h4 className="font-bold text-white text-lg">Revisão da Proposta</h4>
                                    <p className="text-xs text-slate-400">Verifique meticulosamente a análise M.A.P.C.A abaixo.</p>
                                </div>
                                <div className="flex gap-3">
                                    {/* @ts-ignore */}
                                    <Button variant="ghost" onClick={() => setGeneratedProposal(null)}>
                                        <X size={18} /> Cancelar
                                    </Button>
                                    {/* @ts-ignore */}
                                    <Button variant="secondary" onClick={() => setGeneratedProposal(null)} disabled={isLoading}>
                                        <RotateCcw size={18} /> Regenerar (Editar Prompt)
                                    </Button>
                                    {/* @ts-ignore */}
                                    <Button variant="primary" onClick={handleApproveAndSaveClient} disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> Aprovar e Cadastrar</>}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 bg-white rounded-lg overflow-hidden border border-slate-700 shadow-xl">
                                <iframe srcDoc={generatedProposal} className="w-full h-full" title="Proposal Preview" />
                            </div>
                        </div>
                    )}
                </Modal>

                {/* AI DASHBOARD UPDATE MODAL */}
                <Modal isOpen={isUpdateModalOpen} onClose={() => { setIsUpdateModalOpen(false); setPreviewHtml(null); }} title="Atualizar Dashboard com IA" maxWidth="max-w-5xl">
                    {!previewHtml ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Selecione o Cliente</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-[#00e800] focus:outline-none"
                                    value={updateClientId}
                                    onChange={(e) => setUpdateClientId(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <Input
                                label="Instruções para a IA"
                                textarea
                                rows={6}
                                value={updateInstruction}
                                onChange={(e: any) => setUpdateInstruction(e.target.value)}
                                placeholder="Ex: Mude a cor de fundo para azul escuro, adicione uma seção de 'Novidades'..."
                            />
                            {/* @ts-ignore */}
                            <Button className="w-full" onClick={handleGenerateDashboardUpdate} disabled={!updateClientId || !updateInstruction || isUpdating}>
                                {isUpdating ? <><Loader2 className="animate-spin" size={18} /> {updateButtonText}</> : <>🔄 Gerar Preview</>}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[75vh]">
                            <div className="flex justify-between items-center mb-4 p-4 bg-slate-900 border border-slate-700 rounded-lg">
                                <div>
                                    <h4 className="font-bold text-white text-lg">Preview do Dashboard</h4>
                                    <p className="text-xs text-slate-400">Verifique se as alterações ficaram como desejado.</p>
                                </div>
                                <div className="flex gap-3">
                                    {/* @ts-ignore */}
                                    <Button variant="ghost" onClick={() => setPreviewHtml(null)}>
                                        <X size={18} /> Cancelar
                                    </Button>
                                    {/* @ts-ignore */}
                                    <Button variant="primary" onClick={handleSaveDashboardUpdate}>
                                        <CheckCircle size={18} /> Salvar Alterações
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 bg-white rounded-lg overflow-hidden border border-slate-700 shadow-xl">
                                <iframe srcDoc={previewHtml} className="w-full h-full" title="Dashboard Preview" />
                            </div>
                        </div>
                    )}
                </Modal>

                {/* SECURITY DIAGNOSIS MODAL */}
                <Modal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} title="Diagnóstico de Segurança" maxWidth="max-w-4xl">
                    <SecurityDiagnosis onClose={() => setIsSecurityModalOpen(false)} />
                </Modal>

                {/* ADMIN UPDATES MODAL */}
                <AdminUpdatesModal
                    isOpen={isUpdatesModalOpen}
                    onClose={() => setIsUpdatesModalOpen(false)}
                    onConfirm={handleAcknowledgeUpdates}
                    updates={recentUpdates}
                />
                {/* DIAGNOSTIC FIX BUTTON REMOVED */}
            </div>
        </div>
    );
};
