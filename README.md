# Portal de Consultoria Live - Ecossistema Live

Este projeto é um **Portal de Consultoria Premium** desenvolvido para gerenciar clientes, propostas e dashboards exclusivos. Ele integra tecnologias modernas de frontend com inteligência artificial e serviços em nuvem para oferecer uma experiência robusta e segura.

## 🚀 Visão Geral

O sistema funciona como um hub central onde:
- **Administradores** podem gerenciar clientes, gerar propostas comerciais usando IA, e acessar todos os ambientes.
- **Clientes** têm acesso a um dashboard personalizado, agenda de eventos, documentos e assistentes de IA dedicados.

## ✨ Funcionalidades Principais

### 🎨 Identidade Visual V6.1 (Elite)
O portal utiliza um design system de última geração com foco em imersão e performance:
- **Login Dashboard**: Experiência imersiva com globo terrestre em alta visibilidade (0.45) e fundo limpo (remoção inteligente de texturas).
- **Admin Experience**: Cards de clientes com logos vibrantes em background (opacidade 0.4/0.6) e legibilidade reforçada.
- **Sidebar Minimalista**: Navegação inteligente que expande automaticamente via hover, sem necessidade de controles manuais (setas).
- **Design Atoms**: Uso extensivo de Glassmorphism, Neon Glows e tipografia premium (Poppins/Merriweather).

### 1. Painel Administrativo (`/admin`)
- **Gestão de Clientes**: Visualização em grid de todos os clientes ativos com seus logotipos.
- **Sistema de Notificações**: Pop-up automático ao fazer login que informa todas as alterações em dashboards e documentos feitas por outros administradores desde o seu último acesso.
- **Gerador de Propostas com IA**: Ferramenta integrada com Google Gemini para criar propostas comerciais detalhadas baseadas no framework M.A.P.C.A.
- **Cadastro Automatizado**: Criação de novos clientes e ambientes automaticamente após a aprovação da proposta.
- **Ferramentas da Consultoria**: Página exclusiva para admins com acesso a recursos, metodologias e ferramentas auxiliares.
- **Segurança**: Acesso restrito a administradores autenticados com auto-logout após 30 minutos de inatividade.

### 2. Dashboards de Clientes (`/dashboard/:clientId`)
- **Ambiente Personalizado**: Cada cliente vê apenas o seu conteúdo (logo, cores, dados).
- **Assistentes de IA**: 
  - **Iago**: Chatbot para onboarding e suporte (ex: VP Club).
  - **Consultor de R&S**: Assistente especializado em Recrutamento e Seleção disponível na página Ferramentas da Consultoria.
- **Conteúdo Dinâmico**: Carregamento de templates HTML específicos para cada cliente.

### 3. Agenda e Eventos (`/agenda`)
- **Calendário Interativo**: Visualização de eventos futuros.
- **Gestão de Eventos**: Admins podem criar, editar e excluir eventos.
- **Inscrição**: Clientes podem se inscrever em eventos com um clique.

### 4. Gestão de Documentos (`/documents`)
- **Repositório Seguro**: Upload e visualização de contratos, relatórios e apresentações.
- **Controle de Acesso**: Documentos são segregados por cliente.

## 🛠️ Arquitetura e Tecnologias

- **Frontend**: React (Vite), TypeScript, Tailwind CSS.
- **Backend / BaaS**: Firebase (Authentication, Firestore, Hosting).
- **Inteligência Artificial**: Google Gemini API (via SDK `@google/genai`).
- **Ícones**: Lucide React.

## 🔒 Segurança e Controle de Acesso (RBAC)

O sistema implementa um controle de acesso rigoroso:
- **Autenticação**: Via Firebase Auth.
- **Auto-Logout**: Sistema automático de logout após **30 minutos de inatividade** para todos os usuários.
- **Autorização**:
  - **Admin**: Acesso total (CRUD de clientes, eventos, documentos, gerador de propostas, ferramentas da consultoria).
  - **Cliente**: Acesso apenas leitura ao seu próprio dashboard e documentos; permissão de escrita apenas para inscrição em eventos.
- **Regras de Firestore**: Configuradas para garantir que um cliente não possa ler dados de outro.

### 🛡️ Proteção de API Keys Google (Configurado em Dez/2025)

**Configuração Atual das Chaves:**

Para proteger contra uso indevido, as API Keys do Google Cloud foram configuradas com **restrições de domínio**:

