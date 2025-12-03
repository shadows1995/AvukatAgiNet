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
exports.ResetPasswordPage = exports.ForgotPasswordPage = exports.LoginPage = exports.RegisterPage = exports.LandingPage = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var types_1 = require("../types");
var supabaseClient_1 = require("../supabaseClient");
var courthouses_1 = require("../data/courthouses");
var NotificationContext_1 = require("../contexts/NotificationContext");
var AlertContext_1 = require("../contexts/AlertContext");
var InteractiveSphere_1 = require("../components/InteractiveSphere");
var SEO_1 = require("../components/SEO");
var Logo = function (_a) {
    var _b = _a.className, className = _b === void 0 ? "" : _b;
    return (<div className={"flex items-center space-x-2 ".concat(className)}>
    <div className="bg-primary-600 text-white p-1.5 rounded-lg">
      <lucide_react_1.Gavel className="h-6 w-6"/>
    </div>
    <span className="font-bold text-xl tracking-tight text-slate-800">
      Avukat<span className="text-primary-600">Ağı</span>
    </span>
  </div>);
};
var LandingPage = function () { return (<div className="flex flex-col min-h-screen bg-white">
    <SEO_1.default title="AvukatAğı - Avukatlar Arası İş Birliği ve Tevkil Platformu" description="Duruşma, dosya inceleme ve haciz işlemleri için güvenilir avukatlara işlerinizi tevkil edin. Türkiye'nin en büyük hukuk ağına katılın."/>
    {/* Hero Section */}
    {/* Hero Section */}
    <div className="bg-slate-50 pt-24 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-primary-100/50 to-transparent opacity-70 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-to-tr from-secondary-100/50 to-transparent opacity-70 blur-3xl"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-primary-100 text-primary-700 font-bold text-sm mb-8 shadow-glow animate-bounce">
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
          Türkiye'nin En Büyük Hukuk Ağı
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[500px] -z-10 opacity-50 pointer-events-none">
            <InteractiveSphere_1.default dotColor="#d946ef" lineColor="#4f46e5"/>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight relative z-10">
            Meslektaşlarınızla <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 animate-text">Güçlerinizi Birleştirin</span>
          </h1>
        </div>

        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Duruşma, dosya inceleme ve haciz işlemleri için güvenilir avukatlara
          işlerinizi tevkil edin. Premium üyelik ile tevkil işlerinden para kazanın.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <react_router_dom_1.Link to="/register" className="px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-2xl font-bold text-lg shadow-glow hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
            Ücretsiz Üye Ol
            <lucide_react_1.ArrowRight className="ml-2 h-5 w-5"/>
          </react_router_dom_1.Link>
          <react_router_dom_1.Link to="/login" className="px-10 py-4 bg-white border border-slate-200 text-slate-700 hover:text-primary-600 hover:border-primary-200 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            Giriş Yap
          </react_router_dom_1.Link>
        </div>
      </div>
    </div>

    {/* Stats Section */}
    {/* Stats Section */}
    <div className="bg-white border-y border-slate-100 relative z-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="text-4xl md:text-5xl font-extrabold text-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300">595</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Toplam Adliye</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="text-4xl md:text-5xl font-extrabold text-secondary-500 mb-2 group-hover:scale-110 transition-transform duration-300">49.881</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Kayıtlı Avukat</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-2 group-hover:scale-110 transition-transform duration-300">12.543</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tamamlanan Görev</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="text-4xl md:text-5xl font-extrabold text-primary-800 mb-2 group-hover:scale-110 transition-transform duration-300">2.847</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Aktif Premium Üye</div>
          </div>
        </div>
      </div>
    </div>

    {/* Feature Cards */}
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Process Infographic */}
        <div className="mb-20">
          <img src="/process-infographic.png" alt="Avukat Görevlendirme Süreci" className="w-full max-w-5xl mx-auto rounded-2xl shadow-xl border border-slate-200"/>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Neden AvukatAğı?</h2>
          <p className="mt-4 text-lg text-slate-600">Tek platformda güvenli ve hızlı hukuki işbirliği</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-600 group-hover:text-white">
              <lucide_react_1.Briefcase className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Kolay Görev Oluşturma</h3>
            <p className="text-slate-600 leading-relaxed">
              Kolay arayüz ile saniyeler içinde detaylı görev oluşturun. Şehir, adliye ve ücret bilgisini girin, gerisini bize bırakın.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-600 group-hover:text-white">
              <lucide_react_1.ShieldCheck className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">%100 Avukat Ağı</h3>
            <p className="text-slate-600 leading-relaxed">
              Sadece baro levhasına kayıtlı ve kimliği doğrulanmış avukatlar sisteme katılabilir. Güvenli bir ortamda çalışın.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-600 group-hover:text-white">
              <lucide_react_1.Star className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors"/>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Puanlama Sistemi</h3>
            <p className="text-slate-600 leading-relaxed">
              Tamamlanan işler sonrası meslektaşlarınızı puanlayın. Yüksek puanlı avukatlarla çalışarak riskleri minimize edin.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>); };
