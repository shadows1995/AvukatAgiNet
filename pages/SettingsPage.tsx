import React, { useState, useEffect } from 'react';
import { User, User as UserIcon } from 'lucide-react';
import { Gavel, Award, FileText, Camera, Check, Info, Loader2, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { db } from '../firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';

const SettingsPage = ({ user }: { user: UserType }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);

  // Notification Modal State
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean, type: 'success' | 'error', message: string }>({
    isOpen: false, type: 'success', message: ''
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setStatusModal({ isOpen: true, type, message });
  };

  const PersonalInfoTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [formData, setFormData] = useState({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || '',
      jobStatus: user.jobStatus || 'active'
    });
    const [isDirty, setIsDirty] = useState(false);

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
        showNotification('success', 'Kişisel bilgileriniz başarıyla güncellendi.');
        setIsDirty(false);
      } catch (error) {
        console.error(error);
        showNotification('error', 'Güncelleme sırasında bir hata oluştu.');
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
            <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-slate-700 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-Posta</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 focus:ring-primary-500 focus:border-primary-500 text-slate-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">İl</label>
            <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11">
              {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-3">Görev Alma Durumu</label>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex space-x-2">
                <button onClick={() => setFormData({ ...formData, jobStatus: 'active' })} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${formData.jobStatus === 'active' ? 'bg-green-500 text-white shadow-md scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>Açık</button>
                <button onClick={() => setFormData({ ...formData, jobStatus: 'passive' })} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${formData.jobStatus === 'passive' ? 'bg-red-400 text-white shadow-md scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>Kapalı</button>
              </div>
              <div className={`text-sm font-medium ${formData.jobStatus === 'active' ? 'text-green-600' : 'text-red-500'}`}>{formData.jobStatus === 'active' ? 'Profiliniz Aktif' : 'Profiliniz Gizli'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CourthousesTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [preferences, setPreferences] = useState<string[]>(user.preferredCourthouses || []);
    const [viewCity, setViewCity] = useState(user.city || 'İstanbul');
    const [isSaving, setIsSaving] = useState(false);

    const currentCourthouses = COURTHOUSES[viewCity] || [];

    // Helper to find city of a courthouse
    const getCityFromCourthouse = (courthouse: string): string | undefined => {
      for (const [city, courthouses] of Object.entries(COURTHOUSES)) {
        if (courthouses.includes(courthouse)) return city;
      }
      return undefined;
    };

    const handleToggle = (courthouse: string) => {
      if (preferences.includes(courthouse)) {
        setPreferences(preferences.filter(c => c !== courthouse));
      } else {
        // Check if we are adding a courthouse from a different city
        if (preferences.length > 0) {
          const firstCourthouseCity = getCityFromCourthouse(preferences[0]);
          const newCourthouseCity = getCityFromCourthouse(courthouse);

          if (firstCourthouseCity && newCourthouseCity && firstCourthouseCity !== newCourthouseCity) {
            showNotification('error', `Sadece tek bir ilden adliye seçebilirsiniz. (${firstCourthouseCity})`);
            return;
          }
        }
        setPreferences([...preferences, courthouse]);
      }
    };
    const handleSavePreferences = async () => {
      setIsSaving(true);
      try {
        await updateDoc(doc(db, "users", user.uid), { preferredCourthouses: preferences });
        showNotification('success', 'Görev adliyeleriniz kaydedildi.');
      } catch (error) {
        console.error(error);
        showNotification('error', 'Kaydedilirken bir hata oluştu.');
      } finally { setIsSaving(false); }
    };



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

        {/* Selected Courthouses Summary */}
        {preferences.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Seçili Adliyeler ({preferences.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {preferences.map(ch => (
                <span key={ch} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  {ch}
                  <button
                    onClick={() => handleToggle(ch)}
                    className="ml-2 text-green-400 hover:text-green-600 focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
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

  const AboutTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [about, setAbout] = useState(user.aboutMe || '');
    const [loading, setLoading] = useState(false);

    const save = async () => {
      setLoading(true);
      try {
        await updateDoc(doc(db, "users", user.uid), { aboutMe: about });
        showNotification('success', 'Hakkımda yazısı güncellendi.');
      } catch (e) {
        showNotification('error', 'Güncellenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
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

  const SpecializationTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [specs, setSpecs] = useState<string[]>(user.specializations || []);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const addSpec = () => {
      if (input && !specs.includes(input)) {
        setSpecs([...specs, input]);
        setInput('');
      }
    }

    const removeSpec = (s: string) => {
      setSpecs(specs.filter(item => item !== s));
    }

    const save = async () => {
      setLoading(true);
      try {
        await updateDoc(doc(db, "users", user.uid), { specializations: specs });
        showNotification('success', 'Uzmanlık alanları güncellendi.');
      } catch (e) {
        showNotification('error', 'Güncellenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
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
              <button onClick={() => removeSpec(s)} className="ml-2 text-primary-400 hover:text-red-500"><X className="w-3 h-3" /></button>
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
    { id: 'personal', label: 'Kişisel Bilgiler', icon: UserIcon, component: <PersonalInfoTab showNotification={showNotification} /> },
    { id: 'courthouses', label: 'Görev Adliyeleriniz', icon: Gavel, component: <CourthousesTab showNotification={showNotification} /> },
    { id: 'specialization', label: 'Uzmanlık Alanları', icon: Award, component: <SpecializationTab showNotification={showNotification} /> },
    { id: 'about', label: 'Hakkımda', icon: FileText, component: <AboutTab showNotification={showNotification} /> },
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
                className={`w-full flex items-center p-4 rounded-xl border text-sm font-medium transition duration-200 ${isActive
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

      {/* STATUS MODAL (Success / Error) */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setStatusModal({ ...statusModal, isOpen: false })}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative z-10 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${statusModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {statusModal.type === 'success' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {statusModal.type === 'success' ? 'İşlem Başarılı!' : 'Hata Oluştu'}
            </h3>
            <p className="text-slate-600 mb-6">{statusModal.message}</p>
            <button
              onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition transform hover:-translate-y-1 ${statusModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
