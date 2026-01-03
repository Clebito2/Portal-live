# Backlog - Portal de Consultoria Live

## 🎯 Oportunidades de Melhoria Identificadas

### Alta Prioridade

#### 1. Sistema de Gestão de Usuários
- [ ] Interface para criação de usuários clientes via painel admin
- [ ] Gerenciamento de permissões por usuário (não apenas por email)
- [ ] Sistema de convite por email com senha temporária
- [ ] Histórico de acessos e auditoria

#### 2. Dashboard IA - Validação e Robustez
- [ ] Implementar validação de HTML gerado (prevenir conteúdo em branco)
- [ ] Melhorar prompt C.A.F.S. com exemplos de estrutura HTML
- [ ] Sistema de rollback para reverter atualizações problemáticas
- [ ] Preview com comparação lado a lado (versão antiga vs nova)

#### 3. Gestão de Documentos - Evolução
- [ ] Upload direto de arquivos (atualmente apenas links)
- [ ] Categorização automática de documentos
- [ ] Sistema de busca/filtro de documentos
- [ ] Versionamento de documentos
- [ ] Controle de expiração/validade de documentos

### Média Prioridade

#### 4. Agentes de IA - Expansão
- [ ] Agente de Suporte Financeiro
- [ ] Agente de Marketing e Conteúdo
- [ ] Agente de Análise de Dados
- [ ] Sistema de treinamento/fine-tuning de agentes existentes
- [ ] Dashboard de métricas dos agentes (qualidade, uso, feedback)

#### 5. Agenda - Funcionalidades Avançadas
- [ ] Notificações por email antes de eventos
- [ ] Integração com Google Calendar (sincronização bidirecional)
- [ ] Sala de videoconferência integrada
- [ ] Anexos em eventos (documentos, apresentações)
- [ ] Eventos recorrentes

#### 6. Analytics e Relatórios
- [ ] Dashboard de métricas de uso por cliente
- [ ] Relatório de engajamento (acessos, tempo de sessão)
- [ ] Análise de uso dos agentes de IA
- [ ] Exportação de dados em CSV/PDF

### Baixa Prioridade

#### 7. Experiência do Usuário
- [ ] Modo escuro/claro (theme switcher)
- [ ] Personalização de cores por cliente
- [ ] Tutorial interativo para novos usuários
- [ ] Sistema de feedback in-app
- [ ] Notificações push (PWA)

#### 8. Integrações Externas
- [ ] Integração com WhatsApp Business API
- [ ] Integração com Slack/Teams
- [ ] Integração com CRM (HubSpot, RD Station)
- [ ] API pública para terceiros

#### 9. Mobile
- [ ] Aplicativo mobile nativo (React Native)
- [ ] Otimizações específicas para mobile web
- [ ] Suporte a biometria para login

## 🐛 Bugs Conhecidos

### Críticos
- [ ] Verificar estabilidade do sistema RAG Memory em alta concorrência
- [ ] Testar limite de caracteres no editor HTML de dashboard

### Menores
- [ ] Ajustar quebra de texto em títulos longos na sidebar
- [ ] Melhorar feedback visual durante uploads (atualmente apenas links)
- [ ] Corrigir layout de cards em resoluções atípicas (ultra-wide)

## 🔄 Débitos Técnicos

### Refatoração
- [ ] Migrar componentes de classe para hooks (se houver algum remanescente)
- [ ] Extrair lógica de API Gemini para serviço dedicado
- [ ] Consolidar constantes de estilo em design tokens
- [ ] Implementar testes unitários (Jest/Vitest)
- [ ] Implementar testes E2E (Playwright/Cypress)

### Documentação
- [ ] Criar guia de contribuição (CONTRIBUTING.md)
- [ ] Documentar arquitetura de componentes (Storybook)
- [ ] Criar diagramas de fluxo de dados
- [ ] Documentar padrões de código do projeto

### Performance
- [ ] Implementar lazy loading de componentes
- [ ] Otimizar bundle size (code splitting)
- [ ] Adicionar service worker para cache
- [ ] Compressão de imagens automática

## 🎨 Design System

- [ ] Criar biblioteca de componentes reutilizáveis
- [ ] Padronizar espaçamentos (Tailwind spacing scale)
- [ ] Definir paleta de cores oficial
- [ ] Criar guia de estilo visual (style guide)

## 🔐 Segurança

- [ ] Implementar rate limiting para APIs
- [ ] Adicionar CAPTCHA em formulários públicos
- [ ] Auditoria de segurança completa (OWASP Top 10)
- [ ] Implementar CSP (Content Security Policy) mais restritivo
- [ ] Logs de auditoria com retenção de 90 dias

## 📊 Monitoramento

- [ ] Implementar Sentry para tracking de erros
- [ ] Configurar Google Analytics 4
- [ ] Alertas automáticos para erros críticos
- [ ] Dashboard de health check da aplicação

---

## 📝 Notas

### Itens Concluídos Recentemente (Dezembro 2025)
- ✅ Sistema RAG Memory implementado
- ✅ Proteção de API Keys com HTTP referrers
- ✅ Auto-logout por inatividade (30min)
- ✅ Página de Agentes de IA
- ✅ Gerador de Propostas com IA (framework M.A.P.C.A)
- ✅ Dashboard IA com preview
- ✅ Correção de links externos em iframes
- ✅ Sidebar recolhível

### Próximas Sprints Sugeridas

**Sprint 1 (2 semanas):**
- Sistema de gestão de usuários
- Validação de HTML no Dashboard IA
- Upload direto de documentos

**Sprint 2 (2 semanas):**
- Novos agentes de IA
- Notificações de eventos
- Analytics básico

**Sprint 3 (2 semanas):**
- Testes automatizados
- Refatoração técnica
- Performance

---

**Última atualização:** 18 de Dezembro de 2025
