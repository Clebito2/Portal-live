import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from './firebase';

// reCAPTCHA Site Key (Public - safe to expose)
const RECAPTCHA_SITE_KEY = '6LcimyosAAAAALTQpbM2eMInJhJlr5lPYcySEdU3';

export const initAppCheck = () => {
    if (typeof window !== 'undefined') {
        try {
            const appCheck = initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
                isTokenAutoRefreshEnabled: true // Auto-refresh tokens
            });
            console.log('✅ Firebase App Check initialized successfully');
            return appCheck;
        } catch (error) {
            console.error('❌ Error initializing App Check:', error);
        }
    }
};
