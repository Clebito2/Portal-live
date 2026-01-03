export const INITIAL_DASHBOARDS: Record<string, string> = {
    goianita: `
        <style>
            body { font-family: 'Poppins', sans-serif; background: transparent; color: white; padding: 20px; }
            .card { background: rgba(255,255,255,0.05); padding: 25px; border-radius: 16px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
            .metric { font-size: 2.5rem; font-weight: 700; color: #00e800; margin: 10px 0; }
            .label { color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
            h1 { font-size: 2rem; margin-bottom: 30px; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        </style>
        <h1>Dashboard Casa Goianita</h1>
        <div class="grid">
            <div class="card">
                <div class="label">Faturamento Mensal</div>
                <div class="metric">R$ 1.2M</div>
                <div style="color: #00e800; font-size: 0.8rem;">▲ 12% vs mês anterior</div>
            </div>
            <div class="card">
                <div class="label">Ticket Médio</div>
                <div class="metric">R$ 345</div>
                <div style="color: #ef4444; font-size: 0.8rem;">▼ 3% vs mês anterior</div>
            </div>
            <div class="card">
                <div class="label">Novos Clientes</div>
                <div class="metric">128</div>
                <div style="color: #00e800; font-size: 0.8rem;">▲ 24% vs mês anterior</div>
            </div>
        </div>
        <div class="card" style="margin-top: 20px;">
            <h3>Próximos Passos Estratégicos</h3>
            <ul style="margin-top: 15px; color: #cbd5e1; line-height: 1.6;">
                <li>• Implementação do novo CRM para equipe de vendas</li>
                <li>• Treinamento de liderança (Módulo 2)</li>
                <li>• Revisão de processos logísticos</li>
            </ul>
        </div>
    `,
    plur: `
        <style>
            body { font-family: 'Poppins', sans-serif; background: transparent; color: white; padding: 20px; }
            .card { background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); padding: 25px; border-radius: 16px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); }
            .metric { font-size: 3rem; font-weight: 800; color: #a855f7; margin: 10px 0; }
            .label { color: #d8b4fe; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
            h1 { font-size: 2rem; margin-bottom: 30px; color: #a855f7; }
        </style>
        <h1>PLUR Movimento</h1>
        <div class="grid">
            <div class="card">
                <div class="label">Alunos Ativos</div>
                <div class="metric">450</div>
            </div>
            <div class="card">
                <div class="label">Retenção</div>
                <div class="metric">92%</div>
            </div>
            <div class="card">
                <div class="label">NPS</div>
                <div class="metric">78</div>
            </div>
        </div>
        <div class="card" style="margin-top: 20px;">
            <h3 style="color: #d8b4fe;">Status do Projeto</h3>
            <div style="margin-top: 15px; background: rgba(168, 85, 247, 0.1); border-radius: 8px; height: 10px; width: 100%; overflow: hidden;">
                <div style="background: #a855f7; width: 65%; height: 100%;"></div>
            </div>
            <p style="margin-top: 10px; color: #cbd5e1;">Expansão da Unidade 2 - 65% Concluído</p>
        </div>
    `,
    autocare: `
        <style>
            body { font-family: 'Poppins', sans-serif; background: transparent; color: white; padding: 20px; }
            .card { background: rgba(15, 23, 42, 0.6); padding: 25px; border-radius: 16px; margin-bottom: 20px; border: 1px solid rgba(56, 189, 248, 0.2); }
            .metric { font-size: 2.5rem; font-weight: 700; color: #38bdf8; margin: 10px 0; }
            .label { color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
            h1 { font-size: 2rem; margin-bottom: 30px; color: #38bdf8; }
        </style>
        <h1>AutoCare Performance</h1>
        <div class="grid">
            <div class="card">
                <div class="label">Veículos Atendidos</div>
                <div class="metric">85</div>
                <div style="font-size: 0.8rem; color: #38bdf8;">Esta semana</div>
            </div>
            <div class="card">
                <div class="label">Eficiência Operacional</div>
                <div class="metric">88%</div>
            </div>
            <div class="card">
                <div class="label">Faturamento Serviços</div>
                <div class="metric">R$ 45k</div>
            </div>
        </div>
    `,
    lideranca: `
        <style>
            body { font-family: 'Merriweather', serif; background: transparent; color: white; padding: 20px; }
            .card { background: rgba(255,255,255,0.05); padding: 30px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #eab308; }
            h1 { font-family: 'Poppins', sans-serif; font-size: 2rem; margin-bottom: 30px; color: #eab308; }
            h3 { font-family: 'Poppins', sans-serif; margin-bottom: 15px; }
            p { line-height: 1.8; color: #cbd5e1; }
        </style>
        <h1>Liderança Antifrágil</h1>
        <div class="card">
            <h3>Conceito da Semana</h3>
            <p>"O antifrágil é aquilo que se beneficia do caos. Diferente do resiliente, que resiste ao choque e permanece o mesmo, o antifrágil melhora." - Nassim Taleb</p>
        </div>
        <div class="card" style="border-color: #00e800;">
            <h3>Agenda de Mentoria</h3>
            <p>Próximo encontro: <strong>12/12/2025 às 19h</strong></p>
            <p>Tema: Tomada de Decisão sob Incerteza</p>
        </div>
    `,
    ferramentas: `
        <style>
            body { font-family: 'Poppins', sans-serif; background: transparent; color: white; padding: 20px; }
            .card { background: rgba(255,255,255,0.05); padding: 30px; border-radius: 16px; margin-bottom: 20px; border: 1px solid rgba(0,232,0,0.2); backdrop-filter: blur(10px); }
            .highlight { color: #00e800; font-weight: 700; }
            h1 { font-size: 2.5rem; margin-bottom: 30px; background: linear-gradient(to right, #00e800, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            h2 { color: #00e800; margin-top: 30px; margin-bottom: 15px; font-size: 1.5rem; }
            p { line-height: 1.8; color: #cbd5e1; margin-bottom: 15px; }
            .values { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
            .value-card { background: rgba(0,232,0,0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #00e800; }
        </style>
        <h1>🚀 Bem-vindo à Live Consultoria</h1>
        
        <div class="card">
            <h2>Quem Somos</h2>
            <p>A <span class="highlight">Live Consultoria</span> é uma consultoria empresarial moderna e inovadora, especializada em transformação digital e gestão estratégica de negócios.</p>
            <p>Utilizamos metodologias proprietárias e tecnologia de ponta, incluindo inteligência artificial, para impulsionar o crescimento e a eficiência operacional de nossos clientes.</p>
        </div>

        <div class="card">
            <h2>Nossa Abordagem</h2>
            <p>Desenvolvemos soluções personalizadas que combinam:</p>
            <ul style="color: #cbd5e1; line-height: 2; margin-top: 15px;">
                <li>• Diagnóstico profundo e estruturado</li>
                <li>• Metodologias validadas (Framework M.A.P.C.A)</li>
                <li>• Tecnologia e automação inteligente</li>
                <li>• Acompanhamento contínuo de resultados</li>
                <li>• Agentes de IA especializados por área</li>
            </ul>
        </div>

        <div class="values">
            <div class="value-card">
                <h3 style="color: #00e800; margin-bottom: 10px;">📊 Dados & Análise</h3>
                <p style="font-size: 0.9rem;">Decisões baseadas em métricas reais e análise profunda de mercado</p>
            </div>
            <div class="value-card">
                <h3 style="color: #00e800; margin-bottom: 10px;">🤖 IA Aplicada</h3>
                <p style="font-size: 0.9rem;">Agentes especializados que potencializam cada área do seu negócio</p>
            </div>
            <div class="value-card">
                <h3 style="color: #00e800; margin-bottom: 10px;">🎯 Resultados</h3>
                <p style="font-size: 0.9rem;">Foco em entregas tangíveis e mensuráveis para seu negócio</p>
            </div>
        </div>

        <div class="card" style="margin-top: 30px; background: rgba(0,232,0,0.05); border-color: #00e800;">
            <h2>Acesse Nossos Agentes de IA</h2>
            <p>Na aba <span class="highlight">Agentes</span> do menu lateral, você encontra consultores especializados com inteligência artificial para diferentes áreas:</p>
            <ul style="color: #cbd5e1; line-height: 2; margin-top: 15px;">
                <li>• <strong style="color: #00e800;">Recrutamento e Seleção:</strong> Análise de perfis e criação de anúncios estratégicos</li>
                <li>• <strong style="color: #94a3b8;">Em breve:</strong> Novos agentes especializados</li>
            </ul>
        </div>
    `
};
