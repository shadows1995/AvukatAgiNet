import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import { User, JobType } from '../types';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { refineJobDescription } from '../services/geminiService';
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

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    if (!formData.courthouse || !formData.description) {
      alert("Lütfen önce adliye ve kısa bir not giriniz.");
      return;
    }
    setIsGenerating(true);
    const enhancedDesc = await refineJobDescription(formData.type, formData.courthouse, formData.description);
    setFormData(prev => ({ ...prev, description: enhancedDesc }));
    setIsGenerating(false);
  };

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
      alert("İlan oluşturulurken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
        <div className="bg-primary-100 p-2 rounded-lg mr-3">
          <PlusCircle className="text-primary-600 h-6 w-6" />
        </div>
        Yeni Görev İlanı
      </h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Görev Türü</label>
                <select 
                  required
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as JobType})}
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
                  onChange={e => setFormData({...formData, city: e.target.value})}
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
                  onChange={e => setFormData({...formData, courthouse: e.target.value})}
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
                  <input
                    type="number"
                    required
                    className="block w-full rounded-lg border-slate-300 pl-7 focus:border-primary-500 focus:ring-primary-500 h-11"
                    placeholder="0.00"
                    value={formData.fee}
                    onChange={e => setFormData({...formData, fee: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                <input 
                  type="date" 
                  required
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Saat</label>
                <input 
                  type="time" 
                  required
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">İlan Başlığı</label>
              <input 
                type="text" 
                required
                placeholder="Örn: 12. Aile Mah. Duruşma Yetki Belgesi"
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className={`p-4 rounded-lg border ${user.isPremium ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
              <label className="flex items-start cursor-pointer">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    disabled={!user.isPremium}
                    checked={formData.isUrgent}
                    onChange={e => setFormData({...formData, isUrgent: e.target.checked})}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <span className={`font-bold ${user.isPremium ? 'text-red-700' : 'text-slate-500'}`}>
                    Acil İlan (5 Dakika Süre)
                  </span>
                  <p className="text-slate-500 text-xs mt-1">
                    Normal ilanlarda başvuru toplama süresi 15 dakikadır. Acil ilanlarda bu süre 5 dakikaya düşer. 
                    {!user.isPremium && <span className="text-primary-600 ml-1">(Sadece Premium Üyeler)</span>}
                  </p>
                </div>
              </label>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Açıklama / Notlar</label>
                <button 
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="text-xs flex items-center text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-1.5 rounded-full shadow-sm hover:shadow transition"
                >
                  {isGenerating ? <Loader2 className="animate-spin h-3 w-3 mr-1.5" /> : <Sparkles className="h-3 w-3 mr-1.5" />}
                  AI ile Profesyonelleştir
                </button>
              </div>
              <div className="relative">
                <textarea 
                  required
                  rows={4}
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
                  placeholder="Görev detaylarını buraya yazın..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="pt-6 flex justify-end border-t border-slate-100 mt-8">
              <button type="button" onClick={() => navigate('/dashboard')} className="mr-4 px-6 py-2.5 text-slate-600 hover:text-slate-800 font-medium transition">İptal</button>
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-lg shadow-lg hover:shadow-primary-200 font-medium flex items-center transition transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {isLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                İlanı Yayınla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
