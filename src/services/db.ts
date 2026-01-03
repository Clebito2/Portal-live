import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db, isFirebaseReady } from "./firebase";
import { Document, Event, Client } from "../types";

export const DB = {
    // Generic get (Collection)
    getCollection: async (path: string) => {
        if (isFirebaseReady && db) {
            try {
                const snap = await getDocs(collection(db, path));
                return snap.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch (e) { console.error(e); return []; }
        }
        return JSON.parse(localStorage.getItem(path) || '[]');
    },

    // Generic set (Doc)
    setDoc: async (path: string, id: string, data: any) => {
        if (isFirebaseReady && db) {
            await setDoc(doc(db, path, id), data, { merge: true });
        } else {
            const colPath = path.split('/')[0];
            const list = JSON.parse(localStorage.getItem(colPath) || '[]');
            const idx = list.findIndex((i: any) => i.id === id);
            if (idx >= 0) list[idx] = { ...list[idx], ...data };
            else list.push({ id, ...data });
            localStorage.setItem(colPath, JSON.stringify(list));
            localStorage.setItem(`${path}/${id}`, JSON.stringify(data));
        }
    },

    // Clients
    getClients: async () => {
        if (isFirebaseReady && db) {
            try {
                const snap = await getDocs(collection(db, 'clients'));
                let dbClients = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Client[];

                // Ensure MOCK_CLIENTS exist (Sync)
                const { MOCK_CLIENTS } = await import('../utils/constants');
                let hasChanges = false;
                for (const mock of MOCK_CLIENTS) {
                    if (!dbClients.find(c => c.id === mock.id)) {
                        await setDoc(doc(db, 'clients', mock.id), mock);
                        dbClients.push(mock);
                        hasChanges = true;
                    }
                }

                if (hasChanges) {
                    // Re-sort or just return the updated list
                    return dbClients;
                }

                return dbClients;
            } catch (e) { console.error(e); return []; }
        }
        const { MOCK_CLIENTS } = await import('../utils/constants');
        return JSON.parse(localStorage.getItem('clients') || JSON.stringify(MOCK_CLIENTS));
    },

    getClient: async (clientId: string) => {
        if (isFirebaseReady && db) {
            try {
                const d = await getDoc(doc(db, 'clients', clientId));
                if (d.exists()) return { id: d.id, ...d.data() } as Client;
            } catch (e) { console.error(e); }
        }
        // Fallback to local or Mock
        const { MOCK_CLIENTS } = await import('../utils/constants');
        const list = JSON.parse(localStorage.getItem('clients') || JSON.stringify(MOCK_CLIENTS));
        return list.find((c: Client) => c.id === clientId) || null;
    },

    saveClient: async (client: Client) => {
        if (isFirebaseReady && db) {
            await setDoc(doc(db, 'clients', client.id), client);
        } else {
            const { MOCK_CLIENTS } = await import('../utils/constants');
            const list = JSON.parse(localStorage.getItem('clients') || JSON.stringify(MOCK_CLIENTS));
            const idx = list.findIndex((c: Client) => c.id === client.id);
            if (idx >= 0) list[idx] = client;
            else list.push(client);
            localStorage.setItem('clients', JSON.stringify(list));
        }
    },

    deleteClient: async (clientId: string) => {
        if (isFirebaseReady && db) {
            await deleteDoc(doc(db, 'clients', clientId));
        } else {
            const { MOCK_CLIENTS } = await import('../utils/constants');
            let list = JSON.parse(localStorage.getItem('clients') || JSON.stringify(MOCK_CLIENTS));
            list = list.filter((c: Client) => c.id !== clientId);
            localStorage.setItem('clients', JSON.stringify(list));
        }
    },

    // Specific Helpers
    getDashboardHTML: async (clientId: string) => {
        if (isFirebaseReady && db) {
            try {
                const d = await getDoc(doc(db, 'dashboards', clientId));
                return d.exists() ? d.data().html : null;
            } catch (e) { return null; }
        }
        return localStorage.getItem(`dashboard_${clientId}`);
    },

    saveDashboardHTML: async (clientId: string, html: string) => {
        if (isFirebaseReady && db) await setDoc(doc(db, 'dashboards', clientId), { html });
        else localStorage.setItem(`dashboard_${clientId}`, html);
    },

    // Documents CRUD
    getDocuments: async (clientId: string) => {
        if (isFirebaseReady && db) {
            const snap = await getDocs(collection(db, `clients/${clientId}/documents`));
            return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Document[];
        }
        const key = `docs_${clientId}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    },
    saveDocument: async (clientId: string, docData: Document) => {
        if (isFirebaseReady && db) {
            await setDoc(doc(db, `clients/${clientId}/documents`, docData.id), docData);
        } else {
            const key = `docs_${clientId}`;
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            const idx = list.findIndex((d: Document) => d.id === docData.id);
            if (idx >= 0) list[idx] = docData;
            else list.push(docData);
            localStorage.setItem(key, JSON.stringify(list));
        }
    },
    deleteDocument: async (clientId: string, docId: string) => {
        if (isFirebaseReady && db) {
            await deleteDoc(doc(db, `clients/${clientId}/documents`, docId));
        } else {
            const key = `docs_${clientId}`;
            let list = JSON.parse(localStorage.getItem(key) || '[]');
            list = list.filter((d: Document) => d.id !== docId);
            localStorage.setItem(key, JSON.stringify(list));
        }
    },

    // Events CRUD
    getEvents: async (clientId: string) => {
        if (isFirebaseReady && db) {
            const snap = await getDocs(collection(db, `clients/${clientId}/events`));
            if (snap.empty) {
                // Seed initial event
                const sampleEvent: Event = {
                    id: 'sample-1',
                    title: 'Mentoria Estratégica (Exemplo)',
                    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
                    time: '14:00',
                    description: 'Sessão de alinhamento estratégico e análise de KPIs.',
                    type: 'meeting',
                    attendees: []
                };
                await setDoc(doc(db, `clients/${clientId}/events`, sampleEvent.id), sampleEvent);
                return [sampleEvent];
            }
            return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Event[];
        }
        const key = `events_${clientId}`;
        const local = JSON.parse(localStorage.getItem(key) || '[]');
        if (local.length === 0) {
            const sampleEvent: Event = {
                id: 'sample-1',
                title: 'Mentoria Estratégica (Exemplo)',
                date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                time: '14:00',
                description: 'Sessão de alinhamento estratégico e análise de KPIs.',
                type: 'meeting',
                attendees: []
            };
            localStorage.setItem(key, JSON.stringify([sampleEvent]));
            return [sampleEvent];
        }
        return local;
    },
    saveEvent: async (clientId: string, eventData: Event) => {
        if (isFirebaseReady && db) {
            await setDoc(doc(db, `clients/${clientId}/events`, eventData.id), eventData);
        } else {
            const key = `events_${clientId}`;
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            const idx = list.findIndex((e: Event) => e.id === eventData.id);
            if (idx >= 0) list[idx] = eventData;
            else list.push(eventData);
            localStorage.setItem(key, JSON.stringify(list));
        }
    },
    deleteEvent: async (clientId: string, eventId: string) => {
        if (isFirebaseReady && db) {
            await deleteDoc(doc(db, `clients/${clientId}/events`, eventId));
        } else {
            const key = `events_${clientId}`;
            let list = JSON.parse(localStorage.getItem(key) || '[]');
            list = list.filter((e: Event) => e.id !== eventId);
            localStorage.setItem(key, JSON.stringify(list));
        }
    },

    // Base Knowledge
    getBaseKnowledge: async (clientId: string) => {
        if (isFirebaseReady && db) {
            const d = await getDoc(doc(db, 'knowledge', clientId));
            return d.exists() ? d.data().text : '';
        }
        return localStorage.getItem(`bk_${clientId}`) || '';
    },
    saveBaseKnowledge: async (clientId: string, text: string) => {
        if (isFirebaseReady && db) {
            await setDoc(doc(db, 'knowledge', clientId), { text });
        } else {
            localStorage.setItem(`bk_${clientId}`, text);
        }
    },

    // User Mappings (email -> clientId)
    getUserMappings: async () => {
        if (isFirebaseReady && db) {
            try {
                const snap = await getDocs(collection(db, 'userMappings'));
                return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
            } catch (e) {
                console.error('Error fetching user mappings:', e);
                return [];
            }
        }
        return JSON.parse(localStorage.getItem('userMappings') || '[]');
    },

    getUserMapping: async (email: string) => {
        if (isFirebaseReady && db) {
            try {
                const d = await getDoc(doc(db, 'userMappings', email));
                if (d.exists()) return { email: d.id, ...d.data() } as any;
                return null;
            } catch (e) {
                console.error('Error fetching user mapping:', e);
                return null;
            }
        }
        const mappings = JSON.parse(localStorage.getItem('userMappings') || '[]');
        return mappings.find((m: any) => m.email === email) || null;
    },

    addUserMapping: async (email: string, clientId: string, createdBy: string): Promise<boolean> => {
        const mapping = {
            email,
            clientId,
            createdAt: new Date().toISOString(),
            createdBy
        };

        try {
            if (isFirebaseReady && db) {
                console.log(`📝 Salvando mapeamento no Firestore para ${email}...`);
                await setDoc(doc(db, 'userMappings', email), mapping);
                console.log(`✅ Mapeamento salvo no Firestore para ${email}`);
                
                // Verify the document was created
                console.log(`🔍 Verificando se o documento foi criado...`);
                const verify = await getDoc(doc(db, 'userMappings', email));
                if (!verify.exists()) {
                    console.error('❌ Documento não foi criado no Firestore');
                    return false;
                }
                
                const data = verify.data();
                console.log(`✅ Documento verificado:`, data);
                return true;
            } else {
                const mappings = JSON.parse(localStorage.getItem('userMappings') || '[]');
                const idx = mappings.findIndex((m: any) => m.email === email);
                if (idx >= 0) mappings[idx] = mapping;
                else mappings.push(mapping);
                localStorage.setItem('userMappings', JSON.stringify(mappings));
                console.log(`✅ Mapeamento salvo no localStorage para ${email}`);
                return true;
            }
        } catch (error) {
            console.error('❌ Erro ao salvar mapeamento:', error);
            return false;
        }
    },

    removeUserMapping: async (email: string) => {
        if (isFirebaseReady && db) {
            await deleteDoc(doc(db, 'userMappings', email));
        } else {
            let mappings = JSON.parse(localStorage.getItem('userMappings') || '[]');
            mappings = mappings.filter((m: any) => m.email !== email);
            localStorage.setItem('userMappings', JSON.stringify(mappings));
        }
    }
};