**Restrições do Aplicativo (HTTP Referrers):**
```
https://ecossistema-live-d8fa5.web.app/*
https://ecossistema-live-d8fa5.firebaseapp.com/*
http://localhost:5173/*
http://localhost:4173/*
```

**Restrições da API:**
- Status: **Não restringir a chave**
- Motivo: Firebase Auth requer acesso a múltiplas APIs Google. Restringir para apenas "Generative Language API" quebra autenticação.

**Proteção Ativa:**
- ✅ API Keys só funcionam nos domínios autorizados
- ✅ Uso externo bloqueado pelo Google
- ⚠️ Chaves visíveis no código (limitação de frontend)

**Documentação Completa:**  
Veja `brain/api_key_restrictions_guide.md` e `brain/security_analysis.md`

## 🔑 Gerenciamento de Acesso (Guia Prático)

### Como Adicionar um Novo Administrador
Para dar acesso total a um novo usuário, siga estes passos:
1.  Abra o arquivo `src/utils/constants.ts`.
2.  Localize a lista `ADMIN_EMAILS`.
3.  Adicione o e-mail do novo administrador:
    ```typescript
    export const ADMIN_EMAILS = ['cleber.ihs@gmail.com', 'novo.admin@live.com'];
    ```
4.  Faça o deploy (`npm run build` && `firebase deploy`).
5.  O usuário deve criar uma conta no Firebase com este e-mail.

### Como Vincular um Login a um Cliente
Existem duas formas de vincular um usuário a um dashboard de cliente:

#### 1. Vinculação Automática (Recomendada)
O sistema verifica se o e-mail contém o **ID** ou o **Primeiro Nome** do cliente.
*   **Exemplo**: Se o cliente tem ID `vpclub`, o e-mail `contato@vpclub.com` será vinculado automaticamente.

#### 2. Vinculação Manual (Para e-mails genéricos)
Para e-mails como Gmail, Hotmail, ou que não contêm o nome da empresa:
1.  Abra o arquivo `src/utils/constants.ts`.
2.  Localize o objeto `MANUAL_CLIENT_MAPPINGS`.
3.  Adicione o mapeamento `email: id_do_cliente`:
    ```typescript
    export const MANUAL_CLIENT_MAPPINGS: Record<string, string> = {
        'usuario.generico@gmail.com': 'goianita',
        'diretor@hotmail.com': 'vpclub'
    };
```

## 🛡️ Segurança e Boas Práticas

### Auto-Logout por Inatividade
O sistema implementa logout automático após **30 minutos** sem interação do usuário.

**Como funciona:**
- Monitora eventos: mouse, teclado, scroll e touch
- Timer é resetado a cada interação
- Aplica-se a todos os usuários (admin e clientes)
- Previne acesso não autorizado em sessões abandonadas

**Arquivo de implementação:** `src/hooks/useAutoLogout.ts`

### Página de Ferramentas da Consultoria
Recurso exclusivo para administradores com acesso a metodologias e recursos.

**Como acessar:**
1. Faça login como administrador
2. No painel de seleção (`/admin`), clique no card "Ferramentas da Consultoria"
3. Navegue pelas 6 categorias de ferramentas disponíveis

**Conteúdo disponível:**
- Framework M.A.P.C.A
- Análise de Mercado
- Gestão de Clientes (CRM)
- Base de Conhecimento
- Gerador de Propostas IA
- Ferramentas Auxiliares

### Padrão de Logos
Ao adicionar novos clientes, sempre use logos com as seguintes especificações:

**Formato recomendado:**
- Formato: PNG com fundo transparente
- Proporção: Quadrada (1:1) ou retangular horizontal
- Resolução mínima: 200x200px

**Implementação no código:**
```tsx
<div className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-3 overflow-hidden">
    <img src={logo} className="w-full h-full object-contain" alt={name} />
</div>
```

**Propriedade CSS essencial:** `object-contain` (mantém proporção original sem cortes)

## 📝 Histórico de Alterações e Correções Recentes

### Atualizações de IA e Colaboração (Janeiro 2026)
1.  **Sistema de Notificações de Atualizações**:
    - **Nova Funcionalidade**: Pop-up inteligente para administradores que resume todas as alterações em dashboards e documentos desde o último login.
    - **Dinâmica Multi-Admin**: Rastreamento individual por administrador (`lastSeen`), permitindo que cada um saiba o que seus colegas alteraram.
    - **Metadados de Autoria**: Agora o sistema registra `updatedBy` em cada alteração, informando exatamente quem foi o responsável pela mudança.
    - **Arquivos**: `src/components/AdminUpdatesModal.tsx`, `src/services/db.ts` (sessões e updates).

