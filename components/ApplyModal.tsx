import React, { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { Job, User } from '../types';
import { supabase } from '../supabaseClient';
import Toast from './Toast';

import { useAlert } from '../contexts/AlertContext';


const ApplyModal = ({ job, user, onClose }: { job: Job, user: User, onClose: () => void }) => {
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
        message: `${user.fullName}, "${job.title}" görevinize başvurdu.`,
        type: "info",
        read: false
      });

      showAlert({
        title: "Başarılı",
        message: "Başvurunuz başarıyla gönderildi.",
        type: "success",
        confirmText: "Tamam",
        onConfirm: onClose
      });

    } catch (error) {
      console.error("Başvuru hatası:", error);
      setToast({ message: 'Başvuru sırasında bir hata oluştu.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Göreve Başvur</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
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
                <input
                  type="number"
                  required
                  className="w-full rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500"
                  value={bid}
                  onChange={e => setBid(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kısa Mesajınız</label>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Örn: Dosya incelemesi için müsaitim, adliyeye yakınım."
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-bold shadow-md flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <><Send className="w-4 h-4 mr-2" /> Başvuruyu Gönder</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyModal;

