import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, AlertCircle, Briefcase, MapPin, Search, Loader2, BarChart3, Search as SearchIcon, TrendingUp, CheckCircle, Wallet, X } from 'lucide-react';
import { User, Job, JobType } from '../types';
import { supabase } from '../supabaseClient';
import JobCard from '../components/JobCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Dashboard = ({ user }: { user: User }) => {
  // Search Tab State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCourthouseModal, setShowCourthouseModal] = useState(false);

  // Fetch Jobs for Search
  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) {
        console.error("Dashboard job fetch error:", error);
        setErrorMsg("Görevler yüklenirken bir sorun oluştu.");
        setLoading(false);
        return;
      }

      const jobsData = (data || []).map((d: any) => ({
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

      jobsData.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      setJobs(jobsData);
      setLoading(false);
    };

    fetchJobs();

    const subscription = supabase
      .channel('public:jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        fetchJobs();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch Applied Jobs
  useEffect(() => {
    if (!user) return;
    const fetchApplied = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('job_id')
        .eq('applicant_id', user.uid);

      if (data) {
        setAppliedJobIds(data.map((d: any) => d.job_id));
      }
    };
    fetchApplied();

    const subscription = supabase
      .channel('public:applications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `applicant_id=eq.${user.uid}` }, () => {
        fetchApplied();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);


  if (job.time) {
    const [hours, minutes] = job.time.split(':').map(Number);
    jobDate.setHours(hours, minutes);
  } else {
    // If no time, assume end of day
    jobDate.setHours(23, 59, 59);
  }

  const now = new Date();
  const isExpired = jobDate < now;
  const isInvolved = job.createdBy === user.uid || job.assignedTo === user.uid;

  if (isExpired && !isInvolved) {
    return false;
  }
} catch (e) {
  console.warn("Date parsing error for job:", job.jobId, e);
}
    }

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
            <button
              onClick={() => setShowCourthouseModal(true)}
              className="flex items-center hover:text-primary-600 transition group"
            >
              <MapPin className="w-4 h-4 mr-1 text-primary-500 group-hover:scale-110 transition" />
              <strong>{userCourthouses.length}</strong>&nbsp;adliye izleniyor
            </button>
          ) : (
            <span>Tüm Türkiye (Filtresiz)</span>
          )}
        </div>
      </div>

      {/* Monitored Courthouses Modal */}
      {showCourthouseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-400" />
                <h3 className="font-bold">İzlenen Adliyeler</h3>
              </div>
              <button
                onClick={() => setShowCourthouseModal(false)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                {userCourthouses.map((ch, index) => (
                  <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mr-3"></div>
                    <span className="text-slate-700 font-medium">{ch}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center">
                  Adliye tercihlerinizi <Link to="/settings" className="text-primary-600 hover:underline">Ayarlar</Link> sayfasından değiştirebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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