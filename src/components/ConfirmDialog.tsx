import LoadingSpinner from "./LoadingSpinner";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
    variant = 'info'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    button: 'bg-red-600 hover:bg-red-700 text-white',
                    icon: '⚠️'
                };
            case 'warning':
                return {
                    button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                    icon: '⚠️'
                };
            default:
                return {
                    button: 'bg-blue-600 hover:bg-blue-700 text-white',
                    icon: 'ℹ️'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{styles.icon}</span>
                    <h2 className="text-lg font-bold text-black">{title}</h2>
                </div>

                <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${styles.button}`}
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-gray-600 hover:text-black disabled:opacity-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}