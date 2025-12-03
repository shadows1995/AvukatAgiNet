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
var supabaseClient_1 = require("./supabaseClient");
// Component Imports
var Navbar_1 = require("./components/Navbar");
var Footer_1 = require("./components/Footer");
var Dashboard_1 = require("./pages/Dashboard");
var HomePage_1 = require("./pages/HomePage");
var MyJobs_1 = require("./pages/MyJobs");
var CreateJob_1 = require("./pages/CreateJob");
var SettingsPage_1 = require("./pages/SettingsPage");
var ProfilePage_1 = require("./pages/ProfilePage");
var AuthPages_1 = require("./pages/AuthPages");
var PremiumPage_1 = require("./pages/PremiumPage");
var Payment_1 = require("./pages/Payment");
var PaymentSuccessPage_1 = require("./pages/PaymentSuccessPage");
var AcceptedJobs_1 = require("./pages/AcceptedJobs");
var JobDetails_1 = require("./pages/JobDetails");
var TermsOfUse_1 = require("./pages/TermsOfUse");
var PrivacyPolicy_1 = require("./pages/PrivacyPolicy");
var HowItWorksPage_1 = require("./pages/HowItWorksPage");
var LegalCompliancePage_1 = require("./pages/LegalCompliancePage");
var AboutPage_1 = require("./pages/AboutPage");
var DistanceSalesAgreementPage_1 = require("./pages/DistanceSalesAgreementPage");
// Admin Imports
var RequireAdmin_1 = require("./components/RequireAdmin");
var AdminLayout_1 = require("./pages/admin/AdminLayout");
var AdminDashboard_1 = require("./pages/admin/AdminDashboard");
var AdminJobs_1 = require("./pages/admin/AdminJobs");
var AdminJobDetail_1 = require("./pages/admin/AdminJobDetail");
var AdminUsers_1 = require("./pages/admin/AdminUsers");
var AdminUserDetail_1 = require("./pages/admin/AdminUserDetail");
var AdminSecurity_1 = require("./pages/admin/AdminSecurity");
var NotificationContext_1 = require("./contexts/NotificationContext");
var AlertContext_1 = require("./contexts/AlertContext");
var AppContent = function () {
    var _a = (0, react_1.useState)(null), user = _a[0], setUser = _a[1];
    var _b = (0, react_1.useState)(true), authLoading = _b[0], setAuthLoading = _b[1];
    var location = (0, react_router_dom_1.useLocation)();
    var fetchUserProfile = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, userData, error, mappedUser, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*').eq('uid', uid).single()];
                case 1:
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
                        setUser(mappedUser);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    console.error("Error fetching user profile:", error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setAuthLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        // Check active session
        supabaseClient_1.supabase.auth.getSession().then(function (_a) {
            var session = _a.data.session;
            if (session === null || session === void 0 ? void 0 : session.user) {
                fetchUserProfile(session.user.id);
            }
            else {
                setUser(null);
                setAuthLoading(false);
            }
        });
        var subscription = supabaseClient_1.supabase.auth.onAuthStateChange(function (event, session) {
            if (event === 'PASSWORD_RECOVERY') {
                // Redirect to reset password page when recovery link is clicked
                window.location.hash = '#/reset-password';
            }
            if (session === null || session === void 0 ? void 0 : session.user) {
                // Only fetch if we don't have the user or if the ID changed
                if (!user || user.uid !== session.user.id) {
                    fetchUserProfile(session.user.id);
                }
            }
            else {
                setUser(null);
                setAuthLoading(false);
            }
        }).data.subscription;
        return function () { return subscription.unsubscribe(); };
    }, []);
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.signOut()];
                case 1:
                    _a.sent();
                    setUser(null);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (authLoading)
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><lucide_react_1.Loader2 className="h-12 w-12 text-primary-600 animate-spin"/></div>;
    // Footer visibility logic
    var showFooter = ['/', '/home', '/login', '/register', '/forgot-password', '/reset-password', '/terms', '/privacy'].includes(location.pathname);
    return (<div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar_1.default user={user} onLogout={handleLogout}/>
      <div className="flex-grow">
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={user ? <react_router_dom_1.Navigate to="/home"/> : <AuthPages_1.LandingPage />}/>
          <react_router_dom_1.Route path="/login" element={user ? <react_router_dom_1.Navigate to="/home"/> : <AuthPages_1.LoginPage />}/>
          <react_router_dom_1.Route path="/register" element={user ? <react_router_dom_1.Navigate to="/home"/> : <AuthPages_1.RegisterPage />}/>
          <react_router_dom_1.Route path="/forgot-password" element={user ? <react_router_dom_1.Navigate to="/home"/> : <AuthPages_1.ForgotPasswordPage />}/>
          <react_router_dom_1.Route path="/reset-password" element={<AuthPages_1.ResetPasswordPage />}/>
          <react_router_dom_1.Route path="/home" element={user ? <HomePage_1.default user={user}/> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/dashboard" element={user ? <Dashboard_1.default user={user}/> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/create-job" element={user ? <CreateJob_1.default user={user}/> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/premium" element={user ? <PremiumPage_1.default user={user}/> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/payment" element={user ? <Payment_1.default onPaymentSuccess={function () { return fetchUserProfile(user.uid); }}/> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/payment-success" element={user ? <PaymentSuccessPage_1.default /> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/settings" element={user ? <SettingsPage_1.default user={user} onProfileUpdate={function () { return fetchUserProfile(user.uid); }}/> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/my-jobs" element={user ? <MyJobs_1.default /> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/accepted-jobs" element={user ? <AcceptedJobs_1.default /> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/job/:jobId" element={user ? <JobDetails_1.default user={user}/> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/profile/:userId" element={user ? <ProfilePage_1.default currentUser={user}/> : <react_router_dom_1.Navigate to="/login"/>}/>
          <react_router_dom_1.Route path="/terms" element={<TermsOfUse_1.default />}/>
          <react_router_dom_1.Route path="/privacy" element={<PrivacyPolicy_1.default />}/>
          <react_router_dom_1.Route path="/terms" element={<TermsOfUse_1.default />}/>
          <react_router_dom_1.Route path="/privacy" element={<PrivacyPolicy_1.default />}/>
          <react_router_dom_1.Route path="/how-it-works" element={<HowItWorksPage_1.default />}/>
          <react_router_dom_1.Route path="/yasal-mevzuat" element={<LegalCompliancePage_1.default />}/>
          <react_router_dom_1.Route path="/about" element={<AboutPage_1.default />}/>
          <react_router_dom_1.Route path="/distance-sales-agreement" element={<DistanceSalesAgreementPage_1.default />}/>
          {/* Admin Routes */}
          <react_router_dom_1.Route element={<RequireAdmin_1.default />}>
            <react_router_dom_1.Route path="/admin" element={<AdminLayout_1.default />}>
              <react_router_dom_1.Route index element={<AdminDashboard_1.default />}/>
              <react_router_dom_1.Route path="jobs" element={<AdminJobs_1.default />}/>
              <react_router_dom_1.Route path="jobs/:jobId" element={<AdminJobDetail_1.default />}/>
              <react_router_dom_1.Route path="users" element={<AdminUsers_1.default />}/>
              <react_router_dom_1.Route path="users/:userId" element={<AdminUserDetail_1.default />}/>
              <react_router_dom_1.Route path="security" element={<AdminSecurity_1.default />}/>
            </react_router_dom_1.Route>
          </react_router_dom_1.Route>

          {/* Catch all route */}
          <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/" replace/>}/>
        </react_router_dom_1.Routes>
      </div>
      {showFooter && <Footer_1.default />}
    </div>);
};
var react_helmet_async_1 = require("react-helmet-async");
var App = function () {
    return (<react_helmet_async_1.HelmetProvider>
      <react_router_dom_1.HashRouter>
        <NotificationContext_1.NotificationProvider>
          <AlertContext_1.AlertProvider>
            <AppContent />
          </AlertContext_1.AlertProvider>
        </NotificationContext_1.NotificationProvider>
      </react_router_dom_1.HashRouter>
    </react_helmet_async_1.HelmetProvider>);
};
exports.default = App;
