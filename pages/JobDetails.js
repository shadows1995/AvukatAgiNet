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
var ApplyModal_1 = require("../components/ApplyModal");
var AlertContext_1 = require("../contexts/AlertContext");
var SEO_1 = require("../components/SEO");
var JobDetails = function (_a) {
    var user = _a.user;
    var jobId = (0, react_router_dom_1.useParams)().jobId;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(null), job = _b[0], setJob = _b[1];
    var _c = (0, react_1.useState)(null), owner = _c[0], setOwner = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)(false), isApplyModalOpen = _e[0], setIsApplyModalOpen = _e[1];
    var _f = (0, react_1.useState)(false), completing = _f[0], setCompleting = _f[1];
    var _g = (0, react_1.useState)(null), myApplication = _g[0], setMyApplication = _g[1];
    (0, react_1.useEffect)(function () {
        var fetchJobDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, jobData, jobError, mappedJob, _b, ownerData, ownerError, mappedOwner, appData, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!jobId)
                            return [2 /*return*/];
                        setLoading(true);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 8]);
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('jobs')
                                .select('*')
                                .eq('job_id', jobId)
                                .single()];
                    case 2:
                        _a = _c.sent(), jobData = _a.data, jobError = _a.error;
                        if (jobError)
                            throw jobError;
                        if (!jobData) return [3 /*break*/, 5];
                        mappedJob = {
                            jobId: jobData.job_id,
                            title: jobData.title,
                            createdBy: jobData.created_by,
                            ownerName: jobData.owner_name,
                            ownerPhone: jobData.owner_phone,
                            city: jobData.city,
                            courthouse: jobData.courthouse,
                            date: jobData.date,
                            time: jobData.time,
                            jobType: jobData.job_type,
                            description: jobData.description,
                            offeredFee: jobData.offered_fee,
                            status: jobData.status,
                            applicationsCount: jobData.applications_count,
                            selectedApplicant: jobData.selected_applicant,
                            createdAt: jobData.created_at,
                            updatedAt: jobData.updated_at,
                            isUrgent: jobData.is_urgent,
                            applicationDeadline: jobData.application_deadline
                        };
                        setJob(mappedJob);
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('users')
                                .select('*')
                                .eq('uid', mappedJob.createdBy)
                                .single()];
                    case 3:
                        _b = _c.sent(), ownerData = _b.data, ownerError = _b.error;
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
                                title: ownerData.title
                            };
                            setOwner(mappedOwner);
                        }
                        if (!user) return [3 /*break*/, 5];
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('applications')
                                .select('*')
                                .eq('job_id', jobId)
                                .eq('applicant_id', user.uid)
                                .single()];
                    case 4:
                        appData = (_c.sent()).data;
                        if (appData) {
                            setMyApplication({
                                applicationId: appData.application_id,
                                jobId: appData.job_id,
                                applicantId: appData.applicant_id,
                                applicantName: appData.applicant_name,
                                message: appData.message,
                                proposedFee: appData.proposed_fee,
                                status: appData.status,
                                createdAt: appData.created_at,
                                applicantPhone: appData.applicant_phone,
                                applicantRating: appData.applicant_rating
                            });
                        }
                        _c.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_1 = _c.sent();
                        console.error("Error fetching job details:", error_1);
                        return [3 /*break*/, 8];
                    case 7:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        fetchJobDetails();
    }, [jobId, user]);
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    var handleCompleteTask = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!job || !user || !owner)
                return [2 /*return*/];
            showAlert({
                title: "Görevi Tamamla",
                message: "Bu görevi tamamladığınızı onaylıyor musunuz?",
                type: "confirm",
                confirmText: "Evet, Tamamla",
                cancelText: "Vazgeç",
                onConfirm: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var updateError, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                setCompleting(true);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, 5, 6]);
                                return [4 /*yield*/, supabaseClient_1.supabase
                                        .from('jobs')
                                        .update({
                                        status: 'completed',
                                        completed_at: new Date().toISOString()
                                    })
                                        .eq('job_id', job.jobId)];
                            case 2:
                                updateError = (_a.sent()).error;
                                if (updateError)
                                    throw updateError;
                                // 2. Notify Owner
                                return [4 /*yield*/, supabaseClient_1.supabase.from('notifications').insert({
                                        user_id: owner.uid,
                                        title: "Görev Tamamlandı! 🎉",
                                        message: "\"".concat(job.title, "\" g\u00F6revi Av. ").concat(user.fullName, " taraf\u0131ndan tamamland\u0131."),
                                        type: "success",
                                        read: false
                                    })];
                            case 3:
                                // 2. Notify Owner
                                _a.sent();
                                showAlert({
                                    title: "Başarılı",
                                    message: "Görev başarıyla tamamlandı olarak işaretlendi.",
                                    type: "success",
                                    confirmText: "Tamam"
                                });
                                // Refresh job data
                                setJob(function (prev) { return prev ? __assign(__assign({}, prev), { status: 'completed' }) : null; });
                                return [3 /*break*/, 6];
                            case 4:
                                error_2 = _a.sent();
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
        });
    }); };
    var handleWhatsApp = function (phone) {
        var cleanPhone = phone.replace(/\D/g, '');
        var finalPhone = cleanPhone;
        if (finalPhone.startsWith('0'))
            finalPhone = finalPhone.substring(1);
        if (finalPhone.length === 10)
            finalPhone = '90' + finalPhone;
        window.open("https://wa.me/".concat(finalPhone), '_blank');
    };
    if (loading)
        return <div className="flex justify-center p-20"><lucide_react_1.Loader2 className="animate-spin w-8 h-8 text-primary-600"/></div>;
    if (!job || !owner)
        return <div className="text-center p-20 text-slate-500">Görev bulunamadı.</div>;
    var isOwner = user.uid === job.createdBy;
    var isAssignedToMe = job.selectedApplicant === user.uid;
    var isCompleted = job.status === 'completed';
    var canViewContact = isOwner || isAssignedToMe;
    return (<div className="max-w-3xl mx-auto px-4 py-8">
            <SEO_1.default title={"".concat(job.title, " - ").concat(job.city, " / ").concat(job.courthouse)} description={"".concat(job.city, " ").concat(job.courthouse, " adliyesinde ").concat(job.jobType, " i\u015Fi. \u00DCcret: ").concat(job.offeredFee, " TL. Hemen ba\u015Fvurun.")}/>
            <button onClick={function () { return navigate(-1); }} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition">
                <lucide_react_1.ArrowLeft className="w-5 h-5 mr-2"/> Geri Dön
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-primary-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold">{job.title}</h1>
                            {isCompleted && (<span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-green-400">
                                    TAMAMLANDI
                                </span>)}
                        </div>

                        <div className="flex flex-wrap gap-4 text-primary-100 text-sm">
                            <span className="flex items-center"><lucide_react_1.MapPin className="w-4 h-4 mr-1"/> {job.city} / {job.courthouse}</span>
                            <span className="flex items-center"><lucide_react_1.Calendar className="w-4 h-4 mr-1"/> {job.date}</span>
                            <span className="flex items-center"><lucide_react_1.Clock className="w-4 h-4 mr-1"/> {job.time}</span>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">
                                {job.offeredFee} TL
                            </div>
                            {job.isUrgent && (<span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                    ACİL
                                </span>)}
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Görev Detayları</h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                    </div>
                </div>

                {/* Actions */}
                {isAssignedToMe ? (<div className="space-y-4">
                        {/* Contact Buttons for Assignee */}
                        {owner.phone && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={function () { return handleWhatsApp(owner.phone); }} className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition shadow-md hover:shadow-lg">
                                    <lucide_react_1.MessageCircle className="w-5 h-5 mr-2"/> WhatsApp
                                </button>
                                <a href={"tel:".concat(owner.phone)} className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md hover:shadow-lg">
                                    <lucide_react_1.Phone className="w-5 h-5 mr-2"/> Ara
                                </a>
                            </div>)}

                        {/* Complete Task Button */}
                        {!isCompleted && (<div className="pt-4 border-t border-slate-100">
                                <button onClick={handleCompleteTask} disabled={completing} className="w-full flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                                    {completing ? <lucide_react_1.Loader2 className="animate-spin w-5 h-5 mr-2"/> : <lucide_react_1.CheckCircle className="w-5 h-5 mr-2"/>}
                                    Görevi Tamamla
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-3">
                                    Görevi tamamladığınızda görev sahibine bildirim gönderilecektir.
                                </p>
                            </div>)}
                    </div>) : isOwner ? (<div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 text-center font-medium">
                        Bu görevi siz oluşturdunuz.
                    </div>) : (
        // Apply Button for Others
        <div className="mt-8 pt-8 border-t border-slate-100">
                        {myApplication ? (<div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex items-center justify-center font-bold">
                                <lucide_react_1.CheckCircle className="w-5 h-5 mr-2"/>
                                Bu göreve başvurdunuz ({myApplication.status === 'pending' ? 'Beklemede' : myApplication.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'})
                            </div>) : (function () {
                // Calculate application deadline
                var lockDuration = job.isUrgent ? 5 : 15;
                var applicationDeadline = new Date(job.createdAt).getTime() + lockDuration * 60000;
                var isApplicationClosed = Date.now() > applicationDeadline;
                if (isApplicationClosed) {
                    return (<div className="bg-slate-100 text-slate-500 p-4 rounded-xl border border-slate-200 flex items-center justify-center font-bold">
                                        <lucide_react_1.Clock className="w-5 h-5 mr-2"/>
                                        Başvuru süresi doldu
                                    </div>);
                }
                return (<button onClick={function () { return setIsApplyModalOpen(true); }} className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Göreve Başvur
                                </button>);
            })()}
                    </div>)}
            </div>

            {/* Apply Modal */}
            {isApplyModalOpen && (<ApplyModal_1.default onClose={function () { return setIsApplyModalOpen(false); }} job={job} user={user} onSuccess={function () {
                setMyApplication({
                    applicationId: 'temp-id',
                    jobId: job.jobId,
                    applicantId: user.uid,
                    applicantName: user.fullName,
                    message: '',
                    proposedFee: job.offeredFee,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    applicantPhone: user.phone || '',
                    applicantRating: user.rating || 0
                });
            }}/>)}
        </div>);
};
exports.default = JobDetails;
