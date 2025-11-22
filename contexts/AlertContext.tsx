import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface AlertOptions {
    title: string;
    message: string;
    type: AlertType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: (inputValue?: string) => void;
    onCancel?: () => void;
    inputPlaceholder?: string;
    defaultValue?: string;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<AlertOptions | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const showAlert = (options: AlertOptions) => {
        setAlert(options);
        setInputValue(options.defaultValue || '');
        setIsOpen(true);
    };

    const hideAlert = () => {
        setIsOpen(false);
        setTimeout(() => {
            setAlert(null);
            setInputValue('');
        }, 300); // Clear after animation
    };

    const handleConfirm = () => {
        if (alert?.onConfirm) alert.onConfirm(inputValue);
        hideAlert();
    };

    const handleCancel = () => {
        if (alert?.onCancel) alert.onCancel();
        hideAlert();
    };

    const getIcon = () => {
        switch (alert?.type) {
            case 'success': return <CheckCircle className="w-12 h-12 text-green-500" />;
            case 'error': return <AlertCircle className="w-12 h-12 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-12 h-12 text-amber-500" />;
            case 'confirm': return <AlertTriangle className="w-12 h-12 text-primary-500" />;
            default: return <Info className="w-12 h-12 text-blue-500" />;
        }
    };

    const getColorClass = () => {
        switch (alert?.type) {
            case 'success': return 'bg-green-100';
            case 'error': return 'bg-red-100';
            case 'warning': return 'bg-amber-100';
            case 'confirm': return 'bg-primary-100';
            default: return 'bg-blue-100';
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {isOpen && alert && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={alert.type !== 'confirm' && !alert.inputPlaceholder ? hideAlert : undefined}></div>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        {alert.type !== 'confirm' && !alert.inputPlaceholder && (
                            <button
                                onClick={hideAlert}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        <div className="flex flex-col items-center text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${getColorClass()}`}>
                                {getIcon()}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{alert.title}</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {alert.message}
                            </p>

                            {alert.inputPlaceholder && (
                                <div className="w-full mb-6">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={alert.inputPlaceholder}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                            )}

                            <div className="flex w-full gap-3">
                                {(alert.type === 'confirm' || alert.onCancel || alert.inputPlaceholder) && (
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        {alert.cancelText || 'Vazgeç'}
                                    </button>
                                )}
                                <button
                                    onClick={handleConfirm}
                                    className={`flex-1 py-3 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${alert.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                        alert.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                                            'bg-primary-600 hover:bg-primary-700'
                                        }`}
                                >
                                    {alert.confirmText || 'Tamam'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};