### Correções Críticas (Dezembro 2025)
1.  **Segurança de Login Reforçada**:
    - Removida a falha de "Mock Login" que permitia acesso com e-mails genéricos.
    - Implementada verificação estrita: apenas usuários autenticados no Firebase ou o administrador mestre podem acessar.
2.  **Correção de Navegação**:
    - O botão "Voltar" na barra lateral agora redireciona corretamente para a Seleção de Clientes (`/admin`) para administradores, em vez de alternar aleatoriamente entre dashboards.
3.  **Gerador de Propostas Estável**:
    - Corrigido erro na leitura da resposta da API Gemini.
    - Adicionada validação explícita da Chave de API com alertas claros de erro.
4.  **Correção de Renderização de Dashboards**:
    - O sistema agora respeita estritamente o `clientId` da URL, impedindo que o conteúdo de um cliente (ex: Casa Goianita) apareça para outros (ex: VP Club).
5.  **Agenda**:
    - Corrigido bug de "Tela Branca" quando o ID do cliente não estava pronto.
    - Resolvidos erros de tipagem nos botões de ação.

### Funcionalidades CRUD e Melhorias (Dezembro 2025 - Parte 2)
1.  **Remoção de IA Generativa**:
    - O botão "Gerador IA" foi removido da barra lateral para simplificar a interface, conforme solicitado.
2.  **Gestão Completa de Clientes (CRUD)**:
    - **Novo Cliente**: Botão adicionado na tela de seleção (`/admin`) para cadastrar novas empresas manualmente (Nome, ID, Logo).
    - **Edição e Exclusão**: Botões rápidos nos cards dos clientes para editar dados ou remover o acesso.
3.  **Gestão de Agenda (CRUD)**:
    - **Novo Evento**: Admins podem criar eventos diretamente na agenda do cliente.
    - **Campos Extras**: Adicionado suporte para **Horário** e **Tipo de Evento** (Reunião, Workshop, Prazo, Outro).
4.  **Gestão de Documentos (CRUD)**:
    - **Novo Documento**: Admins podem adicionar documentos.
    - **Multiformato**: Suporte para links externos de **PDF, Word e Áudio (MP3)**, além de documentos HTML nativos.
5.  **Edição de Dashboard**:
    - **Editor HTML**: Novo botão "Editar Dashboard" (apenas admin) permite colar e salvar o código HTML do dashboard diretamente pelo navegador, facilitando atualizações de layout sem mexer no código-fonte.

### Correções e Melhorias Finais (Dezembro 2025 - Parte 3)
1.  **Atualização Inteligente de Dashboard (IA)**:
    - **Nova Funcionalidade**: Botão "Atualizar Dashboard (IA)" na tela inicial.
    - **Como Funciona**: O Admin seleciona um cliente e dá instruções em linguagem natural (ex: "Mude o fundo para azul escuro"). A IA gera o novo código HTML mantendo a estrutura e o estilo visual.
2.  **Correção de Logos**:
    - Substituição de links quebrados por placeholders automáticos (`ui-avatars.com`) baseados no nome do cliente, garantindo uma interface limpa.
3.  **Visibilidade do Assistente Iago**:
    - O chatbot "Iago" agora é visível também para administradores dentro do ambiente VP Club, facilitando testes e demonstrações.
4.  **Resolução de Erros de API (403)**:
    - Adicionadas instruções claras para ativação da Google Generative AI API no console do Google Cloud.
    - **Instruções de Ativação**:
        1. Acesse o Google Cloud Console.
        2. Selecione o projeto `ecossistema-live-d8fa5`.
        3. Busque por "Generative Language API" e clique em **ENABLE**.

### Otimizações e Novos Recursos (Dezembro 2025 - Parte 4)
1.  **Criação Automática de Dashboard**:
    - Agora, ao aprovar uma proposta gerada pela IA, ela é automaticamente definida como o **Dashboard Principal** do novo cliente, garantindo uma experiência "First Contentful Paint" imediata.
