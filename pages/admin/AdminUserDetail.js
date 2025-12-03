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
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var adminApi_1 = require("../../services/adminApi");
var AlertContext_1 = require("../../contexts/AlertContext");
var AdminUserDetail = function () {
    var userId = (0, react_router_dom_1.useParams)().userId;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    (0, react_1.useEffect)(function () {
        if (userId)
            fetchUserDetail(userId);
    }, [userId]);
    var fetchUserDetail = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, adminApi_1.adminApi.getUserDetail(id)];
                case 1:
                    result = _a.sent();
                    setData(result);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching user:', error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    var handleBan = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!userId)
                return [2 /*return*/];
            showAlert({
                title: "Kullanıcıyı Banla",
                message: "Bu kullanıcıyı banlamak istediğinize emin misiniz? Lütfen sebep belirtin.",
                type: "warning",
                inputPlaceholder: "Ban sebebi...",
                confirmText: "Banla",
                cancelText: "Vazgeç",
                onConfirm: function (reason) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!reason)
                                    return [2 /*return*/];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, adminApi_1.adminApi.banUser(userId, { reason: reason, banType: 'permanent' })];
                            case 2:
                                _a.sent();
                                showAlert({ title: "Başarılı", message: "Kullanıcı banlandı.", type: "success" });
                                fetchUserDetail(userId);
                                return [3 /*break*/, 4];
                            case 3:
                                error_2 = _a.sent();
                                console.error(error_2);
                                showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }
            });
            return [2 /*return*/];
        });
    }); };
    var handleUnban = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!userId)
                return [2 /*return*/];
            showAlert({
                title: "Banı Kaldır",
                message: "Kullanıcının banını kaldırmak üzeresiniz. Lütfen sebep belirtin.",
                type: "info",
                inputPlaceholder: "Unban sebebi...",
                confirmText: "Banı Kaldır",
                cancelText: "Vazgeç",
                onConfirm: function (reason) { return __awaiter(void 0, void 0, void 0, function () {
                    var error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!reason)
                                    return [2 /*return*/];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, adminApi_1.adminApi.unbanUser(userId, reason)];
                            case 2:
                                _a.sent();
                                showAlert({ title: "Başarılı", message: "Ban kaldırıldı.", type: "success" });
                                fetchUserDetail(userId);
                                return [3 /*break*/, 4];
                            case 3:
                                error_3 = _a.sent();
                                console.error(error_3);
                                showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }
            });
            return [2 /*return*/];
        });
    }); };
    var handleRoleChange = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!userId)
                return [2 /*return*/];
            showAlert({
                title: "Rol Değiştir",
                message: "Yeni rolü giriniz (free, premium, premium_plus, admin):",
                type: "info",
                inputPlaceholder: "Yeni rol...",
                confirmText: "İlerle",
                cancelText: "Vazgeç",
                onConfirm: function (newRole) {
                    if (!newRole)
                        return;
                    setTimeout(function () {
                        showAlert({
                            title: "Rol Değiştirme Sebebi",
                            message: "Lütfen bu değişiklik için bir sebep belirtin:",
                            type: "info",
                            inputPlaceholder: "Değişiklik sebebi...",
                            confirmText: "Güncelle",
                            cancelText: "Vazgeç",
                            onConfirm: function (reason) { return __awaiter(void 0, void 0, void 0, function () {
                                var error_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!reason)
                                                return [2 /*return*/];
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, adminApi_1.adminApi.changeUserRole(userId, newRole, reason)];
                                        case 2:
                                            _a.sent();
                                            showAlert({ title: "Başarılı", message: "Rol güncellendi.", type: "success" });
                                            fetchUserDetail(userId);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_4 = _a.sent();
                                            console.error(error_4);
                                            showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }
                        });
                    }, 300); // Wait for previous alert to close
                }
            });
            return [2 /*return*/];
        });
    }); };
    if (loading)
        return <div className="p-8 text-center">Yükleniyor...</div>;
    if (!data)
        return <div className="p-8 text-center">Kullanıcı bulunamadı</div>;
    var user = data.user, stats = data.stats, recentLogins = data.recentLogins, activeBans = data.activeBans, assignedJobs = data.assignedJobs, applications = data.applications;
    // Premium Calculations
    var getPremiumDuration = function () {
        if (!user.premium_since)
            return null;
        var start = new Date(user.premium_since);
        var now = new Date();
        var diffTime = Math.abs(now.getTime() - start.getTime());
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    var getPremiumRemaining = function () {
        if (!user.premium_until)
            return null;
        var end = new Date(user.premium_until);
        var now = new Date();
        if (end < now)
            return 0;
        var diffTime = Math.abs(end.getTime() - now.getTime());
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    var premiumDays = getPremiumDuration();
    var remainingDays = getPremiumRemaining();
    return (<div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                            <lucide_react_1.User className="w-8 h-8 text-indigo-600"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.full_name || user.fullName}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                                    {user.role}
                                </span>
                                <span className={"px-2 py-0.5 rounded text-xs font-semibold uppercase ".concat(user.account_status === 'active' || user.accountStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                                    {user.account_status || user.accountStatus}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">ID: {user.uid}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Kayıt Tarihi: {(function () {
            if (!user.created_at && !user.createdAt)
                return '-';
            var dateVal = user.created_at || user.createdAt;
            var seconds = dateVal.seconds || dateVal._seconds;
            if (seconds)
                return new Date(seconds * 1000).toLocaleDateString('tr-TR');
            return new Date(dateVal).toLocaleDateString('tr-TR');
        })()}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {(user.account_status === 'banned' || user.accountStatus === 'banned') ? (<button onClick={handleUnban} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                <lucide_react_1.CheckCircle className="w-4 h-4"/> Banı Kaldır
                            </button>) : (<button onClick={handleBan} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                <lucide_react_1.Ban className="w-4 h-4"/> Banla
                            </button>)}
                        <button onClick={handleRoleChange} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <lucide_react_1.Edit className="w-4 h-4"/> Rol Değiştir
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Açılan Görev</p>
                    <p className="text-2xl font-bold">{stats.jobsCreated}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Tamamlanan</p>
                    <p className="text-2xl font-bold">{stats.jobsCompleted}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Devam Eden</p>
                    <p className="text-2xl font-bold">{stats.jobsInProgress}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Toplam Kazanç</p>
                    <p className="text-2xl font-bold">{stats.totalEarnings} TL</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Login History */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Son Girişler</h2>
                        {recentLogins.length === 0 ? (<p className="text-gray-500">Kayıt yok.</p>) : (<table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-4 py-2">Tarih</th>
                                        <th className="px-4 py-2">IP</th>
                                        <th className="px-4 py-2">User Agent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLogins.map(function (log, idx) { return (<tr key={idx} className="border-b">
                                            <td className="px-4 py-2">
                                                {(function () {
                    var _a, _b;
                    var seconds = ((_a = log.timestamp) === null || _a === void 0 ? void 0 : _a.seconds) || ((_b = log.timestamp) === null || _b === void 0 ? void 0 : _b._seconds);
                    return seconds ? new Date(seconds * 1000).toLocaleString('tr-TR') : '-';
                })()}
                                            </td>
                                            <td className="px-4 py-2 font-mono">{log.ipAddress}</td>
                                            <td className="px-4 py-2 truncate max-w-xs">{log.userAgent}</td>
                                        </tr>); })}
                                </tbody>
                            </table>)}
                    </div>

                    {/* Assigned Jobs */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Aldığı Görevler ({(assignedJobs === null || assignedJobs === void 0 ? void 0 : assignedJobs.length) || 0})</h2>
                        {(assignedJobs === null || assignedJobs === void 0 ? void 0 : assignedJobs.length) === 0 ? (<p className="text-gray-500">Henüz görev almadı.</p>) : (<div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-4 py-2">Başlık</th>
                                            <th className="px-4 py-2">Şehir/Adliye</th>
                                            <th className="px-4 py-2">Durum</th>
                                            <th className="px-4 py-2">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedJobs === null || assignedJobs === void 0 ? void 0 : assignedJobs.map(function (job) { return (<tr key={job.job_id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={function () { return navigate("/admin/jobs/".concat(job.job_id)); }}>
                                                <td className="px-4 py-2 font-medium text-indigo-600">{job.title}</td>
                                                <td className="px-4 py-2">{job.city} / {job.courthouse}</td>
                                                <td className="px-4 py-2">
                                                    <span className={"px-2 py-1 rounded text-xs font-semibold uppercase ".concat(job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800')}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {new Date(job.created_at).toLocaleDateString('tr-TR')}
                                                </td>
                                            </tr>); })}
                                    </tbody>
                                </table>
                            </div>)}
                    </div>

                    {/* Applications */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Başvurular ({(applications === null || applications === void 0 ? void 0 : applications.length) || 0})</h2>
                        {(applications === null || applications === void 0 ? void 0 : applications.length) === 0 ? (<p className="text-gray-500">Henüz başvuru yapmadı.</p>) : (<div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-4 py-2">Görev</th>
                                            <th className="px-4 py-2">Teklif</th>
                                            <th className="px-4 py-2">Durum</th>
                                            <th className="px-4 py-2">Tarih</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications === null || applications === void 0 ? void 0 : applications.map(function (app) {
                var _a;
                return (<tr key={app.application_id} className="border-b">
                                                <td className="px-4 py-2 font-medium">
                                                    {((_a = app.jobs) === null || _a === void 0 ? void 0 : _a.title) || 'Silinmiş Görev'}
                                                </td>
                                                <td className="px-4 py-2">{app.proposed_fee} TL</td>
                                                <td className="px-4 py-2">
                                                    <span className={"px-2 py-1 rounded text-xs font-semibold uppercase ".concat(app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800')}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {new Date(app.created_at).toLocaleDateString('tr-TR')}
                                                </td>
                                            </tr>);
            })}
                                    </tbody>
                                </table>
                            </div>)}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-6">
                    {/* Premium Details */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <lucide_react_1.Shield className="w-5 h-5 text-indigo-600"/>
                            Üyelik Detayları
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Üyelik Tipi</p>
                                <p className="font-medium uppercase text-indigo-600">{user.membership_type || user.membershipType || 'Free'}</p>
                            </div>

                            {(user.membership_type === 'premium' || user.membership_type === 'premium_plus' || user.membershipType === 'premium' || user.membershipType === 'premium_plus') && (<>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Başlangıç</p>
                                            <p className="font-medium">
                                                {user.premium_since || user.premiumSince ? new Date(user.premium_since || user.premiumSince).toLocaleDateString('tr-TR') : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Bitiş</p>
                                            <p className="font-medium">
                                                {user.premium_until || user.premiumUntil ? new Date(user.premium_until || user.premiumUntil).toLocaleDateString('tr-TR') : 'Süresiz'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">Geçen Süre</span>
                                            <span className="font-bold text-gray-900">{premiumDays || 0} Gün</span>
                                        </div>
                                        {remainingDays !== null && (<div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Kalan Süre</span>
                                                <span className="font-bold text-green-600">{remainingDays} Gün</span>
                                            </div>)}
                                    </div>
                                </>)}

                            {(user.membership_type === 'free' || (!user.membership_type && !user.membershipType) || user.membershipType === 'free') && (<div className="p-3 bg-gray-50 rounded text-sm text-gray-500 text-center">
                                    Kullanıcı premium üye değil.
                                </div>)}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">İletişim</h2>
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <lucide_react_1.Mail className="w-5 h-5 text-gray-400"/>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <lucide_react_1.Phone className="w-5 h-5 text-gray-400"/>
                                <div>
                                    <p className="text-sm text-gray-500">Telefon</p>
                                    <p className="font-medium">{user.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <lucide_react_1.MapPin className="w-5 h-5 text-gray-400"/>
                                <div>
                                    <p className="text-sm text-gray-500">Baro</p>
                                    <p className="font-medium">{user.baro_city || user.baroCity} - {user.baro_number || user.baroNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};
exports.default = AdminUserDetail;
