import React, { useState, useEffect } from 'react';
import { User, User as UserIcon } from 'lucide-react'; // Warning: User import conflict, aliasing lucide icon
import { Gavel, Award, FileText, Camera, Check, Info, Loader2, X } from 'lucide-react';
import { User as UserType } from '../types';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { db } from '../firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';

const SettingsPage = ({ user }: { user: UserType }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);

  const PersonalInfoTab = () => {
    const [formData, setFormData] = useState({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || '',
      jobStatus: user.jobStatus || 'active'
    });
    const [isDirty, setIsDirty] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
      const hasChanges = 
        formData.fullName !== (user.fullName || '') ||
        formData.email !== (user.email || '') ||
        formData.phone !== (user.phone || '') ||
        formData.city !== (user.city || '') ||
        formData.jobStatus !== (user.jobStatus || 'active');
      
      setIsDirty(hasChanges);
    }, [formData, user]);

    const handleSavePersonal = async () => {
      setIsSaving(true);
      try {
        await updateDoc(doc(db, "users", user.uid), {
          fullName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          jobStatus: formData.jobStatus,
          email: formData.email 
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setIsDirty(false);
      } catch (error) {
        console.error(error);
        alert("Güncelleme sırasında hata oluştu.");
      } finally {
        setIsSaving(false);
      }
    };

    const handleCancel = () => {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        jobStatus: user.jobStatus || 'active'
      });
      setIsDirty(false);
    }

    return (
      <div className="relative space-y-6 animate-in fade-in duration-300">
        {showSuccess && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
            <div className="bg-green-500 text-white px-6 py-2 rounded-full shadow-lg flex items-center text-sm font-medium animate-bounce">
              <Check className="w-4 h-4 mr-2" />
              Değişiklikler başarıyla kaydedildi!
            </div>
          </div>
        )}

        {isDirty && (
          <div className="sticky top-0 z-20 -mx-8 -mt-8 px-8 py-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center mb-6">
             <div className="flex items-center text-indigo-700">
               <Info className="w-5 h-5 mr-2" />
               <span className="font-medium">Kaydedilmemiş değişiklikleriniz var.</span>
             </div>
             <div className="flex space-x-3">
                <button onClick={handleCancel} className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-md transition">İptal</button>
                <button onClick={handleSavePersonal} disabled={isSaving} className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm flex items-center transition">{isSaving && <Loader2 className="w-3 h-3 animate-spin mr-2" />} Kaydet</button>
             </div>
          </div>
        )}

        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-lg font-bold text-slate-800">Kişisel Bilgiler</h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
            <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-slate-700 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-Posta</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-slate-600" />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
             <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11" />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">İl</label>
             <select value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11">
                {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
          </div>
          <div className="pt-4 border-t border-slate-100">
             <label className="block text-sm font-medium text-slate-700 mb-3">Görev Alma Durumu</label>
             <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex space-x-2">
                   <button onClick={() => setFormData({...formData, jobStatus: 'active'})} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${formData.jobStatus === 'active' ? 'bg-green-500 text-white shadow-md scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>Açık</button>
                   <button onClick={() => setFormData({...formData, jobStatus: 'passive'})} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${formData.jobStatus === 'passive' ? 'bg-red-400 text-white shadow-md scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>Kapalı</button>
                </div>
                <div className={`text-sm font-medium ${formData.jobStatus === 'active' ? 'text-green-600' : 'text-red-500'}`}>{formData.jobStatus === 'active' ? 'Profiliniz Aktif' : 'Profiliniz Gizli'}</div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const CourthousesTab = () => {
    const [viewCity, setViewCity] = useState<string>(user.city || 'İstanbul');
    const [preferences, setPreferences] = useState<string[]>(user.preferredCourthouses || []);

    const handleToggle = (courthouse: string) => {
      setPreferences(prev => prev.includes(courthouse) ? prev.filter(p => p !== courthouse) : [...prev, courthouse]);
    };

    const handleSavePreferences = async () => {
      setIsSaving(true);
      try {
        await updateDoc(doc(db, "users", user.uid), { preferredCourthouses: preferences });
        alert("Kaydedildi.");
      } catch (error) { console.error(error); alert("Hata."); } finally { setIsSaving(false); }
    };

    const currentCourthouses = COURTHOUSES[viewCity] || [];

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h3 className="text-lg font-bold text-slate-800">Görev Adliyeleriniz</h3>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
           <div className="flex items-center space-x-3 w-full md:w-auto">
             <span className="text-sm text-blue-800 font-medium">Şehir:</span>
             <select value={viewCity} onChange={(e) => setViewCity(e.target.value)} className="rounded-lg border-blue-200 text-sm py-1.5 w-full md:w-48">
               {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
           </div>
           <button onClick={handleSavePreferences} disabled={isSaving} className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition shadow-md w-full md:w-auto flex justify-center items-center">
             {isSaving && <Loader2 className="animate-spin h-3 w-3 mr-2" />} Kaydet
           </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
           {currentCourthouses.map(ch => (
              <label key={ch} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${preferences.includes(ch) ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                  <input type="checkbox" checked={preferences.includes(ch)} onChange={() => handleToggle(ch)} className="w-4 h-4 text-primary-600 rounded border-gray-300 mr-3" />
                  <span className={`text-sm ${preferences.includes(ch) ? 'text-primary-800 font-medium' : 'text-slate-700'}`}>{ch}</span>
              </label>
           ))}
        </div>
      </div>
    );
  };

  const AboutTab = () => {
    const [about, setAbout] = useState(user.aboutMe || '');
    const [loading, setLoading] = useState(false);

    const save = async () => {
      setLoading(true);
      await updateDoc(doc(db, "users", user.uid), { aboutMe: about });
      setLoading(false);
      alert("Hakkımda yazısı güncellendi.");
    }

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
           <h3 className="text-lg font-bold text-slate-800">Hakkımda</h3>
           <p className="text-sm text-slate-500 mt-1">Profilinizi ziyaret eden meslektaşlarınıza kendinizi tanıtın.</p>
        </div>
        <textarea 
          rows={6} 
          className="w-full rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Mezuniyetiniz, deneyimleriniz ve çalışma prensiplerinizden bahsedin..."
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        <div className="flex justify-end">
           <button onClick={save} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
             {loading ? "Kaydediliyor..." : "Kaydet"}
           </button>
        </div>
      </div>
    )
  }

  const SpecializationTab = () => {
    const [specs, setSpecs] = useState<string[]>(user.specializations || []);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const addSpec = () => {
      if(input && !specs.includes(input)) {
        setSpecs([...specs, input]);
        setInput('');
      }
    }

    const removeSpec = (s: string) => {
      setSpecs(specs.filter(item => item !== s));
    }

    const save = async () => {
      setLoading(true);
      await updateDoc(doc(db, "users", user.uid), { specializations: specs });
      setLoading(false);
      alert("Uzmanlık alanları güncellendi.");
    }

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
           <h3 className="text-lg font-bold text-slate-800">Uzmanlık Alanları</h3>
           <p className="text-sm text-slate-500 mt-1">Hangi hukuk dallarında yetkin olduğunuzu belirtin.</p>
        </div>
        <div className="flex gap-2">
           <input 
             className="flex-1 rounded-lg border-slate-300" 
             placeholder="Örn: Ceza Hukuku" 
             value={input} 
             onChange={e => setInput(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && addSpec()}
           />
           <button onClick={addSpec} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 rounded-lg font-medium">Ekle</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
           {specs.map(s => (
             <span key={s} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
               {s}
               <button onClick={() => removeSpec(s)} className="ml-2 text-primary-400 hover:text-red-500"><X className="w-3 h-3"/></button>
             </span>
           ))}
        </div>
        <div className="flex justify-end mt-4">
           <button onClick={save} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
             {loading ? "Kaydediliyor..." : "Kaydet"}
           </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'personal', label: 'Kişisel Bilgiler', icon: UserIcon, component: <PersonalInfoTab /> },
    { id: 'courthouses', label: 'Görev Adliyeleriniz', icon: Gavel, component: <CourthousesTab /> },
    { id: 'specialization', label: 'Uzmanlık Alanları', icon: Award, component: <SpecializationTab /> },
    { id: 'about', label: 'Hakkımda', icon: FileText, component: <AboutTab /> },
    { id: 'photo', label: 'Profil Fotoğrafı', icon: Camera, component: <div className="text-center py-12 text-slate-500">Profil fotoğrafı yükleme modülü yakında eklenecek.</div> },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Hesap Ayarları</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center p-4 rounded-xl border text-sm font-medium transition duration-200 ${
                  isActive 
                    ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-200' 
                    : 'bg-white text-primary-500 border-primary-200 hover:bg-primary-50'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-primary-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[600px] relative overflow-hidden">
             {ActiveComponent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
