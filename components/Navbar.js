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
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var supabaseClient_1 = require("../supabaseClient");
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
var Navbar = function (_a) {
    var user = _a.user, onLogout = _a.onLogout;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_1.useState)([]), notifications = _c[0], setNotifications = _c[1];
    var _d = (0, react_1.useState)(false), showNotifs = _d[0], setShowNotifs = _d[1];
    var _e = (0, react_1.useState)(false), showPremiumModal = _e[0], setShowPremiumModal = _e[1];
    var location = (0, react_router_dom_1.useLocation)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    var notificationRef = (0, react_1.useRef)(null);
    var isActive = function (path) { return location.pathname === path
        ? "text-primary-600 font-bold bg-primary-50/80 rounded-xl px-3 py-2 shadow-sm ring-1 ring-primary-100 whitespace-nowrap text-sm"
        : "text-slate-600 font-medium hover:text-primary-600 hover:bg-slate-50/80 rounded-xl px-3 py-2 transition-all duration-200 whitespace-nowrap text-sm"; };
    var formatName = function (fullName) {
        var parts = fullName.trim().split(/\s+/);
        if (parts.length === 1)
            return parts[0];
        var firstName = parts[0];
        var lastName = parts[parts.length - 1];
        // If name is long (> 15 chars), abbreviate last name
        if (fullName.length > 15) {
            return "".concat(firstName, " ").concat(lastName.charAt(0), ".");
        }
        return fullName;
    };
    (0, react_1.useEffect)(function () {
        if (!user)
            return;
        // Initial fetch
        var fetchNotifications = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase
                            .from('notifications')
                            .select('*')
                            .eq('user_id', user.uid)
                            .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            setNotifications(data);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchNotifications();
        // Realtime subscription
        var subscription = supabaseClient_1.supabase
            .channel('notifications_channel')
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: "user_id=eq.".concat(user.uid)
        }, function (payload) {
            setNotifications(function (prev) { return __spreadArray([payload.new], prev, true); });
        })
            .subscribe();
        return function () {
            subscription.unsubscribe();
        };
    }, [user]);
    // Close notifications when clicking outside
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    var unreadCount = notifications.filter(function (n) { return !n.read; }).length;
    var handleReadNotifications = function () { return __awaiter(void 0, void 0, void 0, function () {
        var updatedNotifs, unreadIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setShowNotifs(!showNotifs);
                    if (!(!showNotifs && unreadCount > 0)) return [3 /*break*/, 2];
                    updatedNotifs = notifications.map(function (n) { return (__assign(__assign({}, n), { read: true })); });
                    setNotifications(updatedNotifs);
                    unreadIds = notifications.filter(function (n) { return !n.read; }).map(function (n) { return n.id; });
                    if (!(unreadIds.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('notifications')
                            .update({ read: true })
                            .in('id', unreadIds)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var goToProfile = function () {
        if (user)
            navigate("/profile/".concat(user.uid));
    };
    return (<>
    <nav className="glass-effect border-b border-white/20 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <react_router_dom_1.Link to="/" className="flex-shrink-0">
              <Logo />
            </react_router_dom_1.Link>
            {user && (<div className="hidden md:flex ml-6 space-x-2">
                <react_router_dom_1.Link to="/home" className={isActive('/home')}>Anasayfa</react_router_dom_1.Link>
                <react_router_dom_1.Link to="/dashboard" className={isActive('/dashboard')}>Açık Görevler</react_router_dom_1.Link>
                <react_router_dom_1.Link to="/my-jobs" className={isActive('/my-jobs')}>Görevlerim</react_router_dom_1.Link>
                <react_router_dom_1.Link to="/accepted-jobs" className={isActive('/accepted-jobs')}>Aldığım Görevler</react_router_dom_1.Link>
                <react_router_dom_1.Link to="/create-job" className={isActive('/create-job')}>Görev Ver</react_router_dom_1.Link>
                {user.role === 'admin' && (<react_router_dom_1.Link to="/admin" className={"".concat(isActive('/admin'), " text-red-600 hover:text-red-700 hover:bg-red-50")}>
                    <lucide_react_1.Shield className="w-4 h-4 mr-1 inline-block"/> Admin
                  </react_router_dom_1.Link>)}
                {!user.isPremium && (<react_router_dom_1.Link to="/premium" className="flex items-center text-secondary-600 font-medium bg-secondary-50 px-3 py-2 rounded-md hover:bg-secondary-100 transition whitespace-nowrap text-sm">
                    <lucide_react_1.Sparkles className="w-4 h-4 mr-1"/> Premium
                  </react_router_dom_1.Link>)}
              </div>)}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (<>
                {user.isPremium && (<button onClick={function () { return setShowPremiumModal(true); }} className={"px-4 py-1.5 text-xs font-bold text-white rounded-full flex items-center shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap ".concat(user.membershipType === 'premium_plus'
                    ? 'bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 border border-primary-700'
                    : 'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 border border-primary-400')}>
                    {user.membershipType === 'premium_plus' ? <lucide_react_1.Sparkles className="w-3.5 h-3.5 mr-1.5"/> : <lucide_react_1.Crown className="w-3.5 h-3.5 mr-1.5"/>}
                    {user.membershipType === 'premium_plus' ? 'PREMIUM +' : 'PREMIUM'}
                  </button>)}
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">

                  {/* Notification Bell */}
                  <div className="relative" ref={notificationRef}>
                    <button onClick={handleReadNotifications} className="p-2 text-slate-400 hover:text-primary-600 transition relative">
                      <lucide_react_1.Bell className="h-5 w-5"/>
                      {unreadCount > 0 && (<span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white"></span>)}
                    </button>

                    {showNotifs && (<div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700 text-sm">
                          Bildirimler
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (<div className="p-4 text-center text-sm text-slate-500">Bildiriminiz yok.</div>) : (notifications.map(function (n) { return (<div key={n.id} className={"p-3 border-b border-slate-50 hover:bg-slate-50 ".concat(!n.read ? 'bg-blue-50/50' : '')}>
                                <div className="text-sm font-medium text-slate-800">{n.title}</div>
                                <div className="text-xs text-slate-500 mt-1">{n.message}</div>
                              </div>); }))}
                        </div>
                      </div>)}
                  </div>

                  <div className="text-right hidden lg:block cursor-pointer group" onClick={goToProfile}>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition whitespace-nowrap">{formatName(user.fullName)}</p>
                    <p className="text-xs text-slate-500 font-medium whitespace-nowrap">{user.baroCity} Barosu</p>
                  </div>
                  <div onClick={goToProfile} className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200 flex-shrink-0">
                    {user.fullName.charAt(0)}
                  </div>
                  <react_router_dom_1.Link to="/settings" className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-200" title="Ayarlar">
                    <lucide_react_1.Settings className="h-5 w-5"/>
                  </react_router_dom_1.Link>
                  <button onClick={onLogout} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200" title="Çıkış Yap">
                    <lucide_react_1.LogOut className="h-5 w-5"/>
                  </button>
                </div>
              </>) : (<div className="flex items-center space-x-3">
                <react_router_dom_1.Link to="/yasal-mevzuat" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2">
                  Yasal Mevzuat
                </react_router_dom_1.Link>
                <react_router_dom_1.Link to="/how-it-works" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2">
                  Nasıl Çalışır?
                </react_router_dom_1.Link>
                <react_router_dom_1.Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2">
                  Giriş Yap
                </react_router_dom_1.Link>
                <react_router_dom_1.Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm hover:shadow-md">
                  Kayıt Ol
                </react_router_dom_1.Link>
              </div>)}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={function () { return setIsOpen(!isOpen); }} className="text-slate-600">
              {isOpen ? <lucide_react_1.X /> : <lucide_react_1.Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && user && (<div className="md:hidden bg-white border-t border-slate-100 px-2 pt-2 pb-3 space-y-1">
          <react_router_dom_1.Link to="/home" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Anasayfa</react_router_dom_1.Link>
          <react_router_dom_1.Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Açık Görevler</react_router_dom_1.Link>
          <react_router_dom_1.Link to="/create-job" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Görev Ver</react_router_dom_1.Link>
          <react_router_dom_1.Link to="/my-jobs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Görevlerim</react_router_dom_1.Link>
          <react_router_dom_1.Link to="/accepted-jobs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Aldığım Görevler</react_router_dom_1.Link>
          {user.role === 'admin' && (<react_router_dom_1.Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
              <lucide_react_1.Shield className="w-4 h-4 mr-2 inline-block"/> Admin Paneli
            </react_router_dom_1.Link>)}
          <react_router_dom_1.Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Ayarlar</react_router_dom_1.Link>
          <react_router_dom_1.Link to={"/profile/".concat(user.uid)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Profilim</react_router_dom_1.Link>
          <button onClick={onLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50">Çıkış Yap</button>
        </div>)}
    </nav>
    {/* Premium Details Modal */}
    {showPremiumModal && user && user.isPremium && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={"p-6 text-white relative ".concat(user.membershipType === 'premium_plus'
                ? 'bg-primary-800'
                : 'bg-primary-600')}>
              <button onClick={function () { return setShowPremiumModal(false); }} className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition">
                <lucide_react_1.X className="w-5 h-5"/>
              </button>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  {user.membershipType === 'premium_plus' ? <lucide_react_1.Sparkles className="w-8 h-8 text-white"/> : <lucide_react_1.Crown className="w-8 h-8 text-white"/>}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user.membershipType === 'premium_plus' ? 'Premium + Üyelik' : 'Premium Üyelik'}</h3>
                  <p className="text-white/80 text-sm">Aktif ve Onaylı</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex items-center">
                  <lucide_react_1.CreditCard className="w-5 h-5 text-primary-600 mr-3"/>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Mevcut Plan</p>
                    <p className="text-slate-900 font-bold">
                      {user.premiumPlan === 'yearly' ? 'Yıllık Plan' : 'Aylık Plan'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Ücret</p>
                  <p className="text-slate-900 font-bold">{user.premiumPrice || 299} TL<span className="text-xs font-normal text-slate-500">/ay</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center text-slate-600">
                    <lucide_react_1.Calendar className="w-4 h-4 mr-2 text-slate-400"/>
                    <span className="text-sm">Başlangıç Tarihi</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {user.premiumSince ? new Date(user.premiumSince).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center text-slate-600">
                    <lucide_react_1.Calendar className="w-4 h-4 mr-2 text-slate-400"/>
                    <span className="text-sm">Yenileme Tarihi</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {user.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-600">
                    <lucide_react_1.Sparkles className="w-4 h-4 mr-2 text-slate-400"/>
                    <span className="text-sm">Kalan Süre</span>
                  </div>
                  <span className="text-sm font-bold text-primary-600">
                    {user.premiumUntil ? Math.ceil((new Date(user.premiumUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0} Gün
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button onClick={function () {
                setShowPremiumModal(false);
                navigate('/premium');
            }} className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition mb-3">
                  Planları İncele / Yükselt
                </button>
                <button onClick={function () { return setShowPremiumModal(false); }} className="w-full py-3 text-slate-500 font-medium hover:text-slate-700 transition">
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>)}
  </>);
};
exports.default = Navbar;
