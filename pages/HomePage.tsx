import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowRight, Gavel, Loader2, Activity, Briefcase, Archive, Users, Check, Wallet, CheckCircle, Sparkles } from 'lucide-react';
import { User, Job } from '../types';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

import InteractiveSphere from '../components/InteractiveSphere';
import SEO from '../components/SEO';

const HomePage = ({ user }: { user: User }) => {
   const navigate = useNavigate();
   const [recentActivity, setRecentActivity] = useState<Job[]>([]);
   const [archive, setArchive] = useState<Job[]>([]);
   const [loading, setLoading] = useState(true);

   // Stats State
   const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
   const [statsLoading, setStatsLoading] = useState(true);

   // Chart filter state
   const [chartView, setChartView] = useState<'month' | 'day'>('month');
   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

   useEffect(() => {
      const fetchFeed = async () => {
         const { data: jobsData, error } = await supabase
            .from('jobs')
            .select('*')
            .order('updated_at', { ascending: false });

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
         {/* Hero Section - BOXED LAYOUT & BLUE COLOR */}
         <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="bg-primary-900 text-white py-20 px-8 rounded-3xl shadow-2xl relative overflow-hidden">
               {/* Interactive Sphere Background */}
               <div className="absolute top-0 right-0 w-full h-full md:w-2/3 md:h-full opacity-60 pointer-events-auto z-0">
                  <InteractiveSphere />
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
                        <button
                           onClick={() => navigate('/create-job')}
                           className="bg-white text-primary-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-50 transition transform hover:-translate-y-1 flex items-center"
                        >
                           <PlusCircle className="w-6 h-6 mr-3" /> Yeni Görev Ver
                        </button>
                        <button
                           onClick={() => {
                              if (user.membershipType === 'premium' || user.membershipType === 'premium_plus') {
                                 navigate('/dashboard');
                              } else {
                                 navigate('/premium');
                              }
                           }}
                           className="bg-primary-800/50 backdrop-blur-md border border-primary-400/30 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-primary-800/70 transition transform hover:-translate-y-1 flex items-center"
                        >
                           <Briefcase className="w-6 h-6 mr-3" /> Görevlere Başvur
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
                           <Wallet className="w-7 h-7 text-white" />
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
                           <CheckCircle className="w-7 h-7 text-primary-600" />
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
                           <Briefcase className="w-7 h-7 text-secondary-600" />
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
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
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
            </div>

            {/* History Links */}
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

            {/* Feed & Archive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

               {/* Live Feed */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
                     <div className="p-2 bg-primary-50 rounded-lg mr-3">
                        <Activity className="w-5 h-5 text-primary-600" />
                     </div>
                     AvukatAğı'nda Gündem
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
                           <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center flex-shrink-0 shadow-sm z-10 transition-transform duration-300 group-hover:scale-110 ${job.status === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
                              {job.status === 'in_progress' ? <Users className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                           </div>
                           <div className="ml-4 flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
                              <div className="flex justify-between items-start mb-1">
                                 <p className="text-sm font-bold text-slate-800">{maskName(job.ownerName)}</p>
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {job.status === 'in_progress' ? 'Görev Atandı' : job.status === 'completed' ? 'Tamamlandı' : 'Yeni Görev'}
                                 </span>
                              </div>
                              <p className="text-xs text-slate-600 font-medium">{job.city} • {job.courthouse}</p>
                              <p className="text-[10px] text-slate-400 mt-2 flex items-center">
                                 <Activity className="w-3 h-3 mr-1" />
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
                     <h3 className="text-xl font-bold text-slate-800 flex items-center">
                        <div className="p-2 bg-secondary-50 rounded-lg mr-3">
                           <Archive className="w-5 h-5 text-secondary-600" />
                        </div>
                        Geçmiş Görevlerim
                     </h3>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Son Tamamlananlar</span>
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
                              className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-slate-100 group cursor-pointer"
                           >
                              <div className="flex items-center">
                                 <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                    <Check className="w-6 h-6" />
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
                           </div>
                        ))}
                     </div>
                  )}
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
      </div>
   );
};

export default HomePage;