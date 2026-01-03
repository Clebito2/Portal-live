import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    maxWidth?: string;
    footer?: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = "max-w-md" }: ModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay fade-in">
            <div className={`bg-[#0a253a] rounded-xl border border-slate-700 w-full ${maxWidth} flex flex-col max-h-[75vh] my-auto`}>
                <div className="p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
                    <h3 className="text-xl font-bold text-white font-serif">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
                {footer && (
                    <div className="p-4 border-t border-slate-700 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
