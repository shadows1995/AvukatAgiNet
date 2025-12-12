import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, User as UserIcon } from 'lucide-react';
import { Gavel, Award, FileText, Camera, Check, Info, Loader2, X, AlertTriangle, CheckCircle, Shield, Trash2, Bell } from 'lucide-react';
import { User as UserType } from '../types';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { supabase } from '../supabaseClient';
import TaskDisputePage from './TaskDisputePage';

const SettingsPage = ({ user, onProfileUpdate }: { user: UserType, onProfileUpdate: () => void }) => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'personal');
  const [isSaving, setIsSaving] = useState(false);

  // Update active tab when URL param changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
        const { error } = await supabase.from('users').update({
          full_name: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          job_status: formData.jobStatus,
          email: formData.email
        }).eq('uid', user.uid);

        if (error) throw error;
        showNotification('success', 'Kişisel bilgileriniz başarıyla güncellendi.');
        onProfileUpdate();
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
            <input type="text" value={formData.fullName} disabled className="w-full bg-slate-100 p-3 rounded-lg border border-slate-200 text-slate-500 font-medium cursor-not-allowed" />
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
      let nextPreferences: string[];

      if (preferences.includes(courthouse)) {
        nextPreferences = preferences.filter(c => c !== courthouse);
      } else {
        nextPreferences = [...preferences, courthouse];
      }

      // Calculate the number of unique cities in the NEW selection
      const cities = new Set<string>();
      nextPreferences.forEach(ch => {
        const city = getCityFromCourthouse(ch);
        if (city) cities.add(city);
      });

      // If user is NOT Premium Plus and tries to select from > 1 city
      if (cities.size > 1 && user.membershipType !== 'premium_plus') {
        // Only block if we are ADDING. Removing is always safe (reducing complexity).
        if (nextPreferences.length > preferences.length) {
          const firstCity = Array.from(cities)[0];
          showNotification('error', `Birden fazla ilden adliye seçimi sadece Premium + üyeler içindir. (${firstCity} dışında seçim yapamazsınız)`);
          return;
        }
      }

      setPreferences(nextPreferences);
    };
    const handleSavePreferences = async () => {
      setIsSaving(true);
      try {
        const { error } = await supabase.from('users').update({ preferred_courthouses: preferences }).eq('uid', user.uid);
        if (error) throw error;
        showNotification('success', 'Görev adliyeleriniz kaydedildi.');
        onProfileUpdate();
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
        const { error } = await supabase.from('users').update({ about_me: about }).eq('uid', user.uid);
        if (error) throw error;
        showNotification('success', 'Hakkımda yazısı güncellendi.');
        onProfileUpdate();
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

  const PasswordChangeTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async () => {
      if (password !== confirmPassword) {
        showNotification('error', 'Şifreler eşleşmiyor.');
        return;
      }
      if (password.length < 6) {
        showNotification('error', 'Şifre en az 6 karakter olmalıdır.');
        return;
      }

      setLoading(true);
      try {
        const { error } = await supabase.auth.updateUser({ password: password });
        if (error) throw error;
        showNotification('success', 'Şifreniz başarıyla güncellendi.');
        setPassword('');
        setConfirmPassword('');
      } catch (error: any) {
        showNotification('error', 'Şifre güncellenirken hata oluştu: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Şifre Değiştir</h3>
          <p className="text-sm text-slate-500 mt-1">Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirin.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 h-11" placeholder="••••••••" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 h-11" placeholder="••••••••" />
        </div>
        <div className="flex justify-end">
          <button onClick={handlePasswordChange} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
          </button>
        </div>
      </div>
    );
  };

  const SpecializationTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [specs, setSpecs] = useState<string[]>(user.specializations || []);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const addSpec = () => {
      if (input && !specs.includes(input)) {
        if (specs.length >= 3) {
          showNotification('error', 'En fazla 3 uzmanlık alanı ekleyebilirsiniz.');
          return;
        }
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
        const { error } = await supabase.from('users').update({ specializations: specs }).eq('uid', user.uid);
        if (error) throw error;
        showNotification('success', 'Uzmanlık alanları güncellendi.');
        onProfileUpdate();
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
          <p className="text-sm text-slate-500 mt-1">Hangi hukuk dallarında yetkin olduğunuzu belirtin (Maks. 3 alan).</p>
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border-slate-300"
            placeholder="Örn: Ceza Hukuku"
            value={input}
            maxLength={15}
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

  const AuthorizationTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [formData, setFormData] = useState({
      baroCity: user.baroCity || '',
      baroNumber: user.baroNumber || '',
      address: user.address || ''
    });
    const [loading, setLoading] = useState(false);

    const save = async () => {
      setLoading(true);
      try {
        const { error } = await supabase.from('users').update({
          baro_city: formData.baroCity,
          baro_number: formData.baroNumber,
          address: formData.address
        }).eq('uid', user.uid);

        if (error) throw error;
        showNotification('success', 'Yetki belgesi bilgileri güncellendi.');
        onProfileUpdate();
      } catch (e: any) {
        console.error(e);
        showNotification('error', `Güncellenirken hata oluştu: ${e.message || 'Bilinmeyen hata'}`);
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Yetki Belgesi Bilgileri</h3>
          <p className="text-sm text-slate-500 mt-1">Bu bilgiler, görevi aldığınızda karşı tarafla paylaşılacaktır.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Baro</label>
            <select
              value={formData.baroCity}
              onChange={(e) => setFormData({ ...formData, baroCity: e.target.value })}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11"
            >
              <option value="" disabled>Seçiniz</option>
              {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Baro Sicil No</label>
            <input
              type="text"
              value={formData.baroNumber}
              onChange={(e) => setFormData({ ...formData, baroNumber: e.target.value })}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50 h-11"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border-slate-300 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ofis adresiniz..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="flex justify-end">
          <button onClick={save} disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    )
  }
  const DeleteAccountTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [loading, setLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = async () => {
      if (confirmText !== 'HESABIMI SİL') {
        showNotification('error', 'Lütfen onaylamak için "HESABIMI SİL" yazınız.');
        return;
      }

      if (!window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir.')) {
        return;
      }

      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/delete-account`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid: user.uid,
            token: token
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Hesap silinirken bir hata oluştu.');
        }

        // Sign out locally
        await supabase.auth.signOut();
        window.location.href = '/';

      } catch (error: any) {
        console.error('Delete account error:', error);
        showNotification('error', error.message || 'Bir hata oluştu.');
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="border-b border-red-100 pb-4">
          <h3 className="text-lg font-bold text-red-600">Hesabı Sil</h3>
          <p className="text-sm text-slate-500 mt-1">Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.</p>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <div className="flex items-start mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-bold mb-1">Dikkat!</p>
              <p>Hesabınızı sildiğinizde:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>Tüm profil bilgileriniz silinecek.</li>
                <li>Mevcut başvurularınız iptal edilecek.</li>
                <li>Yayınladığınız görevler sistemden kaldırılacak.</li>
                <li>Premium üyeliğiniz varsa iptal edilecek (iade yapılmaz).</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Onaylamak için aşağıya <span className="font-bold select-all">HESABIMI SİL</span> yazınız:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-lg border-red-300 focus:ring-red-500 focus:border-red-500 mb-4"
              placeholder="HESABIMI SİL"
            />
            <button
              onClick={handleDelete}
              disabled={loading || confirmText !== 'HESABIMI SİL'}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition flex items-center justify-center ${loading || confirmText !== 'HESABIMI SİL'
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 hover:shadow-lg'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Siliniyor...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5 mr-2" />
                  Hesabımı Kalıcı Olarak Sil
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PhotoTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(user.avatarUrl || null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setUploading(true);
        if (!event.target.files || event.target.files.length === 0) {
          throw new Error('Bir fotoğraf seçmelisiniz.');
        }

        const file = event.target.files[0];

        // CHECK FILE SIZE (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Dosya boyutu çok büyük. Lütfen 5MB\'dan küçük bir fotoğraf seçiniz.');
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.uid}/${Date.now()}.${fileExt}`;
        const filePath = `Profile photos/${fileName}`;
        const userFolder = `Profile photos/${user.uid}`;

        // 1. Delete Old Photos
        const { data: oldFiles } = await supabase.storage.from('LOGO2').list(userFolder);
        if (oldFiles && oldFiles.length > 0) {
          const filesToRemove = oldFiles.map(x => `${userFolder}/${x.name}`);
          await supabase.storage.from('LOGO2').remove(filesToRemove);
        }

        // 2. Upload to Supabase Storage (LOGO2 bucket)
        const { error: uploadError } = await supabase.storage
          .from('LOGO2')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('LOGO2')
          .getPublicUrl(filePath);

        // 3. Update User Profile
        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: publicUrl })
          .eq('uid', user.uid);

        if (updateError) {
          throw updateError;
        }

        setPreview(publicUrl);
        showNotification('success', 'Profil fotoğrafınız güncellendi.');
        onProfileUpdate();

      } catch (error: any) {
        showNotification('error', error.message || 'Fotoğraf yüklenirken bir hata oluştu.');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Profil Fotoğrafı</h3>
          <p className="text-sm text-slate-500 mt-1">Diğer kullanıcıların sizi tanıması için bir fotoğraf yükleyin.</p>
        </div>

        <div className="flex flex-col items-center space-y-6 py-8">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg ${!preview ? 'bg-slate-100' : ''}`}>
              {preview ? (
                <img src={preview} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-slate-300" />
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <label className="cursor-pointer bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition shadow-md hover:shadow-lg transform active:scale-95 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              <span>{uploading ? 'Yükleniyor...' : 'Fotoğraf Seç'}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-slate-400 mt-3">JPG, PNG veya GIF (Maks. 5MB)</p>
          </div>
        </div>
      </div>
    );
  };

  const NotificationSettingsTab = ({ showNotification }: { showNotification: (type: 'success' | 'error', message: string) => void }) => {
    const [smsEnabled, setSmsEnabled] = useState(user.sms_notifications_enabled !== false); // Default to true if undefined
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
      const newValue = !smsEnabled;
      setSmsEnabled(newValue);
      setLoading(true);

      try {
        const { error } = await supabase.from('users').update({ sms_notifications_enabled: newValue }).eq('uid', user.uid);
        if (error) throw error;
        showNotification('success', newValue ? 'SMS bildirimleri açıldı.' : 'SMS bildirimleri kapatıldı.');
        onProfileUpdate();
      } catch (e) {
        setSmsEnabled(!newValue); // Revert on error
        showNotification('error', 'Güncellenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">Bildirim Ayarları</h3>
          <p className="text-sm text-slate-500 mt-1">Hangi konularda bildirim almak istediğinizi yönetin.</p>
        </div>

        <div className="bg-white border rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">SMS Bildirimleri</h4>
              <p className="text-sm text-slate-500">Mevcut veya yeni görevler hakkında SMS al.</p>
            </div>
          </div>

          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${smsEnabled ? 'bg-primary-600' : 'bg-slate-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smsEnabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'personal', label: 'Kişisel Bilgiler', icon: UserIcon, component: <PersonalInfoTab showNotification={showNotification} /> },
    { id: 'authorization', label: 'Yetki Belgesi Bilgileri', icon: FileText, component: <AuthorizationTab showNotification={showNotification} /> },
    { id: 'courthouses', label: 'Görev Adliyeleriniz', icon: Gavel, component: <CourthousesTab showNotification={showNotification} /> },
    { id: 'specialization', label: 'Uzmanlık Alanları', icon: Award, component: <SpecializationTab showNotification={showNotification} /> },
    { id: 'about', label: 'Hakkımda', icon: Info, component: <AboutTab showNotification={showNotification} /> },
    { id: 'disputes', label: 'Görev Uyuşmazlıkları', icon: Gavel, component: <TaskDisputePage /> },
    { id: 'password', label: 'Şifre Değiştir', icon: Shield, component: <PasswordChangeTab showNotification={showNotification} /> },
    { id: 'photo', label: 'Profil Fotoğrafı', icon: Camera, component: <PhotoTab showNotification={showNotification} /> },
    { id: 'delete', label: 'Hesabı Sil', icon: Trash2, component: <DeleteAccountTab showNotification={showNotification} /> },
    { id: 'notifications', label: 'Bildirim Ayarları', icon: Bell, component: <NotificationSettingsTab showNotification={showNotification} /> },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  // Auto-scroll to content on mobile when tab changes
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll if we are on mobile (check window width or just always scroll if content is ref'd)
    if (window.innerWidth < 1024 && contentRef.current) {
      // Small delay to ensure render
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeTab]);

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
        <div ref={contentRef} className="w-full lg:w-3/4 scroll-mt-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[600px] relative overflow-hidden md:transform-none transform scale-[0.85] origin-top-left w-[117.6%] md:w-full mb-[-15%] md:mb-0">
            {/* Note: Scale 0.85 means width needs to be 1/0.85 = ~117.6% to fill container, and origin top-left.
                 We apply this only on mobile phones (<768px), and reset on md/lg screens. */}
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
