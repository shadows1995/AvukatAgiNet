import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Loader2, Send } from 'lucide-react';
import { Job, User } from '../types';
import { supabase } from '../supabaseClient';
import Toast from './Toast';

import { useAlert } from '../contexts/AlertContext';


const ApplyModal = ({ job, user, onClose, onSuccess }: { job: Job, user: User, onClose: () => void, onSuccess?: () => void }) => {
  const [message, setMessage] = useState('Görevle ilgileniyorum. Müsaitim.');
  const [bid, setBid] = useState(job.offeredFee.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!job.jobId) throw new Error("Job ID missing");

      // 1. Check if already applied
      const { data: existingApp } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', job.jobId)
        .eq('applicant_id', user.uid)
        .single();

      if (existingApp) {
        setToast({ message: 'Bu göreve zaten başvurdunuz.', type: 'error' });
        setTimeout(() => onClose(), 2000);
        return;
      }

      // 2. Create Application
      const { error: appError } = await supabase.from('applications').insert({
        job_id: job.jobId,
        applicant_id: user.uid,
        applicant_name: user.fullName,
        applicant_phone: user.phone || "",
        applicant_rating: user.rating || 0,
        message: message,
        proposed_fee: Number(bid),
        status: 'pending'
        // created_at defaults to now()
      });

      if (appError) throw appError;

      // 3. Increment Job Application Count
      // Handled by Database Trigger (fix_application_count.sql)

      // 4. Notify Job Owner
      await supabase.from('notifications').insert({
        user_id: job.createdBy,
        title: "Yeni Başvuru Geldi 📢",
        message: "1 Kullanıcı oluşturduğunuz göreve başvuru yaptı.",
        type: "info",
        read: false,
        metadata: { jobId: job.jobId, type: 'job_application' }
      });

      if (onSuccess) onSuccess();

      setToast({ message: 'Başvurunuz başarıyla gönderildi.', type: 'success' });

      // Auto close after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Başvuru hatası:", error);
      setToast({ message: 'Başvuru sırasında bir hata oluştu.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use React Portal to render the modal at the document body level
  // This prevents issues with z-index and fixed positioning when parents have transforms
  if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Göreve Başvur</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Başvurulan Görev</p>
              <p className="font-bold text-slate-900 text-lg mb-1">{job.title}</p>
              <p className="text-sm text-blue-700 font-medium bg-white px-2 py-1 rounded inline-block shadow-sm">Teklif Edilen: {job.offeredFee} TL</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Teklifiniz (TL)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    className="w-full pl-4 pr-12 py-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-bold text-lg"
                    value={bid}
                    onChange={e => setBid(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-bold">TL</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Kısa Mesajınız</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-3 rounded-lg border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-700"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Örn: Dosya incelemesi için müsaitim, adliyeye yakınım."
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary-200 hover:shadow-xl transition transform hover:-translate-y-0.5 flex justify-center items-center text-base"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <><Send className="w-5 h-5 mr-2" /> Başvuruyu Gönder</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ApplyModal;

