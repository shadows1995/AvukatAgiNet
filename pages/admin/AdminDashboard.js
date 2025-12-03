"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var adminApi_1 = require("../../services/adminApi");
var AdminDashboard = function () {
    var _a = (0, react_1.useState)(null), stats = _a[0], setStats = _a[1];
    var _b = (0, react_1.useState)(null), botEnabled = _b[0], setBotEnabled = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)(false), togglingBot = _e[0], setTogglingBot = _e[1];
    (0, react_1.useEffect)(function () {
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, statsData, botData, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, Promise.all([
                                adminApi_1.adminApi.getDashboardStats(),
                                adminApi_1.adminApi.getBotStatus()
                            ])];
                    case 1:
                        _a = _b.sent(), statsData = _a[0], botData = _a[1];
                        setStats(statsData);
                        setBotEnabled(botData.enabled);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _b.sent();
                        console.error(err_1);
                        setError('Veriler yüklenirken hata oluştu.');
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, []);
    var handleToggleBot = function () { return __awaiter(void 0, void 0, void 0, function () {
        var newState, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (botEnabled === null)
                        return [2 /*return*/];
                    setTogglingBot(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    newState = !botEnabled;
                    return [4 /*yield*/, adminApi_1.adminApi.updateBotStatus(newState)];
                case 2:
                    _a.sent();
                    setBotEnabled(newState);
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    console.error("Error toggling bot:", err_2);
                    alert("Bot durumu değiştirilemedi.");
                    return [3 /*break*/, 5];
                case 4:
                    setTogglingBot(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return <div className="p-8 text-center">Yükleniyor...</div>;
    }
    if (error) {
        return (<div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                <lucide_react_1.AlertCircle className="w-5 h-5 mr-2"/>
                {error}
            </div>);
    }
    if (!stats)
        return null;
    return (<div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Sistemin genel durumuna hızlı bakış</p>
                </div>

                {/* Bot Control Panel */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
                    <div className={"p-3 rounded-lg ".concat(botEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500')}>
                        <lucide_react_1.Bot className="w-6 h-6"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Otomatik Görev Botu</h3>
                        <p className="text-xs text-gray-500">
                            {botEnabled ? 'Aktif - Görev oluşturuyor' : 'Pasif - Devre dışı'}
                        </p>
                    </div>
                    <button onClick={handleToggleBot} disabled={togglingBot} className={"ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ".concat(botEnabled ? 'bg-green-500' : 'bg-gray-200')}>
                        <span className="sr-only">Botu Aç/Kapat</span>
                        <span aria-hidden="true" className={"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ".concat(botEnabled ? 'translate-x-5' : 'translate-x-0')}/>
                    </button>
                </div>
            </div>

            {/* Today's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Bugün Açılan Görev</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.today.jobsCreated}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <lucide_react_1.Briefcase className="w-6 h-6 text-indigo-600"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Bugün Tamamlanan</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.today.jobsCompleted}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <lucide_react_1.CheckCircle className="w-6 h-6 text-green-600"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Aktif Kullanıcılar</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.today.activeUsers}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <lucide_react_1.Users className="w-6 h-6 text-blue-600"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Yeni Üyeler</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.today.newUsers}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <lucide_react_1.TrendingUp className="w-6 h-6 text-purple-600"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <lucide_react_1.Activity className="w-5 h-5 mr-2 text-gray-500"/>
                    Genel İstatistikler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Toplam Kullanıcı</p>
                        <p className="text-xl font-bold text-gray-900">{stats.totals.totalUsers}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Premium Üye</p>
                        <p className="text-xl font-bold text-amber-600">{stats.totals.premiumUsers}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Toplam Görev</p>
                        <p className="text-xl font-bold text-gray-900">{stats.totals.totalJobs}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Açık Görevler</p>
                        <p className="text-xl font-bold text-green-600">{stats.totals.activeJobs}</p>
                    </div>
                </div>
            </div>
        </div>);
};
exports.default = AdminDashboard;
