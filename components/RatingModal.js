"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var supabaseClient_1 = require("../supabaseClient");
var AlertContext_1 = require("../contexts/AlertContext");
var RatingModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, jobId = _a.jobId, revieweeId = _a.revieweeId, revieweeName = _a.revieweeName, onSuccess = _a.onSuccess;
    var _b = (0, react_1.useState)(0), rating = _b[0], setRating = _b[1];
    var _c = (0, react_1.useState)(0), hoveredRating = _c[0], setHoveredRating = _c[1];
    var _d = (0, react_1.useState)(''), reviewText = _d[0], setReviewText = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, ratingError, job, isOwner, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (rating === 0) {
                        showAlert({
                            title: "Hata",
                            message: "Lütfen bir puan seçin.",
                            type: "error",
                            confirmText: "Tamam"
                        });
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, supabaseClient_1.supabase.auth.getUser()];
                case 2:
                    user = (_b.sent()).data.user;
                    if (!user)
                        throw new Error('Kullanıcı bulunamadı');
                    return [4 /*yield*/, supabaseClient_1.supabase.from('ratings').insert({
                            job_id: jobId,
                            reviewer_id: user.id,
                            reviewee_id: revieweeId,
                            rating: rating,
                            review_text: reviewText || null
                        })];
                case 3:
                    ratingError = (_b.sent()).error;
                    if (ratingError)
                        throw ratingError;
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('jobs')
                            .select('created_by, selected_applicant')
                            .eq('job_id', jobId)
                            .single()];
                case 4:
                    job = (_b.sent()).data;
                    if (!job) return [3 /*break*/, 6];
                    isOwner = job.created_by === user.id;
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('jobs')
                            .update((_a = {},
                            _a[isOwner ? 'owner_rated' : 'lawyer_rated'] = true,
                            _a))
                            .eq('job_id', jobId)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    showAlert({
                        title: "Başarılı",
                        message: "Değerlendirmeniz kaydedildi. Teşekkürler!",
                        type: "success",
                        confirmText: "Tamam",
                        onConfirm: function () {
                            onSuccess();
                            onClose();
                        }
                    });
                    return [3 /*break*/, 9];
                case 7:
                    error_1 = _b.sent();
                    console.error('Rating error:', error_1);
                    showAlert({
                        title: "Hata",
                        message: error_1.message || "Değerlendirme kaydedilemedi.",
                        type: "error",
                        confirmText: "Tamam"
                    });
                    return [3 /*break*/, 9];
                case 8:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Değerlendirme</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <lucide_react_1.X className="w-6 h-6"/>
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <p className="text-slate-600 text-center">
                        <span className="font-semibold text-slate-900">{revieweeName}</span> ile yaptığınız işbirliğini değerlendirin
                    </p>

                    {/* Star Rating */}
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map(function (star) { return (<button key={star} type="button" onClick={function () { return setRating(star); }} onMouseEnter={function () { return setHoveredRating(star); }} onMouseLeave={function () { return setHoveredRating(0); }} className="transition-transform hover:scale-110">
                                <lucide_react_1.Star className={"w-10 h-10 ".concat(star <= (hoveredRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300')}/>
                            </button>); })}
                    </div>

                    {rating > 0 && (<p className="text-center text-slate-600 font-medium">
                            {rating === 1 && "Çok Kötü"}
                            {rating === 2 && "Kötü"}
                            {rating === 3 && "Orta"}
                            {rating === 4 && "İyi"}
                            {rating === 5 && "Mükemmel"}
                        </p>)}

                    {/* Review Text */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Yorumunuz (Opsiyonel)
                        </label>
                        <textarea value={reviewText} onChange={function (e) { return setReviewText(e.target.value); }} placeholder="İşbirliği deneyiminizi paylaşın..." rows={4} className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"/>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition disabled:opacity-50">
                            İptal
                        </button>
                        <button onClick={handleSubmit} disabled={loading || rating === 0} className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center">
                            {loading ? (<lucide_react_1.Loader2 className="w-5 h-5 animate-spin"/>) : ('Gönder')}
                        </button>
                    </div>
                </div>
            </div>
        </div>);
};
exports.default = RatingModal;
