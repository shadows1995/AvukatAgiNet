import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Phone, MessageCircle, User as UserIcon, Calendar, Clock, CheckCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import { Job, Application, User } from '../types';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';

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
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAcceptedJobs = async () => {
      if (!user) return;

      try {
        // 1. Get my accepted applications
        const appsQuery = query(
          collection(db, "applications"),
          where("applicantId", "==", user.uid),
          where("status", "==", "accepted")
        );
        const appsSnap = await getDocs(appsQuery);

        const jobsData: AcceptedJobData[] = [];

        // 2. For each application, get Job and Owner details
        await Promise.all(appsSnap.docs.map(async (appDoc) => {
          const appData = { applicationId: appDoc.id, ...appDoc.data() } as Application;

          // Get Job
          const jobRef = doc(db, "jobs", appData.jobId);
          const jobSnap = await getDoc(jobRef);

          if (jobSnap.exists()) {
            const jobData = { jobId: jobSnap.id, ...jobSnap.data() } as Job;

            // Only show if NOT completed (or if we want to show history, maybe filter differently)
            // For now, let's show all, but visually distinguish or filter out completed if desired.
            // User request implies "active" accepted jobs here, but let's keep all for now or filter?
            // "Tamamladığı görevler Anasayfada arşiv kısmında görünmeli" -> So maybe remove from here if completed?
            // Let's keep them here but marked as completed, or remove. 
            // Let's filter out 'completed' ones to keep this list for "Active" tasks.
            if (jobData.status !== 'completed') {
              // Get Owner
              const ownerRef = doc(db, "users", jobData.createdBy);
              const ownerSnap = await getDoc(ownerRef);

              if (ownerSnap.exists()) {
                const ownerData = { uid: ownerSnap.id, ...ownerSnap.data() } as User;
                jobsData.push({
                  job: jobData,
                  application: appData,
                  owner: ownerData
                });
              }
            }
          }
        }));

        // Sort by date (newest first)
        jobsData.sort((a, b) => {
          const dateA = a.job.createdAt?.seconds || 0;
          const dateB = b.job.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setAcceptedJobs(jobsData);

      } catch (error) {
        console.error("Error fetching accepted jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedJobs();
  }, [user]);

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let finalPhone = cleanPhone;
    if (finalPhone.startsWith('0')) finalPhone = finalPhone.substring(1);
    if (finalPhone.length === 10) finalPhone = '90' + finalPhone;
    window.open(`https://wa.me/${finalPhone}`, '_blank');
  };

  const handleCompleteTask = async () => {
    if (!selectedJob || !user) return;
    if (!confirm("Bu görevi tamamladığınızı onaylıyor musunuz?")) return;

    setCompleting(true);
    try {
      // 1. Update Job Status
      await updateDoc(doc(db, "jobs", selectedJob.job.jobId!), {
        status: 'completed',
        completedAt: serverTimestamp()
      });

      // 2. Notify Owner
      await addDoc(collection(db, "notifications"), {
        userId: selectedJob.owner.uid,
        title: "Görev Tamamlandı! 🎉",
        message: `"${selectedJob.job.title}" görevi Av. ${user.displayName || 'Meslektaşınız'} tarafından tamamlandı.`,
        type: "success",
        read: false,
        createdAt: serverTimestamp()
      });

      alert("Görev başarıyla tamamlandı olarak işaretlendi.");

      // Remove from list
      setAcceptedJobs(prev => prev.filter(j => j.job.jobId !== selectedJob.job.jobId));
      setSelectedJob(null);

    } catch (error) {
      console.error("Error completing task:", error);
      alert("Bir hata oluştu.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  // DETAIL VIEW
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
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">İlan Sahibi</h3>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="mt-8 pt-8 border-t border-slate-100">
              <button
                onClick={handleCompleteTask}
                disabled={completing}
                className="w-full flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {completing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                Görevi Tamamla
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                Görevi tamamladığınızda ilan sahibine bildirim gönderilecektir.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Aldığım İşler</h2>

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
            İlanlara Göz At
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {acceptedJobs.map((data) => (
            <div
              key={data.job.jobId}
              onClick={() => setSelectedJob(data)}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition cursor-pointer group flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition">{data.job.title}</h3>
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
