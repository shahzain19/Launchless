import { useState, useCallback } from 'react';
import type { Toast } from '../components/Toast';

interface ErrorContext {
  code?: string;
  details?: string;
  action?: () => void;
  actionLabel?: string;
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { ...toast, id }]);
        
        // Auto-remove after duration (default 5s for errors, 3s for others)
        const duration = toast.duration || (toast.type === 'error' ? 5000 : 3000);
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const success = useCallback((message: string, duration?: number) => {
        addToast({ type: 'success', message, duration });
    }, [addToast]);

    const error = useCallback((message: string, context?: ErrorContext, duration?: number) => {
        let errorMessage = message;
        
        // Enhanced error message based on context
        if (context?.code) {
            switch (context.code) {
                case 'NETWORK_ERROR':
                    errorMessage = 'Network connection failed. Please check your internet connection.';
                    break;
                case 'AUTH_ERROR':
                    errorMessage = 'Authentication failed. Please log in again.';
                    break;
                case 'RATE_LIMIT':
                    errorMessage = 'Too many requests. Please wait a moment before trying again.';
                    break;
                case 'SERVER_ERROR':
                    errorMessage = 'Server error occurred. Our team has been notified.';
                    break;
                case 'VALIDATION_ERROR':
                    errorMessage = `Validation failed: ${context.details || message}`;
                    break;
                default:
                    errorMessage = message;
            }
        }

        addToast({ 
            type: 'error', 
            message: errorMessage, 
            duration: duration || 0, // Errors persist until dismissed
            action: context?.action,
            actionLabel: context?.actionLabel
        });
    }, [addToast]);

    const warning = useCallback((message: string, duration?: number) => {
        addToast({ type: 'warning', message, duration });
    }, [addToast]);

    const info = useCallback((message: string, duration?: number) => {
        addToast({ type: 'info', message, duration });
    }, [addToast]);

    const loading = useCallback((message: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { 
            type: 'info', 
            message, 
            id, 
            duration: 0, // Loading toasts don't auto-dismiss
            isLoading: true 
        }]);
        return id; // Return ID so caller can dismiss it
    }, []);

    // Handle different error types automatically
    const handleError = useCallback((error: any, context?: Partial<ErrorContext>) => {
        let errorCode = 'UNKNOWN_ERROR';
        let errorMessage = 'An unexpected error occurred';

        if (error?.response) {
            // HTTP error
            const status = error.response.status;
            switch (status) {
                case 401:
                    errorCode = 'AUTH_ERROR';
                    break;
                case 403:
                    errorCode = 'PERMISSION_ERROR';
                    errorMessage = 'You don\'t have permission to perform this action';
                    break;
                case 404:
                    errorCode = 'NOT_FOUND';
                    errorMessage = 'The requested resource was not found';
                    break;
                case 429:
                    errorCode = 'RATE_LIMIT';
                    break;
                case 500:
                    errorCode = 'SERVER_ERROR';
                    break;
                default:
                    errorMessage = error.response.data?.message || errorMessage;
            }
        } else if (error?.code === 'NETWORK_ERROR' || !navigator.onLine) {
            errorCode = 'NETWORK_ERROR';
        } else if (error?.message) {
            errorMessage = error.message;
        }

        error(errorMessage, { code: errorCode, ...context });
    }, [error]);

    return {
        toasts,
        removeToast,
        clearAll,
        success,
        error,
        warning,
        info,
        loading,
        handleError
    };
}