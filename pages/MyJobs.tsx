
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Timer, Users, ChevronDown, Star, DollarSign, CheckCircle, User as UserIcon, AlertTriangle, X } from 'lucide-react';
import { Job, Application, User } from '../types';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApplicantData, setSelectedApplicantData] = useState<{ [jobId: string]: User | null }>({});

  // Modal States
  const [confirmData, setConfirmData] = useState<{ isOpen: boolean, job: Job | null, app: Application | null }>({
    isOpen: false, job: null, app: null
  });
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean, type: 'success' | 'error', message: string }>({
    isOpen: false, type: 'success', message: ''
  });

  const user = auth.currentUser;
  const navigate = useNavigate();

  const [_, setTicker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "jobs"), where("createdBy", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((doc) => {
        jobsData.push({ jobId: doc.id, ...doc.data() } as Job);
      });

      // Client-side sorting
      jobsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setMyJobs(jobsData);
      setLoading(false);

      // Fetch selected applicants data for "In Progress" jobs
      jobsData.forEach(async (job) => {
        if (job.selectedApplicant && job.status === 'in_progress' && job.jobId) {
          try {
            const userDoc = await getDoc(doc(db, "users", job.selectedApplicant));
            if (userDoc.exists()) {
              setSelectedApplicantData(prev => ({
                ...prev,
                [job.jobId!]: { uid: userDoc.id, ...userDoc.data() } as User
              }));
            }
          } catch (error) {
            console.error("Error fetching applicant data:", error);
          }
        }
      });

    }, (error) => {
      console.error("MyJobs listener error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const fetchApplications = async (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
    if (expandedJobId === jobId) return;

    setLoadingApps(true);
    try {
      const q = query(collection(db, "applications"), where("jobId", "==", jobId));
      const snapshot = await getDocs(q);
      const apps: Application[] = [];
      snapshot.forEach(doc => apps.push({ applicationId: doc.id, ...doc.data() } as Application));
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  const isJobExpired = (job: Job) => {
    if (!job.date || !job.time) return false;
    try {
      const [day, month, year] = job.date.split('.').map(Number);
      const [hour, minute] = job.time.split(':').map(Number);
      const jobDate = new Date(year, month - 1, day, hour, minute);
      return new Date() > jobDate;
    } catch (e) {
      return false;
    }
  };

  // 1. Step: Open Confirm Modal
  const handleSelectClick = (job: Job, app: Application) => {
    if (isJobExpired(job)) {
      alert("Görevin süresi geçti! Artık bu göreve atama yapamazsınız.");
      return;
    }
    setConfirmData({ isOpen: true, job, app });
  };

  // 2. Step: Execute Logic
  const executeAssignment = async () => {
    const { job, app } = confirmData;
    if (!job || !app || !job.jobId || !app.applicationId) {
      setStatusModal({ isOpen: true, type: 'error', message: 'İşlem sırasında veri kaybı oluştu.' });
      return;
    }

    // Close confirm modal immediately to show loading or just result
    setConfirmData({ ...confirmData, isOpen: false });

    try {
      // 1. Update Job
      await updateDoc(doc(db, "jobs", job.jobId), {
        selectedApplicant: app.applicantId,
        status: 'in_progress'
      });

      // 2. Update Application
      await updateDoc(doc(db, "applications", app.applicationId), {
        status: 'accepted'
      });

      // 3. Notify Applicant
      await addDoc(collection(db, "notifications"), {
        userId: app.applicantId,
        title: "Başvurunuz Kabul Edildi! 🎉",
        message: `Tebrikler! "${job.title}" görevi için seçildiniz. Görev sahibiyle iletişime geçebilirsiniz.`,
        type: "success",
        read: false,
        createdAt: serverTimestamp()
      });

      // 4. Notify Owner (Self)
      if (user) {
        await addDoc(collection(db, "notifications"), {
          userId: user.uid,
          title: "Görev Atandı ✅",
          message: `"${job.title}" görevi Av. ${app.applicantName}'e atandı.`,
          type: "success",
          read: false,
          createdAt: serverTimestamp()
        });
      }

      // Show Success Modal
      setStatusModal({ isOpen: true, type: 'success', message: 'Görev ataması başarıyla yapıldı! İletişim bilgileri açılıyor...' });

      // Redirect logic is handled in the Success Modal "Tamam" button or useEffect

    } catch (error: any) {
      console.error("Error selecting applicant:", error);
      setStatusModal({ isOpen: true, type: 'error', message: `Hata: ${error.message || 'Bilinmeyen hata'}` });
    }
  };

  const handleStatusClose = () => {
    const redirectId = confirmData.app?.applicantId;
    setStatusModal({ ...statusModal, isOpen: false });
    setConfirmData({ isOpen: false, job: null, app: null });

    if (statusModal.type === 'success' && redirectId) {
      navigate(`/profile/${redirectId}`);
    }
  };

  const getTimeLeft = (deadline: any) => {
    if (!deadline) return 0;
    const deadlineDate = deadline.toDate ? deadline.toDate() : new Date(deadline);
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

      {/* CONFIRMATION MODAL */}
      {confirmData.isOpen && confirmData.app && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmData({ ...confirmData, isOpen: false })}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 transform transition-all scale-100">
            <button
              onClick={() => setConfirmData({ ...confirmData, isOpen: false })}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Emin misiniz?</h3>
              <p className="text-slate-600 mb-6">
                <span className="font-semibold text-slate-900">{confirmData.app.applicantName}</span> isimli avukata bu görevi vermek üzeresiniz. İletişim bilgileriniz karşılıklı olarak paylaşılacaktır.
              </p>

              <div className="flex w-full space-x-3">
                <button
                  onClick={() => setConfirmData({ ...confirmData, isOpen: false })}
                  className="flex-1 py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Vazgeç
                </button>
                <button
                  onClick={executeAssignment}
                  className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-md hover:shadow-lg transition"
                >
                  Görevi Ver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUS MODAL (Success / Error) */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative z-10 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${statusModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {statusModal.type === 'success' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {statusModal.type === 'success' ? 'İşlem Başarılı!' : 'Hata Oluştu'}
            </h3>
            <p className="text-slate-600 mb-6">{statusModal.message}</p>
            <button
              onClick={handleStatusClose}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-1 ${statusModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {statusModal.type === 'success' ? 'Profiline Git' : 'Tamam'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {myJobs.length === 0 && <p className="text-slate-500">Henüz görev yayınlamadınız.</p>}
        {myJobs.map(job => {
          const isSelectionLocked = false; // Force unlocked for testing
          const selectedUser = job.jobId ? selectedApplicantData[job.jobId] : null;

          return (
            <div key={job.jobId} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${job.status === 'open' ? 'bg-green-100 text-green-700' :
                      job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {job.status === 'open' ? 'Başvuruya Açık' : job.status === 'in_progress' ? 'Atandı' : job.status}
                    </span>
                    {job.isUrgent && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">ACİL</span>}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.city} • {job.courthouse} • {job.date}</p>

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
                          <p className="text-sm text-slate-600">{selectedUser.baroCity} Barosu • {selectedUser.phone}</p>
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
                  {job.status === 'open' && (
                    <div className={`flex items-center font-mono text-sm px-3 py-1 rounded-md ${isSelectionLocked ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                      <Timer className="w-4 h-4 mr-2" />
                      {isSelectionLocked ? (
                        <span>Süre Bekleniyor...</span>
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
                    className="flex items-center text-primary-600 font-medium hover:bg-primary-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-primary-100"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Başvuruları Yönet {expandedJobId === job.jobId ? <ChevronDown className="ml-1 w-4 h-4 rotate-180" /> : <ChevronDown className="ml-1 w-4 h-4" />}
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
                      {applications.map(app => {
                        const isSelected = job.selectedApplicant === app.applicantId;

                        return (
                          <div key={app.applicationId} className={`bg-white p-4 rounded-lg border ${isSelected ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-200'} flex justify-between items-center shadow-sm`}>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span
                                  onClick={() => navigate(`/profile/${app.applicantId}`)}
                                  className="font-bold text-slate-800 cursor-pointer hover:text-primary-600 hover:underline"
                                >
                                  {app.applicantName}
                                </span>
                                <span className="flex items-center text-amber-500 text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                  <Star className="w-3 h-3 fill-current mr-1" />
                                  {app.applicantRating ? app.applicantRating.toFixed(1) : '0.0'}
                                </span>
                                {isSelected && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold border border-green-200">SEÇİLDİ</span>}
                              </div>
                              <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100 italic">"{app.message}"</p>
                              <div className="flex items-center mt-2 text-xs text-slate-500 space-x-4">
                                <span className="flex items-center text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded"><DollarSign className="w-3 h-3 mr-1" /> Teklif: {app.proposedFee} TL</span>
                              </div>
                            </div>

                            {!isSelected && (
                              <button
                                onClick={() => handleSelectClick(job, app)}
                                disabled={isSelectionLocked}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm ${isSelectionLocked
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md'
                                  }`}
                              >
                                {isSelectionLocked ? 'Süre' : 'Görevi Ver'}
                              </button>
                            )}
                            {isSelected && (
                              <button
                                onClick={() => navigate(`/profile/${app.applicantId}`)}
                                className="text-green-600 font-bold text-sm flex items-center hover:underline bg-green-50 px-3 py-2 rounded-lg"
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
