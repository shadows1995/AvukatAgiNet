"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AdminSecurity = function () {
    var _a = (0, react_1.useState)('audit'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)([]), auditLogs = _b[0], setAuditLogs = _b[1];
    var _c = (0, react_1.useState)([]), loginLogs = _c[0], setLoginLogs = _c[1];
    var _d = (0, react_1.useState)([]), blockedIps = _d[0], setBlockedIps = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    // Mock data loading for now - replace with actual API calls when endpoints are ready
    (0, react_1.useEffect)(function () {
        // In a real implementation, you would fetch data based on activeTab
        // For now, we'll just show the structure
    }, [activeTab]);
    return (<div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Güvenlik ve Loglar</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={function () { return setActiveTab('audit'); }} className={"".concat(activeTab === 'audit'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', " whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center")}>
                        <lucide_react_1.Activity className="w-4 h-4 mr-2"/>
                        Audit Logları
                    </button>
                    <button onClick={function () { return setActiveTab('login'); }} className={"".concat(activeTab === 'login'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', " whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center")}>
                        <lucide_react_1.Shield className="w-4 h-4 mr-2"/>
                        Giriş Logları
                    </button>
                    <button onClick={function () { return setActiveTab('ip'); }} className={"".concat(activeTab === 'ip'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', " whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center")}>
                        <lucide_react_1.Lock className="w-4 h-4 mr-2"/>
                        IP Yönetimi
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] p-6">
                {activeTab === 'audit' && (<div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin İşlem Geçmişi</h3>
                        <div className="text-center text-gray-500 py-8">
                            <lucide_react_1.Activity className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                            <p>Henüz işlem kaydı bulunmuyor.</p>
                        </div>
                    </div>)}

                {activeTab === 'login' && (<div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Kullanıcı Giriş Hareketleri</h3>
                        <div className="text-center text-gray-500 py-8">
                            <lucide_react_1.Shield className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                            <p>Henüz giriş kaydı bulunmuyor.</p>
                        </div>
                    </div>)}

                {activeTab === 'ip' && (<div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Engellenen IP Adresleri</h3>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                                IP Engelle
                            </button>
                        </div>
                        <div className="text-center text-gray-500 py-8">
                            <lucide_react_1.Lock className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                            <p>Engellenmiş IP adresi bulunmuyor.</p>
                        </div>
                    </div>)}
            </div>
        </div>);
};
exports.default = AdminSecurity;
