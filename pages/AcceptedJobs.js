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
var RatingModal_1 = require("../components/RatingModal");
var AcceptedJobs = function () {
    var _a = (0, react_1.useState)([]), acceptedJobs = _a[0], setAcceptedJobs = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), selectedJob = _c[0], setSelectedJob = _c[1];
    var _d = (0, react_1.useState)(false), completing = _d[0], setCompleting = _d[1];
    var _e = (0, react_1.useState)(false), showRatingModal = _e[0], setShowRatingModal = _e[1];
    var _f = (0, react_1.useState)(false), canRate = _f[0], setCanRate = _f[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    (0, react_1.useEffect)(function () {
        fetchAcceptedJobs();
    }, []);
    var fetchAcceptedJobs = function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, _a, jobsData, jobsError, acceptedJobsData_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                case 1:
                    user = (_b.sent()).data.user;
                    if (!user)
                        return [2 /*return*/];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 6, 7, 8]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('jobs')
                            .select('*')
                            .eq('selected_applicant', user.id)
                            .order('created_at', { ascending: false })];
                case 3:
                    _a = _b.sent(), jobsData = _a.data, jobsError = _a.error;
                    if (jobsError)
                        throw jobsError;
                    acceptedJobsData_1 = [];
                    if (!jobsData) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.all(jobsData.map(function (jobData) { return __awaiter(void 0, void 0, void 0, function () {
                            var mappedJob, appData, mappedApp, ownerData, mappedOwner;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        mappedJob = {
                                            jobId: jobData.job_id,
                                            title: jobData.title,
                                            description: jobData.description,
                                            city: jobData.city,
                                            courthouse: jobData.courthouse,
                                            date: jobData.date,
                                            time: jobData.time,
                                            jobType: jobData.job_type,
                                            offeredFee: jobData.offered_fee,
                                            createdBy: jobData.created_by,
                                            ownerName: jobData.owner_name,
                                            ownerPhone: jobData.owner_phone,
                                            status: jobData.status,
                                            applicationsCount: jobData.applications_count,
                                            createdAt: jobData.created_at,
                                            updatedAt: jobData.updated_at,
                                            isUrgent: jobData.is_urgent,
                                            applicationDeadline: jobData.application_deadline,
                                            selectedApplicant: jobData.selected_applicant,
                                            completedAt: jobData.completed_at
                                        };
                                        return [4 /*yield*/, supabaseClient_1.supabase
                                                .from('applications')
                                                .select('*')
                                                .eq('job_id', jobData.job_id)
                                                .eq('applicant_id', user.id)
                                                .single()];
                                    case 1:
                                        appData = (_b.sent()).data;
                                        mappedApp = appData ? {
                                            applicationId: appData.application_id,
                                            jobId: appData.job_id,
                                            applicantId: appData.applicant_id,
                                            applicantName: appData.applicant_name,
                                            applicantRating: appData.applicant_rating,
                                            message: appData.message,
                                            proposedFee: appData.proposed_fee,
                                            status: appData.status,
                                            createdAt: appData.created_at
                                        } : {
                                            jobId: jobData.job_id,
                                            applicantId: user.id,
                                            applicantName: ((_a = user.user_metadata) === null || _a === void 0 ? void 0 : _a.full_name) || '',
                                            message: '',
                                            proposedFee: jobData.offered_fee,
                                            status: 'accepted',
                                            createdAt: new Date().toISOString()
                                        };
                                        return [4 /*yield*/, supabaseClient_1.supabase
                                                .from('users')
                                                .select('*')
                                                .eq('uid', jobData.created_by)
                                                .single()];
                                    case 2:
                                        ownerData = (_b.sent()).data;
                                        if (ownerData) {
                                            mappedOwner = {
                                                uid: ownerData.uid,
                                                email: ownerData.email,
                                                fullName: ownerData.full_name,
                                                baroNumber: ownerData.baro_number,
                                                baroCity: ownerData.baro_city,
                                                phone: ownerData.phone,
                                                specializations: ownerData.specializations,
                                                city: ownerData.city,
                                                preferredCourthouses: ownerData.preferred_courthouses,
                                                isPremium: ownerData.is_premium,
                                                membershipType: ownerData.membership_type,
                                                premiumUntil: ownerData.premium_until,
                                                premiumSince: ownerData.premium_since,
                                                premiumPlan: ownerData.premium_plan,
                                                premiumPrice: ownerData.premium_price,
                                                role: ownerData.role,
                                                rating: ownerData.rating,
                                                completedJobs: ownerData.completed_jobs,
                                                avatarUrl: ownerData.avatar_url,
                                                createdAt: ownerData.created_at,
                                                updatedAt: ownerData.updated_at,
                                                jobStatus: ownerData.job_status,
                                                aboutMe: ownerData.about_me,
                                                title: ownerData.title,
                                                address: ownerData.address
                                            };
                                            acceptedJobsData_1.push({
                                                job: mappedJob,
                                                application: mappedApp,
                                                owner: mappedOwner
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    setAcceptedJobs(acceptedJobsData_1);
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _b.sent();
                    console.error("Error fetching accepted jobs:", error_1);
                    return [3 /*break*/, 8];
                case 7:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var checkCanRate = function (jobId) { return __awaiter(void 0, void 0, void 0, function () {
        var user, job;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                case 1:
                    user = (_a.sent()).data.user;
                    if (!user)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('jobs')
                            .select('lawyer_rated')
                            .eq('job_id', jobId)
                            .single()];
                case 2:
                    job = (_a.sent()).data;
                    return [2 /*return*/, job && !job.lawyer_rated];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (selectedJob && selectedJob.job.status === 'completed') {
            checkCanRate(selectedJob.job.jobId).then(setCanRate);
        }
        else {
            setCanRate(false);
        }
    }, [selectedJob]);
    var handleRatingSuccess = function () {
        setShowRatingModal(false);
        setCanRate(false);
    };
    var handleWhatsApp = function (phone) {
        var cleanPhone = phone.replace(/\D/g, '');
        var finalPhone = cleanPhone;
        if (finalPhone.startsWith('0'))
            finalPhone = finalPhone.substring(1);
        if (finalPhone.length === 10)
            finalPhone = '90' + finalPhone;
        window.open("https://wa.me/".concat(finalPhone), '_blank');
    };
    var handleCompleteTask = function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedJob)
                        return [2 /*return*/];
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                case 1:
                    user = (_a.sent()).data.user;
                    if (!user)
                        return [2 /*return*/];
                    showAlert({
                        title: "Görevi Tamamla",
                        message: "Bu görevi tamamladığınızı onaylıyor musunuz?",
                        type: "confirm",
                        confirmText: "Evet, Tamamla",
                        cancelText: "Vazgeç",
                        onConfirm: function () { return __awaiter(void 0, void 0, void 0, function () {
                            var jobError, error_2;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        setCompleting(true);
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 4, 5, 6]);
                                        return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').update({
                                                status: 'completed',
                                                completed_at: new Date().toISOString()
                                            }).eq('job_id', selectedJob.job.jobId)];
                                    case 2:
                                        jobError = (_b.sent()).error;
                                        if (jobError)
                                            throw jobError;
                                        return [4 /*yield*/, supabaseClient_1.supabase.from('notifications').insert({
                                                user_id: selectedJob.owner.uid,
                                                title: "Görev Tamamlandı! 🎉",
                                                message: "\"".concat(selectedJob.job.title, "\" g\u00F6revi Av. ").concat(((_a = user.user_metadata) === null || _a === void 0 ? void 0 : _a.full_name) || 'Meslektaşınız', " taraf\u0131ndan tamamland\u0131."),
                                                type: "success",
                                                read: false,
                                                created_at: new Date().toISOString()
                                            })];
                                    case 3:
                                        _b.sent();
                                        showAlert({
                                            title: "Başarılı",
                                            message: "Görev başarıyla tamamlandı olarak işaretlendi.",
                                            type: "success",
                                            confirmText: "Tamam"
                                        });
                                        setAcceptedJobs(function (prev) { return prev.map(function (j) {
                                            return j.job.jobId === selectedJob.job.jobId
                                                ? __assign(__assign({}, j), { job: __assign(__assign({}, j.job), { status: 'completed' }) }) : j;
                                        }); });
                                        setSelectedJob(function (prev) { return prev ? __assign(__assign({}, prev), { job: __assign(__assign({}, prev.job), { status: 'completed' }) }) : null; });
                                        return [3 /*break*/, 6];
                                    case 4:
                                        error_2 = _b.sent();
                                        console.error("Error completing task:", error_2);
                                        showAlert({
                                            title: "Hata",
                                            message: "Bir hata oluştu.",
                                            type: "error",
                                            confirmText: "Tamam"
                                        });
                                        return [3 /*break*/, 6];
                                    case 5:
                                        setCompleting(false);
                                        return [7 /*endfinally*/];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); }
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return <div className="flex justify-center p-12"><lucide_react_1.Loader2 className="animate-spin"/></div>;
    if (selectedJob) {
        var job = selectedJob.job, owner_1 = selectedJob.owner, application = selectedJob.application;
        return (<div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={function () { return setSelectedJob(null); }} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition">
          <lucide_react_1.ArrowLeft className="w-5 h-5 mr-2"/> Listeye Dön
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="bg-primary-600 p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-primary-100 text-sm">
              <span className="flex items-center"><lucide_react_1.MapPin className="w-4 h-4 mr-1"/> {job.city} / {job.courthouse}</span>
              <span className="flex items-center"><lucide_react_1.Calendar className="w-4 h-4 mr-1"/> {job.date}</span>
              <span className="flex items-center"><lucide_react_1.Clock className="w-4 h-4 mr-1"/> {job.time}</span>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Görev Detayları</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Görev Sahibi</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary-600 font-bold text-lg shadow-sm">
                    {owner_1.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{owner_1.title || 'Av.'} {owner_1.fullName}</h4>
                    <p className="text-sm text-slate-500">{owner_1.baroCity} Barosu • {owner_1.phone}</p>
                  </div>
                </div>
                <button onClick={function () { return navigate("/profile/".concat(owner_1.uid)); }} className="text-primary-600 font-medium hover:underline text-sm">
                  Profili Gör
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {owner_1.phone && (<>
                  <button onClick={function () { return handleWhatsApp(owner_1.phone); }} className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition shadow-md hover:shadow-lg">
                    <lucide_react_1.MessageCircle className="w-5 h-5 mr-2"/> WhatsApp
                  </button>
                  <a href={"tel:".concat(owner_1.phone)} className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md hover:shadow-lg">
                    <lucide_react_1.Phone className="w-5 h-5 mr-2"/> Ara
                  </a>
                </>)}
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button onClick={handleCompleteTask} disabled={completing || job.status === 'completed'} className={"w-full flex items-center justify-center px-6 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ".concat(job.status === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800')}>
                {completing ? (<lucide_react_1.Loader2 className="animate-spin w-5 h-5 mr-2"/>) : job.status === 'completed' ? (<lucide_react_1.CheckCircle className="w-5 h-5 mr-2"/>) : (<lucide_react_1.CheckCircle className="w-5 h-5 mr-2"/>)}
                {job.status === 'completed' ? 'Görevi Tamamladınız' : 'Görevi Tamamla'}
              </button>

              {job.status === 'completed' && canRate && (<button onClick={function () { return setShowRatingModal(true); }} className="w-full flex items-center justify-center px-6 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl bg-yellow-500 text-white hover:bg-yellow-600 mt-3">
                  <lucide_react_1.Star className="w-5 h-5 mr-2"/>
                  Görev Sahibini Değerlendir
                </button>)}

              {job.status === 'completed' && !canRate && (<p className="text-center text-xs text-slate-500 mt-3">
                  ✓ Görev sahibini değerlendirdiniz
                </p>)}

              <p className="text-center text-xs text-slate-400 mt-3">
                Görevi tamamladığınızda görev sahibine bildirim gönderilecektir.
              </p>
            </div>
          </div>
        </div>

        <RatingModal_1.default isOpen={showRatingModal} onClose={function () { return setShowRatingModal(false); }} jobId={job.jobId} revieweeId={owner_1.uid} revieweeName={owner_1.fullName} onSuccess={handleRatingSuccess}/>
      </div>);
    }
    return (<div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Aldığım Görevler</h2>

      {acceptedJobs.length === 0 ? (<div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <lucide_react_1.User className="w-8 h-8 text-slate-400"/>
          </div>
          <h3 className="text-lg font-medium text-slate-900">Aktif göreviniz bulunmuyor.</h3>
          <p className="text-slate-500 mt-2">Başvurularınız kabul edildiğinde burada listelenecektir.</p>
          <button onClick={function () { return navigate('/'); }} className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition">
            Görevlere Göz At
          </button>
        </div>) : (<div className="space-y-4">
          {acceptedJobs.map(function (data) { return (<div key={data.job.jobId} onClick={function () { return setSelectedJob(data); }} className={"border rounded-xl p-6 hover:shadow-md transition cursor-pointer group flex justify-between items-center ".concat(data.job.status === 'completed' ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200')}>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition">{data.job.title}</h3>
                  {data.job.status === 'completed' && (<span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                      TAMAMLANDI
                    </span>)}
                </div>
                <div className="flex items-center text-slate-500 text-sm mt-1 space-x-3">
                  <span className="flex items-center"><lucide_react_1.MapPin className="w-3 h-3 mr-1"/> {data.job.city}</span>
                  <span className="flex items-center"><lucide_react_1.Calendar className="w-3 h-3 mr-1"/> {data.job.date}</span>
                </div>
              </div>
              <div className="flex items-center text-slate-400">
                <span className="text-sm font-medium mr-4 text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {data.application.proposedFee} TL
                </span>
                <lucide_react_1.ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition"/>
              </div>
            </div>); })}
        </div>)}
    </div>);
};
exports.default = AcceptedJobs;
