import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { CheckCircle, AlertCircle, Calendar, User } from 'lucide-react';

interface UpdateItem {
    type: 'dashboard' | 'document';
    clientId: string;
    clientName?: string;
    title?: string;
    updatedAt: string;
    updatedBy: string;
}

interface AdminUpdatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    updates: UpdateItem[];
}

export const AdminUpdatesModal = ({ isOpen, onClose, onConfirm, updates }: AdminUpdatesModalProps) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Novidades no Sistema" maxWidth="max-w-2xl">
            <div className="space-y-6">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3 items-start">
                    <AlertCircle className="text-blue-400 shrink-0" size={20} />
                    <p className="text-sm text-slate-300">
                        Identificamos <strong>{updates.length}</strong> alterações desde o seu último acesso. Confira o que mudou nos dashboards e documentos.
                    </p>
                </div>

                <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {updates.map((update, idx) => (
                        <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-[#00e800]/30 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${update.type === 'dashboard' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {update.type === 'dashboard' ? '📊 Dashboard' : '📄 Documento'}
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <Calendar size={10} /> {formatDate(update.updatedAt)}
                                </span>
                            </div>

                            <h4 className="font-bold text-white text-sm mb-1">
                                {update.type === 'dashboard' ? `Dashboard: ${update.clientId}` : update.title}
                            </h4>
                            {update.clientName && (
                                <p className="text-xs text-slate-400 mb-2">Cliente: {update.clientName}</p>
                            )}

                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <User size={12} className="text-[#00e800]" />
                                Alterado por: <span className="text-slate-300">{update.updatedBy}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <Button className="w-full" onClick={onConfirm}>
                    <CheckCircle size={18} /> Entendido
                </Button>
            </div>
        </Modal>
    );
};
