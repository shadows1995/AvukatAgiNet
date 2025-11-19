import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Phone, MessageCircle, User as UserIcon, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Job, Application, User } from '../types';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface AcceptedJobData {
  job: Job;
  application: Application;
  owner: User;
}

const AcceptedJobs = () => {
  const [acceptedJobs, setAcceptedJobs] = useState<AcceptedJobData[]>([]);
  const [loading, setLoading] = useState(true);
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
    // Assuming TR numbers, if starts with 0, remove it. If no country code, add 90.
    let finalPhone = cleanPhone;
    if (finalPhone.startsWith('0')) finalPhone = finalPhone.substring(1);
    if (finalPhone.length === 10) finalPhone = '90' + finalPhone;
    
    window.open(`https://wa.me/${finalPhone}`, '_blank');
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Aldığım İşler</h2>
      
      {acceptedJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <UserIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Henüz kabul edilen bir başvurunuz yok.</h3>
          <p className="text-slate-500 mt-2">Başvurularınız kabul edildiğinde burada listelenecektir.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition"
          >
            İlanlara Göz At
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {acceptedJobs.map(({ job, application, owner }) => (
            <div key={job.jobId} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Job Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                    <div className="flex items-center text-slate-500 text-sm mt-2 space-x-4">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.city} / {job.courthouse}</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {job.date}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {job.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                      KABUL EDİLDİ
                    </span>
                    <p className="mt-2 text-lg font-bold text-primary-600">{application.proposedFee} TL</p>
                    <p className="text-xs text-slate-400">Anlaşılan Ücret</p>
                  </div>
                </div>
              </div>

              {/* Owner Contact Info */}
              <div className="p-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">İlan Sahibi İletişim Bilgileri</h4>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                      {owner.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{owner.title || 'Av.'} {owner.fullName}</h4>
                      <p className="text-slate-500 text-sm">{owner.baroCity} Barosu • Sicil: {owner.baroNumber}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {owner.phone && (
                      <>
                        <button 
                          onClick={() => handleWhatsApp(owner.phone!)}
                          className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg font-bold hover:bg-green-100 transition border border-green-200"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                        </button>
                        <a 
                          href={`tel:${owner.phone}`}
                          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition border border-blue-200"
                        >
                          <Phone className="w-5 h-5 mr-2" /> Ara
                        </a>
                      </>
                    )}
                    <button 
                      onClick={() => navigate(`/profile/${owner.uid}`)}
                      className="flex items-center px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-bold hover:bg-slate-100 transition border border-slate-200"
                    >
                      <UserIcon className="w-5 h-5 mr-2" /> Profil
                    </button>
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
