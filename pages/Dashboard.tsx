import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, AlertCircle, Briefcase, MapPin, Search, Loader2, BarChart3, Search as SearchIcon, TrendingUp, CheckCircle, Wallet } from 'lucide-react';
import { User, Job, JobType } from '../types';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import JobCard from '../components/JobCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Dashboard = ({ user }: { user: User }) => {
  // Search Tab State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch Jobs for Search
  useEffect(() => {
    const q = query(collection(db, "jobs"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData: Job[] = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ jobId: doc.id, ...doc.data() } as Job);
      });

      jobsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Dashboard job listener error:", error);
      setErrorMsg("Görevler yüklenirken bir sorun oluştu.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Applied Jobs
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "applications"), where("applicantId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.data().jobId);
      setAppliedJobIds(ids);
    }, (error) => {
      console.warn("App listener warning:", error);
    });
    return () => unsubscribe();
  }, [user]);



  const userCourthouses = user.preferredCourthouses || [];

  const filteredJobs = jobs.filter(job => {
    if (job.createdBy === user.uid) return false;
    if (job.status !== 'open') return false;
    if (filterType !== 'ALL' && job.jobType !== filterType) return false;
    if (!userCourthouses.includes(job.courthouse)) return false;
    return true;
  });



  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">

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
          <Link to="/create-job" className="flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <PlusCircle className="h-5 w-5 mr-2" /> Yeni Görev Oluştur
          </Link>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {errorMsg}
          </div>
        )}

        {/* Warning if no courthouses selected */}
        {userCourthouses.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Henüz görev almak istediğiniz bir adliye seçmediniz. Size uygun görevleri görebilmek için
                  <Link to="/settings" className="font-medium underline text-yellow-800 ml-1 hover:text-yellow-900">
                    Ayarlar sayfasından seçim yapınız.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
              <Briefcase className="h-5 w-5 text-slate-400" />
              <select
                className="bg-transparent border-none focus:ring-0 text-slate-700 font-medium text-sm pr-8 cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">Tüm Görev Tipleri</option>
                {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            {userCourthouses.length > 0 ? (
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                <strong>{userCourthouses.length}</strong> adliye izleniyor
              </span>
            ) : (
              <span>Tüm Türkiye (Filtresiz)</span>
            )}
          </div>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <Search className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Şu an için uygun görev bulunamadı.</p>
                <p className="text-sm mt-2 text-center max-w-md">
                  Seçtiğiniz adliyelerde ({userCourthouses.join(', ') || 'Yok'}) henüz açık bir görev yok veya kriterlerinize uymuyor.
                  <br />
                  <Link to="/settings" className="text-primary-600 hover:underline mt-1 inline-block">Çalışma alanlarınızı genişletmek ister misiniz?</Link>
                </p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <JobCard
                  key={job.jobId}
                  job={job}
                  user={user}
                  hasApplied={appliedJobIds.includes(job.jobId || '')}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;