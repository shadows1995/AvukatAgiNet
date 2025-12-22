import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Phone, MessageCircle, User as UserIcon, Calendar, Clock, CheckCircle, ArrowLeft, ChevronRight, Star, X } from 'lucide-react';
import { Job, Application, User } from '../types';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';
import RatingModal from '../components/RatingModal';


interface AcceptedJobData {
  job: Job;
  application: Application;
  owner: User;
}

const AcceptedJobs = () => {
  const [acceptedJobs, setAcceptedJobs] = useState<AcceptedJobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<AcceptedJobData | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [canRate, setCanRate] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  useEffect(() => {
    fetchAcceptedJobs();
  }, []);

  // ... (keep fetchAcceptedJobs and helper functions same)
  const fetchAcceptedJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('selected_applicant', user.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      const acceptedJobsData: AcceptedJobData[] = [];

      if (jobsData) {
        const results = await Promise.all(jobsData.map(async (jobData) => {
          const mappedJob: Job = {
            jobId: jobData.job_id,
            title: jobData.title,
            description: jobData.description,
            city: jobData.city,
            courthouse: jobData.courthouse,
            date: jobData.date,
            time: jobData.time,
            jobType: jobData.job_type,
            offeredFee: jobData.offered_fee,
            createdBy: jobData.created_by,
            ownerName: jobData.owner_name,
            ownerPhone: jobData.owner_phone,
            status: jobData.status,
            applicationsCount: jobData.applications_count,
            createdAt: jobData.created_at,
            updatedAt: jobData.updated_at,
            isUrgent: jobData.is_urgent,
            applicationDeadline: jobData.application_deadline,
            selectedApplicant: jobData.selected_applicant,
            completedAt: jobData.completed_at
          };

          const { data: appData } = await supabase
            .from('applications')
            .select('*')
            .eq('job_id', jobData.job_id)
            .eq('applicant_id', user.id)
            .single();

          const mappedApp: Application = appData ? {
            applicationId: appData.application_id,
            jobId: appData.job_id,
            applicantId: appData.applicant_id,
            applicantName: appData.applicant_name,
            applicantRating: appData.applicant_rating,
            message: appData.message,
            proposedFee: appData.proposed_fee,
            status: appData.status,
            createdAt: appData.created_at
          } : {
            jobId: jobData.job_id,
            applicantId: user.id,
            applicantName: user.user_metadata?.full_name || '',
            message: '',
            proposedFee: jobData.offered_fee,
            status: 'accepted',
            createdAt: new Date().toISOString()
          };

          const { data: ownerData } = await supabase
            .from('users')
            .select('*')
            .eq('uid', jobData.created_by)
            .single();

          if (ownerData) {
            const mappedOwner: User = {
              uid: ownerData.uid,
              email: ownerData.email,
              fullName: ownerData.full_name,
              baroNumber: ownerData.baro_number,
              baroCity: ownerData.baro_city,
              phone: ownerData.phone,
              specializations: ownerData.specializations,
              city: ownerData.city,
              preferredCourthouses: ownerData.preferred_courthouses,
              isPremium: ownerData.is_premium,
              membershipType: ownerData.membership_type,
              premiumUntil: ownerData.premium_until,
              premiumSince: ownerData.premium_since,
              premiumPlan: ownerData.premium_plan,
              premiumPrice: ownerData.premium_price,
              role: ownerData.role,
              rating: ownerData.rating,
              completedJobs: ownerData.completed_jobs,
              avatarUrl: ownerData.avatar_url,
              createdAt: ownerData.created_at,
              updatedAt: ownerData.updated_at,
              jobStatus: ownerData.job_status,
              aboutMe: ownerData.about_me,
              title: ownerData.title,
              address: ownerData.address
            };

            return {
              job: mappedJob,
              application: mappedApp,
              owner: mappedOwner
            };
          }
          return null;
        }));

        const validJobs = results.filter((item): item is AcceptedJobData => item !== null);
        acceptedJobsData.push(...validJobs);
      }

      setAcceptedJobs(acceptedJobsData);
    } catch (error) {
      console.error("Error fetching accepted jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkCanRate = async (jobId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: job } = await supabase
      .from('jobs')
      .select('lawyer_rated')
      .eq('job_id', jobId)
      .single();

    return job && !job.lawyer_rated;
  };

  useEffect(() => {
    if (selectedJob && selectedJob.job.status === 'completed') {
      checkCanRate(selectedJob.job.jobId).then(setCanRate);
    } else {
      setCanRate(false);
    }
  }, [selectedJob]);

  const handleRatingSuccess = () => {
    setShowRatingModal(false);
    setCanRate(false);
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let finalPhone = cleanPhone;
    if (finalPhone.startsWith('0')) finalPhone = finalPhone.substring(1);
    if (finalPhone.length === 10) finalPhone = '90' + finalPhone;
    window.open(`https://wa.me/${finalPhone}`, '_blank');
  };

  const handleCompleteTask = async () => {
    if (!selectedJob) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    showAlert({
      title: "Görevi Tamamla",
      message: "Bu görevi tamamladığınızı onaylıyor musunuz?",
      type: "confirm",
      confirmText: "Evet, Tamamla",
      cancelText: "Vazgeç",
      onConfirm: async () => {
        setCompleting(true);
        try {
          const { error: jobError } = await supabase.from('jobs').update({
            status: 'completed',
            completed_at: new Date().toISOString()
          }).eq('job_id', selectedJob.job.jobId);

          if (jobError) throw jobError;

          // Increment User's Completed Jobs
          const { data: currentUserData } = await supabase
            .from('users')
            .select('completed_jobs')
            .eq('uid', user.id)
            .single();

          if (currentUserData) {
            await supabase.from('users').update({
              completed_jobs: (currentUserData.completed_jobs || 0) + 1
            }).eq('uid', user.id);
          }

          await supabase.from('notifications').insert({
            user_id: selectedJob.owner.uid,
            title: "Görev Tamamlandı! 🎉",
            message: `"${selectedJob.job.title}" görevi Av. ${user.user_metadata?.full_name || 'Meslektaşınız'} tarafından tamamlandı.`,
            type: "success",
            read: false,
            created_at: new Date().toISOString(),
            metadata: { jobId: selectedJob.job.jobId, type: 'job_completed' }
          });

          showAlert({
            title: "Başarılı",
            message: "Görev başarıyla tamamlandı olarak işaretlendi.",
            type: "success",
            confirmText: "Tamam"
          });

          setAcceptedJobs(prev => prev.map(j =>
            j.job.jobId === selectedJob.job.jobId
              ? { ...j, job: { ...j.job, status: 'completed' } }
              : j
          ));

          setSelectedJob(prev => prev ? { ...prev, job: { ...prev.job, status: 'completed' } } : null);
        } catch (error) {
          console.error("Error completing task:", error);
          showAlert({
            title: "Hata",
            message: "Bir hata oluştu.",
            type: "error",
            confirmText: "Tamam"
          });
        } finally {
          setCompleting(false);
        }
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center p-20 min-h-[50vh]">
      <div className="text-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary-600 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Görevleriniz yükleniyor...</p>
      </div>
    </div>
  );

  if (selectedJob) {
    const { job, owner } = selectedJob;
    const isCompleted = job.status === 'completed';

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedJob(null)}
          className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition font-medium group"
        >
          <div className="bg-white p-2 rounded-full shadow-sm border border-slate-200 mr-2 group-hover:border-primary-200 group-hover:text-primary-600">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </div>
          Listeye Dön
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
          {/* Artistic Header Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-10 -mb-10 blur-3xl opacity-50 z-0"></div>

          {/* Header Content */}
          <div className="relative z-10 bg-gradient-to-br from-primary-600 to-indigo-700 text-white p-8 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{job.title}</h1>
              {isCompleted && (
                <div className="flex items-center bg-green-500/20 backdrop-blur-sm border border-green-400/30 px-4 py-1.5 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-bold">TAMAMLANDI</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-primary-100 text-sm font-medium">
              <span className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10">
                <MapPin className="w-4 h-4 mr-2 text-primary-200" />
                {job.city} / {job.courthouse}
              </span>
              <span className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10">
                <Calendar className="w-4 h-4 mr-2 text-primary-200" />
                {formatDate(job.date)}
              </span>
              <span className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10">
                <Clock className="w-4 h-4 mr-2 text-primary-200" />
                {job.time}
              </span>
            </div>
          </div>

          <div className="relative z-10 p-8 md:p-10 space-y-10">
            {/* Task Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                <div className="w-8 h-0.5 bg-slate-200 mr-2"></div>
                Görev Detayları
              </h3>
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">{job.description}</p>
              </div>
            </div>

            {/* Owner Info */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                <div className="w-8 h-0.5 bg-slate-200 mr-2"></div>
                Görev Sahibi
              </h3>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow flex items-center justify-center text-slate-600 font-bold text-xl">
                      {owner.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{owner.title || 'Av.'} {owner.fullName}</h4>
                      <div className="flex items-center text-sm text-slate-500 mt-0.5">
                        <span>{owner.baroCity} Barosu</span>
                        <span className="mx-2">•</span>
                        <span>{owner.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/profile/${owner.uid}`)}
                    className="text-primary-600 font-bold hover:text-primary-700 text-sm bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition"
                  >
                    Profili Gör
                  </button>
                </div>

                {/* Contact Actions */}
                {owner.phone && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => handleWhatsApp(owner.phone!)}
                      className="flex items-center justify-center px-4 py-3.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-200 transform hover:-translate-y-0.5"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp ({owner.phone})
                    </button>
                    <a
                      href={`tel:${owner.phone}`}
                      className="flex items-center justify-center px-4 py-3.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-200 transform hover:-translate-y-0.5"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Ara ({owner.phone})
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Completion Actions */}
            <div className="pt-8 border-t border-slate-100">
              {job.status === 'cancelled' ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-3 rounded-full shadow-sm border border-red-100">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-red-700 mb-2">Bu Görev İptal Edildi</h3>
                  <p className="text-red-600/80 max-w-sm mx-auto">
                    Bu görev, görev sahibi tarafından iptal edilmiştir. Artık bu görev üzerinde herhangi bir işlem yapamazsınız.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleCompleteTask}
                    disabled={completing || isCompleted}
                    className={`w-full flex items-center justify-center px-6 py-5 rounded-2xl font-bold text-lg transition shadow-xl transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none ${isCompleted
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-green-200'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-300'
                      }`}
                  >
                    {completing ? (
                      <Loader2 className="animate-spin w-6 h-6 mr-3" />
                    ) : (
                      <CheckCircle className="w-6 h-6 mr-3" />
                    )}
                    {isCompleted ? 'Görevi Tamamladınız' : 'Görevi Tamamla'}
                  </button>

                  {isCompleted && canRate && (
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="w-full flex items-center justify-center px-6 py-4 rounded-2xl font-bold transition shadow-lg hover:shadow-xl bg-amber-400 text-white hover:bg-amber-500 mt-4 shadow-amber-100"
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Görev Sahibini Değerlendir
                    </button>
                  )}

                  {isCompleted && !canRate && (
                    <div className="mt-4 flex justify-center">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                        <CheckCircle className="w-3 h-3 mr-1.5" />
                        Değerlendirme yapıldı
                      </span>
                    </div>
                  )}

                  <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                    Görevi tamamladığınızda görev sahibine otomatik bildirim gönderilecektir.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          jobId={job.jobId}
          revieweeId={owner.uid}
          revieweeName={owner.fullName}
          onSuccess={handleRatingSuccess}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Aldığım Görevler</h2>
        <p className="text-slate-500 mt-2 text-lg">Başvurusu kabul edilen ve üzerinde çalıştığınız aktif görevler.</p>
      </div>

      {acceptedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <UserIcon className="w-12 h-12 text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Henüz aktif göreviniz bulunmuyor</h3>
          <p className="text-slate-500 mt-3 max-w-md text-center leading-relaxed">
            Başvurularınız kabul edildiğinde görev detaylarını burada görebileceksiniz.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-200 hover:-translate-y-1"
          >
            Yeni Görev Bul
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {acceptedJobs.map((data) => (
            <div
              key={data.job.jobId}
              onClick={() => setSelectedJob(data)}
              className={`group relative bg-white rounded-2xl p-6 border transition-all duration-300 cursor-pointer overflow-hidden ${data.job.status === 'completed'
                ? 'border-slate-100 shadow-sm opacity-80 hover:opacity-100'
                : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200 hover:-translate-y-1'
                }`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <UserIcon className="w-24 h-24 text-primary-600 transform rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary-50 p-3 rounded-xl group-hover:bg-primary-100 transition-colors">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  {data.job.status === 'completed' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Tamamlandı
                    </span>
                  )}
                  {data.job.status === 'cancelled' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 flex items-center">
                      <X className="w-3 h-3 mr-1" />
                      İptal Edildi
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {data.job.title}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {data.job.city} / {data.job.courthouse}
                  </div>
                  <div className="flex items-center text-slate-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    {formatDate(data.job.date)} &bull; {data.job.time}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="font-bold text-lg text-slate-900">
                    {data.application.proposedFee} <span className="text-sm text-slate-500 font-normal">TL</span>
                  </div>
                  <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Detaylar <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedJobs;
