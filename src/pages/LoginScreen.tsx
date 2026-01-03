import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ASSETS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export const LoginScreen = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.clientId) {
                navigate(`/dashboard/${user.clientId}`);
            } else {
                setError('Usuário autenticado, mas sem vínculo com empresa. Contate o suporte.');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Falha no login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden login-screen">
            {/* Bloquear pattern de cubos APENAS nesta tela */}
            <style>{`
                .login-screen::before {
                    content: "";
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #06192a;
                    z-index: -3;
                }
                
                /* Remover textura de cubos na tela de login */
                .login-screen::after {
                    display: none !important;
                }
            `}</style>

            {/* Globo Terrestre - Visibilidade Aumentada */}
            <div
                className="absolute inset-0 pointer-events-none golden-filter"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.45
                }}
            />

            <div className="w-full max-w-md card-v4 p-8 relative z-10 fade-in">
                <div className="text-center mb-8">
                    <img src={ASSETS.logoLive} alt="Live" className="h-24 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(0,232,0,0.4)] animate-pulse-slow" />
                    <h2 className="text-3xl font-bold font-serif kinetic-title">Acesso Restrito</h2>
                    <p className="text-slate-400 text-sm mt-3 tracking-wide">Consultoria Ecossistema Live</p>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6 text-sm text-center font-medium">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input label="Email Corporativo" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required placeholder="ex: admin@live.com" />
                    <Input label="Senha" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
                    <Button type="submit" className="w-full py-3 text-lg shadow-lg shadow-[#00e800]/20" disabled={loading}>{loading ? 'Acessando...' : 'Entrar no Portal'}</Button>
                </form>
            </div>
        </div>
    );
};
