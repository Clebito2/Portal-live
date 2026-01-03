import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos em milissegundos

export const useAutoLogout = () => {
    const { logout, user } = useAuth();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        // Limpar timeout anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Criar novo timeout
        timeoutRef.current = setTimeout(() => {
            if (user) {
                console.log('Auto-logout: Usuário inativo por 30 minutos');
                logout();
            }
        }, INACTIVITY_TIMEOUT);
    };

    useEffect(() => {
        if (!user) return; // Não ativar se não houver usuário logado

        // Eventos que indicam atividade do usuário
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        // Iniciar timer
        resetTimer();

        // Adicionar listeners para todos os eventos
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [user]);
};
