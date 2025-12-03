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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var types_1 = require("../types");
var courthouses_1 = require("../data/courthouses");
var supabaseClient_1 = require("../supabaseClient");
var NotificationContext_1 = require("../contexts/NotificationContext");
var AlertContext_1 = require("../contexts/AlertContext");
var CreateJob = function (_a) {
    var user = _a.user;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var showNotification = (0, NotificationContext_1.useNotification)().showNotification;
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)({
        title: '',
        type: types_1.JobType.DURUSMA,
        city: 'İstanbul',
        courthouse: '',
        date: '',
        time: '',
        fee: '',
        description: '',
        isUrgent: false
    }), formData = _c[0], setFormData = _c[1];
    (0, react_1.useEffect)(function () {
        var cityCourthouses = courthouses_1.COURTHOUSES[formData.city] || [];
        if (!cityCourthouses.includes(formData.courthouse)) {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { courthouse: cityCourthouses[0] || '' })); });
        }
    }, [formData.city]);
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var deadlineMinutes, deadlineDate, today, _a, todayJobCount, countError, _b, year, month, day, _c, hour, minute, jobDate, error, apiUrl, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    deadlineMinutes = formData.isUrgent ? 5 : 15;
                    deadlineDate = new Date();
                    deadlineDate.setMinutes(deadlineDate.getMinutes() + deadlineMinutes);
                    today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('jobs')
                            .select('*', { count: 'exact', head: true })
                            .eq('created_by', user.uid)
                            .gte('created_at', today.toISOString())];
                case 1:
                    _a = _d.sent(), todayJobCount = _a.count, countError = _a.error;
                    if (countError) {
                        console.error("Error checking job limit:", countError);
                        showNotification('error', "Limit kontrolü yapılırken bir hata oluştu.");
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    if (user.role !== 'admin' && (todayJobCount || 0) >= 10) {
                        showNotification('error', "Günlük görev oluşturma limitine (10) ulaştınız. Yarın tekrar deneyiniz.");
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    _b = formData.date.split('-').map(Number), year = _b[0], month = _b[1], day = _b[2];
                    _c = formData.time.split(':').map(Number), hour = _c[0], minute = _c[1];
                    jobDate = new Date(year, month - 1, day, hour, minute);
                    if (jobDate < new Date()) {
                        showNotification('error', "Geçmiş bir tarihe görev oluşturamazsınız. Lütfen ileri bir tarih ve saat seçiniz.");
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, 5, 6]);
                    return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').insert({
                            title: formData.title,
                            job_type: formData.type,
                            city: formData.city,
                            courthouse: formData.courthouse,
                            date: formData.date,
                            time: formData.time,
                            offered_fee: Number(formData.fee),
                            description: formData.description,
                            created_by: user.uid,
                            owner_name: user.fullName,
                            owner_phone: user.phone || '',
                            status: 'open',
                            applications_count: 0,
                            is_urgent: formData.isUrgent,
                            application_deadline: deadlineDate.toISOString(),
                            // created_at and updated_at are handled by default
                        })];
                case 3:
                    error = (_d.sent()).error;
                    if (error)
                        throw error;
                    apiUrl = import.meta.env.VITE_API_URL || '';
                    fetch("".concat(apiUrl, "/api/notify-new-job"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            city: formData.city,
                            courthouse: formData.courthouse,
                            jobType: formData.type,
                            jobId: null,
                            createdBy: user.uid,
                            date: formData.date,
                            offeredFee: formData.fee
                        })
                    }).catch(function (err) { return console.error("SMS Notification Error:", err); });
                    showAlert({
                        title: "Başarılı!",
                        message: "Göreviniz Başarıyla Yayımlanmıştır",
                        type: "success",
                        confirmText: "Tamam",
                        onConfirm: function () { return navigate('/my-jobs'); }
                    });
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _d.sent();
                    console.error("Error creating job: ", error_1);
                    showNotification('error', "Görev oluşturulurken bir hata oluştu.");
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h2 className="text-3xl font-bold flex items-center relative z-10">
            <lucide_react_1.Briefcase className="mr-3 w-8 h-8"/>
            Yeni Görev Oluştur
          </h2>
          <p className="text-primary-100 mt-2 relative z-10 text-lg">Meslektaşlarınızla paylaşmak için yeni bir görev oluşturun.</p>
        </div>
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Görev Türü</label>
                <select required className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white" value={formData.type} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { type: e.target.value })); }}>
                  {Object.values(types_1.JobType).map(function (t) { return <option key={t} value={t}>{t}</option>; })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Şehir</label>
                <select required className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white" value={formData.city} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { city: e.target.value })); }}>
                  {courthouses_1.TURKISH_CITIES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Adliye / Yer</label>
                <select required className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white" value={formData.courthouse} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { courthouse: e.target.value })); }}>
                  <option value="" disabled>Seçiniz</option>
                  {(courthouses_1.COURTHOUSES[formData.city] || []).map(function (ch) { return (<option key={ch} value={ch}>{ch}</option>); })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ücret (TL)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-500 sm:text-sm font-bold">₺</span>
                  </div>
                  <select required className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-8 focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white" value={formData.fee} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { fee: e.target.value })); }}>
                    <option value="" disabled>Seçiniz</option>
                    {(function () {
            var minFee = 0;
            switch (formData.type) {
                case types_1.JobType.DURUSMA:
                    minFee = 800;
                    break;
                case types_1.JobType.ICRA:
                case types_1.JobType.DOSYA_INCELEME:
                case types_1.JobType.HACIZ:
                case types_1.JobType.DILEKCE:
                    minFee = 700;
                    break;
                case types_1.JobType.DIGER:
                    minFee = 0;
                    break;
                default: minFee = 0;
            }
            var options = [];
            // Special case for 0 start
            if (minFee === 0) {
                options.push(0);
                for (var i = 100; i <= 1500; i += 100) {
                    options.push(i);
                }
            }
            else {
                for (var i = minFee; i <= 1500; i += 100) {
                    options.push(i);
                }
            }
            return options.map(function (amount) { return (<option key={amount} value={amount}>{amount}</option>); });
        })()}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tarih</label>
                <input type="date" required className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white" value={formData.date} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { date: e.target.value })); }}/>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Saat</label>
                <input type="time" required className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white" value={formData.time} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { time: e.target.value })); }}/>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Görev Başlığı</label>
              <input type="text" required placeholder="Örn: 12. Aile Mah. Duruşma Yetki Belgesi" className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white px-4" value={formData.title} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }}/>
            </div>

            <div className={"p-6 rounded-2xl border-2 transition-all duration-300 ".concat(user.isPremium ? 'bg-red-50 border-red-100 hover:border-red-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200', " ")}>
              <div className="flex items-start">
                <div className="flex items-center h-6">
                  <input type="checkbox" id="isUrgent" checked={formData.isUrgent} onChange={function (e) {
            if (!user.isPremium && e.target.checked) {
                showAlert({
                    title: "Premium Özellik",
                    message: "Acil görev oluşturmak Premium özelliklerden biridir. Yükseltmek ister misiniz?",
                    type: "confirm",
                    confirmText: "Premium'a Geç",
                    cancelText: "Vazgeç",
                    onConfirm: function () { return window.location.hash = "#/premium"; }
                });
                return;
            }
            setFormData(__assign(__assign({}, formData), { isUrgent: e.target.checked }));
        }} className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-200"/>
                </div>
                <div className="ml-4 text-sm">
                  <label htmlFor="isUrgent" className="font-bold text-slate-900 flex items-center cursor-pointer text-base">
                    <lucide_react_1.AlertCircle className="w-5 h-5 text-red-500 mr-2"/>
                    Acil Görev
                    {!user.isPremium && <span className="ml-3 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full font-bold shadow-sm">PREMIUM</span>}
                  </label>
                  <p className="text-slate-500 mt-1.5 leading-relaxed">
                    Normal görevlerde başvuru toplama süresi 15 dakikadır. Acil görevlerde bu süre 5 dakikaya düşer ve göreviniz öne çıkarılır.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Açıklama / Notlar</label>
              </div>
              <div className="relative">
                <textarea required rows={4} className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-4 font-medium text-slate-700 transition-all duration-200 hover:bg-white" placeholder="Görev detaylarını buraya yazın..." value={formData.description} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); }}></textarea>
              </div>
            </div>

            <div className="pt-6 flex justify-end border-t border-slate-100 mt-8">
              <button type="button" onClick={function () { return navigate('/dashboard'); }} className="mr-4 px-8 py-3 text-slate-600 hover:text-slate-900 font-bold transition-colors duration-200">İptal</button>
              <button type="submit" disabled={isLoading} className="w-full md:w-auto px-12 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-glow hover:shadow-glow-lg flex items-center justify-center transform hover:-translate-y-0.5">
                {isLoading ? <lucide_react_1.Loader2 className="animate-spin mr-2"/> : <lucide_react_1.Send className="mr-2 w-5 h-5"/>}
                Görevi Yayınla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
};
exports.default = CreateJob;
