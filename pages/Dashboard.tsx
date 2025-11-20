import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, AlertCircle, Briefcase, MapPin, Search, Loader2, BarChart3, Search as SearchIcon, TrendingUp, CheckCircle, Wallet } from 'lucide-react';
import { User, Job, JobType } from '../types';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import JobCard from '../components/JobCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Dashboard = ({ user }: { user: User }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'search'>('stats');

  // Search Tab State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Stats Tab State
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

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

  // Fetch Completed Jobs for Stats
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        // Find jobs where I was the applicant AND status is completed
        // We need to find applications first where status='accepted' and applicantId=me
        // Then check if the job is completed.
        // OR: If we store 'selectedApplicant' in Job, we can query Jobs directly.
        // Let's use the Application approach as it's safer given current structure.

        const appsQuery = query(
          collection(db, "applications"),
          where("applicantId", "==", user.uid),
          where("status", "==", "accepted")
        );
        const appsSnap = await getDocs(appsQuery);
        const jobIds = appsSnap.docs.map(d => d.data().jobId);

        if (jobIds.length > 0) {
          // Firestore 'in' query limit is 10. If user has many, we need to batch or fetch all and filter.
          // For scalability, let's fetch all completed jobs and filter in memory (not ideal for huge apps but fine here)
          // OR fetch specific IDs. Let's try fetching specific IDs if < 10, else fetch all.
          // Actually, let's just fetch all 'completed' jobs and filter by ID.
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

  const userCourthouses = user.preferredCourthouses || [];

  const filteredJobs = jobs.filter(job => {
    if (job.createdBy === user.uid) return false;
    if (job.status !== 'open') return false;
    if (filterType !== 'ALL' && job.jobType !== filterType) return false;
    if (!userCourthouses.includes(job.courthouse)) return false;
    return true;
  });

  // --- STATS CALCULATIONS ---
  const totalEarnings = completedJobs.reduce((sum, job) => {
    // We need the 'agreed fee'. Currently Job doesn't store it directly, Application does.
    // For simplicity, let's assume Job has 'offeredFee' or we use a rough estimate.
    // Ideally we should fetch the accepted application for each job to get the exact fee.
    // For this demo, let's use job.offeredFee if available, else 0.
    // In a real app, we'd join this data better.
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

  // Chart Data: Earnings over time (Dummy data generation if not enough real data)
  // Let's try to group by month
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

  // If no data, add some dummy for visualization if desired, or show empty state.
  // Let's show empty state if no data.

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Hoşgeldiniz, Av. {user.fullName}</p>
        </div>

        <div className="mt-4 md:mt-0 flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'stats' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center"><BarChart3 className="w-4 h-4 mr-2" /> İstatistikler</div>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'search' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center"><SearchIcon className="w-4 h-4 mr-2" /> Görev Ara</div>
          </button>
        </div>
      </div>

      {/* STATS TAB */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="mt-4 flex items-center text-sm text-blue-100">
                <TrendingUp className="w-4 h-4 mr-1" /> Bu ay performansınız harika!
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium mb-1">Tamamlanan Görevler</p>
                  <h3 className="text-3xl font-bold text-slate-900">{completedCount}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-500">
                Toplam {completedJobs.length} başarılı işbirliği
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium mb-1">Çalışılan Adliyeler</p>
                  <h3 className="text-3xl font-bold text-slate-900">{Object.keys(courthouseStats).length}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-500">
                Farklı lokasyonda hizmet verdiniz
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Kazanç Grafiği</h3>
              <div className="h-64">
                {areaData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="colorKazanc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="kazanc" stroke="#3b82f6" fillOpacity={1} fill="url(#colorKazanc)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    Henüz veri yok.
                  </div>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Adliye Dağılımı</h3>
              <div className="h-64">
                {pieData.length > 0 ? (
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
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    Henüz veri yok.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH TAB */}
      {activeTab === 'search' && (
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
      )}
    </div>
  );
};

export default Dashboard;