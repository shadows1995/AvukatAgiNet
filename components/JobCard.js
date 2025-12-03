"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var types_1 = require("../types");
var ApplyModal_1 = require("./ApplyModal");
var AlertContext_1 = require("../contexts/AlertContext");
var JobCard = function (_a) {
    var job = _a.job, user = _a.user, hasApplied = _a.hasApplied;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(false), showApplyModal = _b[0], setShowApplyModal = _b[1];
    var isPremium = user.isPremium || user.role === types_1.UserRole.ADMIN;
    var isOwner = job.createdBy === user.uid;
    var isSelected = job.selectedApplicant === user.uid;
    var formattedFee = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(job.offeredFee);
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    // Check if application window is still open
    // Urgent jobs: 5 minutes, Regular jobs: 15 minutes from job creation
    var applicationWindowMinutes = job.isUrgent ? 5 : 15;
    var jobCreatedTime = new Date(job.createdAt).getTime();
    var applicationDeadline = jobCreatedTime + (applicationWindowMinutes * 60 * 1000);
    var isApplicationWindowClosed = Date.now() > applicationDeadline;
    var handleApplyClick = function () {
        if (!user) {
            showAlert({
                title: "Giriş Yapın",
                message: "Başvuru yapmak için giriş yapmalısınız.",
                type: "warning",
                confirmText: "Giriş Yap",
                onConfirm: function () { return navigate('/login'); }
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
                onConfirm: function () { return window.location.hash = "#/premium"; }
            });
            return;
        }
        if (isApplicationWindowClosed) {
            showAlert({
                title: "Başvuru Süresi Doldu",
                message: "Bu g\u00F6reve ba\u015Fvuru s\u00FCresi (".concat(applicationWindowMinutes, " dakika) dolmu\u015Ftur."),
                type: "error"
            });
            return;
        }
        setShowApplyModal(true);
    };
    return (<>
      <div onClick={function () { return navigate("/job/".concat(job.jobId)); }} className={"bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 border flex flex-col h-full group cursor-pointer ".concat(job.isUrgent ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200', " ").concat(isSelected ? 'ring-2 ring-green-500 border-green-500' : '')}>
        {job.isUrgent && (<div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-1 border-b border-red-100 flex items-center justify-center">
            <lucide_react_1.Clock className="w-3 h-3 mr-1"/> ACİL GÖREV - 5 DK
          </div>)}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <span className={"inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ".concat(job.jobType === types_1.JobType.DURUSMA ? 'bg-blue-50 text-blue-700' :
            job.jobType === types_1.JobType.ICRA ? 'bg-orange-50 text-orange-700' :
                'bg-slate-100 text-slate-700')}>
              {job.jobType}
            </span>
            <span className="text-lg font-bold text-primary-600">{formattedFee}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition">
            {job.title}
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-slate-500 text-sm">
              <lucide_react_1.MapPin className="h-4 w-4 mr-2 text-slate-400"/>
              <span className="truncate">{job.city} • {job.courthouse}</span>
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <lucide_react_1.Clock className="h-4 w-4 mr-2 text-slate-400"/>
              {job.date} | {job.time}
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <lucide_react_1.Users className="h-4 w-4 mr-2 text-slate-400"/>
              {job.applicationsCount || 0} Başvuru
            </div>
          </div>

          <div className="flex items-center pt-4 border-t border-slate-50">
            <div className={"h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white transition ".concat(isOwner || isSelected
            ? 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 cursor-pointer hover:ring-primary-200'
            : 'bg-slate-100 text-slate-400 cursor-default')} onClick={function (e) {
            e.stopPropagation();
            if (isOwner || isSelected)
                navigate("/profile/".concat(job.createdBy));
        }}>
              {job.ownerName ? job.ownerName.charAt(0) : '?'}
            </div>
            <div className="ml-3">
              <p onClick={function (e) {
            e.stopPropagation();
            if (isOwner || isSelected)
                navigate("/profile/".concat(job.createdBy));
        }} className={"text-sm font-medium transition ".concat(isOwner || isSelected
            ? 'text-slate-900 cursor-pointer hover:text-primary-600 hover:underline'
            : 'text-slate-500 cursor-default')}>
                {(isOwner || isSelected)
            ? (job.ownerName || 'Bilinmeyen Kullanıcı')
            : (job.ownerName ? (function () {
                var parts = job.ownerName.trim().split(/\s+/);
                if (parts.length === 1)
                    return "".concat(parts[0].charAt(0), ".");
                return "".concat(parts[0].charAt(0), ". ").concat(parts[parts.length - 1].charAt(0), ".");
            })() : 'Av. Kullanıcı')}
              </p>
              {isOwner && <span className="text-xs text-primary-600 font-semibold">(Sizin Göreviniz)</span>}
            </div>
          </div>

          {/* Selected Applicant Message Body */}
          {isSelected && (<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in zoom-in duration-300">
              <div className="flex items-center text-green-800 font-bold text-sm mb-1">
                <lucide_react_1.CheckCircle className="w-4 h-4 mr-1.5"/> TEBRİKLER! GÖREV SİZİN
              </div>
              <div className="text-xs text-green-700">Görev sahibi ile iletişime geçebilirsiniz.</div>
            </div>)}
        </div>

        <div className="px-6 py-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
          {isOwner ? (<react_router_dom_1.Link to="/my-jobs" onClick={function (e) { return e.stopPropagation(); }} className="w-full flex justify-center items-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm font-semibold text-slate-600 hover:bg-white hover:text-primary-600 transition">
              Yönet
            </react_router_dom_1.Link>) : isSelected ? (<button onClick={function (e) { e.stopPropagation(); navigate("/profile/".concat(job.createdBy)); }} className="w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition duration-200">
              <lucide_react_1.Phone className="w-4 h-4 mr-2"/>
              İletişim Bilgileri
            </button>) : isApplicationWindowClosed ? (<button disabled className="w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-semibold text-white bg-slate-400 cursor-not-allowed">
              Başvuru Süresi Doldu
            </button>) : (<button onClick={function (e) { e.stopPropagation(); handleApplyClick(); }} disabled={hasApplied} className={"w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-semibold text-white transition duration-200 ".concat(hasApplied
                ? 'bg-slate-400 cursor-not-allowed'
                : isPremium
                    ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-200'
                    : 'bg-slate-800 hover:bg-slate-900')}>
              {hasApplied
                ? 'Başvuru Yapıldı'
                : isPremium
                    ? 'Hemen Başvur'
                    : 'Premium ile Başvur'}
            </button>)}
        </div>
      </div>

      {showApplyModal && (<ApplyModal_1.default job={job} user={user} onClose={function () { return setShowApplyModal(false); }}/>)}
    </>);
};
exports.default = JobCard;
