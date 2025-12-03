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
var AdminJobDetail = function () {
    var jobId = (0, react_router_dom_1.useParams)().jobId;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    // Modal states (simplified for this implementation)
    var _c = (0, react_1.useState)(false), isStatusModalOpen = _c[0], setIsStatusModalOpen = _c[1];
    var _d = (0, react_1.useState)(''), selectedStatus = _d[0], setSelectedStatus = _d[1];
    var _e = (0, react_1.useState)(''), statusReason = _e[0], setStatusReason = _e[1];
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    (0, react_1.useEffect)(function () {
        if (jobId)
            fetchJobDetail(jobId);
    }, [jobId]);
    var fetchJobDetail = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    console.log("Fetching job details for ID:", id);
                    return [4 /*yield*/, adminApi_1.adminApi.getJobDetail(id)];
                case 1:
                    result = _a.sent();
                    setData(result);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    console.error('Error fetching job:', err_1);
                    setError(err_1.message || 'Görev detayları alınamadı');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    var handleStatusUpdate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedStatus || !statusReason || !jobId) {
                        showAlert({ title: "Eksik Bilgi", message: "Lütfen yeni durum ve sebep giriniz.", type: "warning" });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, adminApi_1.adminApi.updateJobStatus(jobId, selectedStatus, statusReason)];
                case 2:
                    _a.sent();
                    showAlert({ title: "Başarılı", message: "Görev durumu güncellendi.", type: "success" });
                    setIsStatusModalOpen(false);
                    setStatusReason('');
                    fetchJobDetail(jobId);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error updating status:', error_1);
                    showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!jobId)
                return [2 /*return*/];
            showAlert({
                title: "Görevi Sil",
                message: "Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
                type: "warning",
                confirmText: "Evet, Sil",
                cancelText: "Vazgeç",
                onConfirm: function () {
                    setTimeout(function () {
                        showAlert({
                            title: "Silme Sebebi",
                            message: "Lütfen silme sebebini belirtin:",
                            type: "warning",
                            inputPlaceholder: "Silme sebebi...",
                            confirmText: "Sil",
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
                                            return [4 /*yield*/, adminApi_1.adminApi.deleteJob(jobId, reason)];
                                        case 2:
                                            _a.sent();
                                            showAlert({
                                                title: "Başarılı",
                                                message: "Görev silindi.",
                                                type: "success",
                                                onConfirm: function () { return navigate('/admin/jobs'); }
                                            });
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_2 = _a.sent();
                                            console.error('Error deleting job:', error_2);
                                            showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }
                        });
                    }, 300);
                }
            });
            return [2 /*return*/];
        });
    }); };
    if (loading)
        return <div className="p-8 text-center">Yükleniyor...</div>;
    if (error)
        return (<div className="p-8 text-center">
            <div className="text-red-500 font-bold mb-2">Hata Oluştu</div>
            <p className="text-gray-600">{error}</p>
            <p className="text-xs text-gray-400 mt-2">Job ID: {jobId}</p>
            <button onClick={function () { return navigate('/admin/jobs'); }} className="mt-4 text-indigo-600 hover:underline">
                Listeye Dön
            </button>
        </div>);
    if (!data)
        return <div className="p-8 text-center">Görev bulunamadı</div>;
    var job = data.job, owner = data.owner, assignedLawyer = data.assignedLawyer, applications = data.applications, history = data.history;
    return (<div className="max-w-7xl mx-auto space-y-6 relative">
            {/* Status Modal */}
            {isStatusModalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Görev Durumunu Değiştir</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Durum</label>
                            <select value={selectedStatus} onChange={function (e) { return setSelectedStatus(e.target.value); }} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border">
                                <option value="">Seçiniz...</option>
                                <option value="open">Açık (Open)</option>
                                <option value="in_progress">Devam Ediyor (In Progress)</option>
                                <option value="completed">Tamamlandı (Completed)</option>
                                <option value="cancelled">İptal Edildi (Cancelled)</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Değişiklik Sebebi</label>
                            <textarea value={statusReason} onChange={function (e) { return setStatusReason(e.target.value); }} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border" rows={3} placeholder="Bu değişikliği neden yapıyorsunuz?"></textarea>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={function () { return setIsStatusModalOpen(false); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                                İptal
                            </button>
                            <button onClick={handleStatusUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>)}

            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                                {job.status === 'open' ? 'AÇIK' :
            job.status === 'in_progress' ? 'DEVAM EDİYOR' :
                job.status === 'completed' ? 'TAMAMLANDI' :
                    job.status === 'cancelled' ? 'İPTAL' : job.status}
                            </span>
                        </div>
                        <p className="text-gray-500">Görev ID: {job.jobId}</p>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={function () {
            setSelectedStatus(job.status);
            setIsStatusModalOpen(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <lucide_react_1.Edit className="w-4 h-4"/>
                            Durum Değiştir
                        </button>
                        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            <lucide_react_1.Trash2 className="w-4 h-4"/>
                            Sil
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <lucide_react_1.Briefcase className="w-5 h-5"/>
                            Görev Bilgileri
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Görev Tipi</p>
                                <p className="font-medium">{job.jobType || 'Belirtilmemiş'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ücret</p>
                                <p className="font-medium">{job.offeredFee} TL</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Konum</p>
                                <p className="font-medium">{job.city} - {job.courthouse}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Oluşturulma Tarihi</p>
                                <p className="font-medium">
                                    {(function () {
            if (!job.createdAt)
                return '-';
            var seconds = job.createdAt.seconds || job.createdAt._seconds;
            if (seconds)
                return new Date(seconds * 1000).toLocaleDateString('tr-TR');
            return new Date(job.createdAt).toLocaleDateString('tr-TR');
        })()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">Açıklama</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{job.description}</p>
                        </div>
                    </div>

                    {/* Applications */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Başvurular ({applications.length})</h2>
                        {applications.length === 0 ? (<p className="text-gray-500">Henüz başvuru yok.</p>) : (<div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-4 py-2">Avukat</th>
                                            <th className="px-4 py-2">Teklif</th>
                                            <th className="px-4 py-2">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(function (app, idx) { return (<tr key={idx} className="border-b">
                                                <td className="px-4 py-2">{app.applicantName}</td>
                                                <td className="px-4 py-2">{app.proposedFee} TL</td>
                                                <td className="px-4 py-2">{app.status}</td>
                                            </tr>); })}
                                    </tbody>
                                </table>
                            </div>)}
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <lucide_react_1.Clock className="w-5 h-5"/>
                            İşlem Geçmişi
                        </h2>
                        <div className="space-y-4">
                            {history.map(function (item, index) { return (<div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-indigo-600"></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.action}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.adminEmail} • {(function () {
                var _a, _b;
                var seconds = ((_a = item.timestamp) === null || _a === void 0 ? void 0 : _a.seconds) || ((_b = item.timestamp) === null || _b === void 0 ? void 0 : _b._seconds);
                return seconds ? new Date(seconds * 1000).toLocaleString('tr-TR') : '-';
            })()}
                                        </p>
                                        {item.reason && (<p className="text-xs text-gray-500 mt-1">Sebep: {item.reason}</p>)}
                                    </div>
                                </div>); })}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Owner */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <lucide_react_1.User className="w-5 h-5"/>
                            İlan Sahibi
                        </h2>
                        {owner ? (<div className="space-y-3">
                                <p className="font-medium text-indigo-600 cursor-pointer" onClick={function () { return navigate("/admin/users/".concat(owner.uid)); }}>
                                    {owner.fullName}
                                </p>
                                <p className="text-sm text-gray-600">{owner.email}</p>
                                <p className="text-sm text-gray-600">{owner.phone}</p>
                                <p className="text-sm text-gray-600">{owner.baroCity} Barosu</p>
                            </div>) : (<p className="text-gray-500">Kullanıcı bulunamadı</p>)}
                    </div>

                    {/* Assigned Lawyer */}
                    {assignedLawyer && (<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <lucide_react_1.User className="w-5 h-5"/>
                                Atanan Avukat
                            </h2>
                            <div className="space-y-3">
                                <p className="font-medium text-indigo-600 cursor-pointer" onClick={function () { return navigate("/admin/users/".concat(assignedLawyer.uid)); }}>
                                    {assignedLawyer.fullName}
                                </p>
                                <p className="text-sm text-gray-600">{assignedLawyer.email}</p>
                                <p className="text-sm text-gray-600">{assignedLawyer.phone}</p>
                            </div>
                        </div>)}
                </div>
            </div>
        </div>);
};
exports.default = AdminJobDetail;
