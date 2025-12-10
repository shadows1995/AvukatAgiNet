
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Timer, Users, ChevronDown, Star, DollarSign, CheckCircle, User as UserIcon, AlertTriangle, X, Award } from 'lucide-react';
import { Job, Application, User } from '../types';
import { supabase } from '../supabaseClient';
import { useNotification } from '../contexts/NotificationContext';
import { useAlert } from '../contexts/AlertContext';


const MyJobs = () => {
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApplicantData, setSelectedApplicantData] = useState<{ [jobId: string]: User | null }>({});
  const { showNotification } = useNotification();

  // Modal States


  const navigate = useNavigate();

  const [_, setTicker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("MyJobs listener error:", error);
        setLoading(false);
        return;
      }

      if (jobsData) {
        const mappedJobs: Job[] = jobsData.map((job: any) => ({
          jobId: job.job_id,
          title: job.title,
          description: job.description,
          city: job.city,
          courthouse: job.courthouse,
          date: job.date,
          time: job.time,
          jobType: job.job_type,
          offeredFee: job.offered_fee,
          createdBy: job.created_by,
          ownerName: job.owner_name,
          ownerPhone: job.owner_phone,
          status: job.status,
          applicationsCount: job.applications ? job.applications[0].count : (job.applications_count || 0),
          createdAt: job.created_at,
          updatedAt: job.updated_at,
          isUrgent: job.is_urgent,
          applicationDeadline: job.application_deadline,
          selectedApplicant: job.selected_applicant,
          completedAt: job.completed_at
        }));
        setMyJobs(mappedJobs);

        // Fetch selected applicants data for "In Progress" jobs
        mappedJobs.forEach(async (job) => {
          if (job.selectedApplicant && job.status === 'in_progress' && job.jobId) {
            try {
              const { data: userData } = await supabase.from('users').select('*').eq('uid', job.selectedApplicant).single();
              if (userData) {
                const mappedUser: User = {
                  uid: userData.uid,
                  email: userData.email,
                  fullName: userData.full_name,
                  baroNumber: userData.baro_number,
                  baroCity: userData.baro_city,
                  phone: userData.phone,
                  specializations: userData.specializations,
                  city: userData.city,
                  preferredCourthouses: userData.preferred_courthouses,
                  isPremium: userData.is_premium,
                  membershipType: userData.membership_type,
                  premiumUntil: userData.premium_until,
                  premiumSince: userData.premium_since,
                  premiumPlan: userData.premium_plan,
                  premiumPrice: userData.premium_price,
                  role: userData.role,
                  rating: userData.rating,
                  completedJobs: userData.completed_jobs,
                  avatarUrl: userData.avatar_url,
                  createdAt: userData.created_at,
                  updatedAt: userData.updated_at,
                  jobStatus: userData.job_status,
                  aboutMe: userData.about_me,
                  title: userData.title,
                  address: userData.address
                };
                setSelectedApplicantData(prev => ({
                  ...prev,
                  [job.jobId!]: mappedUser
                }));
              }
            } catch (error) {
              console.error("Error fetching applicant data:", error);
            }
          }
        });
      }
      setLoading(false);
    };

    fetchJobs();

    // Subscribe to realtime changes for jobs
    const subscription = supabase.channel('my_jobs_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, (payload) => {
        fetchJobs(); // Re-fetch on change for simplicity
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchApplications = async (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
    if (expandedJobId === jobId) return;

    setLoadingApps(true);
    try {
      const { data: appsData, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId);

      if (error) throw error;

      if (appsData && appsData.length > 0) {
        // Extract applicant IDs
        const applicantIds = appsData.map(app => app.applicant_id);

        // Fetch FRESH user details for all applicants
        // Using select('*') to ensure we get exactly what ProfilePage gets, avoiding any RLS column restrictions
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .in('uid', applicantIds);

        if (usersError) console.error("Error fetching applicant details:", usersError);

        // Create a map for easy lookup
        const userMap: { [key: string]: User } = {};
        usersData?.forEach((u: any) => {
          userMap[u.uid] = {
            uid: u.uid,
            fullName: u.full_name, // Fresh name
            rating: u.rating,      // Fresh rating
            membershipType: u.membership_type,
            // We can treat monthlyJobCount roughly as job_count or calculate it via stats if critical. 
            // The user mentioned "Aylık alınan görev sayısı". 
            // Let's stick to the stats table for monthly count if we want to be precise, 
            // OR use the user's general job_status if that's what was intended. 
            // Re-reading user request: "Aylık alınan görev sayısı gösterimi de yapılıyor o bağlantıyı da kontrol et."
            // The previous code fetched 'user_monthly_stats'. Let's KEEP that for monthly count accuracy.
            specializations: u.specializations // Capture specializations
          } as User;
        });

        // Get current month for stats (Keep this logic for monthly count)
        const now = new Date();
        const currentMonthDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

        const { data: statsData } = await supabase
          .from('user_monthly_stats')
          .select('user_id, job_count')
          .in('user_id', applicantIds)
          .eq('month', currentMonthDate);

        const statsMap: { [key: string]: number } = {};
        statsData?.forEach(stat => {
          statsMap[stat.user_id] = stat.job_count || 0;
        });

        // Map applications with FRESH user data
        const apps: (Application & { monthlyJobCount: number })[] = appsData.map(app => {
          const freshUser = userMap[app.applicant_id];
          return {
            applicationId: app.application_id,
            jobId: app.job_id,
            applicantId: app.applicant_id,

            // Use FRESH name if available, else fallback to app snapshot
            // NOTE: The UI will mask this name carefully!
            applicantName: freshUser?.fullName || app.applicant_name,

            // Use FRESH rating if available
            applicantRating: freshUser?.rating !== undefined ? freshUser.rating : app.applicant_rating,

            message: app.message,
            proposedFee: app.proposed_fee,
            status: app.status,
            createdAt: app.created_at,

            // Correct monthly count from stats view
            monthlyJobCount: statsMap[app.applicant_id] || 0,

            // Fresh membership type
            membershipType: freshUser?.membershipType || 'free',
            specializations: freshUser?.specializations
          };
        });

        // Sort: Premium+ first, then by monthly job count (ascending)
        apps.sort((a, b) => {
          // 1. Premium Plus Priority
          if (a.membershipType === 'premium_plus' && b.membershipType !== 'premium_plus') return -1;
          if (a.membershipType !== 'premium_plus' && b.membershipType === 'premium_plus') return 1;

          // 2. Monthly Job Count (Ascending - fewer jobs first)
          return a.monthlyJobCount - b.monthlyJobCount;
        });

        setApplications(apps as any);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  const isJobExpired = (job: Job) => {
    if (!job.date || !job.time) return false;
    try {
      let day, month, year;
      // Handle DD.MM.YYYY format
      if (job.date.includes('.')) {
        [day, month, year] = job.date.split('.').map(Number);
      }
      // Handle YYYY-MM-DD format (HTML date input standard)
      else if (job.date.includes('-')) {
        [year, month, day] = job.date.split('-').map(Number);
      }
      else {
        return false;
      }

      const [hour, minute] = job.time.split(':').map(Number);
      const jobDate = new Date(year, month - 1, day, hour, minute);

      // Current time
      const now = new Date();

      return now > jobDate;
    } catch (e) {
      console.error("Date parsing error:", e);
      return false;
    }
  };

  const { showAlert } = useAlert();

  // 1. Step: Open Confirm Modal
  const handleSelectClick = (job: Job, app: Application) => {
    if (isJobExpired(job)) {
      showNotification('error', "Görevin süresi geçti! Artık bu göreve atama yapamazsınız.");
      return;
    }

    showAlert({
      title: "Emin misiniz?",
      message: `${app.applicantName} isimli avukata bu görevi vermek üzeresiniz. İletişim bilgileriniz karşılıklı olarak paylaşılacaktır.`,
      type: "confirm",
      confirmText: "Görevi Ver",
      cancelText: "Vazgeç",
      onConfirm: () => executeAssignment(job, app)
    });
  };

  // 2. Step: Execute Logic
  const executeAssignment = async (job: Job, app: Application) => {
    if (!job || !app || !job.jobId || !app.applicationId) {
      showAlert({ title: "Hata", message: "İşlem sırasında veri kaybı oluştu.", type: "error" });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Update Job
      const { error: jobError } = await supabase.from('jobs').update({
        selected_applicant: app.applicantId,
        status: 'in_progress'
      }).eq('job_id', job.jobId);

      if (jobError) throw jobError;

      // 2. Update Application
      const { error: appError } = await supabase.from('applications').update({
        status: 'accepted'
      }).eq('application_id', app.applicationId);

      if (appError) throw appError;

      // 3. Notify Applicant
      await supabase.from('notifications').insert({
        user_id: app.applicantId,
        title: "Başvurunuz Kabul Edildi! 🎉",
        message: `Tebrikler! "${job.title}" görevi için seçildiniz. Görev sahibiyle iletişime geçebilirsiniz.`,
        type: "success",
        read: false,
        created_at: new Date().toISOString(),
        metadata: { jobId: job.jobId, type: 'application_accepted_applicant' }
      });

      // 4. Notify Owner (Self)
      if (user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: "Görev Atandı ✅",
          message: `"${job.title}" görevi Av. ${app.applicantName}'e atandı.`,
          type: "info",
          read: false,
          created_at: new Date().toISOString(),
          metadata: { jobId: job.jobId, type: 'application_accepted_owner' }
        });
      }

      // Trigger SMS Notification (Fire and forget)
      const apiUrl = import.meta.env.VITE_API_URL || '';
      fetch(`${apiUrl}/api/notify-application-approved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantId: app.applicantId,
          jobTitle: job.title
        })
      }).catch(err => console.error("SMS Notification Error:", err));

      // Show Success Modal
      showAlert({
        title: "İşlem Başarılı!",
        message: "Görev ataması başarıyla yapıldı! İletişim bilgileri açılıyor...",
        type: "success",
        confirmText: "Profiline Git",
        onConfirm: () => navigate(`/profile/${app.applicantId}`)
      });

    } catch (error: any) {
      console.error("Error selecting applicant:", error);
      showAlert({ title: "Hata", message: `Hata: ${error.message || 'Bilinmeyen hata'}`, type: "error" });
    }
  };

  const getTimeLeft = (deadline: any) => {
    if (!deadline) return 0;
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - new Date().getTime();
    return diff > 0 ? diff : 0;
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Görevlerim</h2>



      <div className="space-y-4">
        {myJobs.length === 0 && <p className="text-slate-500">Henüz görev yayınlamadınız.</p>}
        {myJobs.map(job => {
          // Check if application deadline has passed
          const isApplicationOpen = job.applicationDeadline
            ? Date.now() < new Date(job.applicationDeadline).getTime()
            : true; // If no deadline set, assume open

          const selectedUser = job.jobId ? selectedApplicantData[job.jobId] : null;

          return (
            <div key={job.jobId} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${job.status === 'open' && isJobExpired(job) ? 'bg-red-100 text-red-700' :
                      job.status === 'open' && !isApplicationOpen ? 'bg-orange-100 text-orange-700' :
                        job.status === 'open' ? 'bg-green-100 text-green-700' :
                          job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                      }`}>
                      {job.status === 'open' && isJobExpired(job) ? 'Süresi Geçmiş' :
                        job.status === 'open' && !isApplicationOpen ? 'Başvurular Kapandı' :
                          job.status === 'open' ? 'Başvuruya Açık' :
                            job.status === 'in_progress' ? 'Atandı' :
                              job.status === 'completed' ? 'Tamamlandı' :
                                job.status === 'cancelled' ? 'İptal Edildi' : job.status}
                    </span>
                    {job.isUrgent && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">ACİL</span>}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.city} • {job.courthouse} • {job.date ? job.date.split('-').reverse().join('-') : ''}</p>

                  {/* SELECTED APPLICANT INFO CARD */}
                  {job.status === 'in_progress' && selectedUser && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between animate-in fade-in">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-white border border-green-200 flex items-center justify-center text-green-700 font-bold text-lg shadow-sm">
                          {selectedUser.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Görevi Üstlenen</p>
                          <p className="font-bold text-slate-900">{selectedUser.fullName}</p>
                          <p className="text-sm text-slate-600">{selectedUser.baroCity} Barosu • Sicil: {selectedUser.baroNumber} • {selectedUser.phone}</p>
                          {selectedUser.address && <p className="text-xs text-slate-500 mt-1">{selectedUser.address}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/profile/${selectedUser.uid}`)}
                        className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition flex items-center shadow-sm"
                      >
                        <UserIcon className="w-4 h-4 mr-2" /> Profil
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {job.status === 'open' && job.applicationDeadline && (
                    <div className={`flex items-center font-mono text-sm px-3 py-1 rounded-md ${isApplicationOpen ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                      <Timer className="w-4 h-4 mr-2" />
                      {isApplicationOpen ? (
                        <span>Seçim İçin: {formatTime(getTimeLeft(job.applicationDeadline))}</span>
                      ) : (
                        <span>Seçim Yapılabilir</span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/job/${job.jobId}`)}
                    className="flex items-center text-slate-600 font-medium hover:bg-slate-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-slate-200"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Görevi Görüntüle
                  </button>

                  <button
                    onClick={() => fetchApplications(job.jobId!)}
                    disabled={isApplicationOpen}
                    className={`flex items-center font-medium px-4 py-2 rounded-lg transition border border-transparent ${isApplicationOpen
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'text-primary-600 hover:bg-primary-50 hover:border-primary-100'
                      }`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Başvuruları Yönet ({job.applicationsCount || 0}) {expandedJobId === job.jobId ? <ChevronDown className="ml-1 w-4 h-4 rotate-180" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                  </button>
                </div>
              </div>

              {expandedJobId === job.jobId && (
                <div className="bg-slate-50 border-t border-slate-200 p-6 animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-slate-800 mb-4">Gelen Başvurular ({applications.length})</h4>
                  {loadingApps ? (
                    <Loader2 className="animate-spin text-slate-400" />
                  ) : applications.length === 0 ? (
                    <p className="text-sm text-slate-500">Henüz başvuru yok.</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app: any, index) => {
                        const isSelected = job.selectedApplicant === app.applicantId;

                        // Calculate minimum job count and restriction
                        const minJobCount = applications.length > 0 ? Math.min(...applications.map((a: any) => a.monthlyJobCount || 0)) : 0;
                        const isRestricted = (app.monthlyJobCount || 0) > (minJobCount + 3);
                        const isPremiumPlus = app.membershipType === 'premium_plus';

                        return (
                          <div key={app.applicationId} className={`bg-white p-4 rounded-lg border flex justify-between items-center shadow-sm transition-all duration-300 ${isSelected ? 'border-green-500 ring-1 ring-green-500' :
                            isPremiumPlus ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-100 bg-amber-50/30' :
                              isRestricted ? 'border-orange-200 bg-orange-50/30' :
                                'border-slate-200'
                            }`}>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span
                                  onClick={() => isSelected && navigate(`/profile/${app.applicantId}`)}
                                  className={`font-bold transition ${isSelected ? 'text-slate-800 cursor-pointer hover:text-primary-600 hover:underline' : 'text-slate-500 cursor-default'}`}
                                >
                                  {isSelected ? app.applicantName : (() => {
                                    const parts = app.applicantName.trim().split(/\s+/);
                                    if (parts.length === 1) return `${parts[0].charAt(0)}.`;
                                    return `${parts[0].charAt(0)}. ${parts[parts.length - 1].charAt(0)}.`;
                                  })()}
                                </span>
                                <span className="flex items-center text-amber-500 text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                  <Star className="w-3 h-3 fill-current mr-1" />
                                  {app.applicantRating ? app.applicantRating.toFixed(1) : '0.0'}
                                </span>
                                <span className="flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-medium">
                                  Bu ay: {app.monthlyJobCount || 0} görev
                                </span>
                                {isSelected && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">SEÇİLDİ</span>}
                                {isPremiumPlus && !isSelected && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200 flex items-center"><Star className="w-3 h-3 mr-1 fill-amber-700" /> PREMIUM+</span>}
                                {isRestricted && !isSelected && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-200">SEÇİLEMEZ</span>}
                              </div>
                              <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100 italic">"{app.message}"</p>
                              <div className="flex flex-wrap items-center mt-2 text-xs text-slate-500 gap-2 md:gap-0 md:space-x-4">
                                <span className="flex items-center text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded"><DollarSign className="w-3 h-3 mr-1" /> Teklif: {app.proposedFee} TL</span>
                                {isPremiumPlus && app.specializations && app.specializations.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1 md:space-x-2 md:ml-4">
                                    {app.specializations.map((spec: string, i: number) => (
                                      <span key={i} className="text-[10px] md:text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded-full flex items-center">
                                        <Award className="w-3 h-3 mr-1" />{spec}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {!isSelected && (
                              <button
                                onClick={() => handleSelectClick(job, app)}
                                disabled={isApplicationOpen || isJobExpired(job) || isRestricted}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm ml-4 ${isApplicationOpen || isJobExpired(job) || isRestricted
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md'
                                  }`}
                              >
                                {isJobExpired(job) ? 'Süre Doldu' : isApplicationOpen ? 'Süre' : isRestricted ? 'Seçilemez' : 'Görevi Ver'}
                              </button>
                            )}
                            {isSelected && (
                              <button
                                onClick={() => navigate(`/profile/${app.applicantId}`)}
                                className="text-green-600 font-bold text-sm flex items-center hover:underline bg-green-50 px-3 py-2 rounded-lg ml-4"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" /> İletişim Bilgileri
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyJobs;
