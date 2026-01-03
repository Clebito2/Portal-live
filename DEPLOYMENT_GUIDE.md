## Guia de Implantação para IA de Desenvolvimento

Este documento fornece uma explicação detalhada do projeto `portal-consultoria`, projetado para ser compreendido por uma IA de desenvolvimento para fins de implantação.

### Visão Geral do Projeto

O `portal-consultoria` é uma aplicação de página única (SPA) desenvolvida em React, utilizando Vite como ferramenta de construção. O projeto integra-se com os serviços do Google Gemini para funcionalidades de IA e Firebase para banco de dados e autenticação. A interface do usuário é construída com componentes React e estilizada com uma combinação de CSS-in-JS e classes de utilitário.

### Estrutura e Tecnologias

- **Framework Frontend:** React 19.2.1
- **Ferramenta de Build:** Vite 6.2.0
- **Linguagem:** TypeScript 5.8.2
- **Banco de Dados:** Firebase Firestore (com fallback para `localStorage`)
- **API de IA:** `@google/genai` (Gemini)
- **Ícones:** `lucide-react`
- **Ponto de Entrada Principal:** `index.tsx`

### Análise dos Arquivos Principais

- **`package.json`**:
  - **`scripts`**:
    - `dev`: Inicia o servidor de desenvolvimento.
    - `build`: Compila a aplicação para produção.
    - `preview`: Serve a build de produção localmente.
  - **`dependencies`**:
    - `react`, `react-dom`: Biblioteca principal da UI.
    - `@google/genai`: Integração com a IA do Gemini.
    - `firebase`: Serviços de back-end (Firestore).
    - `lucide-react`: Biblioteca de ícones.

- **`vite.config.ts`**:
  - Configura o servidor de desenvolvimento para rodar na porta 3000.
  - Expõe a variável de ambiente `GEMINI_API_KEY` para a aplicação como `process.env.API_KEY` e `process.env.GEMINI_API_KEY`. **É crucial que esta variável de ambiente seja definida durante o processo de build.**
  - Define um alias de caminho `@` para o diretório raiz do projeto.

- **`tsconfig.json`**:
  - Configuração padrão do TypeScript para um projeto React com Vite, compilando para `ES2022` e utilizando módulos `ESNext`.

- **`index.tsx`**:
  - Este é o arquivo principal que renderiza a aplicação React.
  - **Inicialização de Serviços**:
    - O Firebase é inicializado com credenciais **hardcoded**. **Isto é uma falha de segurança e deve ser substituído por variáveis de ambiente em um ambiente de produção.**
    - A API do Gemini é inicializada usando a chave `GEMINI_API_KEY` injetada pelo Vite.
  - **Lógica da Aplicação**:
    - Contém toda a lógica da aplicação, incluindo componentes de UI, gerenciamento de estado (via `useState`), e interações com o banco de dados e a API de IA.
    - Implementa um serviço de banco de dados "híbrido" que utiliza o Firebase se configurado corretamente, caso contrário, usa `localStorage`.
    - Define múltiplos "prompts" para a IA, indicando diferentes personas e tarefas.

### Instruções para Implantação

1.  **Configuração do Ambiente**:
    - Antes de construir a aplicação, a variável de ambiente `GEMINI_API_KEY` **deve** ser definida. Por exemplo, em um ambiente de shell:
      ```bash
      export GEMINI_API_KEY="sua_chave_de_api_aqui"
      ```
    - **Recomendação de Segurança**: As credenciais do Firebase hardcoded em `index.tsx` devem ser extraídas e gerenciadas através de variáveis de ambiente, de forma semelhante à `GEMINI_API_KEY`.

2.  **Processo de Build**:
    - Execute o seguinte comando para compilar a aplicação:
      ```bash
      npm install
      npm run build
      ```
    - O Vite irá gerar os arquivos estáticos da aplicação no diretório `dist`.

3.  **Implantação**:
    - O conteúdo do diretório `dist` deve ser implantado em um servidor web estático (por exemplo, Netlify, Vercel, AWS S3, Nginx).
    - Como se trata de uma SPA, o servidor web deve ser configurado para redirecionar todas as solicitações de rota para o arquivo `index.html`. Isso garante que o roteamento do lado do cliente do React funcione corretamente.

### Resumo das Ações Necessárias para Implantação

- **Ação 1**: Definir a variável de ambiente `GEMINI_API_KEY` no ambiente de build.
- **Ação 2**: (Recomendado) Refatorar o código para carregar as credenciais do Firebase a partir de variáveis de ambiente, em vez de tê-las hardcoded.
- **Ação 3**: Executar `npm run build` para gerar os artefatos de produção.
- **Ação 4**: Implantar o conteúdo do diretório `dist` em um host de site estático.
- **Ação 5**: Configurar o servidor para lidar com o roteamento de SPA, redirecionando todas as solicitações para `index.html`.
