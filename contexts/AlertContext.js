"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertProvider = exports.useAlert = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AlertContext = (0, react_1.createContext)(undefined);
var useAlert = function () {
    var context = (0, react_1.useContext)(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
exports.useAlert = useAlert;
var AlertProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), alert = _b[0], setAlert = _b[1];
    var _c = (0, react_1.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var _d = (0, react_1.useState)(''), inputValue = _d[0], setInputValue = _d[1];
    var showAlert = function (options) {
        setAlert(options);
        setInputValue(options.defaultValue || '');
        setIsOpen(true);
    };
    var hideAlert = function () {
        setIsOpen(false);
        setTimeout(function () {
            setAlert(null);
            setInputValue('');
        }, 300); // Clear after animation
    };
    var handleConfirm = function () {
        if (alert === null || alert === void 0 ? void 0 : alert.onConfirm)
            alert.onConfirm(inputValue);
        hideAlert();
    };
    var handleCancel = function () {
        if (alert === null || alert === void 0 ? void 0 : alert.onCancel)
            alert.onCancel();
        hideAlert();
    };
    var getIcon = function () {
        switch (alert === null || alert === void 0 ? void 0 : alert.type) {
            case 'success': return <lucide_react_1.CheckCircle className="w-12 h-12 text-green-500"/>;
            case 'error': return <lucide_react_1.AlertCircle className="w-12 h-12 text-red-500"/>;
            case 'warning': return <lucide_react_1.AlertTriangle className="w-12 h-12 text-amber-500"/>;
            case 'confirm': return <lucide_react_1.AlertTriangle className="w-12 h-12 text-primary-500"/>;
            default: return <lucide_react_1.Info className="w-12 h-12 text-blue-500"/>;
        }
    };
    var getColorClass = function () {
        switch (alert === null || alert === void 0 ? void 0 : alert.type) {
            case 'success': return 'bg-green-100';
            case 'error': return 'bg-red-100';
            case 'warning': return 'bg-amber-100';
            case 'confirm': return 'bg-primary-100';
            default: return 'bg-blue-100';
        }
    };
    return (<AlertContext.Provider value={{ showAlert: showAlert, hideAlert: hideAlert }}>
            {children}
            {isOpen && alert && (<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={alert.type !== 'confirm' && !alert.inputPlaceholder ? hideAlert : undefined}></div>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        {alert.type !== 'confirm' && !alert.inputPlaceholder && (<button onClick={hideAlert} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                                <lucide_react_1.X className="w-5 h-5"/>
                            </button>)}

                        <div className="flex flex-col items-center text-center">
                            <div className={"w-20 h-20 rounded-full flex items-center justify-center mb-4 ".concat(getColorClass())}>
                                {getIcon()}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{alert.title}</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {alert.message}
                            </p>

                            {alert.inputPlaceholder && (<div className="w-full mb-6">
                                    <input type="text" value={inputValue} onChange={function (e) { return setInputValue(e.target.value); }} placeholder={alert.inputPlaceholder} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" autoFocus/>
                                </div>)}

                            <div className="flex w-full gap-3">
                                {(alert.type === 'confirm' || alert.onCancel || alert.inputPlaceholder) && (<button onClick={handleCancel} className="flex-1 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                        {alert.cancelText || 'Vazgeç'}
                                    </button>)}
                                <button onClick={handleConfirm} className={"flex-1 py-3 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ".concat(alert.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                alert.type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-primary-600 hover:bg-primary-700')}>
                                    {alert.confirmText || 'Tamam'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)}
        </AlertContext.Provider>);
};
exports.AlertProvider = AlertProvider;
