import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowRight, Gavel, Loader2, Activity, Briefcase, Archive, Users, Check, Wallet, CheckCircle, Sparkles, FileText, UserCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { User, Job } from '../types';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

import InteractiveSphere from '../components/InteractiveSphere';

import SEO from '../components/SEO';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import BetaWelcomeModal from '../components/BetaWelcomeModal';
import { useMobileApp } from '../hooks/useMobileApp';
import { SHOW_PREMIUM_FEATURES } from '../config';

const HomePage = ({ user }: { user: User }) => {
   const navigate = useNavigate();
   const isMobileApp = useMobileApp();
   const [recentActivity, setRecentActivity] = useState<Job[]>([]);
   const [archive, setArchive] = useState<Job[]>([]);
   const [loading, setLoading] = useState(true);

   // Stats State
   const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
   const [statsLoading, setStatsLoading] = useState(true);

   const [givenJobsCount, setGivenJobsCount] = useState(0);

   // Profile Completion State
   const [showCompletionModal, setShowCompletionModal] = useState(false);
   const [showBetaModal, setShowBetaModal] = useState(false);
   const [missingFields, setMissingFields] = useState<string[]>([]);

   // Chart filter state
   const [chartView, setChartView] = useState<'month' | 'day'>('month');
   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

   useEffect(() => {
      const fetchFeed = async () => {
         const { data: jobsData, error } = await supabase
            .from('jobs')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(100);

         if (!error && jobsData) {
            const mappedJobs = jobsData.map((d: any) => ({
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
            })) as Job[];

            setRecentActivity(mappedJobs.slice(0, 6));
            setArchive(mappedJobs.filter(j => j.status === 'completed' && j.selectedApplicant === user.uid).slice(0, 5));
         }
         setLoading(false);
      };

      fetchFeed();

      // Realtime subscription for Jobs
      const subscription = supabase
         .channel('public:jobs')
         .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, (payload) => {
            // Simple re-fetch or optimistic update. Re-fetch is safer for lists.
            fetchFeed();
         })
         .subscribe();

      return () => {
         subscription.unsubscribe();
      };
   }, []);

   // Check Missing Fields AND Beta Status
   useEffect(() => {
      if (user) {
         // Priority 1: Check Beta Status - ONLY if Premium features are enabled and they haven't claimed it yet
         if (SHOW_PREMIUM_FEATURES && !user.claimed_beta_promo) {
            setShowBetaModal(true);
            return; // Stop here, do not check profile completion yet
         }

         // Priority 2: Check Missing Fields (Only if Premium/Trial Active)
         const missing = [];
         if (!user.phone) missing.push("Telefon Numarası");
         if (!user.preferredCourthouses || user.preferredCourthouses.length === 0) missing.push("Tercih Edilen Adliyeler");
         if (!user.specializations || user.specializations.length === 0) missing.push("Uzmanlık Alanları");

         if (missing.length > 0) {
            setMissingFields(missing);
            const hasSeenModal = sessionStorage.getItem('hasSeenCompletionModal');
            if (!hasSeenModal) {
               setShowCompletionModal(true);
               sessionStorage.setItem('hasSeenCompletionModal', 'true');
            }
         }
      }
   }, [user]);

   // Fetch Completed Jobs for Stats
   useEffect(() => {
      if (!user) return;

      const fetchStats = async () => {
         try {
            // Direct query to jobs table is more reliable
            const { data: jobs } = await supabase
               .from('jobs')
               .select('*')
               .eq('selected_applicant', user.uid)
               .eq('status', 'completed');

            if (jobs) {
               const mappedJobs = jobs.map((d: any) => ({
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
               })) as Job[];

               setCompletedJobs(mappedJobs);
            } else {
               setCompletedJobs([]);
            }

            // Fetch Given Jobs Count
            const { count: givenCount, error: givenError } = await supabase
               .from('jobs')
               .select('*', { count: 'exact', head: true })
               .eq('created_by', user.uid);

            if (!givenError) {
               setGivenJobsCount(givenCount || 0);
            }
         } catch (e) {
            console.error("Error fetching stats:", e);
         } finally {
            setStatsLoading(false);
         }
      };

      fetchStats();

      // Realtime subscription for Stats (listen for updates to my jobs)
      const statsSubscription = supabase
         .channel('public:jobs:stats')
         .on('postgres_changes',
            {
               event: 'UPDATE',
               schema: 'public',
               table: 'jobs',
               filter: `selected_applicant=eq.${user.uid}`
            },
            () => {
               fetchStats();
            }
         )
         .subscribe();

      return () => {
         statsSubscription.unsubscribe();
      };
   }, [user]);

   // --- STATS CALCULATIONS ---
   const totalEarnings = completedJobs.reduce((sum, job) => {
      return sum + (Number(job.offeredFee) || 0);
   }, 0);

   const completedCount = completedJobs.length;

   // Chart Data: Earnings per Courthouse
   const courthouseStats = completedJobs.reduce((acc, job) => {
      const ch = job.courthouse || 'Diğer';
      acc[ch] = (acc[ch] || 0) + 1;
      return acc;
   }, {} as Record<string, number>);

   const pieData = Object.keys(courthouseStats).map(key => ({
      name: key,
      value: courthouseStats[key]
   }));

   const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

   // Generate chart data based on view mode
   const generateMonthlyData = () => {
      const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      return months.map((month, idx) => {
         const monthJobs = completedJobs.filter(job => {
            // Supabase returns ISO string for timestamps usually, or we might have mapped it.
            // Assuming job.completedAt is ISO string or timestamp.
            // If it's from Firestore migration, it might be different, but new data is ISO.
            // Let's handle both if possible, or assume ISO for Supabase.
            if (!job.completedAt) return false;
            const completedDate = new Date(job.completedAt);
            return completedDate.getMonth() === idx && completedDate.getFullYear() === selectedYear;
         });
         const kazanc = monthJobs.reduce((sum, job) => sum + (job.offeredFee || 0), 0);
         return { name: month, kazanc };
      });
   };

   const generateDailyData = () => {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
         const day = i + 1;
         const dayJobs = completedJobs.filter(job => {
            if (!job.completedAt) return false;
            const completedDate = new Date(job.completedAt);
            return completedDate.getDate() === day &&
               completedDate.getMonth() === selectedMonth &&
               completedDate.getFullYear() === selectedYear;
         });
         const kazanc = dayJobs.reduce((sum, job) => sum + (job.offeredFee || 0), 0);
         return { name: `${day}`, kazanc };
      });
   };

   const areaData = chartView === 'month' ? generateMonthlyData() : generateDailyData();

   const maskName = (name?: string) => {
      if (!name) return "Av. Kullanıcı";
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return `${parts[0].charAt(0)}.`;
      return `${parts[0].charAt(0)}. ${parts[parts.length - 1].charAt(0)}.`;
   };

   return (
      <div className="bg-slate-50 min-h-screen pb-12">
         <SEO
            title="Ana Sayfa - AvukatAğı"
            description="AvukatAğı ana sayfası. Güncel görevleri takip edin, yeni görev oluşturun ve istatistiklerinizi görüntüleyin."
         />

         {showBetaModal && (
            <BetaWelcomeModal
               user={user}
               onSuccess={() => {
                  window.location.reload(); // Reload to refresh user state from Supabase
               }}
            />
         )}

         <ProfileCompletionModal
            isOpen={showCompletionModal}
            onClose={() => setShowCompletionModal(false)}
            missingFields={missingFields}
         />

         {/* Missing Fields Banner */}
         {missingFields.length > 0 && !showCompletionModal && (
            <div className="bg-orange-50 border-b border-orange-200 px-4 py-3 animate-in fade-in slide-in-from-top-4 relative z-50">
               <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                     <div className="bg-orange-100 p-1.5 rounded-full">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                     </div>
                     <p className="text-sm font-medium text-orange-800">
                        Profilinizde eksik bilgiler var: <span className="font-bold">{missingFields.join(', ')}</span>.
                        Güvenilir bir profil için tamamlamanızı öneririz.
                     </p>
                  </div>
                  <button
                     onClick={() => {
                        let targetTab = 'personal';
                        if (missingFields.includes("Telefon Numarası")) targetTab = 'personal';
                        else if (missingFields.includes("Tercih Edilen Adliyeler")) targetTab = 'courthouses';
                        else if (missingFields.includes("Uzmanlık Alanları")) targetTab = 'specialization';

                        navigate(`/settings?tab=${targetTab}`);
                     }}
                     className="text-orange-700 hover:text-orange-800 text-sm font-bold hover:underline"
                  >
                     Bilgileri Tamamla
                  </button>
               </div>
            </div>
         )}
         {/* Hero Section - BOXED LAYOUT & BLUE COLOR */}
         <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="bg-primary-900 text-white py-10 px-6 md:py-20 md:px-8 rounded-3xl shadow-2xl relative overflow-hidden">
               {/* Interactive Sphere Background - Adjusted for mobile */}
               <div className="absolute top-0 right-0 w-full h-full md:w-2/3 md:h-full opacity-40 md:opacity-60 pointer-events-auto z-0 scale-150 md:scale-100 origin-center translate-x-10 md:translate-x-0">
                  <InteractiveSphere />
               </div>

               <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                  <div className="mb-6 md:mb-0 max-w-2xl">
                     <h1 className="text-3xl md:text-6xl font-extrabold mb-4 md:mb-6 leading-tight tracking-tight">
                        Meslektaşlarınızla <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                           Güçlerinizi Birleştirin
                        </span>
                     </h1>
                     <p className="text-primary-100 text-base md:text-xl mb-6 md:mb-10 max-w-lg leading-relaxed">
                        Türkiye'nin lider tevkil uygulaması ile iş ağınızı genişletin, zaman kazanın.
                     </p>
                     <div className="flex flex-wrap gap-3 md:gap-4">
                        <button
                           onClick={() => navigate('/create-job')}
                           className="bg-white text-primary-900 px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:bg-blue-50 transition transform hover:-translate-y-1 flex items-center"
                        >
                           <PlusCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" /> Yeni Görev
                        </button>
                        <button
                           onClick={() => {
                              // If premium features hidden, always go to dashboard (effectively free)
                              // OR if user is premium/mobile not showing premium
                              if (!SHOW_PREMIUM_FEATURES || user.isPremium || user.membershipType === 'premium' || user.membershipType === 'premium_plus' || (isMobileApp && !SHOW_PREMIUM_FEATURES)) {
                                 navigate('/dashboard');
                              } else {
                                 navigate('/premium');
                              }
                           }}
                           className="bg-primary-800/50 backdrop-blur-md border border-primary-400/30 text-white px-5 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl hover:bg-primary-800/70 transition transform hover:-translate-y-1 flex items-center"
                        >
                           <Briefcase className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" /> Görev Bul
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

               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                  {/* Total Earnings Card */}
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-5 md:p-6 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                     <div className="flex justify-between items-start relative z-10">
                        <div>
                           <p className="text-primary-100 font-medium mb-1 text-xs md:text-sm uppercase tracking-wide">Toplam Kazanç</p>
                           <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{totalEarnings.toLocaleString('tr-TR')} <span className="text-xl md:text-2xl font-bold text-primary-200">TL</span></h3>
                        </div>
                        <div className="bg-white/20 p-3 md:p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
                           <Wallet className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                     </div>
                  </div>

                  {/* Completed Jobs Card */}
                  <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-slate-500 font-medium mb-1 text-xs md:text-sm uppercase tracking-wide">Tamamlanan Görev</p>
                           <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{completedCount}</h3>
                        </div>
                        <div className="bg-primary-50 p-3 md:p-3.5 rounded-2xl group-hover:bg-primary-100 transition-colors duration-300">
                           <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-primary-600" />
                        </div>
                     </div>
                  </div>

                  {/* Given Jobs Card (NEW) */}
                  <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-slate-500 font-medium mb-1 text-xs md:text-sm uppercase tracking-wide">Verilen Görevler</p>
                           <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{givenJobsCount}</h3>
                        </div>
                        <div className="bg-indigo-50 p-3 md:p-3.5 rounded-2xl group-hover:bg-indigo-100 transition-colors duration-300">
                           <Archive className="w-6 h-6 md:w-7 md:h-7 text-indigo-600" />
                        </div>
                     </div>
                  </div>

                  {/* Courthouses Card */}
                  <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-slate-500 font-medium mb-1 text-xs md:text-sm uppercase tracking-wide">Çalışılan Adliyeler</p>
                           <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{Object.keys(courthouseStats).length}</h3>
                        </div>
                        <div className="bg-secondary-50 p-3 md:p-3.5 rounded-2xl group-hover:bg-secondary-100 transition-colors duration-300">
                           <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-secondary-600" />
                        </div>
                     </div>
                  </div>

               </div>

               {/* History Links - Moved here for mobile optimization */}
               <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">GÖREVLENDİRME GEÇMİŞİM</h3>
                  <div className="space-y-3">
                     <div
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#323485] hover:bg-[#2a2b6e] text-white p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-md hover:shadow-lg transition group"
                     >
                        <span className="font-semibold">Bekleyen / Başvurduğum Görevler</span>
                        <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition" />
                     </div>
                     <div
                        onClick={() => navigate('/my-jobs')}
                        className="bg-[#323485] hover:bg-[#2a2b6e] text-white p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-md hover:shadow-lg transition group"
                     >
                        <span className="font-semibold">Oluşturduğum Görevler</span>
                        <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition" />
                     </div>
                  </div>
               </div>


               {/* Charts */}
               {(user.isPremium || !isMobileApp || SHOW_PREMIUM_FEATURES) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {/* Area Chart */}
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-lg font-bold text-slate-800">Kazanç Grafiği</h3>
                           <div className="flex gap-2">
                              <select
                                 value={chartView}
                                 onChange={(e) => setChartView(e.target.value as 'month' | 'day')}
                                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                 <option value="month">Aylık</option>
                                 <option value="day">Günlük</option>
                              </select>
                              {chartView === 'day' && (
                                 <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                 >
                                    {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((m, i) => (
                                       <option key={i} value={i}>{m}</option>
                                    ))}
                                 </select>
                              )}
                              <select
                                 value={selectedYear}
                                 onChange={(e) => setSelectedYear(Number(e.target.value))}
                                 className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                 {[2023, 2024, 2025].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                        <div className={`h-64 ${!user.isPremium ? 'blur-sm opacity-50 select-none' : ''}`}>
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={user.isPremium ? areaData : [{ name: 'Ocak', kazanc: 5000 }, { name: 'Şubat', kazanc: 7000 }, { name: 'Mart', kazanc: 3000 }, { name: 'Nisan', kazanc: 8500 }]}>
                                 <defs>
                                    <linearGradient id="colorKazanc" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#323485" stopOpacity={0.8} />
                                       <stop offset="95%" stopColor="#323485" stopOpacity={0} />
                                    </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                 <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                 />
                                 <Area type="monotone" dataKey="kazanc" stroke="#323485" strokeWidth={3} fillOpacity={1} fill="url(#colorKazanc)" />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                        {!user.isPremium && (
                           <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/30 backdrop-blur-[2px]">
                              <button
                                 onClick={() => navigate('/premium')}
                                 className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center"
                              >
                                 <Sparkles className="w-5 h-5 mr-2" />
                                 Premium ile Kazancınızı Takip Edin
                              </button>
                           </div>
                        )}
                     </div>

                     {/* Pie Chart */}
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden hidden md:block">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Adliye Dağılımı</h3>
                        <div className={`h-80 ${!user.isPremium ? 'blur-sm opacity-50 select-none' : ''}`}>
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={user.isPremium ? pieData : [{ name: 'İstanbul', value: 10 }, { name: 'Ankara', value: 5 }, { name: 'İzmir', value: 3 }]}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, value }) => `${name} (${value})`}
                                    labelLine={true}
                                 >
                                    {(user.isPremium ? pieData : [{ name: 'İstanbul', value: 10 }, { name: 'Ankara', value: 5 }, { name: 'İzmir', value: 3 }]).map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                 </Pie>
                                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              </PieChart>
                           </ResponsiveContainer>
                        </div>
                        {!user.isPremium && (
                           <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/30 backdrop-blur-[2px]">
                              <button
                                 onClick={() => navigate('/premium')}
                                 className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center"
                              >
                                 <Sparkles className="w-5 h-5 mr-2" />
                                 Premium'a Geç
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>



            {/* Feed & Archive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">

               {/* Live Feed */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-3 md:p-8">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-8 flex items-center">
                     <div className="p-2 bg-primary-50 rounded-lg mr-3 hidden md:block">
                        <Activity className="w-5 h-5 text-primary-600" />
                     </div>
                     AvukatAğı Gündem
                  </h3>
                  <div className="space-y-8 relative pl-2">
                     <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100"></div>
                     {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>
                     ) : recentActivity.map((job) => (
                        <div
                           key={job.jobId}
                           className="flex items-start relative z-10 group"
                        >
                           <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white flex items-center justify-center flex-shrink-0 shadow-sm z-10 transition-transform duration-300 group-hover:scale-110 ${job.status === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
                              {job.status === 'in_progress' ? <Users className="w-3 h-3 md:w-4 md:h-4" /> : <Briefcase className="w-3 h-3 md:w-4 md:h-4" />}
                           </div>
                           <div className="ml-2 md:ml-4 flex-1 bg-slate-50 p-2 md:p-4 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
                              <div className="flex justify-between items-start mb-1">
                                 <p className="text-sm md:text-sm font-bold text-slate-800 line-clamp-1">{maskName(job.ownerName)}</p>
                                 <span className={`text-[10px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full uppercase tracking-wide whitespace-nowrap ml-1 ${job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {job.status === 'in_progress' ? 'Atandı' : job.status === 'completed' ? 'Bitti' : 'Yeni'}
                                 </span>
                              </div>
                              <p className="text-xs md:text-xs text-slate-600 font-medium line-clamp-1">{job.city} • {job.courthouse}</p>
                              <p className="text-[10px] md:text-[10px] text-slate-400 mt-1 md:mt-2 flex items-center">
                                 <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                                 {job.updatedAt ? new Date(job.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Az önce'}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Archive */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                     <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center">
                        <div className="p-2 bg-secondary-50 rounded-lg mr-3 hidden md:block">
                           <Archive className="w-5 h-5 text-secondary-600" />
                        </div>
                        Geçmiş Görevlerim
                     </h3>
                     <span className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">Son Tamamlananlar</span>
                  </div>

                  {loading ? (
                     <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>
                  ) : archive.length === 0 ? (
                     <p className="text-center text-slate-400 py-12 italic">Henüz tamamlanan görev yok.</p>
                  ) : (
                     <div className="space-y-4">
                        {archive.map(job => (
                           <div
                              key={job.jobId}
                              onClick={() => navigate(`/job/${job.jobId}`)}
                              className="flex items-center justify-between p-2 md:p-4 hover:bg-slate-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-slate-100 group cursor-pointer"
                           >
                              <div className="flex items-center">
                                 <div className="h-8 w-8 md:h-12 md:w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all duration-300 hidden md:flex">
                                    <Check className="w-4 h-4 md:w-6 md:h-6" />
                                 </div>
                                 <div className="ml-0 md:ml-4 flex-1 min-w-0">
                                    <p className="text-sm md:text-sm font-bold text-slate-800 truncate">{job.courthouse}</p>
                                    <p className="text-xs md:text-xs text-slate-500 font-medium mt-0.5 truncate">{job.jobType}</p>
                                 </div>
                              </div>
                              <div className="text-right ml-2">
                                 <p className="text-sm md:text-sm font-bold text-slate-900 whitespace-nowrap">{job.offeredFee}</p>
                                 <p className="text-[10px] md:text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block mt-1">Bitti</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

            </div>
         </div>

         {/* How It Works Section (Enhanced) */}
         <div className="max-w-7xl mx-auto px-4 mt-16 mb-16">
            <div className="text-center mb-12">
               <h3 className="text-3xl font-bold text-slate-900">Nasıl Çalışır?</h3>
               <p className="text-slate-500 mt-2 max-w-2xl mx-auto">AvukatAğı ile işbirliği yapmak güvenli, hızlı ve kolaydır. Sürecin nasıl işlediğine göz atın.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
               {/* Connector Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 z-0 border-t-2 border-dashed border-primary-200"></div>

               {/* Step 1 */}
               <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-primary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                     <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">1</div>
                     <FileText className="w-10 h-10 text-primary-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Görev Oluştur</h4>
                  <p className="text-slate-500 leading-relaxed max-w-xs">
                     İhtiyaç duyduğunuz işin detaylarını, yerini ve ücretini belirterek saniyeler içinde görev oluşturun.
                  </p>
               </div>

               {/* Step 2 */}
               <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-primary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                     <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">2</div>
                     <UserCheck className="w-10 h-10 text-primary-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Avukat Seç</h4>
                  <p className="text-slate-500 leading-relaxed max-w-xs">
                     Gelen başvuruları inceleyin, meslektaşlarınızın profillerini ve puanlarını görüntüleyerek en uygun adayı seçin.
                  </p>
               </div>

               {/* Step 3 */}
               <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-primary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                     <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">3</div>
                     <ShieldCheck className="w-10 h-10 text-primary-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">İşi Tamamla</h4>
                  <p className="text-slate-500 leading-relaxed max-w-xs">
                     Güvenle işbirliği yapın, görev tamamlandığında ödeme onayını verin ve meslektaşınızı değerlendirin.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default HomePage;