"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var lucide_react_2 = require("lucide-react");
var courthouses_1 = require("../data/courthouses");
var supabaseClient_1 = require("../supabaseClient");
var SettingsPage = function (_a) {
    var _b;
    var user = _a.user, onProfileUpdate = _a.onProfileUpdate;
    var _c = (0, react_1.useState)('personal'), activeTab = _c[0], setActiveTab = _c[1];
    var _d = (0, react_1.useState)(false), isSaving = _d[0], setIsSaving = _d[1];
    // Notification Modal State
    var _e = (0, react_1.useState)({
        isOpen: false, type: 'success', message: ''
    }), statusModal = _e[0], setStatusModal = _e[1];
    var showNotification = function (type, message) {
        setStatusModal({ isOpen: true, type: type, message: message });
    };
    var PersonalInfoTab = function (_a) {
        var showNotification = _a.showNotification;
        var _b = (0, react_1.useState)({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            city: user.city || '',
            jobStatus: user.jobStatus || 'active'
        }), formData = _b[0], setFormData = _b[1];
        var _c = (0, react_1.useState)(false), isDirty = _c[0], setIsDirty = _c[1];
        (0, react_1.useEffect)(function () {
            var hasChanges = formData.fullName !== (user.fullName || '') ||
                formData.email !== (user.email || '') ||
                formData.phone !== (user.phone || '') ||
                formData.city !== (user.city || '') ||
                formData.jobStatus !== (user.jobStatus || 'active');
            setIsDirty(hasChanges);
        }, [formData, user]);
        var handleSavePersonal = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsSaving(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({
                                full_name: formData.fullName,
                                phone: formData.phone,
                                city: formData.city,
                                job_status: formData.jobStatus,
                                email: formData.email
                            }).eq('uid', user.uid)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        showNotification('success', 'Kişisel bilgileriniz başarıyla güncellendi.');
                        onProfileUpdate();
                        setIsDirty(false);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        showNotification('error', 'Güncelleme sırasında bir hata oluştu.');
                        return [3 /*break*/, 5];
                    case 4:
                        setIsSaving(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        var handleCancel = function () {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                jobStatus: user.jobStatus || 'active'
            });
            setIsDirty(false);
        };
        return (<div className="relative space-y-6 animate-in fade-in duration-300">
        {isDirty && (<div className="sticky top-0 z-20 -mx-8 -mt-8 px-8 py-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center mb-6">
            <div className="flex items-center text-indigo-700">
              <lucide_react_2.Info className="w-5 h-5 mr-2"/>
              <span className="font-medium">Kaydedilmemiş değişiklikleriniz var.</span>
            </div>
            <div className="flex space-x-3">
              <button onClick={handleCancel} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-md transition">İptal</button>
              <button onClick={handleSavePersonal} disabled={isSaving} className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm flex items-center transition">{isSaving && <lucide_react_2.Loader2 className="w-3 h-3 animate-spin mr-2"/>} Kaydet</button>
            </div>
          </div>)}

        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-lg font-bold text-slate-800">Kişisel Bilgiler</h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
            <input type="text" value={formData.fullName} disabled className="w-full bg-slate-100 p-3 rounded-lg border border-slate-200 text-slate-500 font-medium cursor-not-allowed"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-Posta</label>
            <input type="email" value={formData.email} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { email: e.target.value })); }} className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-slate-600"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
            <input type="tel" value={formData.phone} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { phone: e.target.value })); }} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">İl</label>
            <select value={formData.city} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { city: e.target.value })); }} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11">
              {courthouses_1.TURKISH_CITIES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
            </select>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-3">Görev Alma Durumu</label>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex space-x-2">
                <button onClick={function () { return setFormData(__assign(__assign({}, formData), { jobStatus: 'active' })); }} className={"px-4 py-1.5 rounded-full text-sm font-medium transition ".concat(formData.jobStatus === 'active' ? 'bg-green-500 text-white shadow-md scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100')}>Açık</button>
                <button onClick={function () { return setFormData(__assign(__assign({}, formData), { jobStatus: 'passive' })); }} className={"px-4 py-1.5 rounded-full text-sm font-medium transition ".concat(formData.jobStatus === 'passive' ? 'bg-red-400 text-white shadow-md scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100')}>Kapalı</button>
              </div>
              <div className={"text-sm font-medium ".concat(formData.jobStatus === 'active' ? 'text-green-600' : 'text-red-500')}>{formData.jobStatus === 'active' ? 'Profiliniz Aktif' : 'Profiliniz Gizli'}</div>
            </div>
          </div>
        </div>
      </div>);
    };
    var CourthousesTab = function (_a) {
        var showNotification = _a.showNotification;
        var _b = (0, react_1.useState)(user.preferredCourthouses || []), preferences = _b[0], setPreferences = _b[1];
        var _c = (0, react_1.useState)(user.city || 'İstanbul'), viewCity = _c[0], setViewCity = _c[1];
        var _d = (0, react_1.useState)(false), isSaving = _d[0], setIsSaving = _d[1];
        var currentCourthouses = courthouses_1.COURTHOUSES[viewCity] || [];
        // Helper to find city of a courthouse
        var getCityFromCourthouse = function (courthouse) {
            for (var _i = 0, _a = Object.entries(courthouses_1.COURTHOUSES); _i < _a.length; _i++) {
                var _b = _a[_i], city = _b[0], courthouses = _b[1];
                if (courthouses.includes(courthouse))
                    return city;
            }
            return undefined;
        };
        var handleToggle = function (courthouse) {
            if (preferences.includes(courthouse)) {
                setPreferences(preferences.filter(function (c) { return c !== courthouse; }));
            }
            else {
                // Check if we are adding a courthouse from a different city
                if (preferences.length > 0) {
                    var firstCourthouseCity = getCityFromCourthouse(preferences[0]);
                    var newCourthouseCity = getCityFromCourthouse(courthouse);
                    if (firstCourthouseCity && newCourthouseCity && firstCourthouseCity !== newCourthouseCity) {
                        // Allow multi-city ONLY for Premium +
                        if (user.membershipType !== 'premium_plus') {
                            showNotification('error', "Birden fazla ilden adliye se\u00E7imi sadece Premium + \u00FCyeler i\u00E7indir. (".concat(firstCourthouseCity, ")"));
                            return;
                        }
                    }
                }
                setPreferences(__spreadArray(__spreadArray([], preferences, true), [courthouse], false));
            }
        };
        var handleSavePreferences = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsSaving(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({ preferred_courthouses: preferences }).eq('uid', user.uid)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        showNotification('success', 'Görev adliyeleriniz kaydedildi.');
                        onProfileUpdate();
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        showNotification('error', 'Kaydedilirken bir hata oluştu.');
                        return [3 /*break*/, 5];
                    case 4:
                        setIsSaving(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return (<div className="space-y-6 animate-in fade-in duration-300">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-lg font-bold text-slate-800">Görev Adliyeleriniz</h3>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <span className="text-sm text-blue-800 font-medium">Şehir:</span>
            <select value={viewCity} onChange={function (e) { return setViewCity(e.target.value); }} className="rounded-lg border-blue-200 text-sm py-1.5 w-full md:w-48">
              {courthouses_1.TURKISH_CITIES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
            </select>
          </div>
          <button onClick={handleSavePreferences} disabled={isSaving} className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition shadow-md w-full md:w-auto flex justify-center items-center">
            {isSaving && <lucide_react_2.Loader2 className="animate-spin h-3 w-3 mr-2"/>} Kaydet
          </button>
        </div>

        {/* Selected Courthouses Summary */}
        {preferences.length > 0 && (<div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
              <lucide_react_2.CheckCircle className="w-4 h-4 mr-2 text-green-500"/>
              Seçili Adliyeler ({preferences.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {preferences.map(function (ch) { return (<span key={ch} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  {ch}
                  <button onClick={function () { return handleToggle(ch); }} className="ml-2 text-green-400 hover:text-green-600 focus:outline-none">
                    <lucide_react_2.X className="w-3 h-3"/>
                  </button>
                </span>); })}
            </div>
          </div>)}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
          {currentCourthouses.map(function (ch) { return (<label key={ch} className={"flex items-center p-3 rounded-lg border cursor-pointer transition ".concat(preferences.includes(ch) ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-200' : 'bg-white border-slate-200 hover:bg-slate-50')}>
              <input type="checkbox" checked={preferences.includes(ch)} onChange={function () { return handleToggle(ch); }} className="w-4 h-4 text-primary-600 rounded border-gray-300 mr-3"/>
              <span className={"text-sm ".concat(preferences.includes(ch) ? 'text-primary-800 font-medium' : 'text-slate-700')}>{ch}</span>
            </label>); })}
        </div>
      </div>);
    };
    var AboutTab = function (_a) {
        var showNotification = _a.showNotification;
        var _b = (0, react_1.useState)(user.aboutMe || ''), about = _b[0], setAbout = _b[1];
        var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
        var save = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({ about_me: about }).eq('uid', user.uid)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        showNotification('success', 'Hakkımda yazısı güncellendi.');
                        onProfileUpdate();
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        showNotification('error', 'Güncellenirken hata oluştu.');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return (<div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Hakkımda</h3>
          <p className="text-sm text-slate-500 mt-1">Profilinizi ziyaret eden meslektaşlarınıza kendinizi tanıtın.</p>
        </div>
        <textarea rows={6} className="w-full rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500" placeholder="Mezuniyetiniz, deneyimleriniz ve çalışma prensiplerinizden bahsedin..." value={about} onChange={function (e) { return setAbout(e.target.value); }}/>
        <div className="flex justify-end">
          <button onClick={save} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>);
    };
    var PasswordChangeTab = function (_a) {
        var showNotification = _a.showNotification;
        var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
        var _c = (0, react_1.useState)(''), confirmPassword = _c[0], setConfirmPassword = _c[1];
        var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
        var handlePasswordChange = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (password !== confirmPassword) {
                            showNotification('error', 'Şifreler eşleşmiyor.');
                            return [2 /*return*/];
                        }
                        if (password.length < 6) {
                            showNotification('error', 'Şifre en az 6 karakter olmalıdır.');
                            return [2 /*return*/];
                        }
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabaseClient_1.supabase.auth.updateUser({ password: password })];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        showNotification('success', 'Şifreniz başarıyla güncellendi.');
                        setPassword('');
                        setConfirmPassword('');
                        return [3 /*break*/, 5];
                    case 3:
                        error_3 = _a.sent();
                        showNotification('error', 'Şifre güncellenirken hata oluştu: ' + error_3.message);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return (<div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Şifre Değiştir</h3>
          <p className="text-sm text-slate-500 mt-1">Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirin.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
          <input type="password" value={password} onChange={function (e) { return setPassword(e.target.value); }} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 h-11" placeholder="••••••••"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
          <input type="password" value={confirmPassword} onChange={function (e) { return setConfirmPassword(e.target.value); }} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 h-11" placeholder="••••••••"/>
        </div>
        <div className="flex justify-end">
          <button onClick={handlePasswordChange} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center">
            {loading && <lucide_react_2.Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </div>
      </div>);
    };
    var SpecializationTab = function (_a) {
        var showNotification = _a.showNotification;
        var _b = (0, react_1.useState)(user.specializations || []), specs = _b[0], setSpecs = _b[1];
        var _c = (0, react_1.useState)(''), input = _c[0], setInput = _c[1];
        var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
        var addSpec = function () {
            if (input && !specs.includes(input)) {
                setSpecs(__spreadArray(__spreadArray([], specs, true), [input], false));
                setInput('');
            }
        };
        var removeSpec = function (s) {
            setSpecs(specs.filter(function (item) { return item !== s; }));
        };
        var save = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({ specializations: specs }).eq('uid', user.uid)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        showNotification('success', 'Uzmanlık alanları güncellendi.');
                        onProfileUpdate();
                        return [3 /*break*/, 5];
                    case 3:
                        e_2 = _a.sent();
                        showNotification('error', 'Güncellenirken hata oluştu.');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return (<div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Uzmanlık Alanları</h3>
          <p className="text-sm text-slate-500 mt-1">Hangi hukuk dallarında yetkin olduğunuzu belirtin.</p>
        </div>
        <div className="flex gap-2">
          <input className="flex-1 rounded-lg border-slate-300" placeholder="Örn: Ceza Hukuku" value={input} onChange={function (e) { return setInput(e.target.value); }} onKeyDown={function (e) { return e.key === 'Enter' && addSpec(); }}/>
          <button onClick={addSpec} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 rounded-lg font-medium">Ekle</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {specs.map(function (s) { return (<span key={s} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              {s}
              <button onClick={function () { return removeSpec(s); }} className="ml-2 text-primary-400 hover:text-red-500"><lucide_react_2.X className="w-3 h-3"/></button>
            </span>); })}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={save} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>);
    };
    var AuthorizationTab = function (_a) {
        var showNotification = _a.showNotification;
        var _b = (0, react_1.useState)({
            baroCity: user.baroCity || '',
            baroNumber: user.baroNumber || '',
            address: user.address || ''
        }), formData = _b[0], setFormData = _b[1];
        var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
        var save = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({
                                baro_city: formData.baroCity,
                                baro_number: formData.baroNumber,
                                address: formData.address
                            }).eq('uid', user.uid)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        showNotification('success', 'Yetki belgesi bilgileri güncellendi.');
                        onProfileUpdate();
                        return [3 /*break*/, 5];
                    case 3:
                        e_3 = _a.sent();
                        console.error(e_3);
                        showNotification('error', "G\u00FCncellenirken hata olu\u015Ftu: ".concat(e_3.message || 'Bilinmeyen hata'));
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return (<div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Yetki Belgesi Bilgileri</h3>
          <p className="text-sm text-slate-500 mt-1">Bu bilgiler, görevi aldığınızda karşı tarafla paylaşılacaktır.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Baro</label>
            <select value={formData.baroCity} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { baroCity: e.target.value })); }} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11">
              <option value="" disabled>Seçiniz</option>
              {courthouses_1.TURKISH_CITIES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Baro Sicil No</label>
            <input type="text" value={formData.baroNumber} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { baroNumber: e.target.value })); }} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11"/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
          <textarea rows={3} className="w-full rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500" placeholder="Ofis adresiniz..." value={formData.address} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { address: e.target.value })); }}/>
        </div>

        <div className="flex justify-end">
          <button onClick={save} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center">
            {loading && <lucide_react_2.Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>);
    };
    var DeleteAccountTab = function (_a) {
        var showNotification = _a.showNotification;
        var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
        var _c = (0, react_1.useState)(''), confirmText = _c[0], setConfirmText = _c[1];
        var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
            var session, token, response, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (confirmText !== 'HESABIMI SİL') {
                            showNotification('error', 'Lütfen onaylamak için "HESABIMI SİL" yazınız.');
                            return [2 /*return*/];
                        }
                        if (!window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir.')) {
                            return [2 /*return*/];
                        }
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, supabaseClient_1.supabase.auth.getSession()];
                    case 2:
                        session = (_a.sent()).data.session;
                        token = session === null || session === void 0 ? void 0 : session.access_token;
                        return [4 /*yield*/, fetch("".concat(import.meta.env.VITE_API_URL || '', "/api/delete-account"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    uid: user.uid,
                                    token: token
                                })
                            })];
                    case 3:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 4:
                        data = _a.sent();
                        if (!response.ok) {
                            throw new Error(data.error || 'Hesap silinirken bir hata oluştu.');
                        }
                        // Sign out locally
                        return [4 /*yield*/, supabaseClient_1.supabase.auth.signOut()];
                    case 5:
                        // Sign out locally
                        _a.sent();
                        window.location.href = '/';
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _a.sent();
                        console.error('Delete account error:', error_4);
                        showNotification('error', error_4.message || 'Bir hata oluştu.');
                        setLoading(false);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        return (<div className="space-y-6 animate-in fade-in">
        <div className="border-b border-red-100 pb-4">
          <h3 className="text-lg font-bold text-red-600">Hesabı Sil</h3>
          <p className="text-sm text-slate-500 mt-1">Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.</p>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <div className="flex items-start mb-4">
            <lucide_react_2.AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5"/>
            <div className="text-sm text-red-800">
              <p className="font-bold mb-1">Dikkat!</p>
              <p>Hesabınızı sildiğinizde:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Tüm profil bilgileriniz silinecek.</li>
                <li>Mevcut başvurularınız iptal edilecek.</li>
                <li>Yayınladığınız görevler sistemden kaldırılacak.</li>
                <li>Premium üyeliğiniz varsa iptal edilecek (iade yapılmaz).</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Onaylamak için aşağıya <span className="font-bold select-all">HESABIMI SİL</span> yazınız:
            </label>
            <input type="text" value={confirmText} onChange={function (e) { return setConfirmText(e.target.value); }} className="w-full rounded-lg border-red-300 focus:ring-red-500 focus:border-red-500 mb-4" placeholder="HESABIMI SİL"/>
            <button onClick={handleDelete} disabled={loading || confirmText !== 'HESABIMI SİL'} className={"w-full py-3 rounded-xl font-bold text-white shadow-md transition flex items-center justify-center ".concat(loading || confirmText !== 'HESABIMI SİL'
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 hover:shadow-lg')}>
              {loading ? (<>
                  <lucide_react_2.Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                  Siliniyor...
                </>) : (<>
                  <lucide_react_2.Trash2 className="w-5 h-5 mr-2"/>
                  Hesabımı Kalıcı Olarak Sil
                </>)}
            </button>
          </div>
        </div>
      </div>);
    };
    var tabs = [
        { id: 'personal', label: 'Kişisel Bilgiler', icon: lucide_react_1.User, component: <PersonalInfoTab showNotification={showNotification}/> },
        { id: 'authorization', label: 'Yetki Belgesi Bilgileri', icon: lucide_react_2.FileText, component: <AuthorizationTab showNotification={showNotification}/> },
        { id: 'courthouses', label: 'Görev Adliyeleriniz', icon: lucide_react_2.Gavel, component: <CourthousesTab showNotification={showNotification}/> },
        { id: 'specialization', label: 'Uzmanlık Alanları', icon: lucide_react_2.Award, component: <SpecializationTab showNotification={showNotification}/> },
        { id: 'about', label: 'Hakkımda', icon: lucide_react_2.Info, component: <AboutTab showNotification={showNotification}/> },
        { id: 'password', label: 'Şifre Değiştir', icon: lucide_react_2.Shield, component: <PasswordChangeTab showNotification={showNotification}/> },
        { id: 'photo', label: 'Profil Fotoğrafı', icon: lucide_react_2.Camera, component: <div className="text-center py-12 text-slate-500">Profil fotoğrafı yükleme modülü yakında eklenecek.</div> },
        { id: 'delete', label: 'Hesabı Sil', icon: lucide_react_2.Trash2, component: <DeleteAccountTab showNotification={showNotification}/> },
    ];
    var ActiveComponent = (_b = tabs.find(function (t) { return t.id === activeTab; })) === null || _b === void 0 ? void 0 : _b.component;
    return (<div className="max-w-7xl mx-auto px-4 py-10 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Hesap Ayarları</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 space-y-2">
          {tabs.map(function (tab) {
            var Icon = tab.icon;
            var isActive = activeTab === tab.id;
            return (<button key={tab.id} onClick={function () { return setActiveTab(tab.id); }} className={"w-full flex items-center p-4 rounded-xl border text-sm font-medium transition duration-200 ".concat(isActive
                    ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-200'
                    : 'bg-white text-primary-500 border-primary-200 hover:bg-primary-50')}>
                <Icon className={"h-5 w-5 mr-3 ".concat(isActive ? 'text-white' : 'text-primary-500')}/>
                {tab.label}
              </button>);
        })}
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[600px] relative overflow-hidden">
            {ActiveComponent}
          </div>
        </div>
      </div>

      {/* STATUS MODAL (Success / Error) */}
      {statusModal.isOpen && (<div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={function () { return setStatusModal(__assign(__assign({}, statusModal), { isOpen: false })); }}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative z-10 text-center">
            <div className={"w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ".concat(statusModal.type === 'success' ? 'bg-green-100' : 'bg-red-100')}>
              {statusModal.type === 'success' ? (<lucide_react_2.CheckCircle className="w-8 h-8 text-green-600"/>) : (<lucide_react_2.AlertTriangle className="w-8 h-8 text-red-600"/>)}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {statusModal.type === 'success' ? 'İşlem Başarılı!' : 'Hata Oluştu'}
            </h3>
            <p className="text-slate-600 mb-6">{statusModal.message}</p>
            <button onClick={function () { return setStatusModal(__assign(__assign({}, statusModal), { isOpen: false })); }} className={"w-full py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-1 ".concat(statusModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')}>
              Tamam
            </button>
          </div>
        </div>)}
    </div>);
};
exports.default = SettingsPage;
