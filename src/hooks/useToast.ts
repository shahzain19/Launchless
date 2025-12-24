import { useState, useCallback } from 'react';
import type { Toast } from '../components/Toast';

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { ...toast, id }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message: string, duration?: number) => {
        addToast({ type: 'success', message, duration });
    }, [addToast]);

    const error = useCallback((message: string, duration?: number) => {
        addToast({ type: 'error', message, duration });
    }, [addToast]);

    const info = useCallback((message: string, duration?: number) => {
        addToast({ type: 'info', message, duration });
    }, [addToast]);

    return {
        toasts,
        removeToast,
        success,
        error,
        info
    };
}