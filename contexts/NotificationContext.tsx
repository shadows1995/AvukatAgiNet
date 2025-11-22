import React, { createContext, useContext, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
}

interface NotificationContextType {
    showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = (type: NotificationType, message: string) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, type, message }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5" />;
            case 'error': return <AlertCircle className="w-5 h-5" />;
            case 'warning': return <AlertTriangle className="w-5 h-5" />;
            case 'info': return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = (type: NotificationType) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-500 text-green-800';
            case 'error': return 'bg-red-50 border-red-500 text-red-800';
            case 'warning': return 'bg-amber-50 border-amber-500 text-amber-800';
            case 'info': return 'bg-blue-50 border-blue-500 text-blue-800';
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-md">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`${getStyles(notification.type)} border-l-4 p-4 rounded-lg shadow-lg animate-in slide-in-from-right duration-300 flex items-start gap-3`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                        </div>
                        <p className="flex-1 text-sm font-medium">{notification.message}</p>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
