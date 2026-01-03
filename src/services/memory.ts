import { collection, addDoc, query, orderBy, limit, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';
import { ChatMessage } from '../types';

export interface ClientProfile {
    companyName?: string;
    industry?: string;
    mainPain?: string;
    goals?: string[];
    lastUpdated?: string;
}

export interface ConversationContext {
    profile: ClientProfile;
    recentMessages: ChatMessage[];
}

export const Memory = {
    /**
     * Get full context for a client (profile + recent messages)
     */
    async getContext(clientId: string, messageLimit: number = 10): Promise<ConversationContext> {
        if (!isFirebaseReady || !db) {
            return {
                profile: {},
                recentMessages: []
            };
        }

        try {
            // Get profile
            const profileDoc = await getDoc(doc(db, `conversations/${clientId}/profile/data`));
            const profile = profileDoc.exists() ? profileDoc.data() as ClientProfile : {};

            // Get recent messages
            const messagesRef = collection(db, `conversations/${clientId}/messages`);
            const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(messageLimit));
            const snapshot = await getDocs(q);

            const recentMessages = snapshot.docs
                .map(doc => doc.data() as ChatMessage)
                .reverse(); // Reverse to get chronological order

            return { profile, recentMessages };
        } catch (error) {
            console.error('Error loading context:', error);
            return { profile: {}, recentMessages: [] };
        }
    },

    /**
     * Save a message to conversation history
     */
    async saveMessage(clientId: string, message: ChatMessage): Promise<void> {
        if (!isFirebaseReady || !db) {
            console.warn('Firebase not ready. Message not saved.');
            return;
        }

        try {
            const messagesRef = collection(db, `conversations/${clientId}/messages`);
            await addDoc(messagesRef, {
                ...message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    },

    /**
     * Update client profile
     */
    async updateProfile(clientId: string, profile: Partial<ClientProfile>): Promise<void> {
        if (!isFirebaseReady || !db) {
            console.warn('Firebase not ready. Profile not updated.');
            return;
        }

        try {
            const profileRef = doc(db, `conversations/${clientId}/profile/data`);
            await setDoc(profileRef, {
                ...profile,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    },

    /**
     * Build context prompt from profile and messages
     */
    buildContextPrompt(profile: ClientProfile, recentMessages: ChatMessage[], newUserInput: string): string {
        let contextPrompt = '';

        // Add profile if available
        if (profile.companyName || profile.industry) {
            contextPrompt += '📋 CONTEXTO DO CLIENTE:\n';
            if (profile.companyName) contextPrompt += `- Empresa: ${profile.companyName}\n`;
            if (profile.industry) contextPrompt += `- Setor: ${profile.industry}\n`;
            if (profile.mainPain) contextPrompt += `- Principal Dor: ${profile.mainPain}\n`;
            if (profile.goals && profile.goals.length > 0) {
                contextPrompt += `- Objetivos: ${profile.goals.join(', ')}\n`;
            }
            contextPrompt += '\n';
        }

        // Add recent conversation history
        if (recentMessages.length > 0) {
            contextPrompt += '💬 HISTÓRICO RECENTE:\n';
            recentMessages.forEach(msg => {
                const speaker = msg.role === 'user' ? 'Cliente' : 'Você';
                contextPrompt += `${speaker}: ${msg.text.substring(0, 150)}${msg.text.length > 150 ? '...' : ''}\n`;
            });
            contextPrompt += '\n';
        }

        // Add new message
        contextPrompt += `📩 NOVA MENSAGEM:\n${newUserInput}`;

        return contextPrompt;
    },

    /**
     * Get all conversations from all agents for a client (for Contextus context)
     */
    async getAllConversations(clientId: string, messageLimit: number = 50): Promise<ChatMessage[]> {
        if (!isFirebaseReady || !db) {
            return [];
        }

        try {
            const messagesRef = collection(db, `conversations/${clientId}/messages`);
            const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(messageLimit));
            const snapshot = await getDocs(q);

            return snapshot.docs
                .map(doc => ({
                    role: doc.data().role as 'user' | 'model',
                    text: doc.data().text,
                    timestamp: doc.data().timestamp
                }))
                .reverse();
        } catch (error) {
            console.error('Error loading all conversations:', error);
            return [];
        }
    },

    /**
     * Get context specific to Contextus (uses separate namespace)
     */
    async getContextusContext(clientId: string, messageLimit: number = 10): Promise<ConversationContext> {
        if (!isFirebaseReady || !db) {
            return { profile: {}, recentMessages: [] };
        }

        try {
            // Get general profile
            const profileDoc = await getDoc(doc(db, `conversations/${clientId}/profile/data`));
            const profile = profileDoc.exists() ? profileDoc.data() as ClientProfile : {};

            // Get Contextus-specific messages
            const messagesRef = collection(db, `conversations/contextus_${clientId}/messages`);
            const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(messageLimit));
            const snapshot = await getDocs(q);

            const recentMessages = snapshot.docs
                .map(doc => ({
                    role: doc.data().role as 'user' | 'model',
                    text: doc.data().text,
                    timestamp: doc.data().timestamp
                }))
                .reverse();

            return { profile, recentMessages };
        } catch (error) {
            console.error('Error loading Contextus context:', error);
            return { profile: {}, recentMessages: [] };
        }
    },

    /**
     * Save Contextus-specific message (uses separate namespace)
     */
    async saveContextusMessage(clientId: string, message: ChatMessage): Promise<void> {
        if (!isFirebaseReady || !db) {
            console.warn('Firebase not ready. Contextus message not saved.');
            return;
        }

        try {
            const messagesRef = collection(db, `conversations/contextus_${clientId}/messages`);
            await addDoc(messagesRef, {
                ...message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving Contextus message:', error);
        }
    }
};
