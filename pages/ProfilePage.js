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
var supabaseClient_1 = require("../supabaseClient");
var ProfilePage = function (_a) {
    var currentUser = _a.currentUser;
    var userId = (0, react_router_dom_1.useParams)().userId;
    var _b = (0, react_1.useState)(null), profileUser = _b[0], setProfileUser = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(false), canViewContact = _d[0], setCanViewContact = _d[1];
    (0, react_1.useEffect)(function () {
        var fetchProfileData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, userData, error, mappedUser, jobs1, jobs2, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!userId)
                            return [2 /*return*/];
                        setLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, 6, 7]);
                        return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*').eq('uid', userId).single()];
                    case 2:
                        _a = _b.sent(), userData = _a.data, error = _a.error;
                        if (userData) {
                            mappedUser = {
                                uid: userData.uid,
                                email: userData.email,
                                fullName: userData.full_name,
                                baroNumber: userData.baro_number,
                                baroCity: userData.baro_city,
                                phone: userData.phone,
                                specializations: userData.specializations,
                                city: userData.city,
                                preferredCourthouses: userData.preferred_courthouses,
                                isPremium: userData.is_premium,
                                membershipType: userData.membership_type,
                                premiumUntil: userData.premium_until,
                                premiumSince: userData.premium_since,
                                premiumPlan: userData.premium_plan,
                                premiumPrice: userData.premium_price,
                                role: userData.role,
                                rating: userData.rating,
                                completedJobs: userData.completed_jobs,
                                avatarUrl: userData.avatar_url,
                                createdAt: userData.created_at,
                                updatedAt: userData.updated_at,
                                jobStatus: userData.job_status,
                                aboutMe: userData.about_me,
                                title: userData.title,
                                address: userData.address
                            };
                            setProfileUser(mappedUser);
                        }
                        return [4 /*yield*/, supabaseClient_1.supabase.from('jobs')
                                .select('*')
                                .eq('created_by', currentUser.uid)
                                .eq('selected_applicant', userId)
                                .in('status', ['in_progress', 'completed'])];
                    case 3:
                        jobs1 = (_b.sent()).data;
                        return [4 /*yield*/, supabaseClient_1.supabase.from('jobs')
                                .select('*')
                                .eq('created_by', userId)
                                .eq('selected_applicant', currentUser.uid)
                                .in('status', ['in_progress', 'completed'])];
                    case 4:
                        jobs2 = (_b.sent()).data;
                        if ((jobs1 && jobs1.length > 0) || (jobs2 && jobs2.length > 0) || currentUser.uid === userId) {
                            setCanViewContact(true);
                        }
                        else {
                            setCanViewContact(false);
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _b.sent();
                        console.error("Error fetching profile:", error_1);
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        fetchProfileData();
    }, [userId, currentUser]);
    if (loading)
        return <div className="flex justify-center p-20"><lucide_react_1.Loader2 className="animate-spin w-8 h-8 text-primary-600"/></div>;
    if (!profileUser)
        return <div className="text-center p-20 text-slate-500">Kullanıcı bulunamadı.</div>;
    return (<div className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-10 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg relative z-10">
              <div className="h-full w-full rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-3xl font-bold">
                {(canViewContact || currentUser.uid === profileUser.uid) ? profileUser.fullName.charAt(0) : <lucide_react_1.Lock className="w-8 h-8 opacity-50"/>}
              </div>
            </div>
            <div className="md:ml-6 mt-4 md:mt-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                {(canViewContact || currentUser.uid === profileUser.uid) ? (<>
                    {profileUser.title || 'Av.'} {profileUser.fullName}
                    {profileUser.isPremium && <lucide_react_1.Sparkles className="w-5 h-5 text-amber-500 ml-2 fill-current"/>}
                  </>) : (<span className="flex items-center">
                    Av. {profileUser.fullName.split(' ').map(function (n) { return n[0] + '***'; }).join(' ')}
                    <lucide_react_1.Lock className="w-4 h-4 text-slate-400 ml-2"/>
                  </span>)}
              </h1>
              <p className="text-slate-500 flex items-center mt-1">
                <lucide_react_1.MapPin className="w-4 h-4 mr-1"/> {profileUser.city} • {profileUser.baroCity} Barosu
                {(canViewContact || currentUser.uid === profileUser.uid) && " (".concat(profileUser.baroNumber, ")")}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
              <div className="flex items-center bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                <lucide_react_1.Star className="w-5 h-5 text-amber-500 fill-current mr-2"/>
                <span className="text-lg font-bold text-amber-700">{profileUser.rating ? profileUser.rating.toFixed(1) : '0.0'}</span>
                <span className="text-sm text-amber-600 ml-1">/ 5.0</span>
              </div>
              {currentUser.uid === profileUser.uid && (<a href="#/settings" className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                  Profili Düzenle
                </a>)}
            </div>
          </div>

          {/* About Section */}
          {(canViewContact || currentUser.uid === profileUser.uid) ? (<>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-slate-800">Hakkında</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {profileUser.aboutMe || "Bu kullanıcı henüz kendini tanıtan bir yazı eklememiş."}
                </p>
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Uzmanlık Alanları</h3>
                <div className="flex flex-wrap gap-2">
                  {profileUser.specializations && profileUser.specializations.length > 0 ? (profileUser.specializations.map(function (spec) { return (<span key={spec} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        {spec}
                      </span>); })) : (<span className="text-slate-400 italic text-sm">Belirtilmemiş</span>)}
                </div>
              </div>
            </>) : (<div className="py-12 text-center">
              <lucide_react_1.Lock className="w-16 h-16 text-slate-200 mx-auto mb-4"/>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Profil Kısıtlı</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Bu kullanıcının detaylı profil bilgilerini görüntülemek için, kendisiyle onaylanmış bir göreviniz bulunmalıdır.
              </p>
            </div>)}
        </div>
      </div>

      {/* Contact Information - Conditional Visibility */}
      {(canViewContact || currentUser.uid === profileUser.uid) && (<div className={"rounded-2xl shadow-sm border overflow-hidden ".concat(canViewContact ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200')}>
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <lucide_react_1.Phone className="w-5 h-5 mr-2 text-primary-600"/> İletişim Bilgileri
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                  <lucide_react_1.Phone className="w-6 h-6 text-green-600"/>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Telefon</p>
                  {profileUser.phone ? (currentUser.uid === profileUser.uid ? (<p className="text-lg font-bold text-slate-800 mt-1">{profileUser.phone}</p>) : (<a href={"https://wa.me/90".concat(profileUser.phone.replace(/\s+/g, '').replace(/^0/, ''))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
                        <lucide_react_1.Phone className="w-4 h-4 mr-2"/>
                        WhatsApp ile İletişime Geç
                      </a>)) : (<p className="text-sm text-slate-500 mt-1">Belirtilmemiş</p>)}
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                  <lucide_react_1.Mail className="w-6 h-6 text-blue-600"/>
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">E-Posta</p>
                  <p className="text-lg font-bold text-slate-800">{profileUser.email}</p>
                </div>
              </div>
              {profileUser.address && (<div className="md:col-span-2 flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                    <lucide_react_1.MapPin className="w-6 h-6 text-slate-600"/>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Ofis Adresi</p>
                    <p className="text-lg font-bold text-slate-800">{profileUser.address}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>)}
    </div>);
};
exports.default = ProfilePage;
