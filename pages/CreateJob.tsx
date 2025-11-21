import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2, Briefcase, Send, AlertCircle } from 'lucide-react';
import { User, JobType } from '../types';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';

const CreateJob = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: JobType.DURUSMA,
    city: 'İstanbul',
    courthouse: '',
    date: '',
    time: '',
    fee: '',
    description: '',
    isUrgent: false
  });

  useEffect(() => {
    const cityCourthouses = COURTHOUSES[formData.city] || [];
    if (!cityCourthouses.includes(formData.courthouse)) {
      setFormData(prev => ({ ...prev, courthouse: cityCourthouses[0] || '' }));
    }
  }, [formData.city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const deadlineMinutes = formData.isUrgent ? 5 : 15;
    const deadlineDate = new Date();
    deadlineDate.setMinutes(deadlineDate.getMinutes() + deadlineMinutes);

    try {
      await addDoc(collection(db, "jobs"), {
        title: formData.title,
        jobType: formData.type,
        city: formData.city,
        courthouse: formData.courthouse,
        date: formData.date,
        time: formData.time,
        offeredFee: Number(formData.fee),
        description: formData.description,
        createdBy: user.uid,
        ownerName: user.fullName,
        ownerPhone: user.phone || '',
        status: 'open',
        applicationsCount: 0,
        isUrgent: formData.isUrgent,
        applicationDeadline: Timestamp.fromDate(deadlineDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      navigate('/my-jobs');
    } catch (error) {
      console.error("Error creating job: ", error);
      alert("Görev oluşturulurken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-primary-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <Briefcase className="mr-3" />
            Yeni Görev Oluştur
          </h2>
          <p className="text-primary-100 mt-2">Meslektaşlarınızla paylaşmak için yeni bir görev oluşturun.</p>
        </div>
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Görev Türü</label>
                <select
                  required
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as JobType })}
                >
                  {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Şehir</label>
                <select
                  required
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                >
                  {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adliye / Yer</label>
                <select
                  required
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                  value={formData.courthouse}
                  onChange={e => setFormData({ ...formData, courthouse: e.target.value })}
                >
                  <option value="" disabled>Seçiniz</option>
                  {(COURTHOUSES[formData.city] || []).map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ücret (TL)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-500 sm:text-sm">₺</span>
                  </div>
                  <select
                    required
                    className="block w-full rounded-lg border-slate-300 pl-7 focus:border-primary-500 focus:ring-primary-500 h-11"
                    value={formData.fee}
                    onChange={e => setFormData({ ...formData, fee: e.target.value })}
                  >
                    <option value="" disabled>Seçiniz</option>
                    {(() => {
                      let minFee = 0;
                      switch (formData.type) {
                        case JobType.DURUSMA: minFee = 800; break;
                        case JobType.ICRA:
                        case JobType.DOSYA_INCELEME:
                        case JobType.HACIZ:
                        case JobType.DILEKCE:
                          minFee = 700; break;
                        case JobType.DIGER: minFee = 0; break;
                        default: minFee = 0;
                      }

                      const options = [];
                      // Special case for 0 start
                      if (minFee === 0) {
                        options.push(0);
                        for (let i = 100; i <= 1500; i += 100) {
                          options.push(i);
                        }
                      } else {
                        for (let i = minFee; i <= 1500; i += 100) {
                          options.push(i);
                        }
                      }

                      return options.map(amount => (
                        <option key={amount} value={amount}>{amount}</option>
                      ));
                    })()}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                <input
                  type="date"
                  required
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Saat</label>
                <input
                  type="time"
                  required
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Görev Başlığı</label>
              <input
                type="text"
                required
                placeholder="Örn: 12. Aile Mah. Duruşma Yetki Belgesi"
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className={`p-4 rounded-lg border ${user.isPremium ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'} `}>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onChange={(e) => {
                      if (!user.isPremium && e.target.checked) {
                        const confirm = window.confirm("Acil görev oluşturmak Premium özelliklerden biridir. Yükseltmek ister misiniz?");
                        if (confirm) window.location.hash = "#/premium";
                        return;
                      }
                      setFormData({ ...formData, isUrgent: e.target.checked });
                    }}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isUrgent" className="font-medium text-slate-900 flex items-center cursor-pointer">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                    Acil Görev
                    {!user.isPremium && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Premium</span>}
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    Normal görevlerde başvuru toplama süresi 15 dakikadır. Acil görevlerde bu süre 5 dakikaya düşer.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Açıklama / Notlar</label>
              </div>
              <div className="relative">
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
                  placeholder="Görev detaylarını buraya yazın..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="pt-6 flex justify-end border-t border-slate-100 mt-8">
              <button type="button" onClick={() => navigate('/dashboard')} className="mr-4 px-6 py-2.5 text-slate-600 hover:text-slate-800 font-medium transition">İptal</button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
                Görevi Yayınla
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default CreateJob;
