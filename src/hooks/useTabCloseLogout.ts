import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to automatically log out the user when the tab or browser is closed.
 * Uses 'visibilitychange' and 'pagehide' for maximum compatibility.
 */
export const useTabCloseLogout = () => {
    const { logout, user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const handleVisibilityChange = () => {
            // Note: In real scenarios, you might want to wait a few seconds
            // or use a sessionStorage flag to distinguish between refresh and close.
            // But here the requirement is strict logoff on exit.
            if (document.visibilityState === 'hidden') {
                // logout(); // Optional: uncomment if logout on tab switch is desired
            }
        };

        const handlePageHide = (event: PageTransitionEvent) => {
            // This event is more reliable for "leaving" the page (close/navigate away)
            // It doesn't trigger on simple refresh as consistently as beforeunload,
            // but it's the modern way.
            logout();
        };

        const handleUnload = () => {
            // Fallback for older browsers
            logout();
        };

        // window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            // window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [user]);
};
