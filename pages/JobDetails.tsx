import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Calendar, Clock, User as UserIcon, ArrowLeft, MessageCircle, Phone, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { Job, User, Application } from '../types';
import { supabase } from '../supabaseClient';
import ApplyModal from '../components/ApplyModal';
import { useAlert } from '../contexts/AlertContext';
import SEO from '../components/SEO';
import { useMobileApp } from '../hooks/useMobileApp';


const JobDetails = ({ user }: { user: User }) => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [myApplication, setMyApplication] = useState<Application | null>(null);
    const isMobileApp = useMobileApp();

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!jobId) return;
            setLoading(true);
            try {
                // 1. Fetch Job
                const { data: jobData, error: jobError } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('job_id', jobId)
                    .single();

                if (jobError) throw jobError;

                if (jobData) {
                    const mappedJob: Job = {
                        jobId: jobData.job_id,
                        title: jobData.title,
                        createdBy: jobData.created_by,
                        ownerName: jobData.owner_name,
                        ownerPhone: jobData.owner_phone,
                        city: jobData.city,
                        courthouse: jobData.courthouse,
                        date: jobData.date,
                        time: jobData.time,
                        jobType: jobData.job_type,
                        description: jobData.description,
                        offeredFee: jobData.offered_fee,
                        status: jobData.status,
                        applicationsCount: jobData.applications_count,
                        selectedApplicant: jobData.selected_applicant,
                        createdAt: jobData.created_at,
                        updatedAt: jobData.updated_at,
                        isUrgent: jobData.is_urgent,
                        applicationDeadline: jobData.application_deadline
                    };
                    setJob(mappedJob);

                    // 2. Fetch Owner
                    const { data: ownerData, error: ownerError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('uid', mappedJob.createdBy)
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
                            title: ownerData.title
                        };
                        setOwner(mappedOwner);
                    }

                    // 3. Check if I have an application
                    if (user) {
                        const { data: appData } = await supabase
                            .from('applications')
                            .select('*')
                            .eq('job_id', jobId)
                            .eq('applicant_id', user.uid)
                            .single();

                        if (appData) {
                            setMyApplication({
                                applicationId: appData.application_id,
                                jobId: appData.job_id,
                                applicantId: appData.applicant_id,
                                applicantName: appData.applicant_name,
                                message: appData.message,
                                proposedFee: appData.proposed_fee,
                                status: appData.status,
                                createdAt: appData.created_at,
                                applicantPhone: appData.applicant_phone,
                                applicantRating: appData.applicant_rating
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId, user]);

    const { showAlert } = useAlert();

    const handleCompleteTask = async () => {
        if (!job || !user || !owner) return;

        showAlert({
            title: "Görevi Tamamla",
            message: "Bu görevi tamamladığınızı onaylıyor musunuz?",
            type: "confirm",
            confirmText: "Evet, Tamamla",
            cancelText: "Vazgeç",
            onConfirm: async () => {
                setCompleting(true);
                try {
                    // 1. Update Job Status
                    const { error: updateError } = await supabase
                        .from('jobs')
                        .update({
                            status: 'completed',
                            completed_at: new Date().toISOString()
                        })
                        .eq('job_id', job.jobId);

                    if (updateError) throw updateError;

                    // 1.5. Increment Applicant's Completed Jobs Count
                    if (job.selectedApplicant) {
                        // Fetch current count first to be safe (or use RPC if available, but read-write is okay here)
                        const { data: applicantData } = await supabase
                            .from('users')
                            .select('completed_jobs')
                            .eq('uid', job.selectedApplicant)
                            .single();

                        const currentCount = applicantData?.completed_jobs || 0;

                        await supabase
                            .from('users')
                            .update({ completed_jobs: currentCount + 1 })
                            .eq('uid', job.selectedApplicant);
                    }

                    // 2. Notify Applicant (Fix: Notify the person who did the job, not the owner)
                    // The original code was notifying the owner? 
                    // "Metadata: ... görevi Av. User tarafından tamamlandı" -> This looks like self-completion logic?
                    // Wait, handleCompleteTask in JobDetails can be called by Owner OR Assignee depending on view?
                    // Line 204: isOwner = user.uid === job.createdBy.
                    // Line 346: Button is shown if isAssignedToMe.
                    // If isAssignedToMe, then USER is the APPLICANT.
                    // So we are updating OUR OWN count.
                    // Let's check logic again.

                    // Logic check:
                    // If IS_ASSIGNED_TO_ME (User is Applicant):
                    //   We update 'jobs'.
                    //   We notify OWNER (line 160: user_id: owner.uid).
                    //   We increment OUR (user.uid) completed_jobs.

                    // 2. Notify Owner
                    await supabase.from('notifications').insert({
                        user_id: owner.uid,
                        title: "Görev Tamamlandı! 🎉",
                        message: `"${job.title}" görevi Av. ${user.fullName} tarafından tamamlandı.`,
                        type: "success",
                        read: false,
                        metadata: { jobId: job.jobId, type: 'job_completed' }
                    });

                    showAlert({
                        title: "Başarılı",
                        message: "Görev başarıyla tamamlandı olarak işaretlendi.",
                        type: "success",
                        confirmText: "Tamam"
                    });

                    // Refresh job data
                    setJob(prev => prev ? { ...prev, status: 'completed' } : null);

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

    const handleWhatsApp = (phone: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        let finalPhone = cleanPhone;
        if (finalPhone.startsWith('0')) finalPhone = finalPhone.substring(1);
        if (finalPhone.length === 10) finalPhone = '90' + finalPhone;
        window.open(`https://wa.me/${finalPhone}`, '_blank');
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary-600" /></div>;
    if (!job || !owner) return <div className="text-center p-20 text-slate-500">Görev bulunamadı.</div>;

    const isOwner = user.uid === job.createdBy;
    const isAssignedToMe = job.selectedApplicant === user.uid;
    const isCompleted = job.status === 'completed';
    const canViewContact = isOwner || isAssignedToMe;

    const handleCancelJob = async () => {
        showAlert({
            title: "Görevi İptal Etmek İstediğinize Emin misiniz?",
            message: "Görev iptal edilecek ve listelerden kaldırılacaktır. Bu işlem geri alınamaz.",
            type: "confirm",
            confirmText: "Evet, İptal Et",
            cancelText: "Vazgeç",
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('jobs')
                        .update({ status: 'cancelled' })
                        .eq('job_id', job.jobId);

                    if (error) throw error;

                    // Notify Applicant if assigned
                    if (job.selectedApplicant) {
                        await supabase.from('notifications').insert({
                            user_id: job.selectedApplicant,
                            title: "Görev İptal Edildi ⚠️",
                            message: `"${job.title}" görevi, görev sahibi tarafından iptal edildi.`,
                            type: "error",
                            read: false,
                            metadata: { jobId: job.jobId, type: 'job_cancelled' }
                        });
                    }

                    navigate('/dashboard');
                } catch (error) {
                    console.error("Error cancelling job:", error);
                    showAlert({ title: "Hata", message: "Görev iptal edilirken bir hata oluştu.", type: "error" });
                }
            }
        });
    };

    if (job?.status === 'cancelled') {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Geri Dön
                </button>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm">
                    <div className="flex items-center">
                        <AlertTriangle className="h-8 w-8 text-red-500 mr-4" />
                        <div>
                            <h3 className="text-lg font-bold text-red-700">BU GÖREV İPTAL EDİLMİŞTİR</h3>
                            <p className="text-red-600 mt-1">Bu görev, görev sahibi tarafından iptal edilmiştir ve artık işleme kapalıdır.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <SEO
                title={`${job.title} - ${job.city} / ${job.courthouse}`}
                description={`${job.city} ${job.courthouse} adliyesinde ${job.jobType} işi. Ücret: ${job.offeredFee} TL. Hemen başvurun.`}
            />
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Geri Dön
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-primary-600 p-8 text-white relative overflow-hidden">
                    {/* ... existing header content ... */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold">{job.title}</h1>
                            {isCompleted && (
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-green-400">
                                    TAMAMLANDI
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-primary-100 text-sm">
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.city} / {job.courthouse}</span>
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {job.date}</span>
                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {job.time}</span>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">
                                {job.offeredFee} TL
                            </div>
                            {job.isUrgent && (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                    ACİL
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Görev Detayları</h3>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                    </div>
                </div>

                {/* Actions */}
                {isAssignedToMe ? (
                    <div className="space-y-4 px-8 pb-8">
                        {/* Contact Buttons for Assignee */}
                        {owner.phone && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleWhatsApp(owner.phone!)}
                                    className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition shadow-md hover:shadow-lg"
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp ({owner.phone})
                                </button>
                                <a
                                    href={`tel:${owner.phone}`}
                                    className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md hover:shadow-lg"
                                >
                                    <Phone className="w-5 h-5 mr-2" /> Ara ({owner.phone})
                                </a>
                            </div>
                        )}

                        {/* Complete Task Button */}
                        {!isCompleted && (
                            <div className="pt-4 border-t border-slate-100">
                                <button
                                    onClick={handleCompleteTask}
                                    disabled={completing}
                                    className="w-full flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {completing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                                    Görevi Tamamla
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-3">
                                    Görevi tamamladığınızda görev sahibine bildirim gönderilecektir.
                                </p>
                            </div>
                        )}
                    </div>
                ) : isOwner ? (
                    <div className="px-8 pb-8">
                        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 text-center font-medium mb-4">
                            Bu görevi siz oluşturdunuz.
                        </div>
                        <button
                            onClick={handleCancelJob}
                            className="w-full flex items-center justify-center px-6 py-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 transition"
                        >
                            <Trash2 className="w-5 h-5 mr-2" />
                            Görevi İptal Et
                        </button>
                    </div>
                ) : (
                    // Apply Button for Others
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        {myApplication ? (
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex items-center justify-center font-bold">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Bu göreve başvurdunuz ({myApplication.status === 'pending' ? 'Beklemede' : myApplication.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'})
                            </div>
                        ) : (() => {
                            // Calculate application deadline
                            const lockDuration = job.isUrgent ? 5 : 15;
                            const applicationDeadline = new Date(job.createdAt).getTime() + lockDuration * 60000;
                            const isApplicationClosed = Date.now() > applicationDeadline;

                            if (isApplicationClosed) {
                                return (
                                    <div className="bg-slate-100 text-slate-500 p-4 rounded-xl border border-slate-200 flex items-center justify-center font-bold">
                                        <Clock className="w-5 h-5 mr-2" />
                                        Başvuru süresi doldu
                                    </div>
                                );
                            }

                            if (!user.isPremium) {
                                if (isMobileApp) {
                                    return (
                                        <div className="text-center">
                                            <div className="bg-slate-100 text-slate-500 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center font-bold mb-3">
                                                <p>Bu göreve başvurmaya uygun değilsiniz.</p>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="text-center">
                                        <div className="bg-slate-100 text-slate-500 p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center font-bold mb-3">
                                            <p>Bu göreve başvurmak için Premium üye olmalısınız.</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/premium')}
                                            className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            Premium'a Geç
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <button
                                    onClick={() => setIsApplyModalOpen(true)}
                                    className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Göreve Başvur
                                </button>
                            );
                        })()}
                    </div>
                )}
            </div>

            {/* Apply Modal */}
            {isApplyModalOpen && (
                <ApplyModal
                    onClose={() => setIsApplyModalOpen(false)}
                    job={job}
                    user={user}
                    onSuccess={() => {
                        setMyApplication({
                            applicationId: 'temp-id',
                            jobId: job.jobId!,
                            applicantId: user.uid,
                            applicantName: user.fullName,
                            message: '',
                            proposedFee: job.offeredFee,
                            status: 'pending',
                            createdAt: new Date().toISOString(),
                            applicantPhone: user.phone || '',
                            applicantRating: user.rating || 0
                        });
                    }}
                />
            )}
        </div>
    );
};

export default JobDetails;
