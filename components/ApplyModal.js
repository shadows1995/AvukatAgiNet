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
var Toast_1 = require("./Toast");
var AlertContext_1 = require("../contexts/AlertContext");
var ApplyModal = function (_a) {
    var job = _a.job, user = _a.user, onClose = _a.onClose, onSuccess = _a.onSuccess;
    var _b = (0, react_1.useState)('Görevle ilgileniyorum. Müsaitim.'), message = _b[0], setMessage = _b[1];
    var _c = (0, react_1.useState)(job.offeredFee.toString()), bid = _c[0], setBid = _c[1];
    var _d = (0, react_1.useState)(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var _e = (0, react_1.useState)(null), toast = _e[0], setToast = _e[1];
    var showAlert = (0, AlertContext_1.useAlert)().showAlert;
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var existingApp, appError, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    if (!job.jobId)
                        throw new Error("Job ID missing");
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('applications')
                            .select('*')
                            .eq('job_id', job.jobId)
                            .eq('applicant_id', user.uid)
                            .single()];
                case 2:
                    existingApp = (_a.sent()).data;
                    if (existingApp) {
                        setToast({ message: 'Bu göreve zaten başvurdunuz.', type: 'error' });
                        setTimeout(function () { return onClose(); }, 2000);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, supabaseClient_1.supabase.from('applications').insert({
                            job_id: job.jobId,
                            applicant_id: user.uid,
                            applicant_name: user.fullName,
                            applicant_phone: user.phone || "",
                            applicant_rating: user.rating || 0,
                            message: message,
                            proposed_fee: Number(bid),
                            status: 'pending'
                            // created_at defaults to now()
                        })];
                case 3:
                    appError = (_a.sent()).error;
                    if (appError)
                        throw appError;
                    // 3. Increment Job Application Count
                    // Handled by Database Trigger (fix_application_count.sql)
                    // 4. Notify Job Owner
                    return [4 /*yield*/, supabaseClient_1.supabase.from('notifications').insert({
                            user_id: job.createdBy,
                            title: "Yeni Başvuru Geldi 📢",
                            message: "".concat(user.fullName, ", \"").concat(job.title, "\" g\u00F6revi i\u00E7in ba\u015Fvuru yapt\u0131."),
                            type: "info",
                            read: false
                        })];
                case 4:
                    // 3. Increment Job Application Count
                    // Handled by Database Trigger (fix_application_count.sql)
                    // 4. Notify Job Owner
                    _a.sent();
                    if (onSuccess)
                        onSuccess();
                    showAlert({
                        title: "Başarılı",
                        message: "Başvurunuz başarıyla gönderildi.",
                        type: "success",
                        confirmText: "Tamam",
                        onConfirm: onClose
                    });
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error("Başvuru hatası:", error_1);
                    setToast({ message: 'Başvuru sırasında bir hata oluştu.', type: 'error' });
                    return [3 /*break*/, 7];
                case 6:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (<>
      {toast && (<Toast_1.default message={toast.message} type={toast.type} onClose={function () { return setToast(null); }}/>)}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Göreve Başvur</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><lucide_react_1.X className="w-5 h-5"/></button>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-slate-500">Başvurulan Görev:</p>
              <p className="font-semibold text-slate-800">{job.title}</p>
              <p className="text-xs text-primary-600 mt-1 font-medium">Teklif Edilen: {job.offeredFee} TL</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teklifiniz (TL)</label>
                <input type="number" required className="w-full rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500" value={bid} onChange={function (e) { return setBid(e.target.value); }}/>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kısa Mesajınız</label>
                <textarea required rows={3} className="w-full rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500" value={message} onChange={function (e) { return setMessage(e.target.value); }} placeholder="Örn: Dosya incelemesi için müsaitim, adliyeye yakınım."></textarea>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-bold shadow-md flex justify-center items-center">
                  {isSubmitting ? <lucide_react_1.Loader2 className="animate-spin w-5 h-5"/> : <><lucide_react_1.Send className="w-4 h-4 mr-2"/> Başvuruyu Gönder</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>);
};
exports.default = ApplyModal;
