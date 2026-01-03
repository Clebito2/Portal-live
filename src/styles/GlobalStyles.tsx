import React from 'react';

export const GlobalStyles = () => (
    <style>{`
        :root {
            /* --- V6.0 Elite Tokens --- */
            /* Atmosfera */
            --live-deep: #06192a;
            
            /* Superfícies (Refractive Glass) */
            --live-glass: rgba(10, 36, 61, 0.70);
            --live-glass-hover: rgba(15, 45, 75, 0.85);
            --glass-blur: blur(16px) saturate(180%);

            /* Luz & Ação */
            --live-accent: #00e800;
            --live-accent-dim: rgba(0, 232, 0, 0.15);
            --live-accent-text: #06192a; /* Contraste Acessível para botões */
            
            /* Gradiente Cinético */
            --kinetic-gradient: linear-gradient(90deg, #ffffff 0%, #cccccc 50%, #00e800 100%);
            
            /* Física (Micro-Springs) */
            --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
            --ease-fluid: cubic-bezier(0.4, 0.0, 0.2, 1);

            /* Bordas */
            --border-subtle: rgba(255, 255, 255, 0.08);
            --border-active: rgba(0, 232, 0, 0.4);

            /* Legacy Mappings (Backward Compatibility) */
            --primary-bg: var(--live-deep);
            --accent-color: var(--live-accent);
            --card-bg: var(--live-glass);
            --font-primary: 'Poppins', sans-serif;
            --font-secondary: 'Merriweather', serif;
        }

        body { 
            background-color: var(--live-deep); 
            font-family: var(--font-primary); 
            color: #f1f5f9; 
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        .font-serif { font-family: var(--font-secondary); }
        .font-analytical { font-family: var(--font-secondary); line-height: 1.7; letter-spacing: 0.01em; }

        /* Typography */
        h1, .kinetic-title {
            background: linear-gradient(90deg, #00b4d8 0%, #ffffff 50%, #00e800 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: breathe 6s ease-in-out infinite alternate;
        }

        @keyframes breathe {
            0% { background-position: 0% center; filter: drop-shadow(0 0 2px rgba(0, 180, 216, 0.1)); }
            100% { background-position: 100% center; filter: drop-shadow(0 0 8px rgba(0, 232, 0, 0.3)); }
        }

        /* Card Elite Halo */
        .card-v4 {
            background: var(--live-glass);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            transition: transform 0.4s var(--spring-bounce), box-shadow 0.4s var(--spring-bounce), border-color 0.3s;
            position: relative;
            overflow: hidden;
        }
        
        .card-v4:hover {
            transform: translateY(-6px) scale(1.01);
            border-color: var(--border-active);
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
            background: var(--live-glass-hover);
            z-index: 10;
        }

        /* Inputs */
        .input-v4 {
            background-color: rgba(13, 46, 71, 0.6);
            border: 1px solid #1e3a52;
            color: white;
            padding: 0.8rem 1rem;
            border-radius: 8px;
            width: 100%;
            outline: none;
            transition: all 0.2s var(--ease-fluid);
        }
        .input-v4:focus { 
            border-color: var(--live-accent); 
            background-color: rgba(13, 46, 71, 0.9);
            box-shadow: 0 0 0 1px var(--live-accent-dim); 
        }

        /* Buttons Ghost Neon with Inertia & Gradient */
        .btn-primary {
            background: linear-gradient(135deg, #00b4d8 0%, #00e800 100%);
            color: #06192a; /* Dark text for contrast */
            font-weight: 700;
            padding: 0.75rem 1.5rem; 
            border-radius: 8px; 
            transition: all 0.3s var(--spring-bounce); 
            display: inline-flex;
            align-items: center; 
            justify-content: center; 
            gap: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
        }

        .btn-primary::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(rgba(255,255,255,0.2), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .btn-primary:active:not(:disabled) {
            transform: scale(0.96);
        }

        .btn-primary:hover:not(:disabled) { 
            transform: translateY(-2px); 
            box-shadow: 0 4px 25px rgba(0, 232, 0, 0.4);
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .btn-primary:hover::after {
            opacity: 1;
        }
        
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(1); }

        .btn-ghost { 
            background: transparent; 
            color: #94a3b8; 
            padding: 0.5rem; 
            border-radius: 6px; 
            transition: all 0.2s; 
        }
        .btn-ghost:hover { 
            background: rgba(255,255,255,0.05); 
            color: white; 
        }
        .btn-ghost:active { transform: scale(0.95); }

        /* Special Effects V6.1 */
        .golden-filter {
            filter: sepia(100%) saturate(150%) hue-rotate(5deg) brightness(0.7) contrast(1.2);
            mix-blend-mode: screen;
        }

        .sidebar-texture {
            opacity: 0.12; /* Aumentado de 0.05 para mais visibilidade */
            mix-blend-mode: overlay;
        }

        /* Animations */
        .fade-in { animation: fadeIn 0.6s var(--ease-fluid) forwards; opacity: 0; transform: translateY(10px); }
        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
        
        .modal-overlay { background: rgba(6, 25, 42, 0.85); backdrop-filter: blur(12px); }
        
        /* Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e3a52; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--live-accent); }
    `}</style>
);
