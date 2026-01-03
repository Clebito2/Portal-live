// Multi-step proposal generation to bypass token limits
import { GEMINI_API_KEY } from './constants';
import { callGeminiAPI } from './geminiAPI';

interface ProposalContext {
    clientName: string;
    clientNeeds: string;
    currentDate: string;
}

/**
 * Generate proposal in multiple steps to avoid token limits
 * Each step generates a portion of the HTML
 */
export async function generateProposalInParts(context: ProposalContext): Promise<string> {
    const { clientName, clientNeeds, currentDate } = context;

    // Step 1: Generate opening + diagnosis + start of action plan
    const part1Prompt = `Você é um desenvolvedor front-end sênior criando uma PROPOSTA COMERCIAL para ${clientName}.

DATA: ${currentDate}
NECESSIDADES: ${clientNeeds}

GERE APENAS A PRIMEIRA PARTE DO HTML (DOCTYPE até fim da seção de Diagnóstico):
- DOCTYPE, HTML, HEAD completo (com CSS inline)
- BODY abertura
- Cabeçalho (logo Live)
- Capa (título, nome cliente, data)
- Seção DIAGNÓSTICO completa (análise situação atual)

IMPORTANTE: NÃO feche o body nem o html. Termine com a tag </section> do diagnóstico.
Use design system Live (cores #06192a, #0A243D, #00e800, fonte Poppins).`;

    // Step 2: Generate action plan + investment
    const part2Prompt = `Continue gerando a proposta para ${clientName}.

GERE A SEGUNDA PARTE do HTML (Plano de Ação + Investimento):
- Seção PLANO DE AÇÃO (timeline vertical animada)
- Seção INVESTIMENTO (tabela de valores)

NÃO repita head/body. Inicie direto com <section> do plano. 
NÃO feche body/html ainda.`;

    // Step 3: Generate contract + footer
    const part3Prompt = `Finalize a proposta para ${clientName}.

GERE A TERCEIRA E ÚLTIMA PARTE do HTML (Contrato + Rodapé):
- Seção CONTRATO (termos legais resumidos)
- Rodapé: "© 2026 Live Consultoria - Todos os direitos reservados."
- Feche BODY e HTML

NÃO repita head. Inicie com <section> do contrato e termine com </html>.`;

    try {
        console.log('🔄 Gerando parte 1/3...');
        const part1 = await callGeminiAPI(
            [{ role: 'user', text: part1Prompt }],
            { temperature: 0.7, maxOutputTokens: 8192 }
        );

        console.log('🔄 Gerando parte 2/3...');
        const part2 = await callGeminiAPI(
            [{ role: 'user', text: part2Prompt }],
            { temperature: 0.7, maxOutputTokens: 6144 }
        );

        console.log('🔄 Gerando parte 3/3...');
        const part3 = await callGeminiAPI(
            [{ role: 'user', text: part3Prompt }],
            { temperature: 0.7, maxOutputTokens: 4096 }
        );

        // Concatenate and clean up
        const fullHTML = part1 + '\n' + part2 + '\n' + part3;

        // Remove any duplicate DOCTYPE/html/body tags that might appear
        const cleaned = fullHTML
            .replace(/<!DOCTYPE html>/gi, (match, offset) => offset === 0 ? match : '')
            .replace(/<html[^>]*>/gi, (match, offset) => offset < 100 ? match : '')
            .replace(/<\/html>/gi, (match, offset) => offset > fullHTML.length - 100 ? match : '')
            .replace(/<body[^>]*>/gi, (match, offset) => offset < 500 ? match : '')
            .replace(/<\/body>/gi, (match, offset) => offset > fullHTML.length - 200 ? match : '');

        console.log('✅ Proposta completa gerada!');
        return cleaned;

    } catch (error) {
        console.error('❌ Erro ao gerar proposta em partes:', error);
        throw error;
    }
}
