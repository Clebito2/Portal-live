# Documentação Técnica Completa - Portal de Consultoria Live

> **Audiência-Alvo:** Agentes de IA para análise, sugestões de melhoria e criação de mapas mentais  
> **Data:** 18 de Dezembro de 2025  
> **Versão:** 3.0

---

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Arquitetura e Stack Tecnológico](#arquitetura-e-stack-tecnológico)
3. [Modelo de Dados](#modelo-de-dados)
4. [Fluxos de Autenticação e Autorização](#fluxos-de-autenticação-e-autorização)
5. [Funcionalidades Principais](#funcionalidades-principais)
6. [Integração com IA (Google Gemini)](#integração-com-ia-google-gemini)
7. [Sistema RAG (Retrieval-Augmented Generation)](#sistema-rag-retrieval-augmented-generation)
8. [Componentes Frontend](#componentes-frontend)
9. [Roteamento de Aplicação](#roteamento-de-aplicação)
10. [Segurança e Proteção de Dados](#segurança-e-proteção-de-dados)
11. [Deploy e Infraestrutura](#deploy-e-infraestrutura)
12. [Limitações Conhecidas e Débitos Técnicos](#limitações-conhecidas-e-débitos-técnicos)

---

## 1. Visão Geral do Sistema

### Propósito
O **Portal de Consultoria Live** é uma plataforma SaaS B2B projetada para empresas de consultoria gerenciarem múltiplos clientes em um ambiente centralizado. A solução combina:

- **Dashboards Personalizados** (HTML dinâmico renderizado em iframes)
- **Agentes de IA Especializados** (Gemini 2.5 Pro)
- **Sistema RAG** para memória contextual
- **Gerador Automatizado de Propostas Comerciais** (framework M.A.P.C.A)

### Modelo de Negócio
- **Admin** (Consultoria): Gestão completa de clientes, propostas e conteúdo
- **Cliente**: Acesso restrito ao próprio dashboard, documentos e assistentes

---

## 2. Arquitetura e Stack Tecnológico

### Frontend
```typescript
- Framework: React 19.2.1
- Build Tool: Vite 6.2.0
- Linguagem: TypeScript 5.8.2
- Roteamento: React Router DOM 7.10.1
- Estilização: TailwindCSS (inline classes) + CSS personalizado
- Ícones: Lucide React 0.555.0
- Renderização de Markdown: react-markdown 10.1.0
```

### Backend / BaaS
```typescript
- Firebase Authentication: Controle de acesso
- Firestore: Banco de dados NoSQL
- Firebase Storage: Upload de arquivos (atualmente desabilitado, apenas links)
- Firebase Hosting: Hospedagem estática
- Firebase App Check: reCAPTCHA v3 para proteção de API
```

### Inteligência Artificial
```typescript
- Provedor: Google Generative AI (@google/genai 1.31.0)
- Modelo Principal: gemini-2.5-pro
- Aplicações:
  - Geração de propostas comerciais (AGE_QUOD_AGIS)
  - Assistente de onboarding (IAGO)
  - Consultor de R&S (RECRUTAMENTO_SELECAO)
  - Atualizador de dashboards (DASHBOARD_EDITOR)
```

### Estrutura de Diretórios
```
src/
├── components/       # 11 componentes reutilizáveis
├── pages/            # 4 páginas principais
├── services/         # 4 serviços (firebase, db, memory, appCheck)
├── context/          # AuthContext (gerenciamento de sessão)
├── hooks/            # useAutoLogout
├── utils/            # constants, prompts, geminiAPI
├── styles/           # GlobalStyles
├── types/            # Definições TypeScript
└── App.tsx           # Ponto de entrada
```

---

## 3. Modelo de Dados

### Coleções Firestore

#### 3.1 `clients` (root collection)
```typescript
interface Client {
  id: string;           // Identificador único (ex: "goianita")
  name: string;         // Nome da empresa (ex: "Casa Goianita")
  logo: string;         // URL da logo
  theme?: string;       // Tema visual opcional (ex: "gold")
}
```

#### 3.2 `dashboards` (root collection)
```typescript
{
  [clientId]: {
    html: string;  // Código HTML completo do dashboard
  }
}
```

#### 3.3 `clients/{clientId}/documents` (subcollection)
```typescript
interface Document {
  id: string;
  title: string;
  type: 'HTML' | 'PDF' | 'Word' | 'Sheet' | 'Slide' | 'Audio';
  date: string;         // ISO 8601
  content?: string;     // Para tipo HTML
  url?: string;         // Para tipos externos
}
```

#### 3.4 `clients/{clientId}/events` (subcollection)
```typescript
interface Event {
  id: string;
  title: string;
  date: string;         // YYYY-MM-DD
  time: string;         // HH:MM
  description: string;
  type: 'meeting' | 'workshop' | 'deadline' | 'other';
  attendees: string[];  // Array de emails
  externalLink?: string;// URL de inscrição externa (opcional)
}
```

#### 3.5 `conversations/{clientId}/messages` (RAG System)
```typescript
interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;    // ISO 8601
}
```

#### 3.6 `conversations/{clientId}/profile/data` (RAG System)
```typescript
interface ClientProfile {
  companyName?: string;
  industry?: string;
  mainPain?: string;
  goals?: string[];
  lastUpdated?: string;
}
```

#### 3.7 `knowledge/{clientId}` (Base de Conhecimento)
```typescript
{
  text: string;  // Informações contextuais sobre o cliente
}
```

---

## 4. Fluxos de Autenticação e Autorização

### 4.1 Autenticação (Firebase Auth)
```mermaid
sequenceDiagram
    participant U as Usuário
    participant L as LoginScreen
    participant A as AuthContext
    participant F as Firebase Auth
    
    U->>L: Insere email/senha
    L->>A: login(email, password)
    A->>F: signInWithEmailAndPassword()
    F-->>A: firebaseUser
    A->>A: Determina role (admin/client)
    A->>A: Mapeia clientId
    A-->>U: Redireciona para /admin ou /dashboard/:clientId
```

### 4.2 Determinação de Role
```typescript
// src/context/AuthContext.tsx (linha 28)
const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'client';

// Mapeamento de Cliente (prioridade)
1. Manual Mappings (constants.ts)
2. Mock Clients (match por ID ou Nome)
3. Firestore Clients (busca dinâmica)
```

### 4.3 RBAC (Role-Based Access Control)
| Recurso | Admin | Cliente |
|---------|-------|---------|
| Criar/Editar Clientes | ✅ | ❌ |
| Gerar Propostas | ✅ | ❌ |
| Atualizar Dashboard IA | ✅ | ❌ |
| Criar Eventos | ✅ | ❌ |
| Criar Documentos | ✅ | ❌ |
| Visualizar próprio Dashboard | ✅ | ✅ |
| Visualizar próprios Documentos | ✅ | ✅ |
| Inscrever-se em Eventos | ✅ | ✅ |
| Acessar Agentes IA* | ✅ | ✅ (restrito) |

*Agentes disponíveis apenas para clientes específicos (Goianita, Plur, Autocare)

### 4.4 Auto-Logout por Inatividade
```typescript
// src/hooks/useAutoLogout.ts
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

// Eventos monitorados:
['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
```

---

## 5. Funcionalidades Principais

### 5.1 Painel Admin (`/admin`)

#### A. Seleção de Clientes
- Grid visual com logos e hover effects
- Botões de edição/exclusão (hover)
- Redirecionamento para `/dashboard/:clientId`

#### B. Gestão de Clientes (CRUD)
```typescript
// Criação Manual
openClientModal() → Modal com:
  - Input: Nome
  - Input: ID (slug)
  - Input: URL da Logo
  
// API: DB.saveClient(client)
```

#### C. Gerador de Propostas IA
```typescript
// Fluxo (src/pages/SelectionScreen.tsx:157-234)
1. Admin preenche:
   - Nome da empresa
   - Contexto/diagnóstico
2. callGeminiAPI(AGE_QUOD_AGIS prompt)
3. IA retorna HTML completo (framework M.A.P.C.A)
4. Preview em iframe
5. Aprovação → Salva:
   - Cliente novo em Firestore
   - Proposta como documento
   - HTML como dashboard inicial
```

#### D. Atualizador de Dashboard IA
```typescript
// Fluxo (src/pages/SelectionScreen.tsx:291-423)
1. Admin seleciona cliente
2. Insere instrução em linguagem natural
   (ex: "Adicionar aba de Financeiro com gráfico")
3. Sistema:
   - Busca HTML atual do dashboard
   - Envia para Gemini com prompt C.A.F.S.
   - Valida HTML gerado (validateGeneratedHTML)
4. Preview lado a lado
5. Aprovação → Salva em Firestore
```

### 5.2 Dashboard do Cliente (`/dashboard/:clientId`)

#### A. Home (DashboardHome.tsx)
```typescript
// Renderização de HTML dinâmico
<iframe 
  srcDoc={dashboardHTML} 
  sandbox="allow-scripts allow-popups allow-same-origin 
           allow-top-navigation-by-user-activation"
/>
```

#### B. Agenda (Agenda.tsx)
- Listagem de eventos futuros
- Inscrição com um clique
- Criação/Edição (admin only)

#### C. Documentos (Documents.tsx)
- Visualização de PDFs, Docs, Audios (via links externos)
- Documentos HTML nativos (renderizados inline)
- Upload desabilitado (somente links)

#### D. Agentes IA (Agentes.tsx)
**Disponível apenas para clientes autorizados**
```typescript
CLIENTS_WITH_AGENTS = ['goianita', 'plur', 'autocare']
```

Agentes:
1. **Consultor de R&S**: Análise de candidatos com scorecard STAR
2. **Gerador de Propostas**: Modal completo de criação

### 5.3 Ferramentas da Consultoria (`/dashboard/ferramentas`)
**Acesso exclusivo para admins**
- Apresentação institucional da Live Consultoria
- Grid com 6 categorias de ferramentas
- Link para página de agentes

---

## 6. Integração com IA (Google Gemini)

### 6.1 Configuração
```typescript
// src/utils/constants.ts:25
export const GEMINI_API_KEY = "AIzaSyCVMsuZDHBKs2lcIL9qlQK3ePQ5MOuTPok";

// Restrições de Segurança (Google Cloud)
- HTTP Referrers permitidos:
  - https://ecossistema-live-d8fa5.web.app/*
  - https://ecossistema-live-d8fa5.firebaseapp.com/*
  - http://localhost:5173/*
  - http://localhost:4173/*
```

### 6.2 API Wrapper
```typescript
// src/utils/geminiAPI.ts
export async function callGeminiAPI(
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxOutputTokens?: number;
    systemInstruction?: string;
  }
): Promise<string>
```

### 6.3 Prompts Especializados (5 Personas)

#### A. AGE_QUOD_AGIS (Gerador de Propostas)
```typescript
// Framework: M.A.P.C.A
M - Mapeamento (Diagnóstico)
A - Ação (Plano)
P - Precificação (Investimento)
C - Contrato (Termos)
A - Apresentação (HTML Premium)

// Design System V3:
- Cores: #06192a (fundo), #00e800 (acento)
- Fontes: Poppins (geral), Merriweather (diagnóstico)
- Layout: Mobile-first, cards, tokens CSS
```

#### B. IAGO (Onboarding VP Club)
```typescript
// Características:
- Tom hospitaleiro e consultivo
- Roteiro pedagógico em 5 fases
- Validação de assimilação (não quiz de leitura)
- Persona: Concierge de negócios
```

#### C. RECRUTAMENTO_SELECAO
```typescript
// Modo 1: Arquitetura de Vagas
- Estrutura de pergunta-resposta
- Classificação Hunter/Farmer
- Framework STAR

// Modo 2: Análise de Candidatos
- Scorecard ponderado (Comportamental 40%, Técnico 20%, etc.)
- Matriz de Temperamentos (Colérico, Sanguíneo, etc.)
- Parecer técnico estruturado
```

#### D. DASHBOARD_EDITOR
```typescript
// Protocolo:
1. Preservar estrutura de abas (.tab-btn, .tab-content)
2. Não refatorar CSS/JS não relacionado
3. Injeção de CDNs se necessário (Chart.js)
4. Output: HTML válido para iframe
```

#### E. REGRET_AVOIDANCE
```typescript
// Checklist de erros comuns (profilaxia)
- Não reintroduzir "Gerador IA" no menu lateral
- Validar API key antes de chamar Gemini
- Garantir clientId na rota da Agenda
```

---

## 7. Sistema RAG (Retrieval-Augmented Generation)

### 7.1 Arquitetura do Memory System
```typescript
// src/services/memory.ts

interface ConversationContext {
  profile: ClientProfile;
  recentMessages: ChatMessage[];
}

// Funções principais:
Memory.getContext(clientId, messageLimit)
Memory.saveMessage(clientId, message)
Memory.updateProfile(clientId, profile)
Memory.buildContextPrompt(profile, recentMessages, newInput)
```

### 7.2 Fluxo de Conversa com RAG
```mermaid
sequenceDiagram
    participant U as Usuário
    participant C as ChatInterface
    participant M as Memory Service
    participant F as Firestore
    participant G as Gemini API
    
    U->>C: Envia mensagem
    C->>M: getContext(clientId)
    M->>F: Busca profile + últimas 10 mensagens
    F-->>M: Dados contextuais
    M->>M: buildContextPrompt()
    M-->>C: Prompt enriquecido
    C->>G: callGeminiAPI(context + newMessage)
    G-->>C: Resposta da IA
    C->>M: saveMessage(userMessage)
    C->>M: saveMessage(aiResponse)
    C-->>U: Exibe resposta com markdown
```

### 7.3 Estrutura do Prompt RAG
```typescript
// Exemplo de contexto injetado:
📋 CONTEXTO DO CLIENTE:
- Empresa: Casa Goianita
- Setor: Varejo
- Principal Dor: Baixa conversão de vendas

💬 HISTÓRICO RECENTE:
Cliente: Como aumentar meu ticket médio?
Você: Recomendo análise de cross-sell...

📩 NOVA MENSAGEM:
Quais métricas devo acompanhar?
```

---

## 8. Componentes Frontend

### 8.1 Componentes de UI Base

#### `Button.tsx`
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
```

#### `Input.tsx`
```typescript
interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
}
```

#### `Modal.tsx`
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  maxWidth?: string; // Tailwind class
  children: React.ReactNode;
}
```

### 8.2 Componentes de Negócio

#### `ChatInterface.tsx`
```typescript
// Funcionalidades:
- Renderização de markdown (react-markdown)
- Histórico de mensagens
- Input multiline (Ctrl+Enter para enviar)
- Loading states
- Error handling (403, 404, 503)
```

#### `Sidebar.tsx`
```typescript
// Features:
- Logo do cliente (busca dinâmica no Firestore)
- Menu contextual (Dashboard, Agenda, Documentos, Agentes)
- Sistema de recolhimento automático (hover-based minimal navigation)
- Botão "Voltar" (admin retorna para /admin)
- Logout
```

#### `DashboardHome.tsx`
```typescript
// Renderização segura de HTML:
<iframe 
  srcDoc={dashboardHTML}
  sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox 
           allow-same-origin allow-top-navigation-by-user-activation"
  className="w-full h-full"
/>

// Sandbox permite:
- Scripts internos
- Popups
- Links externos (target="_blank")
```

### 8.3 Páginas

#### `LoginScreen.tsx`
```typescript
// Fluxo:
1. Input email/senha
2. login(email, password) → AuthContext
3. Redirecionamento automático:
   - Admin → /admin
   - Cliente → /dashboard/:clientId
```

#### `SelectionScreen.tsx`
```typescript
// Página mais complexa (593 linhas)
// Funcionalidades:
- Grid de clientes
- Modal CRUD de clientes
- Modal Gerador de Propostas IA
- Modal Atualizar Dashboard IA
- Validação de HTML gerado
- Animações de loading com textos dinâmicos
```

#### `Dashboard.tsx`
```typescript
// Container com Outlet do React Router
// Passa contexto para rotas filhas:
- clientId
- clientData
- isAdmin
```

#### `AdminProposals.tsx`
```typescript
// Página legada (3.8KB)
// Nota: Pode ser consolidada com SelectionScreen
```

---

## 9. Roteamento de Aplicação

```typescript
// src/App.tsx
<Routes>
  <Route path="/login" element={<LoginScreen />} />
  
  <Route path="/admin" element={
    <ProtectedRoute>
      <SelectionScreen />
    </ProtectedRoute>
  } />
  
  <Route path="/dashboard/:clientId" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }>
    {/* Rotas filhas (Outlet) */}
    <Route index element={<DashboardHome />} />
    <Route path="agenda" element={<Agenda />} />
    <Route path="documents" element={<Documents />} />
    <Route path="proposals" element={<AdminProposals />} />
    <Route path="agentes" element={<Agentes />} />
  </Route>
  
  <Route path="/" element={<Navigate to="/login" />} />
</Routes>
```

### Proteção de Rotas
```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};
```

---

## 10. Segurança e Proteção de Dados

### 10.1 Firebase App Check
```typescript
// src/services/appCheck.ts
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdZ9...'), // Site key
  isTokenAutoRefreshEnabled: true
});
```

### 10.2 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Clients: Admin write, authenticated read
    match /clients/{clientId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // Documents: Segregados por cliente
    match /clients/{clientId}/documents/{docId} {
      allow read: if request.auth != null && 
                  (isAdmin() || request.auth.uid == getClientUid(clientId));
      allow write: if isAdmin();
    }
    
    // Conversations (RAG): Apenas dono ou admin
    match /conversations/{clientId}/{document=**} {
      allow read, write: if isAdmin() || 
                          request.auth.uid == getClientUid(clientId);
    }
  }
}
```

### 10.3 Sandbox do iframe
```typescript
// Política restritiva para conteúdo HTML dinâmico
sandbox="
  allow-scripts              // Permite JS interno
  allow-popups               // Modal/alertas
  allow-popups-to-escape-sandbox
  allow-same-origin          // Permite fetch (Chart.js CDN)
  allow-top-navigation-by-user-activation // Links externos
"

// Bloqueios:
- allow-forms (previne submissões)
- allow-modals (limita interações invasivas)
```

### 10.4 Validação de HTML Gerado pela IA
```typescript
// src/pages/SelectionScreen.tsx:19-54
function validateGeneratedHTML(generatedHTML: string, originalHTML: string): ValidationResult {
  // Checks:
  1. Não está vazio (min 50 chars)
  2. Tem estrutura HTML básica (<html>, <body>)
  3. Não é mensagem de erro da IA
  
  // Validações removidas (muitos falsos positivos):
  - Contagem de tags
  - Verificação de conteúdo do body
  - Sistema de abas
}
```

---

## 11. Deploy e Infraestrutura

### 11.1 Build
```bash
npm run build  # Vite compila para /dist

# Otimizações automáticas:
- Tree-shaking
- Minificação (Terser)
- Code splitting (React.lazy potencial)
```

### 11.2 Firebase Hosting
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"  // SPA routing
      }
    ]
  }
}
```

### 11.3 Variáveis de Ambiente
```typescript
// Atualmente hardcoded em constants.ts
// Recomendação futura:
// .env.production
VITE_FIREBASE_API_KEY=...
VITE_GEMINI_API_KEY=...

// Acesso:
import.meta.env.VITE_FIREBASE_API_KEY
```

---

## 12. Limitações Conhecidas e Débitos Técnicos

### 12.1 Hardcoded Credentials
```typescript
// src/utils/constants.ts
// ⚠️ API Keys expostas no código fonte
export const FIREBASE_CONFIG = { apiKey: "AIzaSy..." };
export const GEMINI_API_KEY = "AIzaSyC...";

// Mitigação atual:
- HTTP Referrer Restrictions no Google Cloud
- Firebase App Check ativo
```

### 12.2 Upload de Arquivos Desabilitado
```typescript
// Firebase Storage configurado mas não utilizado
// Documentos usam apenas links externos (Google Drive, etc.)
// Razão: Pivô de estratégia em Dezembro/2025
```

### 12.3 Falta de Testes Automatizados
```typescript
// Ausência de:
- Jest/Vitest (unit tests)
- Playwright/Cypress (E2E tests)
- Cobertura de código
```

### 12.4 Bundle Size não otimizado
```typescript
// Oportunidades:
- Code splitting (React.lazy)
- Tree-shaking de Firestore (usar modular SDK)
- Service Worker para cache
```

### 12.5 Componentização Incompleta
```typescript
// SelectionScreen.tsx muito grande (593 linhas)
// Deveria ser dividido em:
- ClientGrid.tsx
- ProposalGeneratorModal.tsx
- DashboardUpdateModal.tsx
```

### 12.6 Tipagem TypeScript Permissiva
```typescript
// Uso excessivo de `any` e `@ts-ignore`
// Exemplo: src/pages/SelectionScreen.tsx:276,461,466
```

### 12.7 Firestore Listeners não otimizados
```typescript
// Todas as queries são one-time gets
// Não usa realtime listeners (onSnapshot)
// Impacto: Dados não atualizam automaticamente
```

---

## 📊 Diagrama de Arquitetura

```mermaid
graph TB
    subgraph "Frontend (React + Vite)"
        LOGIN[LoginScreen]
        ADMIN[Admin Panel]
        DASHBOARD[Client Dashboard]
        CHAT[ChatInterface]
    end
    
    subgraph "Services Layer"
        AUTH[AuthContext]
        DB[DB Service]
        MEMORY[Memory RAG]
        GEMINI[Gemini API Wrapper]
    end
    
    subgraph "Firebase Backend"
        FIREAUTH[Firebase Auth]
        FIRESTORE[(Firestore)]
        APPCHECK[App Check]
    end
    
    subgraph "External APIs"
        GEMINIAPI[Google Gemini AI]
    end
    
    LOGIN --> AUTH
    AUTH --> FIREAUTH
    
    ADMIN --> DB
    DASHBOARD --> DB
    DASHBOARD --> MEMORY
    DASHBOARD --> CHAT
    
    CHAT --> MEMORY
    CHAT --> GEMINI
    
    DB --> FIRESTORE
    MEMORY --> FIRESTORE
    
    GEMINI --> GEMINIAPI
    
    FIRESTORE --> APPCHECK
    FIREAUTH --> APPCHECK
```

---

## 🔄 Fluxo de Geração de Proposta (M.A.P.C.A)

```mermaid
sequenceDiagram
    autonumber
    participant A as Admin
    participant UI as SelectionScreen
    participant G as Gemini API
    participant DB as Firestore
    
    A->>UI: Clica "Novo Cliente"
    UI->>A: Modal com inputs
    A->>UI: Preenche Nome + Contexto
    UI->>G: callGeminiAPI(AGE_QUOD_AGIS)
    Note over G: Gera HTML com M.A.P.C.A<br/>Diagnóstico, Plano, Investimento, Contrato
    G-->>UI: HTML completo (Design System V3)
    UI->>UI: Strip markdown (```html)
    UI->>A: Exibe preview em iframe
    A->>UI: Clica "Aprovar e Cadastrar"
    UI->>DB: saveClient(clientData)
    UI->>DB: saveDocument(proposta)
    UI->>DB: saveDashboardHTML(proposta)
    DB-->>UI: Sucesso
    UI->>A: Redirect para dashboard do cliente
```

---

## 🎯 Oportunidades de Melhoria (Para IA Analista)

### Alta Prioridade
1. **Implementar Testes Automatizados**
   - Unit tests para services (db.ts, memory.ts)
   - Integration tests para fluxos críticos (login, geração de proposta)
   - E2E tests para jornada do usuário

2. **Refatoração de Segurança**
   - Migrar API keys para variáveis de ambiente
   - Implementar rate limiting
   - Adicionar CSP Headers

3. **Otimização de Performance**
   - Code splitting (React.lazy)
   - Implementar Service Worker
   - Otimizar bundle size (atualmente ~500KB não comprimido)

### Média Prioridade
4. **Componentização e Design System**
   - Extrair componentes reutilizáveis
   - Criar Storybook
   - Padronizar tokens CSS

5. **Documentação de API**
   - JSDoc para todas as funções
   - Swagger/OpenAPI para endpoints REST (futuro)
   - Tutoriais de uso

### Baixa Prioridade
6. **Melhorias de UX**
   - Dark/Light mode toggle
   - Internacionalização (i18n)
   - PWA capabilities

---

## 📚 Glossário

| Termo | Definição |
|-------|-----------|
| **M.A.P.C.A** | Framework de propostas: Mapeamento, Ação, Precificação, Contrato, Apresentação |
| **RAG** | Retrieval-Augmented Generation - Enriquecimento de prompts com contexto de conversas anteriores |
| **C.A.F.S.** | Framework de prompts: Contexto, Ação, Formato, Segurança |
| **STAR** | Metodologia de entrevista: Situação, Tarefa, Ação, Resultado |
| **Hunter/Farmer** | Perfis de vendedor: Hunter (prospecção ativa), Farmer (relacionamento) |
| **Design System V3** | Padrão visual Live: #06192a (bg), #00e800 (acento), Poppins (fonte) |
| **Scorecard** | Sistema de avaliação quantitativa de candidatos (R&S) |

---

## 📞 Metadados do Projeto

- **Ambiente de Produção:** https://ecossistema-live-d8fa5.web.app
- **Firebase Project ID:** ecossistema-live-d8fa5
- **Repositório:** Não informado (documentar)
- **Autor Principal:** Cleber Donato
- **Assistente:** Antigravity Agent (Google Deepmind)
- **Última Atualização Maior:** 18 de Dezembro de 2025

---

**FIM DA DOCUMENTAÇÃO TÉCNICA**  
*Este documento pode ser usado para análise automatizada, geração de mapas mentais ou planejamento de melhorias por agentes de IA.*
