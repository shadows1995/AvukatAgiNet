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
var types_1 = require("../types");
var supabaseClient_1 = require("../supabaseClient");
var JobCard_1 = require("../components/JobCard");
var Dashboard = function (_a) {
    var user = _a.user;
    // Search Tab State
    var _b = (0, react_1.useState)([]), jobs = _b[0], setJobs = _b[1];
    var _c = (0, react_1.useState)([]), appliedJobIds = _c[0], setAppliedJobIds = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)('ALL'), filterType = _e[0], setFilterType = _e[1];
    var _f = (0, react_1.useState)(null), errorMsg = _f[0], setErrorMsg = _f[1];
    var _g = (0, react_1.useState)(false), showCourthouseModal = _g[0], setShowCourthouseModal = _g[1];
    // Fetch Jobs for Search
    (0, react_1.useEffect)(function () {
        var fetchJobs = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, data, error, jobsData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase.from('jobs').select('*')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Dashboard job fetch error:", error);
                            setErrorMsg("Görevler yüklenirken bir sorun oluştu.");
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        jobsData = (data || []).map(function (d) { return ({
                            jobId: d.job_id,
                            title: d.title,
                            createdBy: d.created_by,
                            ownerName: d.owner_name,
                            ownerPhone: d.owner_phone,
                            city: d.city,
                            courthouse: d.courthouse,
                            date: d.date,
                            time: d.time,
                            jobType: d.job_type,
                            description: d.description,
                            offeredFee: d.offered_fee,
                            status: d.status,
                            applicationsCount: d.applications_count,
                            selectedApplicant: d.selected_applicant,
                            createdAt: d.created_at,
                            updatedAt: d.updated_at,
                            isUrgent: d.is_urgent,
                            applicationDeadline: d.application_deadline
                        }); });
                        jobsData.sort(function (a, b) {
                            var timeA = new Date(a.createdAt).getTime();
                            var timeB = new Date(b.createdAt).getTime();
                            return timeB - timeA;
                        });
                        setJobs(jobsData);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchJobs();
        var subscription = supabaseClient_1.supabase
            .channel('public:jobs')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, function () {
            fetchJobs();
        })
            .subscribe();
        return function () {
            subscription.unsubscribe();
        };
    }, []);
    // Fetch Applied Jobs
    (0, react_1.useEffect)(function () {
        if (!user)
            return;
        var fetchApplied = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase
                            .from('applications')
                            .select('job_id')
                            .eq('applicant_id', user.uid)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (data) {
                            setAppliedJobIds(data.map(function (d) { return d.job_id; }));
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        fetchApplied();
        var subscription = supabaseClient_1.supabase
            .channel('public:applications')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: "applicant_id=eq.".concat(user.uid) }, function () {
            fetchApplied();
        })
            .subscribe();
        return function () {
            subscription.unsubscribe();
        };
    }, [user]);
    var userCourthouses = user.preferredCourthouses || [];
    var filteredJobs = jobs.filter(function (job) {
        if (job.createdBy === user.uid)
            return false;
        if (job.status !== 'open')
            return false;
        if (filterType !== 'ALL' && job.jobType !== filterType)
            return false;
        // Admins see all jobs, others see only their preferred courthouses
        if (user.role !== 'admin' && !userCourthouses.includes(job.courthouse))
            return false;
        // Filter expired jobs: hide if job date/time passed AND user is not involved
        if (job.date) {
            try {
                // Parse date (YYYY-MM-DD) and time (HH:MM)
                var jobDate = new Date(job.date);
                if (job.time) {
                    var _a = job.time.split(':').map(Number), hours = _a[0], minutes = _a[1];
                    jobDate.setHours(hours, minutes);
                }
                else {
                    // If no time, assume end of day
                    jobDate.setHours(23, 59, 59);
                }
                var now = new Date();
                var isExpired = jobDate < now;
                var isInvolved = job.createdBy === user.uid || job.assignedTo === user.uid;
                if (isExpired && !isInvolved) {
                    return false;
                }
            }
            catch (e) {
                console.warn("Date parsing error for job:", job.jobId, e);
            }
        }
        return true;
    });
    return (<div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">

      {/* Header & Tabs */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Görevler</h2>
          <p className="text-slate-500 text-sm mt-1">Hoşgeldiniz, Av. {user.fullName}</p>
        </div>
      </div>

      {/* SEARCH TAB */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-end mb-6">
          <react_router_dom_1.Link to="/create-job" className="flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <lucide_react_1.PlusCircle className="h-5 w-5 mr-2"/> Yeni Görev Oluştur
          </react_router_dom_1.Link>
        </div>

        {errorMsg && (<div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {errorMsg}
          </div>)}

        {/* Warning if no courthouses selected */}
        {userCourthouses.length === 0 && (<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <lucide_react_1.AlertCircle className="h-5 w-5 text-yellow-400"/>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Henüz görev almak istediğiniz bir adliye seçmediniz. Size uygun görevleri görebilmek için
                  <react_router_dom_1.Link to="/settings" className="font-medium underline text-yellow-800 ml-1 hover:text-yellow-900">
                    Ayarlar sayfasından seçim yapınız.
                  </react_router_dom_1.Link>
                </p>
              </div>
            </div>
          </div>)}

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
              <lucide_react_1.Briefcase className="h-5 w-5 text-slate-400"/>
              <select className="bg-transparent border-none focus:ring-0 text-slate-700 font-medium text-sm pr-8 cursor-pointer" value={filterType} onChange={function (e) { return setFilterType(e.target.value); }}>
                <option value="ALL">Tüm Görev Tipleri</option>
                {Object.values(types_1.JobType).map(function (t) { return <option key={t} value={t}>{t}</option>; })}
              </select>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            {userCourthouses.length > 0 ? (<button onClick={function () { return setShowCourthouseModal(true); }} className="flex items-center hover:text-primary-600 transition group">
                <lucide_react_1.MapPin className="w-4 h-4 mr-1 text-primary-500 group-hover:scale-110 transition"/>
                <strong>{userCourthouses.length}</strong>&nbsp;adliye izleniyor
              </button>) : (<span>Tüm Türkiye (Filtresiz)</span>)}
          </div>
        </div>

        {/* Monitored Courthouses Modal */}
        {showCourthouseModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <lucide_react_1.MapPin className="w-5 h-5 mr-2 text-primary-400"/>
                  <h3 className="font-bold">İzlenen Adliyeler</h3>
                </div>
                <button onClick={function () { return setShowCourthouseModal(false); }} className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition">
                  <lucide_react_1.X className="w-5 h-5"/>
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  {userCourthouses.map(function (ch, index) { return (<div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-primary-500 mr-3"></div>
                      <span className="text-slate-700 font-medium">{ch}</span>
                    </div>); })}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 text-center">
                    Adliye tercihlerinizi <react_router_dom_1.Link to="/settings" className="text-primary-600 hover:underline">Ayarlar</react_router_dom_1.Link> sayfasından değiştirebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>)}

        {/* Job List */}
        {loading ? (<div className="flex justify-center py-20">
            <lucide_react_1.Loader2 className="h-10 w-10 text-primary-600 animate-spin"/>
          </div>) : (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.length === 0 ? (<div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <lucide_react_1.Search className="h-12 w-12 mb-4 opacity-50"/>
                <p className="text-lg font-medium">Şu an için uygun görev bulunamadı.</p>
                <p className="text-sm mt-2 text-center max-w-md">
                  Seçtiğiniz adliyelerde ({userCourthouses.join(', ') || 'Yok'}) henüz açık bir görev yok veya kriterlerinize uymuyor.
                  <br />
                  <react_router_dom_1.Link to="/settings" className="text-primary-600 hover:underline mt-1 inline-block">Çalışma alanlarınızı genişletmek ister misiniz?</react_router_dom_1.Link>
                </p>
              </div>) : (filteredJobs.map(function (job) { return (<JobCard_1.default key={job.jobId} job={job} user={user} hasApplied={appliedJobIds.includes(job.jobId || '')}/>); }))}
          </div>)}
      </div>
    </div>);
};
exports.default = Dashboard;
