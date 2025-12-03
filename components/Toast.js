"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Toast = function (_a) {
    var message = _a.message, type = _a.type, onClose = _a.onClose, _b = _a.duration, duration = _b === void 0 ? 3000 : _b;
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            onClose();
        }, duration);
        return function () { return clearTimeout(timer); };
    }, [duration, onClose]);
    var icons = {
        success: <lucide_react_1.CheckCircle className="w-5 h-5"/>,
        error: <lucide_react_1.XCircle className="w-5 h-5"/>,
        info: <lucide_react_1.Info className="w-5 h-5"/>
    };
    var styles = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200'
    };
    return (<div className="fixed top-4 right-4 z-[200] animate-in slide-in-from-top-5 fade-in duration-300">
            <div className={"flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ".concat(styles[type], " min-w-[320px] max-w-md")}>
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition">
                    <lucide_react_1.X className="w-4 h-4"/>
                </button>
            </div>
        </div>);
};
exports.default = Toast;
