import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIREBASE_CONFIG } from "../utils/constants";

let app;
let db: any;
let auth: any;
let isFirebaseReady = false;

try {
    // Check if config is filled (real keys)
    if (FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.includes("SUA_API_KEY")) {
        app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
        db = getFirestore(app);
        auth = getAuth(app);
        isFirebaseReady = true;
        console.log("Firebase conectado via Config Hardcoded");
    } else {
        console.warn("Firebase Config não preenchido ou inválido. Usando LocalStorage.");
    }
} catch (e) {
    console.error("Erro ao iniciar Firebase:", e);
}

export { app, db, auth, isFirebaseReady };
