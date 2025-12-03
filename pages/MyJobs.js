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
var NotificationContext_1 = require("../contexts/NotificationContext");
var AlertContext_1 = require("../contexts/AlertContext");
var MyJobs = function () {
    var _a = (0, react_1.useState)([]), myJobs = _a[0], setMyJobs = _a[1];
    var _b = (0, react_1.useState)(null), expandedJobId = _b[0], setExpandedJobId = _b[1];
    var _c = (0, react_1.useState)([]), applications = _c[0], setApplications = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)(false), loadingApps = _e[0], setLoadingApps = _e[1];
    var _f = (0, react_1.useState)({}), selectedApplicantData = _f[0], setSelectedApplicantData = _f[1];
    var showNotification = (0, NotificationContext_1.useNotification)().showNotification;
    // Modal States
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _g = (0, react_1.useState)(0), _ = _g[0], setTicker = _g[1];
    (0, react_1.useEffect)(function () {
        var timer = setInterval(function () { return setTicker(function (t) { return t + 1; }); }, 1000);
        return function () { return clearInterval(timer); };
    }, []);
    (0, react_1.useEffect)(function () {
        var fetchJobs = function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, _a, jobsData, error, mappedJobs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                    case 1:
                        user = (_b.sent()).data.user;
                        if (!user)
                            return [2 /*return*/];
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('jobs')
                                .select('*')
                                .eq('created_by', user.id)
                                .order('created_at', { ascending: false })];
                    case 2:
                        _a = _b.sent(), jobsData = _a.data, error = _a.error;
                        if (error) {
                            console.error("MyJobs listener error:", error);
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        if (jobsData) {
                            mappedJobs = jobsData.map(function (job) { return ({
                                jobId: job.job_id,
                                title: job.title,
                                description: job.description,
                                city: job.city,
                                courthouse: job.courthouse,
                                date: job.date,
                                time: job.time,
                                jobType: job.job_type,
                                offeredFee: job.offered_fee,
                                createdBy: job.created_by,
                                ownerName: job.owner_name,
                                ownerPhone: job.owner_phone,
                                status: job.status,
                                applicationsCount: job.applications_count,
                                createdAt: job.created_at,
                                updatedAt: job.updated_at,
                                isUrgent: job.is_urgent,
                                applicationDeadline: job.application_deadline,
                                selectedApplicant: job.selected_applicant,
                                completedAt: job.completed_at
                            }); });
                            setMyJobs(mappedJobs);
                            // Fetch selected applicants data for "In Progress" jobs
                            mappedJobs.forEach(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                                var userData, mappedUser_1, error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(job.selectedApplicant && job.status === 'in_progress' && job.jobId)) return [3 /*break*/, 4];
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, supabaseClient_1.supabase.from('users').select('*').eq('uid', job.selectedApplicant).single()];
                                        case 2:
                                            userData = (_a.sent()).data;
                                            if (userData) {
                                                mappedUser_1 = {
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
                                                setSelectedApplicantData(function (prev) {
                                                    var _a;
                                                    return (__assign(__assign({}, prev), (_a = {}, _a[job.jobId] = mappedUser_1, _a)));
                                                });
                                            }
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_1 = _a.sent();
                                            console.error("Error fetching applicant data:", error_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchJobs();
        // Subscribe to realtime changes for jobs
        var subscription = supabaseClient_1.supabase.channel('my_jobs_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, function (payload) {
            fetchJobs(); // Re-fetch on change for simplicity
        })
            .subscribe();
        return function () {
            subscription.unsubscribe();
        };
    }, []);
    var fetchApplications = function (jobId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, appsData, error, now, currentMonthDate, applicantIds, statsData, usersData, membershipMap_1, jobCountMap_1, apps, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setExpandedJobId(expandedJobId === jobId ? null : jobId);
                    if (expandedJobId === jobId)
                        return [2 /*return*/];
                    setLoadingApps(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('applications')
                            .select('*')
                            .eq('job_id', jobId)];
                case 2:
                    _a = _b.sent(), appsData = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    if (!(appsData && appsData.length > 0)) return [3 /*break*/, 5];
                    now = new Date();
                    currentMonthDate = "".concat(now.getFullYear(), "-").concat(String(now.getMonth() + 1).padStart(2, '0'), "-01");
                    applicantIds = appsData.map(function (app) { return app.applicant_id; });
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_monthly_stats')
                            .select('user_id, job_count')
                            .in('user_id', applicantIds)
                            .eq('month', currentMonthDate)];
                case 3:
                    statsData = (_b.sent()).data;
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('users')
                            .select('uid, membership_type')
                            .in('uid', applicantIds)];
                case 4:
                    usersData = (_b.sent()).data;
                    membershipMap_1 = {};
                    usersData === null || usersData === void 0 ? void 0 : usersData.forEach(function (u) {
                        membershipMap_1[u.uid] = u.membership_type || 'free';
                    });
                    jobCountMap_1 = {};
                    statsData === null || statsData === void 0 ? void 0 : statsData.forEach(function (stat) {
                        jobCountMap_1[stat.user_id] = stat.job_count || 0;
                    });
                    apps = appsData.map(function (app) { return ({
                        applicationId: app.application_id,
                        jobId: app.job_id,
                        applicantId: app.applicant_id,
                        applicantName: app.applicant_name,
                        applicantRating: app.applicant_rating,
                        message: app.message,
                        proposedFee: app.proposed_fee,
                        status: app.status,
                        createdAt: app.created_at,
                        monthlyJobCount: jobCountMap_1[app.applicant_id] || 0,
                        membershipType: membershipMap_1[app.applicant_id]
                    }); });
                    // Sort: Premium+ first, then by monthly job count (ascending)
                    apps.sort(function (a, b) {
                        // 1. Premium Plus Priority
                        if (a.membershipType === 'premium_plus' && b.membershipType !== 'premium_plus')
                            return -1;
                        if (a.membershipType !== 'premium_plus' && b.membershipType === 'premium_plus')
                            return 1;
                        // 2. Monthly Job Count (Ascending - fewer jobs first)
                        return a.monthlyJobCount - b.monthlyJobCount;
                    });
                    setApplications(apps);
                    return [3 /*break*/, 6];
                case 5:
                    setApplications([]);
                    _b.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    error_2 = _b.sent();
                    console.error("Error fetching applications:", error_2);
                    return [3 /*break*/, 9];
                case 8:
                    setLoadingApps(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var isJobExpired = function (job) {
        var _a, _b;
        if (!job.date || !job.time)
            return false;
        try {
            var day = void 0, month = void 0, year = void 0;
            // Handle DD.MM.YYYY format
            if (job.date.includes('.')) {
                _a = job.date.split('.').map(Number), day = _a[0], month = _a[1], year = _a[2];
            }
            // Handle YYYY-MM-DD format (HTML date input standard)
            else if (job.date.includes('-')) {
                _b = job.date.split('-').map(Number), year = _b[0], month = _b[1], day = _b[2];
            }
            else {
                return false;
            }
            var _c = job.time.split(':').map(Number), hour = _c[0], minute = _c[1];
            var jobDate = new Date(year, month - 1, day, hour, minute);
            // Current time
            var now = new Date();
            return now > jobDate;
        }
        catch (e) {
            console.error("Date parsing error:", e);
            return false;
        }
    };
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    // 1. Step: Open Confirm Modal
    var handleSelectClick = function (job, app) {
        if (isJobExpired(job)) {
            showNotification('error', "Görevin süresi geçti! Artık bu göreve atama yapamazsınız.");
            return;
        }
        showAlert({
            title: "Emin misiniz?",
            message: "".concat(app.applicantName, " isimli avukata bu g\u00F6revi vermek \u00FCzeresiniz. \u0130leti\u015Fim bilgileriniz kar\u015F\u0131l\u0131kl\u0131 olarak payla\u015F\u0131lacakt\u0131r."),
            type: "confirm",
            confirmText: "Görevi Ver",
            cancelText: "Vazgeç",
            onConfirm: function () { return executeAssignment(job, app); }
        });
    };
    // 2. Step: Execute Logic
    var executeAssignment = function (job, app) { return __awaiter(void 0, void 0, void 0, function () {
        var user, jobError, appError, apiUrl, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!job || !app || !job.jobId || !app.applicationId) {
                        showAlert({ title: "Hata", message: "İşlem sırasında veri kaybı oluştu.", type: "error" });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                case 2:
                    user = (_a.sent()).data.user;
                    return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').update({
                            selected_applicant: app.applicantId,
                            status: 'in_progress'
                        }).eq('job_id', job.jobId)];
                case 3:
                    jobError = (_a.sent()).error;
                    if (jobError)
                        throw jobError;
                    return [4 /*yield*/, supabaseClient_1.supabase.from('applications').update({
                            status: 'accepted'
                        }).eq('application_id', app.applicationId)];
                case 4:
                    appError = (_a.sent()).error;
                    if (appError)
                        throw appError;
                    // 3. Notify Applicant
                    return [4 /*yield*/, supabaseClient_1.supabase.from('notifications').insert({
                            user_id: app.applicantId,
                            title: "Başvurunuz Kabul Edildi! 🎉",
                            message: "Tebrikler! \"".concat(job.title, "\" g\u00F6revi i\u00E7in se\u00E7ildiniz. G\u00F6rev sahibiyle ileti\u015Fime ge\u00E7ebilirsiniz."),
                            type: "success",
                            read: false,
                            created_at: new Date().toISOString()
                        })];
                case 5:
                    // 3. Notify Applicant
                    _a.sent();
                    if (!user) return [3 /*break*/, 7];
                    return [4 /*yield*/, supabaseClient_1.supabase.from('notifications').insert({
                            user_id: user.id,
                            title: "Görev Atandı ✅",
                            message: "\"".concat(job.title, "\" g\u00F6revi Av. ").concat(app.applicantName, "'e atand\u0131."),
                            type: "info",
                            read: false,
                            created_at: new Date().toISOString()
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    apiUrl = import.meta.env.VITE_API_URL || '';
                    fetch("".concat(apiUrl, "/api/notify-application-approved"), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            applicantId: app.applicantId,
                            jobTitle: job.title
                        })
                    }).catch(function (err) { return console.error("SMS Notification Error:", err); });
                    // Show Success Modal
                    showAlert({
                        title: "İşlem Başarılı!",
                        message: "Görev ataması başarıyla yapıldı! İletişim bilgileri açılıyor...",
                        type: "success",
                        confirmText: "Profiline Git",
                        onConfirm: function () { return navigate("/profile/".concat(app.applicantId)); }
                    });
                    return [3 /*break*/, 9];
                case 8:
                    error_3 = _a.sent();
                    console.error("Error selecting applicant:", error_3);
                    showAlert({ title: "Hata", message: "Hata: ".concat(error_3.message || 'Bilinmeyen hata'), type: "error" });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var getTimeLeft = function (deadline) {
        if (!deadline)
            return 0;
        var deadlineDate = new Date(deadline);
        var diff = deadlineDate.getTime() - new Date().getTime();
        return diff > 0 ? diff : 0;
    };
    var formatTime = function (ms) {
        var minutes = Math.floor(ms / 60000);
        var seconds = Math.floor((ms % 60000) / 1000);
        return "".concat(minutes, ":").concat(seconds < 10 ? '0' : '').concat(seconds);
    };
    if (loading)
        return <div className="flex justify-center p-12"><lucide_react_1.Loader2 className="animate-spin"/></div>;
    return (<div className="max-w-5xl mx-auto px-4 py-8 relative">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Görevlerim</h2>



      <div className="space-y-4">
        {myJobs.length === 0 && <p className="text-slate-500">Henüz görev yayınlamadınız.</p>}
        {myJobs.map(function (job) {
            // Check if application deadline has passed
            var isApplicationOpen = job.applicationDeadline
                ? Date.now() < new Date(job.applicationDeadline).getTime()
                : true; // If no deadline set, assume open
            var selectedUser = job.jobId ? selectedApplicantData[job.jobId] : null;
            return (<div key={job.jobId} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={"px-2.5 py-0.5 rounded-full text-xs font-bold ".concat(job.status === 'open' && isJobExpired(job) ? 'bg-red-100 text-red-700' :
                    job.status === 'open' && !isApplicationOpen ? 'bg-orange-100 text-orange-700' :
                        job.status === 'open' ? 'bg-green-100 text-green-700' :
                            job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700')}>
                      {job.status === 'open' && isJobExpired(job) ? 'Süresi Geçmiş' :
                    job.status === 'open' && !isApplicationOpen ? 'Başvurular Kapandı' :
                        job.status === 'open' ? 'Başvuruya Açık' :
                            job.status === 'in_progress' ? 'Atandı' :
                                job.status === 'completed' ? 'Tamamlandı' :
                                    job.status === 'cancelled' ? 'İptal Edildi' : job.status}
                    </span>
                    {job.isUrgent && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">ACİL</span>}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.city} • {job.courthouse} • {job.date}</p>

                  {/* SELECTED APPLICANT INFO CARD */}
                  {job.status === 'in_progress' && selectedUser && (<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between animate-in fade-in">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-white border border-green-200 flex items-center justify-center text-green-700 font-bold text-lg shadow-sm">
                          {selectedUser.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Görevi Üstlenen</p>
                          <p className="font-bold text-slate-900">{selectedUser.fullName}</p>
                          <p className="text-sm text-slate-600">{selectedUser.baroCity} Barosu • Sicil: {selectedUser.baroNumber} • {selectedUser.phone}</p>
                          {selectedUser.address && <p className="text-xs text-slate-500 mt-1">{selectedUser.address}</p>}
                        </div>
                      </div>
                      <button onClick={function () { return navigate("/profile/".concat(selectedUser.uid)); }} className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition flex items-center shadow-sm">
                        <lucide_react_1.User className="w-4 h-4 mr-2"/> Profil
                      </button>
                    </div>)}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {job.status === 'open' && job.applicationDeadline && (<div className={"flex items-center font-mono text-sm px-3 py-1 rounded-md ".concat(isApplicationOpen ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500')}>
                      <lucide_react_1.Timer className="w-4 h-4 mr-2"/>
                      {isApplicationOpen ? (<span>Seçim İçin: {formatTime(getTimeLeft(job.applicationDeadline))}</span>) : (<span>Seçim Yapılabilir</span>)}
                    </div>)}

                  <button onClick={function () { return navigate("/job/".concat(job.jobId)); }} className="flex items-center text-slate-600 font-medium hover:bg-slate-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-slate-200">
                    <lucide_react_1.Users className="w-4 h-4 mr-2"/>
                    Görevi Görüntüle
                  </button>

                  <button onClick={function () { return fetchApplications(job.jobId); }} disabled={isApplicationOpen} className={"flex items-center font-medium px-4 py-2 rounded-lg transition border border-transparent ".concat(isApplicationOpen
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'text-primary-600 hover:bg-primary-50 hover:border-primary-100')}>
                    <lucide_react_1.Users className="w-4 h-4 mr-2"/>
                    Başvuruları Yönet {expandedJobId === job.jobId ? <lucide_react_1.ChevronDown className="ml-1 w-4 h-4 rotate-180"/> : <lucide_react_1.ChevronDown className="ml-1 w-4 h-4"/>}
                  </button>
                </div>
              </div>

              {expandedJobId === job.jobId && (<div className="bg-slate-50 border-t border-slate-200 p-6 animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-slate-800 mb-4">Gelen Başvurular ({applications.length})</h4>
                  {loadingApps ? (<lucide_react_1.Loader2 className="animate-spin text-slate-400"/>) : applications.length === 0 ? (<p className="text-sm text-slate-500">Henüz başvuru yok.</p>) : (<div className="space-y-3">
                      {applications.map(function (app, index) {
                            var isSelected = job.selectedApplicant === app.applicantId;
                            // Calculate minimum job count and restriction
                            var minJobCount = applications.length > 0 ? Math.min.apply(Math, applications.map(function (a) { return a.monthlyJobCount || 0; })) : 0;
                            var isRestricted = (app.monthlyJobCount || 0) > (minJobCount + 3);
                            var isPremiumPlus = app.membershipType === 'premium_plus';
                            return (<div key={app.applicationId} className={"bg-white p-4 rounded-lg border flex justify-between items-center shadow-sm transition-all duration-300 ".concat(isSelected ? 'border-green-500 ring-1 ring-green-500' :
                                    isPremiumPlus ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-100 bg-amber-50/30' :
                                        isRestricted ? 'border-orange-200 bg-orange-50/30' :
                                            'border-slate-200')}>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span onClick={function () { return isSelected && navigate("/profile/".concat(app.applicantId)); }} className={"font-bold transition ".concat(isSelected ? 'text-slate-800 cursor-pointer hover:text-primary-600 hover:underline' : 'text-slate-500 cursor-default')}>
                                  {isSelected ? app.applicantName : (function () {
                                    var parts = app.applicantName.trim().split(/\s+/);
                                    if (parts.length === 1)
                                        return "".concat(parts[0].charAt(0), ".");
                                    return "".concat(parts[0].charAt(0), ". ").concat(parts[parts.length - 1].charAt(0), ".");
                                })()}
                                </span>
                                <span className="flex items-center text-amber-500 text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                  <lucide_react_1.Star className="w-3 h-3 fill-current mr-1"/>
                                  {app.applicantRating ? app.applicantRating.toFixed(1) : '0.0'}
                                </span>
                                <span className="flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-medium">
                                  Bu ay: {app.monthlyJobCount || 0} görev
                                </span>
                                {isSelected && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">SEÇİLDİ</span>}
                                {isPremiumPlus && !isSelected && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200 flex items-center"><lucide_react_1.Star className="w-3 h-3 mr-1 fill-amber-700"/> PREMIUM+</span>}
                                {isRestricted && !isSelected && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200">SEÇİLEMEZ</span>}
                              </div>
                              <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100 italic">"{app.message}"</p>
                              <div className="flex items-center mt-2 text-xs text-slate-500 space-x-4">
                                <span className="flex items-center text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded"><lucide_react_1.DollarSign className="w-3 h-3 mr-1"/> Teklif: {app.proposedFee} TL</span>
                              </div>
                            </div>

                            {!isSelected && (<button onClick={function () { return handleSelectClick(job, app); }} disabled={isApplicationOpen || isJobExpired(job) || isRestricted} className={"px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm ml-4 ".concat(isApplicationOpen || isJobExpired(job) || isRestricted
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md')}>
                                {isJobExpired(job) ? 'Süre Doldu' : isApplicationOpen ? 'Süre' : isRestricted ? 'Seçilemez' : 'Görevi Ver'}
                              </button>)}
                            {isSelected && (<button onClick={function () { return navigate("/profile/".concat(app.applicantId)); }} className="text-green-600 font-bold text-sm flex items-center hover:underline bg-green-50 px-3 py-2 rounded-lg ml-4">
                                <lucide_react_1.CheckCircle className="w-4 h-4 mr-2"/> İletişim Bilgileri
                              </button>)}
                          </div>);
                        })}
                    </div>)}
                </div>)}
            </div>);
        })}
      </div>
    </div>);
};
exports.default = MyJobs;
