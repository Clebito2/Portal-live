import React, { useEffect, useState } from 'react';
import { DB } from '../services/db';
import { Shield, AlertTriangle, CheckCircle, Users, XCircle } from 'lucide-react';
import { Button } from './Button';

export const SecurityDiagnosis = ({ onClose }: { onClose: () => void }) => {
    const [mappings, setMappings] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [m, c] = await Promise.all([
                DB.getUserMappings(),
                DB.getClients()
            ]);
            setMappings(m);
            setClients(c);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getClientName = (id: string) => {
        return clients.find(c => c.id === id)?.name || id;
    };

    return (
        <div className="p-6 text-white bg-[#0a253a] rounded-xl shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <Shield className="text-[#00e800]" size={32} />
                <div>
                    <h2 className="text-2xl font-bold font-serif">Diagnóstico de Segurança</h2>
                    <p className="text-slate-400 text-sm">Verifique quem terá acesso quando a proteção for ativada.</p>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center text-slate-400 animate-pulse">Carregando dados...</div>
            ) : (
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#06192a] p-4 rounded-lg border border-slate-700">
                            <div className="text-slate-400 text-sm mb-1">Total de Clientes</div>
                            <div className="text-2xl font-bold text-white flex items-center gap-2">
                                <Users size={20} />
                                {clients.length}
                            </div>
                        </div>
                        <div className="bg-[#06192a] p-4 rounded-lg border border-slate-700">
                            <div className="text-slate-400 text-sm mb-1">Usuários Mapeados</div>
                            <div className={`text-2xl font-bold flex items-center gap-2 ${mappings.length > 0 ? 'text-[#00e800]' : 'text-red-500'}`}>
                                <CheckCircle size={20} />
                                {mappings.length}
                            </div>
                        </div>
                        <div className="bg-[#06192a] p-4 rounded-lg border border-slate-700">
                            <div className="text-slate-400 text-sm mb-1">Status da Proteção</div>
                            <div className="text-1xl font-bold text-red-400 flex items-center gap-2 mt-1">
                                <AlertTriangle size={20} />
                                DESATIVADA (Inseguro)
                            </div>
                        </div>
                    </div>

                    {/* Alert Box */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={20} />
                        <div className="text-sm text-yellow-200/90">
                            <strong className="block text-yellow-500 mb-1">Atenção!</strong>
                            Somente os usuários listados abaixo conseguirão fazer login quando a segurança for reativada.
                            Se algum cliente seu não estiver nesta lista, adicione-o imediatamente no menu "Gerenciamento de Usuários".
                        </div>
                    </div>

                    {/* Mapped Users List */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#00e800]"></div>
                            Usuários Autorizados (Safe List)
                        </h3>
                        {mappings.length === 0 ? (
                            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg text-center">
                                <XCircle className="mx-auto text-red-500 mb-2" size={32} />
                                <h4 className="text-red-400 font-bold">Nenhum usuário mapeado!</h4>
                                <p className="text-red-300/70 text-sm mt-1">
                                    Se você ativar a segurança agora, <strong>ninguém</strong> (exceto admins) conseguirá acessar o sistema.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-[#06192a] rounded-lg border border-slate-700 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[#0a253a] text-slate-400 font-medium border-b border-slate-700">
                                        <tr>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Cliente Acessado</th>
                                            <th className="p-3 text-right">Data Vínculo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {mappings.map(m => (
                                            <tr key={m.email} className="hover:bg-slate-800/50">
                                                <td className="p-3 text-white font-mono">{m.email}</td>
                                                <td className="p-3 text-[#00e800]">{getClientName(m.clientId)}</td>
                                                <td className="p-3 text-slate-500 text-right">
                                                    {new Date(m.createdAt).toLocaleDateString('pt-BR')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-700">
                        <Button onClick={onClose} variant="ghost">
                            Fechar Relatório
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
