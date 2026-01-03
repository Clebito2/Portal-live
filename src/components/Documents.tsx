import React, { useState, useEffect } from 'react';
import { FileText, Code, FilePlus, Edit, Trash2, Eye, Link as LinkIcon, FileSpreadsheet, FileVideo } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { DB } from '../services/db';
import { Document } from '../types';
import { useAuth } from '../context/AuthContext';

export const Documents = ({ clientId }: { clientId: string }) => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDoc, setCurrentDoc] = useState<Document>({ id: '', title: '', type: 'PDF', date: '', content: '', url: '' });

    useEffect(() => {
        loadDocs();
    }, [clientId]);

    const loadDocs = async () => {
        const docs = await DB.getDocuments(clientId);
        setDocuments(docs);
    };

    const handleSave = async () => {
        if (!currentDoc.title) {
            alert("O título é obrigatório.");
            return;
        }
        if (currentDoc.type !== 'HTML' && !currentDoc.url) {
            alert("A URL do documento é obrigatória.");
            return;
        }

        const newDoc = {
            ...currentDoc,
            id: currentDoc.id || Date.now().toString(),
            date: currentDoc.date || new Date().toISOString().split('T')[0]
        };
        await DB.saveDocument(clientId, newDoc);
        loadDocs();
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza?')) {
            await DB.deleteDocument(clientId, id);
            loadDocs();
        }
    };

    const handleOpen = (doc: Document) => {
        if (doc.url) {
            window.open(doc.url, '_blank');
        } else if (doc.content) {
            const blob = new Blob([doc.content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'PDF': return <FileText size={24} />;
            case 'Word': return <FileText size={24} />;
            case 'Excel': return <FileSpreadsheet size={24} />;
            case 'Slide': return <FileVideo size={24} />;
            case 'Link': return <LinkIcon size={24} />;
            case 'HTML': return <Code size={24} />;
            default: return <FileText size={24} />;
        }
    };

    return (
        <div className="fade-in max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold font-serif">Documentos</h2>
                {user?.role === 'admin' && (
                    <Button onClick={() => { setCurrentDoc({ id: '', title: '', type: 'PDF', date: new Date().toISOString().split('T')[0], url: '' }); setIsModalOpen(true); }}>
                        <FilePlus size={18} /> Novo Documento
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map(doc => (
                    <div key={doc.id} className="card-v4 p-6 flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-lg bg-[#00e800]/10 text-[#00e800]">
                                    {getIcon(doc.type)}
                                </div>
                                {user?.role === 'admin' && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setCurrentDoc(doc); setIsModalOpen(true); }} className="p-2 hover:text-[#00e800]"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(doc.id)} className="p-2 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{doc.title}</h3>
                            <p className="text-xs text-slate-500">Adicionado em {new Date(doc.date).toLocaleDateString()} • {doc.type}</p>
                        </div>
                        <Button className="w-full mt-6" variant="secondary" onClick={() => handleOpen(doc)}>
                            <Eye size={18} /> Visualizar
                        </Button>
                    </div>
                ))}
                {documents.length === 0 && <p className="col-span-3 text-center text-slate-500">Nenhum documento encontrado.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentDoc.id ? "Editar Documento" : "Novo Documento"} maxWidth="max-w-2xl" footer={<Button className="w-full mt-4" onClick={handleSave}>Salvar</Button>}>
                <div className="space-y-4">
                    <Input label="Título" value={currentDoc.title} onChange={(e: any) => setCurrentDoc({ ...currentDoc, title: e.target.value })} placeholder="Ex: Contrato Social" />

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Tipo de Documento</label>
                        <select
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-[#00e800] focus:outline-none"
                            value={currentDoc.type}
                            onChange={(e) => setCurrentDoc({ ...currentDoc, type: e.target.value as any })}
                        >
                            <option value="PDF">PDF (Documento)</option>
                            <option value="Word">Word (Texto)</option>
                            <option value="Excel">Excel (Planilha)</option>
                            <option value="Slide">PowerPoint/Slide</option>
                            <option value="Link">Link Externo (Drive/Site)</option>
                            <option value="HTML">HTML (Nativo)</option>
                        </select>
                    </div>

                    {currentDoc.type === 'HTML' ? (
                        <Input label="Conteúdo (HTML)" textarea rows={10} value={currentDoc.content} onChange={(e: any) => setCurrentDoc({ ...currentDoc, content: e.target.value })} />
                    ) : (
                        <Input label="Link do Documento (URL)" value={currentDoc.url || ''} onChange={(e: any) => setCurrentDoc({ ...currentDoc, url: e.target.value })} placeholder="https://drive.google.com/..." />
                    )}


                </div>
            </Modal>
        </div>
    );
};
