import { useEffect } from 'react';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    const getToastStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-500/10 border-green-500/20 text-green-400';
            case 'error':
                return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'info':
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            default:
                return 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400';
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'info':
                return 'ℹ️';
            default:
                return '';
        }
    };

    return (
        <div className={`
            ${getToastStyles()}
            border rounded-lg px-4 py-3 text-sm
            animate-in slide-in-from-right-full duration-300
            flex items-center gap-3
            shadow-lg backdrop-blur-sm
        `}>
            <span>{getIcon()}</span>
            <span className="flex-1">{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-current opacity-70 hover:opacity-100 transition-opacity"
            >
                ✕
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={removeToast}
                />
            ))}
        </div>
    );
}