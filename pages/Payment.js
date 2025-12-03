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
var supabaseClient_1 = require("../supabaseClient");
var AlertContext_1 = require("../contexts/AlertContext");
var axios_1 = require("axios");
var PaymentPage = function (_a) {
    var onPaymentSuccess = _a.onPaymentSuccess;
    var location = (0, react_router_dom_1.useLocation)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = location.state || { plan: 'premium', price: 249, period: 'monthly' }, plan = _b.plan, price = _b.price, period = _b.period;
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    var _d = (0, react_1.useState)(false), agreementAccepted = _d[0], setAgreementAccepted = _d[1];
    var _e = (0, react_1.useState)({
        fullName: '',
        address: '',
        tcId: ''
    }), billingInfo = _e[0], setBillingInfo = _e[1];
    var _f = (0, react_1.useState)({
        holderName: '',
        number: '',
        expDate: '',
        cvc: ''
    }), cardInfo = _f[0], setCardInfo = _f[1];
    var handlePayment = function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, expMonth, expYear, apiUrl, response, result, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!agreementAccepted) {
                        showAlert({
                            title: "Uyarı",
                            message: "Lütfen Mesafeli Satış Sözleşmesi ve Kullanım Şartları'nı onaylayınız.",
                            type: "warning",
                            confirmText: "Tamam"
                        });
                        return [2 /*return*/];
                    }
                    if (!billingInfo.fullName || !billingInfo.address || !billingInfo.tcId) {
                        showAlert({
                            title: "Eksik Bilgi",
                            message: "Lütfen tüm fatura bilgilerini doldurunuz.",
                            type: "warning",
                            confirmText: "Tamam"
                        });
                        return [2 /*return*/];
                    }
                    if (!cardInfo.holderName || !cardInfo.number || !cardInfo.expDate || !cardInfo.cvc) {
                        showAlert({
                            title: "Eksik Bilgi",
                            message: "Lütfen tüm kart bilgilerini doldurunuz.",
                            type: "warning",
                            confirmText: "Tamam"
                        });
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                case 1:
                    user = (_b.sent()).data.user;
                    if (!user) {
                        showAlert({
                            title: "Hata",
                            message: "Oturum açmanız gerekiyor.",
                            type: "error",
                            confirmText: "Tamam"
                        });
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, 5, 6]);
                    _a = cardInfo.expDate.split('/'), expMonth = _a[0], expYear = _a[1];
                    if (!expMonth || !expYear || expMonth.length !== 2 || expYear.length !== 2) {
                        throw new Error("Son kullanma tarihi AA/YY formatında olmalıdır.");
                    }
                    apiUrl = import.meta.env.VITE_API_URL || '';
                    return [4 /*yield*/, axios_1.default.post("".concat(apiUrl, "/api/garanti/test-sale"), {
                            amount: price.toString(),
                            cardNumber: cardInfo.number.replace(/\s/g, ''),
                            expMonth: expMonth,
                            expYear: expYear,
                            cvv: cardInfo.cvc,
                            email: user.email,
                            userId: user.id, // Pass user ID for backend update
                            plan: plan,
                            period: period,
                            billingInfo: billingInfo
                        })];
                case 3:
                    response = _b.sent();
                    result = response.data;
                    if (!result.approved) {
                        throw new Error(result.errorMsg || result.message || "Ödeme reddedildi.");
                    }
                    // Client-side update removed as it is now handled by the backend securely.
                    // We just show success message.
                    showAlert({
                        title: "Ödeme Başarılı!",
                        message: "Üyeliğiniz başarıyla güncellendi.",
                        type: "success",
                        confirmText: "Tamam",
                        onConfirm: function () {
                            if (onPaymentSuccess)
                                onPaymentSuccess();
                            navigate('/payment-success', {
                                state: { plan: plan, period: period }
                            });
                        }
                    });
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _b.sent();
                    console.error("Payment error:", error_1);
                    showAlert({
                        title: "Ödeme Başarısız",
                        message: error_1.message || "Ödeme sırasında bir hata oluştu.",
                        type: "error",
                        confirmText: "Tamam"
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={function () { return navigate('/premium'); }} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium">
                    <lucide_react_1.ArrowLeft className="w-5 h-5 mr-2"/>
                    Paketlere Geri Dön
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">Ödeme Bilgileri</h2>
                    <p className="mt-2 text-lg text-slate-600">Güvenli ödeme altyapısı ile işleminizi tamamlayın.</p>
                </div>

                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/10 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white/90 uppercase tracking-wider mb-8 border-b border-white/10 pb-4">Sipariş Özeti</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center group">
                                    <span className="text-primary-100 font-medium group-hover:text-white transition-colors">Paket</span>
                                    <span className="font-bold text-lg">{plan === 'premium_plus' ? 'Premium Plus' : 'Premium'}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-primary-100 font-medium group-hover:text-white transition-colors">Periyot</span>
                                    <span className="font-bold text-lg">{period === 'monthly' ? 'Aylık' : 'Yıllık'}</span>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-xl font-bold text-white/90">Toplam</span>
                                    <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">{price} TL</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 relative z-10 space-y-3 bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center text-sm text-primary-100">
                                <lucide_react_1.ShieldCheck className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0"/>
                                <span>256-bit SSL Koruması</span>
                            </div>
                            <div className="flex items-center text-sm text-primary-100">
                                <lucide_react_1.Lock className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0"/>
                                <span>Güvenli Ödeme Altyapısı</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="p-8 md:p-10 md:w-3/5 bg-white">
                        <form onSubmit={function (e) { e.preventDefault(); handlePayment(); }} className="space-y-6">

                            {/* Billing Info */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800">Fatura Bilgileri</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                                    <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="Ad Soyad" value={billingInfo.fullName} onChange={function (e) { return setBillingInfo(__assign(__assign({}, billingInfo), { fullName: e.target.value })); }}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">TC Kimlik No</label>
                                    <input type="text" required maxLength={11} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="11 Haneli TC Kimlik No" value={billingInfo.tcId} onChange={function (e) { return setBillingInfo(__assign(__assign({}, billingInfo), { tcId: e.target.value.replace(/\D/g, '') })); }}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
                                    <textarea required rows={2} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3" placeholder="Fatura Adresi" value={billingInfo.address} onChange={function (e) { return setBillingInfo(__assign(__assign({}, billingInfo), { address: e.target.value })); }}></textarea>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Kart Bilgileri</h3>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kart Üzerindeki İsim</label>
                                <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="Ad Soyad" value={cardInfo.holderName} onChange={function (e) { return setCardInfo(__assign(__assign({}, cardInfo), { holderName: e.target.value })); }}/>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kart Numarası</label>
                                <div className="relative">
                                    <lucide_react_1.CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-slate-400"/>
                                    <input type="text" required className="w-full pl-10 rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="0000 0000 0000 0000" maxLength={19} value={cardInfo.number} onChange={function (e) { return setCardInfo(__assign(__assign({}, cardInfo), { number: e.target.value })); }}/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Son Kullanma Tarihi</label>
                                    <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="AA/YY" maxLength={5} value={cardInfo.expDate} onChange={function (e) {
            var val = e.target.value.replace(/\D/g, '');
            if (val.length > 2) {
                val = val.substring(0, 2) + '/' + val.substring(2, 4);
            }
            setCardInfo(__assign(__assign({}, cardInfo), { expDate: val }));
        }}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                                    <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="123" maxLength={4} value={cardInfo.cvc} onChange={function (e) { return setCardInfo(__assign(__assign({}, cardInfo), { cvc: e.target.value })); }}/>
                                </div>
                            </div>


                            {/* Agreement Checkbox */}
                            <div className="flex items-start mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center h-5">
                                    <input id="agreement" name="agreement" type="checkbox" required checked={agreementAccepted} onChange={function (e) { return setAgreementAccepted(e.target.checked); }} className="focus:ring-primary-500 h-5 w-5 text-primary-600 border-gray-300 rounded cursor-pointer"/>
                                </div>
                                <div className="ml-3 text-sm leading-relaxed">
                                    <label htmlFor="agreement" className="font-medium text-slate-600 cursor-pointer">
                                        <a href="#/distance-sales-agreement" target="_blank" className="text-primary-600 hover:text-primary-700 hover:underline font-bold">Mesafeli Satış Sözleşmesi</a>'ni ve <a href="#/terms" target="_blank" className="text-primary-600 hover:text-primary-700 hover:underline font-bold">Kullanım Şartları</a>'nı okudum ve kabul ediyorum.
                                    </label>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-primary-500/30 disabled:opacity-70 flex justify-center items-center transform hover:-translate-y-0.5">
                                {loading ? (<>
                                        <lucide_react_1.Loader2 className="animate-spin mr-2 h-5 w-5"/>
                                        İşleniyor...
                                    </>) : ("\u00D6demeyi Tamamla (".concat(price, " TL)"))}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
};
exports.default = PaymentPage;
