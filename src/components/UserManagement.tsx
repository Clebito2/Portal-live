import React, { useState, useEffect } from 'react';
import { DB } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';

interface UserMapping {
    email: string;
    clientId: string;
    createdAt: string;
    createdBy: string;
}

export const UserManagement = () => {
    const { user } = useAuth();
    const [mappings, setMappings] = useState<UserMapping[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [userMappings, clientList] = await Promise.all([
            DB.getUserMappings(),
            DB.getClients()
        ]);
        setMappings(userMappings);
        setClients(clientList);
    };

    const handleAddUser = async () => {
        if (!newEmail || !newPassword || !selectedClientId || !user) return;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            alert('Email inválido');
            return;
        }

        // Validate password
        if (newPassword.length < 6) {
            alert('Senha deve ter no mínimo 6 caracteres');
            return;
        }

        setIsLoading(true);
        let authSuccess = false;
        let mappingSuccess = false;

        try {
            // 1. Create user in Firebase Authentication
            const { createUserWithEmailAndPassword } = await import('firebase/auth');
            const { auth } = await import('../services/firebase');

            console.log('🔐 Criando usuário no Firebase Auth...');
            try {
                await createUserWithEmailAndPassword(auth, newEmail, newPassword);
                console.log('✅ Usuário criado no Firebase Auth');
                authSuccess = true;
            } catch (authError: any) {
                if (authError.code === 'auth/email-already-in-use') {
                    console.log('ℹ️ Usuário já existe no Firebase Auth, criando apenas mapeamento');
                    authSuccess = true; // Consider existing user as success
                } else {
                    throw authError;
                }
            }

            // 2. Create mapping in Firestore with validation
            console.log('📝 Criando mapeamento no Firestore...');
            const success = await DB.addUserMapping(newEmail, selectedClientId, user.email);

            if (!success) {
                throw new Error('Falha ao criar mapeamento no Firestore. Verifique as permissões e a conexão.');
            }

            console.log('✅ Mapeamento criado com sucesso');
            mappingSuccess = true;

            // 3. Verify mapping was created
            console.log('🔍 Verificando mapeamento...');
            const verifyMapping = await DB.getUserMapping(newEmail);

            if (!verifyMapping || verifyMapping.clientId !== selectedClientId) {
                throw new Error('Mapeamento não foi criado corretamente. Verifique no Firestore Console.');
            }

            console.log('✅ Mapeamento verificado com sucesso');

            // Reload data and reset form
            await loadData();
            setIsModalOpen(false);
            setNewEmail('');
            setNewPassword('');
            setSelectedClientId('');

            alert(
                `✅ Usuário criado e vinculado com sucesso!\n\n` +
                `Email: ${newEmail}\n` +
                `Senha: ${newPassword}\n` +
                `Cliente: ${getClientName(selectedClientId)}\n\n` +
                `O usuário já pode fazer login.`
            );
        } catch (e: any) {
            console.error('❌ Erro ao adicionar usuário:', e);

            let errorMsg = 'Erro ao adicionar usuário:\n\n';

            if (e.code === 'auth/weak-password') {
                errorMsg += 'Senha muito fraca';
            } else if (e.code === 'auth/invalid-email') {
                errorMsg += 'Email inválido';
            } else if (e.code === 'permission-denied') {
                errorMsg += 'Permissão negada. Verifique as regras do Firestore.';
            } else {
                errorMsg += e.message || 'Erro desconhecido';
            }

            // Add status information
            errorMsg += '\n\n📊 Status:';
            errorMsg += `\n• Firebase Auth: ${authSuccess ? '✅ Sucesso' : '❌ Falhou'}`;
            errorMsg += `\n• Vinculação ao Cliente: ${mappingSuccess ? '✅ Sucesso' : '❌ Falhou'}`;

            if (authSuccess && !mappingSuccess) {
                errorMsg += '\n\n⚠️ O usuário foi criado no Firebase Auth, mas não foi vinculado ao cliente.';
                errorMsg += '\nVerifique o console do navegador para mais detalhes.';
            }

            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveUser = async (email: string) => {
        if (!confirm(`Remover acesso de ${email}?`)) return;

        setIsLoading(true);
        try {
            await DB.removeUserMapping(email);
            await loadData();
            alert('✅ Usuário removido com sucesso!');
        } catch (e: any) {
            alert('Erro ao remover usuário: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getClientName = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        return client?.name || clientId;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#06192a] via-[#0a253a] to-[#06192a] p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-[#00e800]" size={40} />
                        <h1 className="text-4xl font-bold text-white font-serif">
                            Gerenciamento de Usuários
                        </h1>
                    </div>
                    <p className="text-slate-400 text-lg">
                        Controle de acesso dos clientes ao sistema
                    </p>
                </div>

                {/* Add Button */}
                <div className="mb-6">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <UserPlus size={20} />
                        Adicionar Usuário
                    </Button>
                </div>

                {/* Users Table */}
                <div className="bg-[#0a253a] rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
                    <table className="w-full">
                        <thead className="bg-[#06192a] border-b border-slate-700">
                            <tr>
                                <th className="text-left p-4 text-white font-semibold">Email</th>
                                <th className="text-left p-4 text-white font-semibold">Cliente</th>
                                <th className="text-left p-4 text-white font-semibold">Criado em</th>
                                <th className="text-left p-4 text-white font-semibold">Criado por</th>
                                <th className="text-center p-4 text-white font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        Nenhum usuário cadastrado. Adicione o primeiro usuário!
                                    </td>
                                </tr>
                            ) : (
                                mappings.map((mapping) => (
                                    <tr key={mapping.email} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-white">{mapping.email}</td>
                                        <td className="p-4 text-slate-300">{getClientName(mapping.clientId)}</td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(mapping.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{mapping.createdBy}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleRemoveUser(mapping.email)}
                                                disabled={isLoading}
                                                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                                title="Remover usuário"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add User Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Adicionar Novo Usuário"
                    maxWidth="max-w-2xl"
                >
                    <div className="space-y-4">
                        <Input
                            label="Email do Usuário"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="usuario@empresa.com"
                            disabled={isLoading}
                        />

                        <Input
                            label="Senha Inicial"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            disabled={isLoading}
                        />

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Cliente
                            </label>
                            <select
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00e800] transition-all disabled:opacity-50"
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Selecione um cliente</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                variant="secondary"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleAddUser}
                                disabled={!newEmail || !newPassword || !selectedClientId || isLoading}
                            >
                                {isLoading ? 'Criando usuário...' : 'Criar Usuário'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
