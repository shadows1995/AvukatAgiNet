"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProvider = exports.useNotification = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var NotificationContext = (0, react_1.createContext)(undefined);
var useNotification = function () {
    var context = (0, react_1.useContext)(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};
exports.useNotification = useNotification;
var NotificationProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), notifications = _b[0], setNotifications = _b[1];
    var showNotification = function (type, message) {
        var id = Date.now().toString();
        setNotifications(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{ id: id, type: type, message: message }], false); });
        // Auto-remove after 5 seconds
        setTimeout(function () {
            setNotifications(function (prev) { return prev.filter(function (n) { return n.id !== id; }); });
        }, 5000);
    };
    var removeNotification = function (id) {
        setNotifications(function (prev) { return prev.filter(function (n) { return n.id !== id; }); });
    };
    var getIcon = function (type) {
        switch (type) {
            case 'success': return <lucide_react_1.CheckCircle className="w-5 h-5"/>;
            case 'error': return <lucide_react_1.AlertCircle className="w-5 h-5"/>;
            case 'warning': return <lucide_react_1.AlertTriangle className="w-5 h-5"/>;
            case 'info': return <lucide_react_1.Info className="w-5 h-5"/>;
        }
    };
    var getStyles = function (type) {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-500 text-green-800';
            case 'error': return 'bg-red-50 border-red-500 text-red-800';
            case 'warning': return 'bg-amber-50 border-amber-500 text-amber-800';
            case 'info': return 'bg-blue-50 border-blue-500 text-blue-800';
        }
    };
    return (<NotificationContext.Provider value={{ showNotification: showNotification }}>
            {children}

            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-md">
                {notifications.map(function (notification) { return (<div key={notification.id} className={"".concat(getStyles(notification.type), " border-l-4 p-4 rounded-lg shadow-lg animate-in slide-in-from-right duration-300 flex items-start gap-3")}>
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                        </div>
                        <p className="flex-1 text-sm font-medium">{notification.message}</p>
                        <button onClick={function () { return removeNotification(notification.id); }} className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition">
                            <lucide_react_1.X className="w-4 h-4"/>
                        </button>
                    </div>); })}
            </div>
        </NotificationContext.Provider>);
};
exports.NotificationProvider = NotificationProvider;