exports.LandingPage = LandingPage;
var RegisterPage = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var showNotification = (0, NotificationContext_1.useNotification)().showNotification;
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    var _a = (0, react_1.useState)(false), isLoading = _a[0], setIsLoading = _a[1];
    var _b = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        barNo: '',
        barCity: 'İstanbul'
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)(false), agreedToTerms = _c[0], setAgreedToTerms = _c[1];
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var passwordRegex, cleanPhone, _a, duplicateCheck, rpcError, _b, data, error, updateError, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    if (!agreedToTerms) {
                        showNotification('warning', "Lütfen Kullanıcı Sözleşmesi ve Gizlilik Politikasını onaylayın.");
                        return [2 /*return*/];
                    }
                    passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
                    if (!passwordRegex.test(formData.password)) {
                        showNotification('error', "Şifreniz en az 6 karakter olmalı ve en az bir harf ile bir rakam içermelidir.");
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    cleanPhone = formData.phone.replace(/\s/g, '').replace(/[()]/g, '');
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .rpc('check_duplicate_user', {
                            check_email: formData.email,
                            check_phone: cleanPhone
                        })];
                case 2:
                    _a = _c.sent(), duplicateCheck = _a.data, rpcError = _a.error;
                    if (rpcError) {
                        console.error("Error checking duplicates:", rpcError);
                        // Fail open or handle error
                    }
                    else if (duplicateCheck) {
                        if (duplicateCheck.email_exists) {
                            showNotification('error', "Bu e-posta adresi zaten kullanılıyor.");
                            setIsLoading(false);
                            return [2 /*return*/];
                        }
                        if (duplicateCheck.phone_exists) {
                            showNotification('error', "Bu telefon numarası zaten kayıtlı.");
                            setIsLoading(false);
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.signUp({
                            email: formData.email,
                            password: formData.password,
                            options: {
                                data: {
                                    full_name: "".concat(formData.firstName, " ").concat(formData.lastName),
                                    phone: cleanPhone, // Add phone to metadata
                                }
                            }
                        })];
                case 3:
                    _b = _c.sent(), data = _b.data, error = _b.error;
                    if (error)
                        throw error;
                    if (!data.user) return [3 /*break*/, 5];
                    return [4 /*yield*/, supabaseClient_1.supabase.from('users').update({
                            baro_number: formData.barNo,
                            baro_city: formData.barCity,
                            city: formData.barCity,
                            phone: cleanPhone, // Save normalized phone
                            role: types_1.UserRole.FREE,
                            rating: 0,
                            completed_jobs: 0,
                            job_status: 'active'
                        }).eq('uid', data.user.id)];
                case 4:
                    updateError = (_c.sent()).error;
                    if (updateError) {
                        console.error("Error updating user profile:", updateError);
                        // Continue anyway as the user is created
                    }
                    showAlert({
                        title: "Kayıt Başarılı",
                        message: "E-mail adresinize Doğrulama maili gönderildi. Lütfen kutunuzu kontrol ediniz.",
                        type: "success",
                        confirmText: "Giriş Yap",
                        onConfirm: function () { return navigate('/login'); }
                    });
                    _c.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _c.sent();
                    console.error("Error signing up:", error_1);
                    showNotification('error', "Kayıt hatası: " + error_1.message);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <SEO_1.default title="Kayıt Ol - AvukatAğı" description="AvukatAğı'na ücretsiz üye olun. Meslektaşlarınızla güçlerinizi birleştirin ve tevkil işlerinden kazanç sağlayın."/>
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <lucide_react_1.Gavel className="h-8 w-8 text-primary-600"/>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Hesap Oluştur</h2>
          <p className="text-slate-500 mt-2">Baro sicil numaranız ile hemen katılın</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.firstName} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { firstName: e.target.value })); }}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.lastName} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { lastName: e.target.value })); }}/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <input type="email" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.email} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { email: e.target.value })); }}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefon Numarası</label>
            <input type="tel" required placeholder="0555 555 55 55" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.phone} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { phone: e.target.value })); }}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Baro / Şehir</label>
              <select className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.barCity} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { barCity: e.target.value })); }}>
                {courthouses_1.TURKISH_CITIES.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sicil No</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.barNo} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { barNo: e.target.value })); }}/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <input type="password" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.password} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { password: e.target.value })); }}/>
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" checked={agreedToTerms} onChange={function (e) { return setAgreedToTerms(e.target.checked); }}/>
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-slate-700">
                <react_router_dom_1.Link to="/terms" className="text-primary-600 hover:underline" target="_blank">Kullanıcı Sözleşmesi</react_router_dom_1.Link>'ni ve <react_router_dom_1.Link to="/privacy" className="text-primary-600 hover:underline" target="_blank">Gizlilik Politikası</react_router_dom_1.Link>'nı okudum ve kabul ediyorum.
              </label>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 disabled:opacity-70">
            {isLoading ? <lucide_react_1.Loader2 className="animate-spin inline h-5 w-5"/> : 'Kayıt Ol'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          Zaten hesabınız var mı? <react_router_dom_1.Link to="/login" className="text-primary-600 font-semibold hover:underline">Giriş Yap</react_router_dom_1.Link>
        </div>
      </div>
    </div>);
};
exports.RegisterPage = RegisterPage;
var LoginPage = function () {
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    setError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.signInWithPassword({
                            email: email,
                            password: password
                        })];
                case 2:
                    error_2 = (_a.sent()).error;
                    if (error_2)
                        throw error_2;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    setError('Giriş yapılamadı. E-posta veya şifre hatalı.');
                    setIsLoading(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen flex bg-white">
      <SEO_1.default title="Giriş Yap - AvukatAğı" description="AvukatAğı hesabınıza giriş yapın ve işlerinizi yönetmeye başlayın."/>
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 z-10">
        <div className="mb-10">
          <react_router_dom_1.Link to="/" className="inline-block">
            <Logo className="scale-110 origin-left"/>
          </react_router_dom_1.Link>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">Tekrar Hoşgeldiniz</h2>
        <p className="text-slate-500 mb-8">Lütfen hesabınıza giriş yapın.</p>

        {error && (<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm flex items-center">
            <lucide_react_1.AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/>
            {error}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <lucide_react_1.User className="h-5 w-5 text-slate-400"/>
              </div>
              <input type="email" required value={email} onChange={function (e) { return setEmail(e.target.value); }} className="block w-full pl-10 rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 h-12" placeholder="ornek@avukat.com"/>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">Şifre</label>
              <react_router_dom_1.Link to="/forgot-password" class="text-xs text-primary-600 hover:underline font-medium">Şifremi Unuttum?</react_router_dom_1.Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <lucide_react_1.ShieldCheck className="h-5 w-5 text-slate-400"/>
              </div>
              <input type="password" required value={password} onChange={function (e) { return setPassword(e.target.value); }} className="block w-full pl-10 rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 h-12" placeholder="••••••••"/>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-primary-600 text-white py-3.5 rounded-lg font-bold hover:bg-primary-700 transition duration-200 shadow-lg shadow-primary-500/30 disabled:opacity-70">
            {isLoading ? <lucide_react_1.Loader2 className="animate-spin h-5 w-5"/> : 'Giriş Yap'}
          </button>
        </form>
        <p className="mt-10 text-center text-sm text-slate-500">
          Hesabınız yok mu? <react_router_dom_1.Link to="/register" className="text-primary-600 font-bold hover:underline">Hemen Kayıt Ol</react_router_dom_1.Link>
        </p>
      </div>
      {/* Right Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 animate-float">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Canlı Görevler</h3>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Canlı Akış</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs mr-3 flex-shrink-0">AK</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Av. Ahmet K. <span className="text-slate-400 font-normal">İstanbul</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">Duruşma Yetki Belgesi • 1.500₺</p>
                  <p className="text-[10px] text-slate-400 mt-1">Az önce yayınlandı</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs mr-3 flex-shrink-0">ZD</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Av. Zeynep D. <span className="text-slate-400 font-normal">Ankara</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">Dosya İnceleme • 750₺</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 dakika önce</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur p-4 rounded-xl border border-white/50">
              <div className="text-2xl font-bold text-primary-700">12,542</div>
              <div className="text-sm text-slate-600">Kayıtlı Avukat</div>
            </div>
            <div className="bg-white/60 backdrop-blur p-4 rounded-xl border border-white/50">
              <div className="text-2xl font-bold text-primary-700">595</div>
              <div className="text-sm text-slate-600">Aktif Adliye</div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
exports.LoginPage = LoginPage;
var ForgotPasswordPage = function () {
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), message = _c[0], setMessage = _c[1];
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    setMessage(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.resetPasswordForEmail(email, {
                            redirectTo: window.location.origin,
                        })];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    setMessage({
                        text: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
                        type: 'success'
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error("Reset password error:", error_3);
                    setMessage({
                        text: 'Bir hata oluştu: ' + error_3.message,
                        type: 'error'
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <SEO_1.default title="Şifremi Unuttum - AvukatAğı"/>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <lucide_react_1.ShieldCheck className="h-8 w-8 text-primary-600"/>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Şifremi Unuttum</h2>
          <p className="text-slate-500 mt-2">E-posta adresinizi girerek şifrenizi sıfırlayabilirsiniz.</p>
        </div>

        {message && (<div className={"mb-6 p-4 rounded-lg text-sm flex items-center ".concat(message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200')}>
            {message.type === 'success' ? <lucide_react_1.CheckCircle className="h-5 w-5 mr-2"/> : <lucide_react_1.AlertCircle className="h-5 w-5 mr-2"/>}
            {message.text}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <input type="email" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={email} onChange={function (e) { return setEmail(e.target.value); }} placeholder="ornek@avukat.com"/>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 disabled:opacity-70 flex justify-center items-center">
            {isLoading ? <lucide_react_1.Loader2 className="animate-spin h-5 w-5"/> : 'Sıfırlama Bağlantısı Gönder'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <react_router_dom_1.Link to="/login" className="text-primary-600 font-semibold hover:underline flex items-center justify-center gap-1">
            <lucide_react_1.ArrowRight className="w-4 h-4 rotate-180"/> Giriş sayfasına dön
          </react_router_dom_1.Link>
        </div>
      </div>
    </div>);
};
exports.ForgotPasswordPage = ForgotPasswordPage;
var ResetPasswordPage = function () {
    var _a = (0, react_1.useState)(''), password = _a[0], setPassword = _a[1];
    var _b = (0, react_1.useState)(''), confirmPassword = _b[0], setConfirmPassword = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), message = _d[0], setMessage = _d[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        // Check if we have a session (which happens after clicking the email link)
        supabaseClient_1.supabase.auth.getSession().then(function (_a) {
            var session = _a.data.session;
            if (!session) {
                setMessage({
                    text: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen tekrar deneyin.',
                    type: 'error'
                });
            }
        });
    }, []);
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (password !== confirmPassword) {
                        setMessage({ text: 'Şifreler eşleşmiyor.', type: 'error' });
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    setMessage(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.updateUser({ password: password })];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    setMessage({
                        text: 'Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...',
                        type: 'success'
                    });
                    setTimeout(function () { return navigate('/login'); }, 3000);
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    console.error("Update password error:", error_4);
                    setMessage({
                        text: 'Bir hata oluştu: ' + error_4.message,
                        type: 'error'
                    });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <SEO_1.default title="Şifre Sıfırlama - AvukatAğı"/>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <lucide_react_1.ShieldCheck className="h-8 w-8 text-primary-600"/>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Yeni Şifre Belirle</h2>
          <p className="text-slate-500 mt-2">Lütfen hesabınız için yeni bir şifre girin.</p>
        </div>

        {message && (<div className={"mb-6 p-4 rounded-lg text-sm flex items-center ".concat(message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200')}>
            {message.type === 'success' ? <lucide_react_1.CheckCircle className="h-5 w-5 mr-2"/> : <lucide_react_1.AlertCircle className="h-5 w-5 mr-2"/>}
            {message.text}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
            <input type="password" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={password} onChange={function (e) { return setPassword(e.target.value); }} placeholder="••••••••"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
            <input type="password" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={confirmPassword} onChange={function (e) { return setConfirmPassword(e.target.value); }} placeholder="••••••••"/>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 disabled:opacity-70 flex justify-center items-center">
            {isLoading ? <lucide_react_1.Loader2 className="animate-spin h-5 w-5"/> : 'Şifreyi Güncelle'}
          </button>
        </form>
      </div>
    </div>);
};
exports.ResetPasswordPage = ResetPasswordPage;
