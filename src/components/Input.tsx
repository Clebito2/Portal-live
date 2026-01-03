import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    textarea?: boolean;
    rows?: number;
    [key: string]: any;
}

export const Input = ({ label, textarea, ...props }: InputProps) => (
    <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2 font-semibold">{label}</label>
        {textarea ?
            <textarea className="input-v4 min-h-[100px]" {...props as any} /> :
            <input className="input-v4" {...props as any} />
        }
    </div>
);