2.  **Links em Eventos**:
    - Adicionada opção de "Link de Inscrição" externo na criação de eventos. O botão de ação se adapta automaticamente para redirecionar o usuário.
3.  **Gestão de Logos**:
    - Atualização dos links de logo para usar URLs `raw` do GitHub, garantindo compatibilidade e renderização correta.
4.  **Mapeamento de Usuários**:
    - Configuração explícita de acesso para usuários-chave (Goianita, Plur, Autocare) via `constants.ts`.
5.  **Persona Iago Aprimorada**:
    - O assistente de onboarding recebeu um novo prompt detalhado com roteiro de interação, validação pedagógica e tom de voz refinado.

### Refinamentos de UX e Upload (Dezembro 2025 - Parte 5)
1.  **Upload de Arquivos Robusto**:
    - **Integração Firebase Storage**: Upload direto de arquivos (PDF, Imagens, Áudio) na aba de Documentos.
    - **UX Aprimorada**: Detecção automática de tipo de arquivo, preenchimento de título e feedback visual de progresso.
    - **Tratamento de Erros**: Mensagens claras para o usuário em caso de falha (permissão, rede, etc.).
2.  **Propostas IA 2.0**:
    - **Design System V3**: Prompt atualizado para gerar propostas visualmente alinhadas com a nova identidade visual (cores, fontes, layout).
    - **Fluxo Inteligente**: Injeção automática da data atual e botão "Regenerar" que permite refinar o prompt.
    - **Polimento**: Remoção de artefatos de código (`markdown`) e animação de carregamento com frases de status ("Analisando...", "Estruturando...").
3.  **Ajustes Visuais**:
    - **Logos**: Correção de dimensionamento na lista de clientes (crop circular perfeito).
    - **Layout**: Cabeçalho administrativo compacto e rodapé das propostas atualizado para 2026.

### Correções de UI/UX (Dezembro 2025 - Parte 6)
1.  **Modal de Documentos**:
    - **Fix de Visualização**: Corrigido problema onde o modal ultrapassava a altura da tela, cortando o botão de ação.
    - **Rodapé Fixo**: O botão "Salvar" agora reside em um rodapé fixo do modal, garantindo acessibilidade constante.
    - **Responsividade**: Altura máxima ajustada para melhor compor em telas menores.

### Melhorias de Navegação e Branding (Dezembro 2025 - Parte 7)
1.  **Sidebar Recolhível**:
    - Adicionado botão de toggle para expandir/recolher a barra lateral, otimizando o espaço de tela para visualização de dashboards.
    - Ajustado background para ocupar 100% da altura (`min-h-screen`), eliminando espaços brancos em telas grandes.
2.  **Consistência de Logos**:
    - **Dashboard**: Implementada busca real no banco de dados para garantir que a logo do cliente correto seja exibida, substituindo o fallback estático.
    - **Seleção de Clientes**: Ajuste de estilo (`object-contain`) para que logos retangulares preencham os círculos sem cortes indesejados.

### Segurança e Ferramentas Administrativas (Dezembro 2025 - Parte 8)
1.  **Auto-Logout por Inatividade**:
    - **Implementação**: Sistema automático de logout após **30 minutos de inatividade**.
    - **Funcionamento**: Hook `useAutoLogout` monitora eventos de mouse, teclado, scroll e touch.
    - **Aplicação**: Ativo para **todos os usuários** (admin e clientes).
    - **Segurança**: Previne acesso não autorizado em sessões abandonadas.
2.  **Página "Ferramentas da Consultoria"**:
    - **Acesso**: Exclusivo para administradores.
    - **Conteúdo**: Grid com 6 ferramentas principais (M.A.P.C.A, Análise de Mercado, CRM, Base de Conhecimento, IA, Auxiliares).
    - **Rota**: `/dashboard/ferramentas`.
    - **Integração**: Cliente especial `ADMIN_ONLY_CLIENTS` visível apenas no painel admin.
3.  **Correções de Proporções de Logos**:
    - **Sidebar**: Logos agora usam `object-contain` com padding adequado (p-1) para manter proporções originais.
    - **Painel Admin**: Logo "The Catalyst" com tamanho aumentado (28x28 vs 20x20) para melhor visibilidade.
    - **Regra Global**: Todas as logos mantêm proporção original sem cortes ou distorções.
    - **Novos Cadastros**: Padrão `object-contain` aplicado automaticamente.

