import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Users, CheckCircle, Phone } from 'lucide-react';
import { Job, User, UserRole, JobType } from '../types';
import ApplyModal from './ApplyModal';

const JobCard: React.FC<{ job: Job, user: User, hasApplied?: boolean }> = ({ job, user, hasApplied }) => {
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const isPremium = user.isPremium || user.role === UserRole.ADMIN;
  const isOwner = job.createdBy === user.uid;
  const isSelected = job.selectedApplicant === user.uid;

  const formattedFee = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(job.offeredFee);

  const handleApplyClick = () => {
    if (!user) {
      alert("Başvuru yapmak için giriş yapmalısınız.");
      return;
    }

    if (!user.isPremium) {
      const confirmUpgrade = window.confirm("Ücretsiz üyeler ilanlara başvuru yapamaz. Premium'a geçmek ister misiniz?");
      if (confirmUpgrade) {
        window.location.hash = "#/premium";
      }
      return;
    }

    setShowApplyModal(true);
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 border flex flex-col h-full group ${job.isUrgent ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'} ${isSelected ? 'ring-2 ring-green-500 border-green-500' : ''}`}>
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
              {job.date} | {job.time}
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <Users className="h-4 w-4 mr-2 text-slate-400" />
              {job.applicationsCount || 0} Başvuru
            </div>
          </div>

          <div className="flex items-center pt-4 border-t border-slate-50">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold ring-2 ring-white cursor-pointer" onClick={() => navigate(`/profile/${job.createdBy}`)}>
              {job.ownerName ? job.ownerName.charAt(0) : '?'}
            </div>
            <div className="ml-3">
              <p
                onClick={() => navigate(`/profile/${job.createdBy}`)}
                className="text-sm font-medium text-slate-900 cursor-pointer hover:text-primary-600 hover:underline"
              >
                {job.ownerName || 'Bilinmeyen Kullanıcı'}
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
            <Link to="/my-jobs" className="w-full flex justify-center items-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm font-semibold text-slate-600 hover:bg-white hover:text-primary-600 transition">
              Yönet
            </Link>
          ) : isSelected ? (
            <button
              onClick={() => navigate(`/profile/${job.createdBy}`)}
              className="w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition duration-200"
            >
              <Phone className="w-4 h-4 mr-2" />
              İletişim Bilgileri
            </button>
          ) : (
            <button
              onClick={handleApplyClick}
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