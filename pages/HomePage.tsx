import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowRight, Gavel, Loader2, Activity, Briefcase, Archive, Users, Check, Wallet, CheckCircle } from 'lucide-react';
import { User, Job } from '../types';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

import InteractiveSphere from '../components/InteractiveSphere';

const HomePage = ({ user }: { user: User }) => {
   const navigate = useNavigate();
   const [recentActivity, setRecentActivity] = useState<Job[]>([]);
   const [archive, setArchive] = useState<Job[]>([]);
   const [loading, setLoading] = useState(true);

   // Stats State
   const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
   const [statsLoading, setStatsLoading] = useState(true);

   useEffect(() => {
      const q = query(collection(db, "jobs"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
         const jobsData: Job[] = [];
         snapshot.forEach((doc) => {
            jobsData.push({ jobId: doc.id, ...doc.data() } as Job);
         });

         // Sort by date desc
         jobsData.sort((a, b) => {
            const timeA = a.updatedAt?.seconds || 0;
            const timeB = b.updatedAt?.seconds || 0;
            return timeB - timeA;
         });

         setRecentActivity(jobsData.slice(0, 6));
         setArchive(jobsData.filter(j => j.status === 'completed').slice(0, 5));
         setLoading(false);
      }, (error) => {
         console.error("Error fetching feed:", error);
         setLoading(false);
      });
      return () => unsubscribe();
   }, []);

   // Fetch Completed Jobs for Stats
   useEffect(() => {
      if (!user) return;
      const fetchStats = async () => {
         try {
            const appsQuery = query(
               collection(db, "applications"),
               where("applicantId", "==", user.uid),
               where("status", "==", "accepted")
            );
            const appsSnap = await getDocs(appsQuery);
            const jobIds = appsSnap.docs.map(d => d.data().jobId);

            if (jobIds.length > 0) {
               const jobsQuery = query(collection(db, "jobs"), where("status", "==", "completed"));
               const jobsSnap = await getDocs(jobsQuery);

               const myCompletedJobs: Job[] = [];
               jobsSnap.forEach(doc => {
                  if (jobIds.includes(doc.id)) {
                     myCompletedJobs.push({ jobId: doc.id, ...doc.data() } as Job);
                  }
               });
               setCompletedJobs(myCompletedJobs);
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

   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

   // Chart Data: Earnings over time
   const earningsByMonth = completedJobs.reduce((acc, job) => {
      if (!job.completedAt) return acc;
      const date = new Date(job.completedAt.seconds * 1000);
      const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[key] = (acc[key] || 0) + (Number(job.offeredFee) || 0);
      return acc;
   }, {} as Record<string, number>);

   const areaData = Object.keys(earningsByMonth).map(key => ({
      name: key,
      kazanc: earningsByMonth[key]
   }));

   const maskName = (name?: string) => {
      if (!name) return "Av. Kullanıcı";
      const parts = name.split(' ');
      return parts[0] + (parts.length > 1 ? ' ' + parts[1].charAt(0) + '****' : '');
   };

   return (
      <div className="bg-slate-50 min-h-screen pb-12">
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
                     <button
                        onClick={() => navigate('/create-job')}
                        className="bg-white text-primary-900 px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-50 transition transform hover:-translate-y-1 flex items-center"
                     >
                        <PlusCircle className="w-6 h-6 mr-3" /> Yeni Görev Ver
                     </button>
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
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-blue-100 font-medium mb-1">Toplam Kazanç</p>
                           <h3 className="text-3xl font-bold">{totalEarnings.toLocaleString('tr-TR')} TL</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                           <Wallet className="w-6 h-6 text-white" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-slate-500 font-medium mb-1">Tamamlanan Görevler</p>
                           <h3 className="text-3xl font-bold text-slate-900">{completedCount}</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl">
                           <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-slate-500 font-medium mb-1">Çalışılan Adliyeler</p>
                           <h3 className="text-3xl font-bold text-slate-900">{Object.keys(courthouseStats).length}</h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                           <Briefcase className="w-6 h-6 text-purple-600" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Charts */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Area Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Kazanç Grafiği</h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={areaData}>
                              <defs>
                                 <linearGradient id="colorKazanc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                              <Tooltip
                                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              />
                              <Area type="monotone" dataKey="kazanc" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorKazanc)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <h3 className="text-lg font-bold text-slate-800 mb-4">Adliye Dağılımı</h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={pieData}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius={60}
                                 outerRadius={80}
                                 fill="#8884d8"
                                 paddingAngle={5}
                                 dataKey="value"
                              >
                                 {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                 ))}
                              </Pie>
                              <Tooltip />
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                           {pieData.map((entry, index) => (
                              <div key={index} className="flex items-center text-xs text-slate-600">
                                 <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                 {entry.name} ({entry.value})
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* History Links */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
               <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">GÖREVLENDİRME GEÇMİŞİM</h3>
               <div className="space-y-3">
                  <div
                     onClick={() => navigate('/dashboard')}
                     className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-md hover:shadow-lg transition group"
                  >
                     <span className="font-semibold">Bekleyen / Başvurduğum Görevler</span>
                     <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition" />
                  </div>
                  <div
                     onClick={() => navigate('/my-jobs')}
                     className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-md hover:shadow-lg transition group"
                  >
                     <span className="font-semibold">Oluşturduğum Görevler</span>
                     <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition" />
                  </div>
               </div>
            </div>

            {/* Feed & Archive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

               {/* Live Feed */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                     <Activity className="w-5 h-5 mr-2 text-primary-600" />
                     AvukatNet'te neler oluyor?
                  </h3>
                  <div className="space-y-6 relative">
                     <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                     {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>
                     ) : recentActivity.map((job) => (
                        <div key={job.jobId} className="flex items-start relative z-10">
                           <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                              {job.status === 'in_progress' ? <Users className="w-4 h-4 text-blue-500" /> : <Briefcase className="w-4 h-4 text-emerald-500" />}
                           </div>
                           <div className="ml-4 flex-1">
                              <div className="flex justify-between items-start">
                                 <p className="text-sm font-bold text-slate-700">{maskName(job.ownerName)}</p>
                                 <span className="text-xs text-white bg-purple-500 px-2 py-0.5 rounded font-medium">
                                    {job.status === 'in_progress' ? 'Görev Atandı' : job.status === 'completed' ? 'Tamamlandı' : 'Yeni Görev'}
                                 </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{job.city} • {job.courthouse}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                 {job.updatedAt?.seconds ? new Date(job.updatedAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Az önce'}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Archive */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                     <h3 className="text-lg font-bold text-slate-800 flex items-center">
                        <Archive className="w-5 h-5 mr-2 text-primary-600" /> Arşiv
                     </h3>
                     <span className="text-xs text-slate-500">Son Tamamlananlar</span>
                  </div>

                  {loading ? (
                     <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>
                  ) : archive.length === 0 ? (
                     <p className="text-center text-slate-400 py-8">Henüz tamamlanan görev yok.</p>
                  ) : (
                     <div className="space-y-4">
                        {archive.map(job => (
                           <div key={job.jobId} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition border border-transparent hover:border-slate-100">
                              <div className="flex items-center">
                                 <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                    <Check className="w-5 h-5" />
                                 </div>
                                 <div className="ml-3">
                                    <p className="text-sm font-bold text-slate-800 max-w-[150px] truncate">{job.courthouse}</p>
                                    <p className="text-xs text-slate-500">{job.jobType}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-bold text-slate-900">{job.offeredFee} TL</p>
                                 <p className="text-xs text-green-600 font-medium">Tamamlandı</p>
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