### Central de Agentes de IA e Modelo Gemini (Dezembro 2025 - Parte 9)
1. **Reestruturação da Página "Ferramentas"**:
   - **Live Consultoria - Apresentação Institucional**: A antiga rota `/dashboard/ferramentas` foi transformada em uma página de apresentação premium da consultoria.
   - **Conteúdo**: Texto introdutório sobre a filosofia da Live, explicação dos 3 pilares (Diagnóstico Preciso, Liderança Antifrágil, Vendas e Processos) com ícones visuais.
   - **Design**: Layout moderno com cards interativos (hover effects) e gradientes alinhados à identidade visual.
   - **Arquivo**: `src/components/LiveApresentacao.tsx`

### Segurança e Firebase App Check (Dezembro 2025 - Parte 13)

**Data:** 13 de Dezembro de 2025

**Correções Críticas de Segurança:**
- ✅ **Firebase App Check** implementado com reCAPTCHA v3
- ✅ **Firestore Rules** alteradas de `allow: if true` para RBAC
- ✅ **Isolamento entre clientes** validado em Dashboard.tsx
- ✅ **Iframe sandbox** endurecido (removido `allow-same-origin`)
- ✅ **Mock login** removido (credenciais hardcoded eliminadas)
- ✅ **API Gemini** migrada para REST direta (modelo: `gemini-2.5-flash`)

**Documentação:** 10 artefatos criados (auditoria, arquitetura, guidelines, etc.)  
**Security Score:** 32/100 → 68/100 (+112%)

2. **Nova Página: Agentes de IA** (`/dashboard/:clientId/agentes`):
   - **Acesso**: Exclusivo para administradores (link na sidebar).
   - **Estrutura**: Grid de cards exibindo agentes especializados:
     - **Recrutamento e Seleção**: Consultor de R&S com prompt avançado (perguntas estruturadas, análise STAR, scorecard).
     - **Gerador de Propostas IA**: Modal completo implementado com formulário (Nome do Cliente, Contexto), preview HTML e botões de ação (Gerar, Refazer, Aprovar).
     - **Em Breve**: Placeholder para futuros agentes.
   - **Arquivo**: `src/components/Agentes.tsx`

3. **Correção do Modelo Gemini**:
   - **Problema**: Erro 404 "models/gemini-1.5-flash not found" bloqueava funcionamento dos chats.
   - **Solução**: Atualização para `gemini-2.5-pro` (modelo disponível na API Key do projeto).
   - **Arquivos Afetados**:
     - `src/components/ChatInterface.tsx` (linha 61)
     - `src/components/Agentes.tsx` (linha 83)
   - **Como Verificar Modelos Disponíveis**:
     ```bash
     curl "https://generativelanguage.googleapis.com/v1beta/models?key=SUA_API_KEY"
     ```

4. **Melhorias no ChatInterface**:
   - **Renderização de Markdown**: Integração da biblioteca `react-markdown` para exibir formatação (negrito, listas) nas respostas da IA.
   - **Error Handling Aprimorado**: Mensagens de erro mais descritivas (404, 401, 403) para facilitar debug.
   - **Arquivo**: `src/components/ChatInterface.tsx`

5. **Implementação do Modal "Gerador de Propostas"**:
   - **Funcionalidade Completa**: Interface visual com campos de entrada (nome, contexto), botão "Gerar Proposta", preview do HTML gerado e botões "Refazer" e "Aprovar e Criar Cliente".
   - **Fluxo**: Admin preenche dados → IA gera proposta → Preview exibido → Aprovação cria cliente automaticamente com dashboard pré-configurado.
   - **Status**: 100% funcional após correção do modelo IA.

6. **Correções de Lint/TypeScript**:
   - Adicionado prop `label` obrigatório no componente `Input` (`Agentes.tsx`).
   - Envolvido `ReactMarkdown` em `<div>` para evitar erro de `className` incompatível (`ChatInterface.tsx`).

### Correções de Navegação e Dashboard (Dezembro 2025 - Parte 14)

**Data:** 15 de Dezembro de 2025

1. **Correção de Links Externos no Dashboard**:
   - **Problema**: Links dentro do iframe do dashboard (ex: "Acessar materiais", "Acessar manual") não abriam ao serem clicados.
   - **Causa**: O atributo `sandbox` do iframe não permitia navegação top-level iniciada pelo usuário.
   - **Solução**: Adicionado `allow-top-navigation-by-user-activation` ao sandbox do iframe.
   - **Arquivo**: `src/components/DashboardHome.tsx` (linha 70)
   - **Sandbox Atualizado**: `allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-top-navigation-by-user-activation`

