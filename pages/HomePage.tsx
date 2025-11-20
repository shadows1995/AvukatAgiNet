import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowRight, Gavel, Loader2, Activity, Briefcase, Archive, Users, Check } from 'lucide-react';
import { Job } from '../types';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';

const HomePage = () => {
   const navigate = useNavigate();
   const [recentActivity, setRecentActivity] = useState<Job[]>([]);
   const [archive, setArchive] = useState<Job[]>([]);
   const [loading, setLoading] = useState(true);

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

   const maskName = (name?: string) => {
      if (!name) return "Av. Kullanıcı";
      const parts = name.split(' ');
      return parts[0] + (parts.length > 1 ? ' ' + parts[1].charAt(0) + '****' : '');
   };

   return (
      <div className="bg-slate-50 min-h-screen pb-12">
         {/* Hero Section - BOXED LAYOUT & BLUE COLOR */}
         <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="bg-primary-600 text-white py-12 px-8 rounded-2xl shadow-lg relative overflow-hidden">
               <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                  <div className="mb-6 md:mb-0 max-w-2xl">
                     <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Tevkil vererek il dışındaki meslektaşlarınızı görevlendirin, duruşmalarınızı kaçırmayın!</h1>
                     <p className="text-primary-100 text-lg mb-8">Türkiye'nin lider tevkil uygulamasını kullanmanın tadını çıkarın!</p>
                     <button
                        onClick={() => navigate('/create-job')}
                        className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold text-base shadow-md hover:bg-blue-50 transition flex items-center inline-flex transform hover:-translate-y-1"
                     >
                        <PlusCircle className="w-5 h-5 mr-2" /> Yeni Görev Ver
                     </button>
                  </div>
                  <div className="hidden md:block relative">
                     <div className="bg-white/10 p-6 rounded-full backdrop-blur-sm animate-pulse">
                        <Gavel className="w-24 h-24 text-white opacity-90" />
                     </div>
                  </div>
               </div>
               {/* Decoration */}
               <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary-500 opacity-20 rounded-full blur-3xl"></div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 mt-8">
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