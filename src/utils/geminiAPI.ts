// Direct REST API integration for Gemini (bypass SDK issues)
import { GEMINI_API_KEY } from './constants';

export interface Message {
    role: 'user' | 'model';
    text: string;
}

export interface RequestConfig {
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
}

/**
 * Call Gemini API directly using REST (no SDK dependency)
 * Strategy: Primary (Pro) -> Fallback (Flash)
 */
export async function callGeminiAPI(
    messages: Message[],
    config: RequestConfig = {}
): Promise<string> {
    const apiKey = GEMINI_API_KEY || localStorage.getItem('firebase_key') || '';

    if (!apiKey) {
        throw new Error('API Key não configurada');
    }

    // Convert messages to Gemini format
    const contents = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // API endpoint - Using gemini-2.5-flash (model with available quota)
    // Note: v1beta endpoint allows API Keys from Referrer-restricted sources
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody: any = {
        contents,
        generationConfig: {
            temperature: config.temperature || 0.7,
            maxOutputTokens: config.maxOutputTokens || 16384,
        }
    };

    // Add system instruction if provided
    if (config.systemInstruction) {
        requestBody.systemInstruction = {
            parts: [{ text: config.systemInstruction }]
        };
    }

    // Retry logic for transient errors (503 Overloaded, 429 Rate Limit)
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;

                // Check if it's a retryable error
                const isRetryable = response.status === 503 || response.status === 429;

                if (isRetryable && attempt < maxRetries - 1) {
                    attempt++;
                    const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
                    console.warn(`Gemini API Overloaded (Attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue; // Try again
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error('Resposta da API inválida');

            return text;

        } catch (error: any) {
            // If it's the last attempt or non-retryable error, throw
            if (attempt >= maxRetries - 1 || (!error.message.includes('503') && !error.message.includes('429'))) {
                console.error('Gemini API Error:', error);

                // User-friendly error messages
                if (error.message.includes('404')) {
                    throw new Error('Modelo não encontrado. Verifique a configuração da API.');
                }
                if (error.message.includes('403')) {
                    throw new Error('Acesso negado. Verifique as permissões da API Key.');
                }
                if (error.message.includes('429')) {
                    throw new Error('Limite de requisições excedido. Aguarde alguns instantes.');
                }
                if (error.message.includes('503')) {
                    throw new Error('Serviço de IA temporariamente indisponível. Tente novamente em alguns segundos.');
                }

                throw error;
            }

            // Retry on transient errors
            attempt++;
            const delay = Math.pow(2, attempt) * 1000;
            console.warn(`Gemini API Error (Attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error('Falha na comunicação com a IA após várias tentativas.');
}
