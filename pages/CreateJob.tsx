import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2, Briefcase, Send, AlertCircle } from 'lucide-react';
import { User, JobType } from '../types';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { supabase } from '../supabaseClient';
import { useNotification } from '../contexts/NotificationContext';
import { useAlert } from '../contexts/AlertContext';

const CreateJob = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { showAlert } = useAlert();
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

    // Daily Limit Check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayJobCount, error: countError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.uid)
      .gte('created_at', today.toISOString());

    if (countError) {
      console.error("Error checking job limit:", countError);
      showNotification('error', "Limit kontrolü yapılırken bir hata oluştu.");
      setIsLoading(false);
      return;
    }

    if ((todayJobCount || 0) >= 10) {
      showNotification('error', "Günlük görev oluşturma limitine (10) ulaştınız. Yarın tekrar deneyiniz.");
      setIsLoading(false);
      return;
    }

    // Date Validation
    const [year, month, day] = formData.date.split('-').map(Number);
    const [hour, minute] = formData.time.split(':').map(Number);
    const jobDate = new Date(year, month - 1, day, hour, minute);

    if (jobDate < new Date()) {
      showNotification('error', "Geçmiş bir tarihe görev oluşturamazsınız. Lütfen ileri bir tarih ve saat seçiniz.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('jobs').insert({
        title: formData.title,
        job_type: formData.type,
        city: formData.city,
        courthouse: formData.courthouse,
        date: formData.date,
        time: formData.time,
        offered_fee: Number(formData.fee),
        description: formData.description,
        created_by: user.uid,
        owner_name: user.fullName,
        owner_phone: user.phone || '',
        status: 'open',
        applications_count: 0,
        is_urgent: formData.isUrgent,
        application_deadline: deadlineDate.toISOString(),
        // created_at and updated_at are handled by default
      });

      if (error) throw error;

      // Trigger SMS Notification (Fire and forget)
      const apiUrl = import.meta.env.VITE_API_URL || '';
      fetch(`${apiUrl}/api/notify-new-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: formData.city,
          courthouse: formData.courthouse,
          jobType: formData.type,
          jobId: null,
          createdBy: user.uid
        })
      }).catch(err => console.error("SMS Notification Error:", err));

      showAlert({
        title: "Başarılı!",
        message: "Göreviniz Başarıyla Yayımlanmıştır",
        type: "success",
        confirmText: "Tamam",
        onConfirm: () => navigate('/my-jobs')
      });

    } catch (error) {
      console.error("Error creating job: ", error);
      showNotification('error', "Görev oluşturulurken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h2 className="text-3xl font-bold flex items-center relative z-10">
            <Briefcase className="mr-3 w-8 h-8" />
            Yeni Görev Oluştur
          </h2>
          <p className="text-primary-100 mt-2 relative z-10 text-lg">Meslektaşlarınızla paylaşmak için yeni bir görev oluşturun.</p>
        </div>
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Görev Türü</label>
                <select
                  required
                  className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as JobType })}
                >
                  {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Şehir</label>
                <select
                  required
                  className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                >
                  {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Adliye / Yer</label>
                <select
                  required
                  className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white"
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
                <label className="block text-sm font-bold text-slate-700 mb-2">Ücret (TL)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-slate-500 sm:text-sm font-bold">₺</span>
                  </div>
                  <select
                    required
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-8 focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white"
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
                <label className="block text-sm font-bold text-slate-700 mb-2">Tarih</label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Saat</label>
                <input
                  type="time"
                  required
                  className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Görev Başlığı</label>
              <input
                type="text"
                required
                placeholder="Örn: 12. Aile Mah. Duruşma Yetki Belgesi"
                className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-12 font-medium text-slate-700 transition-all duration-200 hover:bg-white px-4"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${user.isPremium ? 'bg-red-50 border-red-100 hover:border-red-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'} `}>
              <div className="flex items-start">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onChange={(e) => {
                      if (!user.isPremium && e.target.checked) {
                        showAlert({
                          title: "Premium Özellik",
                          message: "Acil görev oluşturmak Premium özelliklerden biridir. Yükseltmek ister misiniz?",
                          type: "confirm",
                          confirmText: "Premium'a Geç",
                          cancelText: "Vazgeç",
                          onConfirm: () => window.location.hash = "#/premium"
                        });
                        return;
                      }
                      setFormData({ ...formData, isUrgent: e.target.checked });
                    }}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-200"
                  />
                </div>
                <div className="ml-4 text-sm">
                  <label htmlFor="isUrgent" className="font-bold text-slate-900 flex items-center cursor-pointer text-base">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    Acil Görev
                    {!user.isPremium && <span className="ml-3 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full font-bold shadow-sm">PREMIUM</span>}
                  </label>
                  <p className="text-slate-500 mt-1.5 leading-relaxed">
                    Normal görevlerde başvuru toplama süresi 15 dakikadır. Acil görevlerde bu süre 5 dakikaya düşer ve göreviniz öne çıkarılır.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Açıklama / Notlar</label>
              </div>
              <div className="relative">
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-4 font-medium text-slate-700 transition-all duration-200 hover:bg-white"
                  placeholder="Görev detaylarını buraya yazın..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="pt-6 flex justify-end border-t border-slate-100 mt-8">
              <button type="button" onClick={() => navigate('/dashboard')} className="mr-4 px-8 py-3 text-slate-600 hover:text-slate-900 font-bold transition-colors duration-200">İptal</button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-12 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-glow hover:shadow-glow-lg flex items-center justify-center transform hover:-translate-y-0.5"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
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
