import React, { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { Job, User } from '../types';
import { db } from '../firebaseConfig';
import { addDoc, collection, updateDoc, doc, increment, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const ApplyModal = ({ job, user, onClose }: { job: Job, user: User, onClose: () => void }) => {
  const [message, setMessage] = useState('Görevle ilgileniyorum. Müsaitim.');
  const [bid, setBid] = useState(job.offeredFee.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!job.jobId) throw new Error("Job ID missing");

      // 1. Check if already applied
      const q = query(
        collection(db, "applications"),
        where("jobId", "==", job.jobId),
        where("applicantId", "==", user.uid)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("Bu göreve zaten başvurdunuz.");
        onClose();
        return;
      }

      // 2. Create Application
      await addDoc(collection(db, "applications"), {
        jobId: job.jobId,
        applicantId: user.uid,
        applicantName: user.fullName,
        applicantPhone: user.phone || "",
        applicantRating: user.rating || 0,
        message: message,
        proposedFee: Number(bid),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 3. Increment Job Application Count
      await updateDoc(doc(db, "jobs", job.jobId), {
        applicationsCount: increment(1)
      });

      // 4. Notify Job Owner
      await addDoc(collection(db, "notifications"), {
        userId: job.createdBy,
        title: "Yeni Başvuru Geldi 📢",
        message: `${user.fullName}, "${job.title}" görevinize başvurdu.`,
        type: "info",
        read: false,
        createdAt: serverTimestamp()
      });

      alert("Başvurunuz başarıyla gönderildi!");
      onClose();

    } catch (error) {
      console.error("Başvuru hatası:", error);
      alert("Başvuru sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};

export default ApplyModal;
