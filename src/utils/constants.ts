import { Client } from "../types";

// --- CONFIGURAÇÃO: FIREBASE & API ---
export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBFihsqhdG6pbxAT27vUgHe0U3XQbaR1iM",
    authDomain: "ecossistema-live-d8fa5.firebaseapp.com",
    projectId: "ecossistema-live-d8fa5",
    storageBucket: "ecossistema-live-d8fa5.firebasestorage.app",
    messagingSenderId: "511169898560", // ATENÇÃO: Atualize se necessário
    appId: "1:511169898560:web:ecc593eeb951c50619d7a5", // ATENÇÃO: Atualize se necessário
    measurementId: "G-JEM7W7V4VN"
};

export const ADMIN_EMAILS = ['cleber.ihs@gmail.com', 'luizportal@ecossistemalive.com.br'];

// Mapeamento manual de emails para clientes (ex: 'usuario@gmail.com': 'vpclub')
export const MANUAL_CLIENT_MAPPINGS: Record<string, string> = {
    'lojasgoianita@gmail.com': 'goianita',
    'gestor@plur.com': 'plur',
    'gestor@autocare.com': 'autocare',
    'gestor@lideraf.com': 'lideranca',
    'gestor@tecnoit.com': 'The_Catalyst',
    'ibra@tecnoit.com.br': 'The_Catalyst',
    'brunoconsultoriamave@gmail.com': 'The_Catalyst'
};

export const MANUAL_MULTI_CLIENT_MAPPINGS: Record<string, string[]> = {
    'marianaoliveira.eng@hotmail.com': ['The_Catalyst', 'lideranca']
};

// @ts-ignore
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: VITE_GEMINI_API_KEY is missing. Please check your .env.local file.");
}

export const ASSETS = {
    logoLive: "https://raw.githubusercontent.com/Clebito2/ApresentacaoConsultoria/main/Logo%20live%20oficial-36.png",
    luizPortal: "https://raw.githubusercontent.com/Clebito2/ConsultoriaLive/main/FOTO_LUIZPORTAL.jpeg",
    iagoAvatar: "https://raw.githubusercontent.com/EcossistemaLive/live-template/master/Gemini_Generated_Image_e5mxdme5mxdme5mx.png",
    ferramentas: "https://raw.githubusercontent.com/Clebito2/Portal-Consultoria/main/ferramentas.png",
    logos: {
        goianita: "https://raw.githubusercontent.com/Clebito2/Goianita/main/Goianita.png",
        plur: "https://github.com/Clebito2/Plur/raw/main/PLUR%20Movimento-03.png",
        autocare: "https://github.com/Clebito2/pneucar2/raw/main/logo%20pneucar.png",
        lideranca: "https://raw.githubusercontent.com/EcossistemaLive/Dashboard_goianita/refs/heads/main/Logo%20Live-26.png",
        theCatalyst: "https://raw.githubusercontent.com/EcossistemaLive/Catalyst-Experience/refs/heads/main/the%20catalyst.png",
        vpclub: "https://ui-avatars.com/api/?name=VP+Club&background=10b981&color=fff&size=200",
        ferramentasConsultoria: "https://raw.githubusercontent.com/Clebito2/Portal-Consultoria/main/ferramentas.png"
    }
};

export const MOCK_CLIENTS: Client[] = [
    { id: 'goianita', name: 'Goianita', logo: ASSETS.logos.goianita },
    { id: 'plur', name: 'Plur', logo: ASSETS.logos.plur },
    { id: 'autocare', name: 'Autocare', logo: ASSETS.logos.autocare },
    { id: 'lideranca', name: 'Liderança Antifrágil', logo: ASSETS.logos.lideranca },
    { id: 'The_Catalyst', name: 'The Catalyst', logo: ASSETS.logos.theCatalyst },
    { id: 'vpclub', name: 'VP Club', logo: ASSETS.logos.vpclub, theme: 'gold' }
];

// Cliente especial apenas para admin (Ferramentas da Consultoria)

// Clientes que têm acesso ao agente de R&S
export const CLIENTS_WITH_AGENTS = ['goianita', 'plur', 'autocare'];
export const ADMIN_ONLY_CLIENTS: Client[] = [
    { id: 'ferramentas', name: 'Ferramentas da Consultoria', logo: ASSETS.logos.ferramentasConsultoria }
];
