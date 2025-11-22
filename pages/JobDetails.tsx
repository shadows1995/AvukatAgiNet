import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Calendar, Clock, User as UserIcon, ArrowLeft, MessageCircle, Phone, CheckCircle, AlertTriangle } from 'lucide-react';
import { Job, User, Application } from '../types';
import { supabase } from '../supabaseClient';
import ApplyModal from '../components/ApplyModal';
import { useAlert } from '../contexts/AlertContext';

const JobDetails = ({ user }: { user: User }) => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [owner, setOwner] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [myApplication, setMyApplication] = useState<Application | null>(null);

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

                    // 2. Notify Owner
                    await supabase.from('notifications').insert({
                        user_id: owner.uid,
                        title: "Görev Tamamlandı! 🎉",
                        message: `"${job.title}" görevi Av. ${user.fullName} tarafından tamamlandı.`,
                        type: "success",
                        read: false
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

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Geri Dön
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-primary-600 p-8 text-white relative overflow-hidden">
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

                    {/* Owner Info */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Görev Sahibi</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary-600 font-bold text-lg shadow-sm">
                                    {owner.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">
                                        {canViewContact ? `${owner.title || 'Av.'} ${owner.fullName}` : `${owner.fullName.split(' ')[0]} ***`}
                                    </h4>
                                    <p className="text-sm text-slate-500">
                                        {owner.baroCity} Barosu {canViewContact && `• ${owner.phone}`}
                                    </p>
                                </div>
                            </div>
                            {canViewContact && (
                                <button
                                    onClick={() => navigate(`/profile/${owner.uid}`)}
                                    className="text-primary-600 font-medium hover:underline text-sm"
                                >
                                    Profili Gör
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {isAssignedToMe ? (
                        <div className="space-y-4">
                            {/* Contact Buttons for Assignee */}
                            {owner.phone && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 text-center font-medium">
                            Bu görevi siz oluşturdunuz.
                        </div>
                    ) : (
                        // Apply Button for Others
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            {myApplication ? (
                                <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 flex items-center justify-center font-bold">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Bu göreve başvurdunuz ({myApplication.status === 'pending' ? 'Beklemede' : myApplication.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'})
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsApplyModalOpen(true)}
                                    className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Göreve Başvur
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isApplyModalOpen && (
                <ApplyModal
                    onClose={() => setIsApplyModalOpen(false)}
                    job={job}
                    user={user}
                />
            )}
        </div>
    );
};

export default JobDetails;