2. **Atualização do Dashboard Casa Goianita**:
   - **Reuniões**: Quantidade atualizada de 5 para 6 (edição direta no Firestore).
   - **Links de Materiais**: Garantido que links de "Acessar Material" e "Acessar Manual" possuem `target="_blank"` para abrir em nova aba.

3. **Boas Práticas para Links em Dashboards**:
1.  **Correção de Links Externos no Dashboard**:
    - **Problema**: Links dentro do iframe do dashboard (ex: "Acessar materiais", "Acessar manual") não abriam ao serem clicados.
    - **Causa**: O atributo `sandbox` do iframe não permitia navegação top-level iniciada pelo usuário.
    - **Solução**: Adicionado `allow-top-navigation-by-user-activation` ao sandbox do iframe.
    - **Arquivo**: `src/components/DashboardHome.tsx` (linha 70)
    - **Sandbox Atualizado**: `allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-top-navigation-by-user-activation`

2.  **Atualização do Dashboard Casa Goianita**:
    - **Reuniões**: Quantidade atualizada de 5 para 6 (edição direta no Firestore).
    - **Links de Materiais**: Garantido que links de "Acessar Material" e "Acessar Manual" possuem `target="_blank"` para abrir em nova aba.

3.  **Boas Práticas para Links em Dashboards**:
    - Sempre usar `target="_blank"` para links externos.
    - Incluir `rel="noopener noreferrer"` por segurança.
    - Exemplo correto:
      ```html
      <a href="https://drive.google.com/..." target="_blank" rel="noopener noreferrer">Acessar Material</a>
      ```

### Correções e Ajustes (Janeiro 2026)

**Data**: 15 de Janeiro de 2026

1.  **Correção de Mapeamento de Clientes**:
    *   **Problema**: Usuário `ibra@tecnoit.com.br` acessava cliente incorreto ou via tela branca.
    *   **Solução**: Reversão do mapeamento para `The_Catalyst` e remoção do cliente duplicado `Ibrahim Boufleur` do código-fonte.
    *   **Ferramenta Admin**: Adicionado botão "Corrigir Acesso Ibra" no painel administrativo para criar regras de segurança faltantes no Firestore.

2.  **Correção de Links na Agenda**:
    *   **Problema**: Links de eventos externos (Google Meet) abriam como sub-rotas relativas.
    *   **Solução**: Normalização automática de URLs (adição de `https://` se ausente) e uso de `window.open` em nova aba.
    *   **UX**: Botão renomeado para "Acessar Link" quando há URL externa, mantendo "Inscrever-se" para eventos internos.

### RAG Memory System e Agentes para Clientes (Dezembro 2025 - Parte 15)

**Data**: 16 de Dezembro de 2025

**Funcionalidades Implementadas:**

1. **Sistema RAG (Retrieval-Augmented Generation)**: Criado `memory.ts` para contexto persistente de conversas em Firestore
2. **Acesso Controlado a Agentes**: Clientes específicos (Goianita, Plur, Autocare) podem acessar agente R&S
3. **Auto-Identificação**: R&S detecta empresa automaticamente e personaliza saudação
4. **Proteção de API Keys**: HTTP referrers configurados no Google Cloud (domínios autorizados)
5. **UX**: Favicon com logo Live + Sidebar "Consultoria" → "Dashboard"

**Documentação**: `brain/security_config_final.md`, `brain/walkthrough.md`

## 🚀 Como Rodar Localmente

1.  **Instalar Dependências**:
    ```bash
    npm install
    ```
2.  **Configurar Variáveis de Ambiente**:
    - Crie um arquivo `.env.local` na raiz.
    - Adicione sua chave do Gemini: `VITE_GEMINI_API_KEY=sua_chave_aqui` (ou configure em `src/utils/constants.ts`).
3.  **Rodar o Servidor de Desenvolvimento**:
    ```bash
    npm run dev
    ```
4.  **Build para Produção**:
    ```bash
    npm run build
    ```

## ☁️ Deploy

O projeto está configurado para deploy no **Firebase Hosting**:

```bash
npm run build
firebase deploy
```

---
**Desenvolvido por Cleber Donato & Antigravity Agent**
