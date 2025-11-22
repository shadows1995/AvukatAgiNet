import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Phone, MessageCircle, User as UserIcon, Calendar, Clock, CheckCircle, ArrowLeft, ChevronRight, Star } from 'lucide-react';
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

  useEffect(() => {
    fetchAcceptedJobs();
  }, []);

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
        await Promise.all(jobsData.map(async (jobData) => {
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

            acceptedJobsData.push({
              job: mappedJob,
              application: mappedApp,
              owner: mappedOwner
            });
          }
        }));
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

          await supabase.from('notifications').insert({
            user_id: selectedJob.owner.uid,
            title: "Görev Tamamlandı! 🎉",
            message: `"${selectedJob.job.title}" görevi Av. ${user.user_metadata?.full_name || 'Meslektaşınız'} tarafından tamamlandı.`,
            type: "success",
            read: false,
            created_at: new Date().toISOString()
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

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  if (selectedJob) {
    const { job, owner, application } = selectedJob;
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedJob(null)}
          className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Listeye Dön
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="bg-primary-600 p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-primary-100 text-sm">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.city} / {job.courthouse}</span>
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {job.date}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {job.time}</span>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Görev Detayları</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Görev Sahibi</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary-600 font-bold text-lg shadow-sm">
                    {owner.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{owner.title || 'Av.'} {owner.fullName}</h4>
                    <p className="text-sm text-slate-500">{owner.baroCity} Barosu • {owner.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/profile/${owner.uid}`)}
                  className="text-primary-600 font-medium hover:underline text-sm"
                >
                  Profili Gör
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {owner.phone && (
                <>
                  <button
                    onClick={() => handleWhatsApp(owner.phone!)}
                    className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                  </button>
                  <a
                    href={`tel:${owner.phone}`}
                    className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md hover:shadow-lg"
                  >
                    <Phone className="w-5 h-5 mr-2" /> Ara
                  </a>
                </>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100">
              <button
                onClick={handleCompleteTask}
                disabled={completing || job.status === 'completed'}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${job.status === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
              >
                {completing ? (
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                ) : job.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                {job.status === 'completed' ? 'Görevi Tamamladınız' : 'Görevi Tamamla'}
              </button>

              {job.status === 'completed' && canRate && (
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="w-full flex items-center justify-center px-6 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl bg-yellow-500 text-white hover:bg-yellow-600 mt-3"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Görev Sahibini Değerlendir
                </button>
              )}

              {job.status === 'completed' && !canRate && (
                <p className="text-center text-xs text-slate-500 mt-3">
                  ✓ Görev sahibini değerlendirdiniz
                </p>
              )}

              <p className="text-center text-xs text-slate-400 mt-3">
                Görevi tamamladığınızda görev sahibine bildirim gönderilecektir.
              </p>
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Aldığım Görevler</h2>

      {acceptedJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Aktif göreviniz bulunmuyor.</h3>
          <p className="text-slate-500 mt-2">Başvurularınız kabul edildiğinde burada listelenecektir.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition"
          >
            Görevlere Göz At
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {acceptedJobs.map((data) => (
            <div
              key={data.job.jobId}
              onClick={() => setSelectedJob(data)}
              className={`border rounded-xl p-6 hover:shadow-md transition cursor-pointer group flex justify-between items-center ${data.job.status === 'completed' ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200'
                }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition">{data.job.title}</h3>
                  {data.job.status === 'completed' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                      TAMAMLANDI
                    </span>
                  )}
                </div>
                <div className="flex items-center text-slate-500 text-sm mt-1 space-x-3">
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {data.job.city}</span>
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {data.job.date}</span>
                </div>
              </div>
              <div className="flex items-center text-slate-400">
                <span className="text-sm font-medium mr-4 text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {data.application.proposedFee} TL
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedJobs;
