/**
 * Utilitário para extrair metadados de iframes do HTML do dashboard
 * Permite que o Contextus tenha informações sobre documentos incorporados
 */

export interface IframeMetadata {
    url: string;
    title: string;
    type: string; // 'google-docs', 'google-slides', 'google-sheets', 'pdf', 'other'
    description: string;
}

/**
 * Extrai informações de todos os iframes presentes no HTML
 */
export function extractIframeMetadata(html: string): IframeMetadata[] {
    if (!html) return [];

    const iframes: IframeMetadata[] = [];

    // Regex para encontrar tags iframe
    const iframeRegex = /<iframe[^>]*>/gi;
    const matches = html.match(iframeRegex);

    if (!matches) return [];

    matches.forEach(iframeTag => {
        // Extrair atributos
        const srcMatch = iframeTag.match(/src=["']([^"']+)["']/i);
        const titleMatch = iframeTag.match(/title=["']([^"']+)["']/i);

        if (!srcMatch) return;

        const url = srcMatch[1];
        const title = titleMatch ? titleMatch[1] : 'Documento sem título';

        // Identificar tipo de documento pela URL
        const type = identifyDocumentType(url);
        const description = generateDescription(url, type, title);

        iframes.push({
            url,
            title,
            type,
            description
        });
    });

    return iframes;
}

/**
 * Identifica o tipo de documento pela URL
 */
function identifyDocumentType(url: string): string {
    if (url.includes('docs.google.com/document')) return 'google-docs';
    if (url.includes('docs.google.com/presentation')) return 'google-slides';
    if (url.includes('docs.google.com/spreadsheets')) return 'google-sheets';
    if (url.includes('docs.google.com/forms')) return 'google-forms';
    if (url.includes('.pdf')) return 'pdf';
    if (url.includes('drive.google.com')) return 'google-drive';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
    return 'other';
}

/**
 * Gera descrição amigável do iframe
 */
function generateDescription(url: string, type: string, title: string): string {
    const typeLabels: Record<string, string> = {
        'google-docs': 'Documento Google Docs',
        'google-slides': 'Apresentação Google Slides',
        'google-sheets': 'Planilha Google Sheets',
        'google-forms': 'Formulário Google',
        'pdf': 'Documento PDF',
        'google-drive': 'Arquivo do Google Drive',
        'video': 'Vídeo',
        'other': 'Documento externo'
    };

    const typeLabel = typeLabels[type] || 'Documento';

    // Extrair ID do documento se for Google
    let docId = '';
    if (type.startsWith('google-')) {
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (idMatch) docId = idMatch[1];
    }

    return `${typeLabel}: "${title}"${docId ? ` (ID: ${docId.substring(0, 10)}...)` : ''}`;
}

/**
 * Formata lista de iframes para o prompt do Contextus
 */
export function formatIframesForPrompt(iframes: IframeMetadata[]): string {
    if (!iframes || iframes.length === 0) {
        return 'Nenhum documento incorporado via iframe.';
    }

    let formatted = `📎 DOCUMENTOS INCORPORADOS (${iframes.length}):\n\n`;

    iframes.forEach((iframe, index) => {
        formatted += `${index + 1}. ${iframe.description}\n`;
        formatted += `   Título: ${iframe.title}\n`;
        formatted += `   Tipo: ${iframe.type}\n`;
        formatted += `   URL: ${iframe.url.substring(0, 80)}${iframe.url.length > 80 ? '...' : ''}\n\n`;
    });

    formatted += `📌 IMPORTANTE: Os iframes contêm documentos externos (Google Docs, Slides, etc.).\n`;
    formatted += `Você não tem acesso ao conteúdo interno desses documentos, mas pode:\n`;
    formatted += `- Informar o usuário sobre quais documentos estão disponíveis\n`;
    formatted += `- Orientar onde encontrá-los no dashboard\n`;
    formatted += `- Sugerir que o usuário acesse o documento diretamente para ver o conteúdo\n`;

    return formatted;
}

/**
 * Remove HTML completo e mantém apenas texto + metadados de iframes
 * Útil para economizar tokens ao enviar para IA
 */
export function summarizeHTMLContent(html: string): {
    textContent: string;
    iframes: IframeMetadata[];
} {
    if (!html) return { textContent: '', iframes: [] };

    // Extrair iframes antes de remover
    const iframes = extractIframeMetadata(html);

    // Remover tags style e script
    let text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remover tags iframe (já temos metadados)
    text = text.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');

    // Substituir tags HTML por espaços
    text = text.replace(/<[^>]+>/g, ' ');

    // Limpar espaços múltiplos
    text = text.replace(/\s+/g, ' ').trim();

    // Limitar tamanho (manter primeiros 5000 caracteres)
    if (text.length > 5000) {
        text = text.substring(0, 5000) + '... [conteúdo truncado]';
    }

    return {
        textContent: text,
        iframes
    };
}
