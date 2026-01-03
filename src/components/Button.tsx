import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    children: React.ReactNode; // Explicitly add children back if needed, though ButtonHTMLAttributes has it.
}

export const Button = ({ children, className = "", variant = "primary", ...props }: ButtonProps) => {
    const variants: any = {
        primary: "bg-[#00e800] text-[#06192a] hover:shadow-[0_0_15px_rgba(0,232,0,0.5)] border border-transparent",
        secondary: "bg-transparent text-white border border-[#00e800] hover:bg-[#00e800] hover:text-[#06192a]",
        ghost: "text-slate-400 hover:text-white hover:bg-white/5",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
    };
    return (
        <button className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`} {...props}>
            {props.disabled && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
};
