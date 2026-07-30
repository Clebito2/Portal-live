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
    'brunoconsultoriamave@gmail.com': 'The_Catalyst',
    // Sincronizados a partir da colecao userMappings do Firestore em 30/07/2026
    '96.guiga@gmail.com': 'The_Catalyst',
    'gestor@topusados.com.br': 'top_usados',
    'renata@ecossistemalive.com.br': 'lideranca'
};

export const MANUAL_MULTI_CLIENT_MAPPINGS: Record<string, string[]> = {
    'marianaoliveira.eng@hotmail.com': ['The_Catalyst', 'lideranca'],
    // Presente no build em producao mas ausente do repositorio — restaurado para nao remover acesso
    'imprensa@vidiceo.com.br': ['The_Catalyst', 'lideranca']
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
        // Logotipo ViDi — SVG oficial extraido da landing page (ecossistemalive.github.io/landing_vidi)
        vidi: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAwIDgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBhcmlhLWxhYmVsPSJWaURpIj4KICAgICAgPGc+CiAgICAgICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTY4Ny43OCw1MTIuNTZsLTcuNjYtNi4yOWMtMS4wNC0uODUtMS42NC0yLjEzLTEuNjQtMy40N3YtMTI5LjY2YzAtMS4zNS42LTIuNjIsMS42NC0zLjQ3bDcuNjYtNi4yOXYtMS43MmgtMzUuOTd2MS43Mmw3LjY3LDYuMjljMS4wNC44NSwxLjY0LDIuMTMsMS42NCwzLjQ3djEyOS42NmMwLDEuMzUtLjYsMi42Mi0xLjY0LDMuNDdsLTcuNjcsNi4zaDB2MS43MmgzNS45N3YtMS43MmgwWiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik01NjYuOSwzNjEuNjRoLTUxLjczdjEuNzJsNy42Nyw2LjNjMS4wNC44NSwxLjY0LDIuMTMsMS42NCwzLjQ3djEyOS42NmMwLDEuMzUtLjYsMi42Mi0xLjY0LDMuNDdsLTcuNjcsNi4zdjEuNzJoNTEuOTRjNDYuMzksMCw3Ni4zOS0zNi4yMyw3Ni4zOS04My4wOSwwLTQzLjQzLTI1LjUzLTY5LjU1LTc2LjYtNjkuNTVaTTU2MC4xOCw1MTEuNWgtMTkuNzl2LTE0Ny4wN2gxNy40NWM1MS4wNywwLDY2LjgyLDI1LjQ5LDY2LjgyLDcyLjE0LDAsNDIuMTQtMTEuOTIsNzQuOTMtNjQuNDgsNzQuOTNaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTQ2Mi44MSwzNjMuMzZsNy42Niw2LjI5YzEuMDQuODUsMS42NCwyLjEzLDEuNjQsMy40N3YxMjkuNjZjMCwxLjM1LS42LDIuNjItMS42NCwzLjQ3bC03LjY3LDYuM3YxLjcyaDM1Ljk3di0xLjcybC03LjY2LTYuMjljLTEuMDQtLjg1LTEuNjQtMi4xMy0xLjY0LTMuNDd2LTEyOS42NmMwLTEuMzUuNi0yLjYyLDEuNjQtMy40N2w3LjY2LTYuMjl2LTEuNzJoLTM1Ljk3djEuNzJaIi8+CiAgICAgICAgPHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTQyMi43NywzNjMuMzZsNy42Nyw2LjI5YzEuMDQuODUsMS42NCwyLjEzLDEuNjQsMy40N3YxMTguNThsLTYzLjE3LTEyMi45Nyw2LjU1LTUuMzh2LTEuNzJoLTM2LjcxdjEuNzJsMTQuNDMsOS45OCw2OS4zOCwxMzUuMDVjMS42NSwzLjIxLDQuNzYsNS4zNSw4LjI4LDUuOHYuMDlzMS4yNSwwLDEuMjUsMGgxMS43N3YtMS43MmwtNi43NC0xMS45MXYtMTI3LjUyYzAtMS4zNS42LTIuNjIsMS42NC0zLjQ3bDcuNjctNi4yOXYtMS43MmgtMjMuNjR2MS43MloiLz4KICAgICAgPC9nPgogICAgICA8cGF0aCBmaWxsPSIjQzVBMDU5IiBkPSJNMzE2LjkzLDQyOC40OGMwLC4zNS0uNDIuNTItLjY3LjI4LTE5LjUxLTE5LjEzLTcwLjYyLDcuMTctNzAuNjIsNzAuNjl2NDMuNDVjLTcwLjA2LTE0LjI0LTEyNC44NS03OS4zNy0xMjQuODUtMTU3LjU2LDAtMjcuMTIsNi4zOC01Mi42NiwxNy42My03NS4wNWw4MS45OSwzNi41NSwxNS43LDYuOTksMS4yMyw0Ljk1YzEuMSw0LjM4LDYuMjIsNi4zNSw5Ljk2LDMuNzlsLjg0LS41Niw4LjE1LTUuNTUtMjMuNjYtMTAuNTQtOTQuNjctNDIuMjFjLTEzLjM5LTYuMjktMjQuMzMtMTYuNzktMjUuNzMtNDYuNmwxNTAuMiw2NC43NmMxNS41NCw2LjcxLDIyLjM1LDIyLjU4LDE4LjQ1LDM5LjA2LDIxLjQ0LDE0LjkyLDM1LjU5LDM5LjU4LDM2LjA3LDY3LjU2WiIvPgogICAgPC9zdmc+",
        ibrahimBoufleur: "https://ui-avatars.com/api/?name=Ibrahim+Boufleur&background=06192a&color=00e800&size=200",
        topUsados: "https://ui-avatars.com/api/?name=Top+Usados&background=06192a&color=00e800&size=200",
        vpclub: "https://ui-avatars.com/api/?name=VP+Club&background=10b981&color=fff&size=200",
        ferramentasConsultoria: "https://raw.githubusercontent.com/Clebito2/Portal-Consultoria/main/ferramentas.png"
    }
};

export const MOCK_CLIENTS: Client[] = [
    { id: 'goianita', name: 'Goianita', logo: ASSETS.logos.goianita },
    { id: 'plur', name: 'Plur', logo: ASSETS.logos.plur },
    { id: 'autocare', name: 'Autocare', logo: ASSETS.logos.autocare },
    { id: 'lideranca', name: 'Liderança Antifrágil', logo: ASSETS.logos.lideranca },
    { id: 'The_Catalyst', name: 'ViDi', logo: ASSETS.logos.vidi },
    { id: 'vpclub', name: 'VP Club', logo: ASSETS.logos.vpclub, theme: 'gold' },
    // Cadastrados no Firestore mas ausentes desta lista ate 30/07/2026 — ficavam invisiveis no portal
    { id: 'Ibrahim Boufleur', name: 'Ibrahim Boufleur', logo: ASSETS.logos.ibrahimBoufleur },
    { id: 'top_usados', name: 'Top Usados', logo: ASSETS.logos.topUsados }
];

// Cliente especial apenas para admin (Ferramentas da Consultoria)

// Clientes que têm acesso ao agente de R&S
export const CLIENTS_WITH_AGENTS = ['goianita', 'plur', 'autocare'];
export const ADMIN_ONLY_CLIENTS: Client[] = [
    { id: 'ferramentas', name: 'Ferramentas da Consultoria', logo: ASSETS.logos.ferramentasConsultoria }
];
