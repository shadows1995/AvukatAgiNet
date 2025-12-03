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
var recharts_1 = require("recharts");
var InteractiveSphere_1 = require("../components/InteractiveSphere");
var SEO_1 = require("../components/SEO");
var HomePage = function (_a) {
    var user = _a.user;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)([]), recentActivity = _b[0], setRecentActivity = _b[1];
    var _c = (0, react_1.useState)([]), archive = _c[0], setArchive = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    // Stats State
    var _e = (0, react_1.useState)([]), completedJobs = _e[0], setCompletedJobs = _e[1];
    var _f = (0, react_1.useState)(true), statsLoading = _f[0], setStatsLoading = _f[1];
    // Chart filter state
    var _g = (0, react_1.useState)('month'), chartView = _g[0], setChartView = _g[1];
    var _h = (0, react_1.useState)(new Date().getMonth()), selectedMonth = _h[0], setSelectedMonth = _h[1]; // 0-11
    var _j = (0, react_1.useState)(new Date().getFullYear()), selectedYear = _j[0], setSelectedYear = _j[1];
    (0, react_1.useEffect)(function () {
        var fetchFeed = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, jobsData, error, mappedJobs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabaseClient_1.supabase
                            .from('jobs')
                            .select('*')
                            .order('updated_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), jobsData = _a.data, error = _a.error;
                        if (!error && jobsData) {
                            mappedJobs = jobsData.map(function (d) { return ({
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
                            setRecentActivity(mappedJobs.slice(0, 6));
                            setArchive(mappedJobs.filter(function (j) { return j.status === 'completed' && j.selectedApplicant === user.uid; }).slice(0, 5));
                        }
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchFeed();
        // Realtime subscription for Jobs
        var subscription = supabaseClient_1.supabase
            .channel('public:jobs')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, function (payload) {
            // Simple re-fetch or optimistic update. Re-fetch is safer for lists.
            fetchFeed();
        })
            .subscribe();
        return function () {
            subscription.unsubscribe();
        };
    }, []);
    // Fetch Completed Jobs for Stats
    (0, react_1.useEffect)(function () {
        if (!user)
            return;
        var fetchStats = function () { return __awaiter(void 0, void 0, void 0, function () {
            var jobs, mappedJobs, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabaseClient_1.supabase
                                .from('jobs')
                                .select('*')
                                .eq('selected_applicant', user.uid)
                                .eq('status', 'completed')];
                    case 1:
                        jobs = (_a.sent()).data;
                        if (jobs) {
                            mappedJobs = jobs.map(function (d) { return ({
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
                                applicationDeadline: d.application_deadline,
                                completedAt: d.completed_at // Ensure this is mapped
                            }); });
                            setCompletedJobs(mappedJobs);
                        }
                        else {
                            setCompletedJobs([]);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _a.sent();
                        console.error("Error fetching stats:", e_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setStatsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchStats();
        // Realtime subscription for Stats (listen for updates to my jobs)
        var statsSubscription = supabaseClient_1.supabase
            .channel('public:jobs:stats')
            .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'jobs',
            filter: "selected_applicant=eq.".concat(user.uid)
        }, function () {
            fetchStats();
        })
            .subscribe();
        return function () {
            statsSubscription.unsubscribe();
        };
    }, [user]);
    // --- STATS CALCULATIONS ---
    var totalEarnings = completedJobs.reduce(function (sum, job) {
        return sum + (Number(job.offeredFee) || 0);
    }, 0);
    var completedCount = completedJobs.length;
    // Chart Data: Earnings per Courthouse
    var courthouseStats = completedJobs.reduce(function (acc, job) {
        var ch = job.courthouse || 'Diğer';
        acc[ch] = (acc[ch] || 0) + 1;
        return acc;
    }, {});
    var pieData = Object.keys(courthouseStats).map(function (key) { return ({
        name: key,
        value: courthouseStats[key]
    }); });
    var COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
    // Generate chart data based on view mode
    var generateMonthlyData = function () {
        var months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        return months.map(function (month, idx) {
            var monthJobs = completedJobs.filter(function (job) {
                // Supabase returns ISO string for timestamps usually, or we might have mapped it.
                // Assuming job.completedAt is ISO string or timestamp.
                // If it's from Firestore migration, it might be different, but new data is ISO.
                // Let's handle both if possible, or assume ISO for Supabase.
                if (!job.completedAt)
                    return false;
                var completedDate = new Date(job.completedAt);
                return completedDate.getMonth() === idx && completedDate.getFullYear() === selectedYear;
            });
            var kazanc = monthJobs.reduce(function (sum, job) { return sum + (job.offeredFee || 0); }, 0);
            return { name: month, kazanc: kazanc };
        });
    };
    var generateDailyData = function () {
        var daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, function (_, i) {
            var day = i + 1;
            var dayJobs = completedJobs.filter(function (job) {
                if (!job.completedAt)
                    return false;
                var completedDate = new Date(job.completedAt);
                return completedDate.getDate() === day &&
                    completedDate.getMonth() === selectedMonth &&
                    completedDate.getFullYear() === selectedYear;
            });
            var kazanc = dayJobs.reduce(function (sum, job) { return sum + (job.offeredFee || 0); }, 0);
            return { name: "".concat(day), kazanc: kazanc };
        });
    };
    var areaData = chartView === 'month' ? generateMonthlyData() : generateDailyData();
    var maskName = function (name) {
        if (!name)
            return "Av. Kullanıcı";
        var parts = name.trim().split(/\s+/);
        if (parts.length === 1)
            return "".concat(parts[0].charAt(0), ".");
        return "".concat(parts[0].charAt(0), ". ").concat(parts[parts.length - 1].charAt(0), ".");
    };
    return (<div className="bg-slate-50 min-h-screen pb-12">
         <SEO_1.default title="Ana Sayfa - AvukatAğı" description="AvukatAğı ana sayfası. Güncel görevleri takip edin, yeni görev oluşturun ve istatistiklerinizi görüntüleyin."/>
         {/* Hero Section - BOXED LAYOUT & BLUE COLOR */}
         <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="bg-primary-900 text-white py-20 px-8 rounded-3xl shadow-2xl relative overflow-hidden">
               {/* Interactive Sphere Background */}
               <div className="absolute top-0 right-0 w-full h-full md:w-2/3 md:h-full opacity-60 pointer-events-auto z-0">
                  <InteractiveSphere_1.default />
               </div>

               <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                  <div className="mb-6 md:mb-0 max-w-2xl">
                     <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        Meslektaşlarınızla <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                           Güçlerinizi Birleştirin
                        </span>
                     </h1>
                     <p className="text-primary-100 text-xl mb-10 max-w-lg leading-relaxed">
                        Türkiye'nin lider tevkil uygulaması ile iş ağınızı genişletin, zaman kazanın.
                     </p>
                     <div className="flex flex-wrap gap-4">
                        <button onClick={function () { return navigate('/create-job'); }} className="bg-white text-primary-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-50 transition transform hover:-translate-y-1 flex items-center">
                           <lucide_react_1.PlusCircle className="w-6 h-6 mr-3"/> Yeni Görev Ver
                        </button>
                        <button onClick={function () {
            if (user.membershipType === 'premium' || user.membershipType === 'premium_plus') {
                navigate('/dashboard');
            }
            else {
                navigate('/premium');
            }
        }} className="bg-primary-800/50 backdrop-blur-md border border-primary-400/30 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-primary-800/70 transition transform hover:-translate-y-1 flex items-center">
                           <lucide_react_1.Briefcase className="w-6 h-6 mr-3"/> Görevlere Başvur
                        </button>
                     </div>
                  </div>
               </div>

               {/* Decoration Gradients */}
               <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-80 h-80 bg-indigo-500 opacity-10 rounded-full blur-3xl pointer-events-none"></div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 mt-8">

            {/* STATS SECTION */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">İSTATİSTİKLERİM</h3>

               {/* KPI Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-6 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                     <div className="flex justify-between items-start relative z-10">
                        <div>
                           <p className="text-primary-100 font-medium mb-1 text-sm uppercase tracking-wide">Toplam Kazanç</p>
                           <h3 className="text-4xl font-extrabold tracking-tight">{totalEarnings.toLocaleString('tr-TR')} <span className="text-2xl font-bold text-primary-200">TL</span></h3>
                        </div>
                        <div className="bg-white/20 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                           <lucide_react_1.Wallet className="w-7 h-7 text-white"/>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-slate-500 font-medium mb-1 text-sm uppercase tracking-wide">Tamamlanan Görevler</p>
                           <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{completedCount}</h3>
                        </div>
                        <div className="bg-primary-50 p-3.5 rounded-2xl group-hover:bg-primary-100 transition-colors duration-300">
                           <lucide_react_1.CheckCircle className="w-7 h-7 text-primary-600"/>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-slate-500 font-medium mb-1 text-sm uppercase tracking-wide">Çalışılan Adliyeler</p>
                           <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{Object.keys(courthouseStats).length}</h3>
                        </div>
                        <div className="bg-secondary-50 p-3.5 rounded-2xl group-hover:bg-secondary-100 transition-colors duration-300">
                           <lucide_react_1.Briefcase className="w-7 h-7 text-secondary-600"/>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Charts */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Area Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Kazanç Grafiği</h3>
                        <div className="flex gap-2">
                           <select value={chartView} onChange={function (e) { return setChartView(e.target.value); }} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                              <option value="month">Aylık</option>
                              <option value="day">Günlük</option>
                           </select>
                           {chartView === 'day' && (<select value={selectedMonth} onChange={function (e) { return setSelectedMonth(Number(e.target.value)); }} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                 {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map(function (m, i) { return (<option key={i} value={i}>{m}</option>); })}
                              </select>)}
                           <select value={selectedYear} onChange={function (e) { return setSelectedYear(Number(e.target.value)); }} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                              {[2023, 2024, 2025].map(function (year) { return (<option key={year} value={year}>{year}</option>); })}
                           </select>
                        </div>
                     </div>
                     <div className={"h-64 ".concat(!user.isPremium ? 'blur-sm opacity-50 select-none' : '')}>
                        <recharts_1.ResponsiveContainer width="100%" height="100%">
                           <recharts_1.AreaChart data={user.isPremium ? areaData : [{ name: 'Ocak', kazanc: 5000 }, { name: 'Şubat', kazanc: 7000 }, { name: 'Mart', kazanc: 3000 }, { name: 'Nisan', kazanc: 8500 }]}>
                              <defs>
                                 <linearGradient id="colorKazanc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#323485" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#323485" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                              <recharts_1.XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }}/>
                              <recharts_1.YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }}/>
                              <recharts_1.Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                              <recharts_1.Area type="monotone" dataKey="kazanc" stroke="#323485" strokeWidth={3} fillOpacity={1} fill="url(#colorKazanc)"/>
                           </recharts_1.AreaChart>
                        </recharts_1.ResponsiveContainer>
                     </div>
                     {!user.isPremium && (<div className="absolute inset-0 flex items-center justify-center z-10 bg-white/30 backdrop-blur-[2px]">
                           <button onClick={function () { return navigate('/premium'); }} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center">
                              <lucide_react_1.Sparkles className="w-5 h-5 mr-2"/>
                              Premium ile Kazancınızı Takip Edin
                           </button>
                        </div>)}
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Adliye Dağılımı</h3>
                     <div className={"h-80 ".concat(!user.isPremium ? 'blur-sm opacity-50 select-none' : '')}>
                        <recharts_1.ResponsiveContainer width="100%" height="100%">
                           <recharts_1.PieChart>
                              <recharts_1.Pie data={user.isPremium ? pieData : [{ name: 'İstanbul', value: 10 }, { name: 'Ankara', value: 5 }, { name: 'İzmir', value: 3 }]} cx="50%" cy="45%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label={function (_a) {
        var name = _a.name, value = _a.value;
        return "".concat(name, " (").concat(value, ")");
    }} labelLine={true}>
                                 {(user.isPremium ? pieData : [{ name: 'İstanbul', value: 10 }, { name: 'Ankara', value: 5 }, { name: 'İzmir', value: 3 }]).map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>); })}
                              </recharts_1.Pie>
                              <recharts_1.Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                           </recharts_1.PieChart>
                        </recharts_1.ResponsiveContainer>
                     </div>
                     {!user.isPremium && (<div className="absolute inset-0 flex items-center justify-center z-10 bg-white/30 backdrop-blur-[2px]">
                           <button onClick={function () { return navigate('/premium'); }} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center">
                              <lucide_react_1.Sparkles className="w-5 h-5 mr-2"/>
                              Premium'a Geç
                           </button>
                        </div>)}
                  </div>
               </div>
            </div>

            {/* History Links */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
               <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">GÖREVLENDİRME GEÇMİŞİM</h3>
               <div className="space-y-3">
                  <div onClick={function () { return navigate('/dashboard'); }} className="bg-[#323485] hover:bg-[#2a2b6e] text-white p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-md hover:shadow-lg transition group">
                     <span className="font-semibold">Bekleyen / Başvurduğum Görevler</span>
                     <lucide_react_1.ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition"/>
                  </div>
                  <div onClick={function () { return navigate('/my-jobs'); }} className="bg-[#323485] hover:bg-[#2a2b6e] text-white p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-md hover:shadow-lg transition group">
                     <span className="font-semibold">Oluşturduğum Görevler</span>
                     <lucide_react_1.ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition"/>
                  </div>
               </div>
            </div>

            {/* Feed & Archive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

               {/* Live Feed */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
                     <div className="p-2 bg-primary-50 rounded-lg mr-3">
                        <lucide_react_1.Activity className="w-5 h-5 text-primary-600"/>
                     </div>
                     AvukatAğı'nda Gündem
                  </h3>
                  <div className="space-y-8 relative pl-2">
                     <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100"></div>
                     {loading ? (<div className="flex justify-center p-8"><lucide_react_1.Loader2 className="animate-spin text-slate-300"/></div>) : recentActivity.map(function (job) { return (<div key={job.jobId} className="flex items-start relative z-10 group">
                           <div className={"w-10 h-10 rounded-full border-4 border-white flex items-center justify-center flex-shrink-0 shadow-sm z-10 transition-transform duration-300 group-hover:scale-110 ".concat(job.status === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white')}>
                              {job.status === 'in_progress' ? <lucide_react_1.Users className="w-4 h-4"/> : <lucide_react_1.Briefcase className="w-4 h-4"/>}
                           </div>
                           <div className="ml-4 flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
                              <div className="flex justify-between items-start mb-1">
                                 <p className="text-sm font-bold text-slate-800">{maskName(job.ownerName)}</p>
                                 <span className={"text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ".concat(job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700')}>
                                    {job.status === 'in_progress' ? 'Görev Atandı' : job.status === 'completed' ? 'Tamamlandı' : 'Yeni Görev'}
                                 </span>
                              </div>
                              <p className="text-xs text-slate-600 font-medium">{job.city} • {job.courthouse}</p>
                              <p className="text-[10px] text-slate-400 mt-2 flex items-center">
                                 <lucide_react_1.Activity className="w-3 h-3 mr-1"/>
                                 {job.updatedAt ? new Date(job.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Az önce'}
                              </p>
                           </div>
                        </div>); })}
                  </div>
               </div>

               {/* Archive */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                     <h3 className="text-xl font-bold text-slate-800 flex items-center">
                        <div className="p-2 bg-secondary-50 rounded-lg mr-3">
                           <lucide_react_1.Archive className="w-5 h-5 text-secondary-600"/>
                        </div>
                        Geçmiş Görevlerim
                     </h3>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Son Tamamlananlar</span>
                  </div>

                  {loading ? (<div className="flex justify-center p-8"><lucide_react_1.Loader2 className="animate-spin text-slate-300"/></div>) : archive.length === 0 ? (<p className="text-center text-slate-400 py-12 italic">Henüz tamamlanan görev yok.</p>) : (<div className="space-y-4">
                        {archive.map(function (job) { return (<div key={job.jobId} onClick={function () { return navigate("/job/".concat(job.jobId)); }} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-slate-100 group cursor-pointer">
                              <div className="flex items-center">
                                 <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                    <lucide_react_1.Check className="w-6 h-6"/>
                                 </div>
                                 <div className="ml-4">
                                    <p className="text-sm font-bold text-slate-800 max-w-[150px] truncate">{job.courthouse}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">{job.jobType}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-bold text-slate-900">{job.offeredFee} TL</p>
                                 <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">TAMAMLANDI</p>
                              </div>
                           </div>); })}
                     </div>)}
               </div>

            </div>
         </div>

         {/* How It Works Section (Brief) */}
         <div className="max-w-7xl mx-auto px-4 mt-12">
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
               <h3 className="text-lg font-bold text-slate-800 mb-6">Nasıl Çalışır?</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                     <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-600 font-bold text-lg">1</div>
                     <h4 className="font-bold text-sm">Görev Oluştur</h4>
                     <p className="text-xs text-slate-500 mt-1">Detayları girin ve görevi yayınlayın.</p>
                  </div>
                  <div>
                     <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-600 font-bold text-lg">2</div>
                     <h4 className="font-bold text-sm">Avukat Seç</h4>
                     <p className="text-xs text-slate-500 mt-1">Gelen başvuruları değerlendirin.</p>
                  </div>
                  <div>
                     <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-600 font-bold text-lg">3</div>
                     <h4 className="font-bold text-sm">İşi Tamamla</h4>
                     <p className="text-xs text-slate-500 mt-1">Güvenle işbirliği yapın.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>);
};
exports.default = HomePage;
