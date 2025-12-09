import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Users, CheckCircle, Phone } from 'lucide-react';
import { Job, User, UserRole, JobType } from '../types';
import ApplyModal from './ApplyModal';
import { useAlert } from '../contexts/AlertContext';

const JobCard: React.FC<{ job: Job, user: User, hasApplied?: boolean }> = ({ job, user, hasApplied }) => {
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const isPremium = user.isPremium || user.role === UserRole.ADMIN;
  const isOwner = job.createdBy === user.uid;
  const isSelected = job.selectedApplicant === user.uid;

  const formattedFee = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(job.offeredFee);

  const { showAlert } = useAlert();

  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calculate deadline
  const applicationWindowMinutes = job.isUrgent ? 5 : 15;
  const jobCreatedTime = new Date(job.createdAt).getTime();
  const applicationDeadline = jobCreatedTime + (applicationWindowMinutes * 60 * 1000);
  const isApplicationWindowClosed = Date.now() > applicationDeadline;

  React.useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = applicationDeadline - now;
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [applicationDeadline]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleApplyClick = () => {
    if (!user) {
      showAlert({
        title: "Giriş Yapın",
        message: "Başvuru yapmak için giriş yapmalısınız.",
        type: "warning",
        confirmText: "Giriş Yap",
        onConfirm: () => navigate('/login')
      });
      return;
    }

    if (!user.isPremium) {
      showAlert({
        title: "Premium Üyelik Gerekli",
        message: "Ücretsiz üyeler ilanlara başvuru yapamaz. Premium'a geçmek ister misiniz?",
        type: "confirm",
        confirmText: "Premium'a Geç",
        cancelText: "Vazgeç",
        onConfirm: () => window.location.hash = "#/premium"
      });
      return;
    }

    if (timeLeft <= 0) {
      showAlert({
        title: "Başvuru Süresi Doldu",
        message: `Bu göreve başvuru süresi (${applicationWindowMinutes} dakika) dolmuştur.`,
        type: "error"
      });
      return;
    }

    setShowApplyModal(true);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/job/${job.jobId}`)}
        className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 border flex flex-col h-full group cursor-pointer ${job.isUrgent ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'} ${isSelected ? 'ring-2 ring-green-500 border-green-500' : ''}`}
      >
        {job.isUrgent && (
          <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-1 border-b border-red-100 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1" /> ACİL GÖREV - 5 DK
          </div>
        )}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${job.jobType === JobType.DURUSMA ? 'bg-blue-50 text-blue-700' :
              job.jobType === JobType.ICRA ? 'bg-orange-50 text-orange-700' :
                'bg-slate-100 text-slate-700'
              }`}>
              {job.jobType}
            </span>
            <span className="text-lg font-bold text-primary-600">{formattedFee}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition">
            {job.title}
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-slate-500 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-slate-400" />
              <span className="truncate">{job.city} • {job.courthouse}</span>
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <Clock className="h-4 w-4 mr-2 text-slate-400" />
              {job.date ? job.date.split('-').reverse().join('-') : ''} | {job.time}
            </div>
            {/* Countdown Display */}
            <div className={`flex items-center text-sm font-medium ${timeLeft > 0 ? 'text-orange-600' : 'text-red-600'}`}>
              <div className="w-4 flex justify-center mr-2">
                <span className="relative flex h-2 w-2">
                  {timeLeft > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${timeLeft > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                </span>
              </div>
              {timeLeft > 0 ? (
                <span>Son Başvuru: {formatTime(timeLeft)}</span>
              ) : (
                <span>Başvuru Süresi Doldu</span>
              )}
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <Users className="h-4 w-4 mr-2 text-slate-400" />
              {job.applicationsCount || 0} Başvuru
            </div>
          </div>

          <div className="flex items-center pt-4 border-t border-slate-50">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white transition ${isOwner || isSelected
                ? 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 cursor-pointer hover:ring-primary-200'
                : 'bg-slate-100 text-slate-400 cursor-default'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isOwner || isSelected) navigate(`/profile/${job.createdBy}`);
              }}
            >
              {job.ownerName ? job.ownerName.charAt(0) : '?'}
            </div>
            <div className="ml-3">
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  if (isOwner || isSelected) navigate(`/profile/${job.createdBy}`);
                }}
                className={`text-sm font-medium transition ${isOwner || isSelected
                  ? 'text-slate-900 cursor-pointer hover:text-primary-600 hover:underline'
                  : 'text-slate-500 cursor-default'
                  }`}
              >
                {(isOwner || isSelected)
                  ? (job.ownerName || 'Bilinmeyen Kullanıcı')
                  : (job.ownerName ? (() => {
                    const parts = job.ownerName.trim().split(/\s+/);
                    if (parts.length === 1) return `${parts[0].charAt(0)}.`;
                    return `${parts[0].charAt(0)}. ${parts[parts.length - 1].charAt(0)}.`;
                  })() : 'Av. Kullanıcı')}
              </p>
              {isOwner && <span className="text-xs text-primary-600 font-semibold">(Sizin Göreviniz)</span>}
            </div>
          </div>

          {/* Selected Applicant Message Body */}
          {isSelected && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in zoom-in duration-300">
              <div className="flex items-center text-green-800 font-bold text-sm mb-1">
                <CheckCircle className="w-4 h-4 mr-1.5" /> TEBRİKLER! GÖREV SİZİN
              </div>
              <div className="text-xs text-green-700">Görev sahibi ile iletişime geçebilirsiniz.</div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
          {isOwner ? (
            <Link
              to="/my-jobs"
              onClick={(e) => e.stopPropagation()}
              className="w-full flex justify-center items-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm font-semibold text-slate-600 hover:bg-white hover:text-primary-600 transition"
            >
              Yönet
            </Link>
          ) : isSelected ? (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/profile/${job.createdBy}`); }}
              className="w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition duration-200"
            >
              <Phone className="w-4 h-4 mr-2" />
              İletişim Bilgileri
            </button>
          ) : timeLeft <= 0 ? (
            <button
              disabled
              className="w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-semibold text-white bg-slate-400 cursor-not-allowed"
            >
              Başvuru Süresi Doldu
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); handleApplyClick(); }}
              disabled={hasApplied}
              className={`w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-semibold text-white transition duration-200 ${hasApplied
                ? 'bg-slate-400 cursor-not-allowed'
                : isPremium
                  ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-200'
                  : 'bg-slate-800 hover:bg-slate-900'
                }`}
            >
              {hasApplied
                ? 'Başvuru Yapıldı'
                : isPremium
                  ? 'Hemen Başvur'
                  : 'Premium ile Başvur'}
            </button>
          )}
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal job={job} user={user} onClose={() => setShowApplyModal(false)} />
      )}
    </>
  );
};

export default JobCard;