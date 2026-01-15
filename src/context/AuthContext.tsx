import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseReady } from '../services/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../types';
import { MOCK_CLIENTS, ADMIN_EMAILS, MANUAL_CLIENT_MAPPINGS } from '../utils/constants';
import { DB } from '../services/db';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFirebaseReady && auth) {
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    const email = firebaseUser.email || '';
                    const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'client';
                    let clientId;

                    if (role === 'client') {
                        // 0. Check Firestore User Mappings first (dynamic)
                        const userMapping = await DB.getUserMapping(email);
                        if (userMapping) {
                            clientId = userMapping.clientId;
                        } else if (MANUAL_CLIENT_MAPPINGS[email]) {
                            // 1. Fallback to Manual Mappings (hardcoded)
                            clientId = MANUAL_CLIENT_MAPPINGS[email];
                        } else {
                            // 2. Check Mock Clients
                            let client = MOCK_CLIENTS.find(c => email.includes(c.id) || email.includes(c.name.split(' ')[0].toLowerCase()));

                            // 3. If not found, check Firestore Clients
                            if (!client) {
                                try {
                                    const dbClients = await DB.getClients();
                                    if (dbClients) {
                                        // Try to match email with client ID or Name
                                        client = dbClients.find(c => email.includes(c.id) || (c.name && email.includes(c.name.toLowerCase().replace(/\s/g, ''))));
                                    }
                                } catch (e) {
                                    console.error("Error fetching clients for auth mapping", e);
                                }
                            }

                            clientId = client?.id;
                        }
                    }

                    setUser({
                        email,
                        name: firebaseUser.displayName || 'Usuário',
                        role,
                        clientId
                    });
                } else {
                    setUser(null);
                }
                setLoading(false);
            });
            return unsubscribe;
        } else {
            // Check localStorage for mock session
            const stored = localStorage.getItem('mock_user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        if (isFirebaseReady && auth) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            // Only for development/demo if Firebase is not configured
            // STRICT CHECK: Only allow specific admin or known clients with a "password" check (mock)
            // For this stage, since user complained about security, we will DISABLE generic mock login.
            // Mock login removed for security - Firebase Auth is required
            throw new Error('Login falhou. Verifique suas credenciais ou a conexão com o Firebase.');
        }
    };

    const logout = async () => {
        if (isFirebaseReady && auth) {
            await signOut(auth);
        }
        localStorage.removeItem('mock_user');
        setUser(null);
    };

    const resetPassword = async (email: string) => {
        if (isFirebaseReady && auth) {
            await sendPasswordResetEmail(auth, email);
        } else {
            throw new Error('Serviço de autenticação indisponível. Contate o suporte.');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};
