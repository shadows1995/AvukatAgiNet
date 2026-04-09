import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, User as UserIcon } from 'lucide-react';
import { Gavel, Award, FileText, Camera, Check, Info, Loader2, X, AlertTriangle, CheckCircle, Shield, Trash2, Bell, Users, Gift, Copy } from 'lucide-react';
import { User as UserType } from '../types';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { supabase } from '../supabaseClient';
import TaskDisputePage from './TaskDisputePage';
import { SHOW_PREMIUM_FEATURES } from '../config';

const NotificationSettingsTab = ({ user, onProfileUpdate, showNotification, askConfirmation }: {
  user: UserType,
  onProfileUpdate: () => void,
  showNotification: (type: 'success' | 'error', message: string) => void,
  askConfirmation: (options: { title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string }) => void
}) => {
  const [smsEnabled, setSmsEnabled] = useState(user.sms_notifications_enabled !== false);
  const [telegramEnabled, setTelegramEnabled] = useState(user.telegram_notifications_enabled || false);
  const [loading, setLoading] = useState(false);

  // Telegram Linking State
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<Date | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Check if connected
  const isTelegramConnected = !!user.telegram_chat_id;

  // Sync state with user prop changes
  useEffect(() => {
    setSmsEnabled(user.sms_notifications_enabled !== false);
    setTelegramEnabled(user.telegram_notifications_enabled || false);
  }, [user.sms_notifications_enabled, user.telegram_notifications_enabled]);

  // Poll for changes when link code is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (linkCode && !isTelegramConnected) {
      interval = setInterval(() => {
        onProfileUpdate();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [linkCode, isTelegramConnected, onProfileUpdate]);

  const handleSmsToggle = async () => {
    const newValue = !smsEnabled;
    setSmsEnabled(newValue);
    setLoading(true);

    try {
      const { error } = await supabase.from('users').update({ sms_notifications_enabled: newValue }).eq('uid', user.uid);
      if (error) throw error;
      showNotification('success', newValue ? 'SMS bildirimleri açıldı.' : 'SMS bildirimleri kapatıldı.');
      onProfileUpdate();
    } catch (e) {
      setSmsEnabled(!newValue);
      showNotification('error', 'Güncellenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramToggle = async () => {
    if (!isTelegramConnected) {
      showNotification('error', 'Telegram bildirimlerini açmak için önce hesabınızı bağlamalısınız.');
      return;
    }

    const newValue = !telegramEnabled;
    setTelegramEnabled(newValue);
    setLoading(true);

    try {
      const { error } = await supabase.from('users').update({ telegram_notifications_enabled: newValue }).eq('uid', user.uid);
      if (error) throw error;
      showNotification('success', newValue ? 'Telegram bildirimleri açıldı.' : 'Telegram bildirimleri kapatıldı.');
      onProfileUpdate();
    } catch (e) {
      setTelegramEnabled(!newValue);
      showNotification('error', 'Güncellenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const generateLinkCode = async () => {
    setIsGeneratingCode(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/telegram/link-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!res.ok) throw new Error('Kod üretilemedi');

      const data = await res.json();
      setLinkCode(data.code);
      setCodeExpiresAt(new Date(data.expiresAt));

    } catch (e) {
      console.error(e);
      showNotification('error', 'Bağlantı kodu üretilirken bir hata oluştu.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-800">Bildirim Ayarları</h3>
        <p className="text-sm text-slate-500 mt-1">Hangi konularda bildirim almak istediğinizi yönetin.</p>
      </div>

      {/* SMS Toggle */}
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
          onClick={handleSmsToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${smsEnabled ? 'bg-primary-600' : 'bg-slate-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Telegram Section */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sky-50 text-sky-500 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Telegram Bildirimleri</h4>
              <p className="text-sm text-slate-500">
                {isTelegramConnected
                  ? 'Hesabınız Telegram\'a bağlı. Bildirimler aktif.'
                  : 'Telegram botumuzu bağlayarak bildirimleri ücretsiz ve anında alın.'}
              </p>
              {isTelegramConnected && (
                <button
                  onClick={() => {
                    askConfirmation({
                      title: 'Bağlantıyı Kes',
                      message: 'Telegram hesabınızın bağlantısını kesmek istediğinize emin misiniz?',
                      confirmText: 'Evet, Kes',
                      onConfirm: async () => {
                        const { error } = await supabase.from('users').update({ telegram_chat_id: null, telegram_notifications_enabled: false }).eq('uid', user.uid);
                        if (!error) {
                          onProfileUpdate();
                          showNotification('success', 'Telegram bağlantısı kesildi.');
                        } else {
                          showNotification('error', 'Hata oluştu.');
                        }
                      }
                    });
                  }}
                  className="text-xs text-red-500 hover:text-red-700 underline mt-1"
                >
                  Bağlantıyı Kes
                </button>
              )}
            </div>
          </div>

          {isTelegramConnected && (
            <button
              onClick={handleTelegramToggle}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${telegramEnabled ? 'bg-sky-500' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${telegramEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          )}
        </div>

        {!isTelegramConnected && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2">
            {!linkCode ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-slate-600">
                  Telegram bildirimlerini kullanmak için hesabınızı <strong>@AvukatAgiBot</strong> ile eşleştirmeniz gerekmektedir.
                </span>
                <button
                  onClick={generateLinkCode}
                  disabled={isGeneratingCode}
                  className="whitespace-nowrap bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-600 transition flex items-center"
                >
                  {isGeneratingCode && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Telegram'ı Bağla
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-2">
                <h5 className="font-bold text-slate-800">Hesap Eşleştirme Kodu</h5>
                <div className="text-3xl font-mono font-bold text-sky-600 tracking-widest bg-white inline-block px-6 py-3 rounded-xl border border-sky-100 shadow-sm">
                  {linkCode}
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>1. Telegram uygulamasını açın ve <strong>@AvukatAgiBot</strong>'u aratın (veya <a href="https://t.me/AvukatAgiBot" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">buraya tıklayın</a>).</p>
                  <p>2. Botu başlatın ve aşağıdaki komutu gönderin:</p>
                  <div className="font-mono bg-slate-200 inline-block px-2 py-1 rounded text-slate-700 mt-1 text-xs sm:text-sm">
                    /start {linkCode}
                  </div>
                  <p className="text-xs text-red-400 mt-2">Bu kod 10 dakika geçerlidir.</p>
                </div>
                <button onClick={() => setLinkCode(null)} className="text-xs text-slate-400 hover:text-slate-600 underline">İptal</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Telegram Channel Link */}
      <a
        href="https://t.me/avukatagitevkil"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-lg">Telegram Kanalımıza Katılın</h4>
              <p className="text-sky-100 text-sm">Tevkil ilanlarını Telegram üzerinden anlık takip edin.</p>
            </div>
          </div>
          <div className="bg-white text-sky-600 px-4 py-2 rounded-lg font-bold text-sm">
            Kanala Git
          </div>
        </div>
      </a>

      {/* WhatsApp Group Link */}
      <a
        href="https://chat.whatsapp.com/E7KfyMClOi269q9lToZ63X"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-lg">WhatsApp Grubumuza Katılın</h4>
              <p className="text-green-100 text-sm">Meslektaşlarımızla anlık iletişim kurun.</p>
            </div>
          </div>
          <div className="bg-white text-green-600 px-4 py-2 rounded-lg font-bold text-sm">
            Gruba Git
          </div>
        </div>
      </a>
    </div>
  );
};


const PersonalInfoTab = ({ showNotification, user, onProfileUpdate }: { showNotification: (type: 'success' | 'error', message: string) => void, user: UserType, onProfileUpdate: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    city: user.city || '',
    jobStatus: user.jobStatus || 'active'
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    } catch (error: any) {
      console.error(error);
      if (error?.code === '23505') {
        if (error?.message?.includes('email') || error?.details?.includes('email') || error?.message?.includes('users_email_key')) {
          showNotification('error', 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor.');
          return;
        }
        if (error?.message?.includes('phone') || error?.details?.includes('phone') || error?.message?.includes('users_phone_key')) {
          showNotification('error', 'Bu telefon numarası başka bir kullanıcı tarafından kullanılıyor.');
          return;
        }
      }
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

const CourthousesTab = ({ showNotification, askConfirmation, user, onProfileUpdate }: { showNotification: (type: 'success' | 'error', message: string) => void, askConfirmation: (options: { title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string }) => void, user: UserType, onProfileUpdate: () => void }) => {
  const [preferences, setPreferences] = useState<string[]>(user.preferredCourthouses || []);
  const [viewCity, setViewCity] = useState(user.city || 'İstanbul');
  const [isSaving, setIsSaving] = useState(false);

  const currentCourthouses = COURTHOUSES[viewCity] || [];

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

    const cities = new Set<string>();
    nextPreferences.forEach(ch => {
      const city = getCityFromCourthouse(ch);
      if (city) cities.add(city);
    });

    if (cities.size > 1) {
      if (user.membershipType !== 'premium_plus') {
        if (nextPreferences.length > preferences.length) {
          const firstCity = Array.from(cities)[0];
          showNotification('error', `Birden fazla ilden adliye seçimi sadece Premium + üyeler içindir. (${firstCity} dışında seçim yapamazsınız)`);
          return;
        }
      } else if (user.premiumPlan === 'beta') {
        // Enforce 2-city limit for Beta users
        if (cities.size > 2 && nextPreferences.length > preferences.length) {
          showNotification('error', `Beta deneme sürecinde en fazla 2 farklı ilden adliye seçebilirsiniz.`);
          return;
        }
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

      {preferences.length > 0 && (
        <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-slate-700 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Seçili Adliyeler ({preferences.length})
            </h4>
            <button
              onClick={() => {
                askConfirmation({
                  title: 'Emin misiniz?',
                  message: 'Tüm seçili adliyeleri silmek üzeresiniz. Bu işlem geri alınamaz.',
                  onConfirm: () => setPreferences([]),
                  confirmText: 'Evet, Sil',
                  cancelText: 'Vazgeç'
                });
              }}
              className="text-xs text-red-500 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-red-100 flex items-center"
            >
              <Trash2 className="w-3 h-3 mr-1" /> Tümünü Temizle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.map(ch => (
              <span key={ch} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100 transition hover:bg-green-100">
                {ch}
                <button
                  onClick={() => handleToggle(ch)}
                  className="ml-3 p-1 text-green-400 hover:text-red-500 focus:outline-none hover:bg-white rounded-full transition"
                >
                  <X className="w-4 h-4" />
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

const AboutTab = ({ showNotification, user, onProfileUpdate }: { showNotification: (type: 'success' | 'error', message: string) => void, user: UserType, onProfileUpdate: () => void }) => {
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
};

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

const SpecializationTab = ({ showNotification, user, onProfileUpdate }: { showNotification: (type: 'success' | 'error', message: string) => void, user: UserType, onProfileUpdate: () => void }) => {
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
};

const AuthorizationTab = ({ showNotification, user, onProfileUpdate }: { showNotification: (type: 'success' | 'error', message: string) => void, user: UserType, onProfileUpdate: () => void }) => {
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
};

const DeleteAccountTab = ({ showNotification, askConfirmation, user }: { showNotification: (type: 'success' | 'error', message: string) => void, askConfirmation: (options: { title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string }) => void, user: UserType }) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText !== 'HESABIMI SİL') {
      showNotification('error', 'Lütfen onaylamak için "HESABIMI SİL" yazınız.');
      return;
    }

    askConfirmation({
      title: 'Hesabı Sil',
      message: 'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir.',
      confirmText: 'Hesabımı Kalıcı Olarak Sil',
      onConfirm: async () => {
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
      }
    });
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
              {SHOW_PREMIUM_FEATURES && (
                <li>Premium üyeliğiniz varsa iptal edilecek (iade yapılmaz).</li>
              )}
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

const PhotoTab = ({ showNotification, user, onProfileUpdate }: { showNotification: (type: 'success' | 'error', message: string) => void, user: UserType, onProfileUpdate: () => void }) => {
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

const ReferralTab = ({ showNotification, user, onProfileUpdate }: { showNotification: (type: 'success' | 'error', message: string) => void, user: UserType, onProfileUpdate: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);

  const fetchReferrals = async () => {
    setIsLoadingReferrals(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/referral/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (res.ok) setReferredUsers(data.referrals || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingReferrals(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const generateCode = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/referral/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Kod oluşturulamadı');

      showNotification('success', 'Referans kodunuz başarıyla oluşturuldu.');
      onProfileUpdate();
    } catch (e: any) {
      showNotification('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const applyCode = async () => {
    if (referralCodeInput.length !== 6) {
      showNotification('error', 'Lütfen 6 haneli geçerli bir referans kodu girin.');
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/referral/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, referralCode: referralCodeInput })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Hata oluştu, kod geçersiz veya kullanılmış olabilir.');

      showNotification('success', 'Kod başarıyla uygulandı! Premium süreniz uzatıldı.');
      setReferralCodeInput('');
      onProfileUpdate();
    } catch (e: any) {
      showNotification('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="border-b border-indigo-100 pb-4">
        <h3 className="text-xl font-bold text-indigo-700 flex items-center">
          <Gift className="w-6 h-6 mr-2" />
          Referans Sistemi
        </h3>
        <p className="text-sm text-slate-500 mt-1">Arkadaşlarınızı davet edin, premium üyeliğinizi ücretsiz uzatın!</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
        <h4 className="font-bold text-slate-800 mb-2">Benim Referans Kodum</h4>
        {user.referral_code ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-3xl font-mono font-bold text-indigo-600 tracking-widest bg-white inline-block px-8 py-3 rounded-xl border border-indigo-200 shadow-sm">
              {user.referral_code}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(user.referral_code || '');
                showNotification('success', 'Kod kopyalandı!');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow transition"
              title="Kopyala"
            >
              <Copy className="w-5 h-5" />
            </button>
            <p className="text-sm text-slate-500 sm:max-w-xs mt-2 sm:mt-0">
              Bu kodu henüz üye olmamış meslektaşlarınızla paylaşın. Onlar kodu girerek üye olduklarında ikiniz de 1 ay premium kazanırsınız.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Henüz bir referans kodunuz yok. Hemen bir tane oluşturarak meslektaşlarınızı davet etmeye başlayın.</p>
            <button
              onClick={generateCode}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow transition flex items-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Referans Kodu Oluştur
            </button>
          </div>
        )}
      </div>

      {!user.referred_by && (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2">Arkadaşımın Referansını Tanıt</h4>
          <p className="text-sm text-slate-500 mb-4">Size davet gönderen meslektaşınızın 6 haneli kodunu girerek hemen 1 ay premium kazanın.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              maxLength={6}
              value={referralCodeInput}
              onChange={(e) => setReferralCodeInput(e.target.value.replace(/\D/g, ''))}
              className="bg-slate-50 border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg h-12 w-full sm:w-48 text-center text-xl tracking-widest font-mono"
              placeholder="000000"
            />
            <button
              onClick={applyCode}
              disabled={loading || referralCodeInput.length !== 6}
              className={`px-6 py-2 h-12 rounded-lg font-medium transition flex items-center justify-center ${referralCodeInput.length === 6 ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Kodu Uygula
            </button>
          </div>
        </div>
      )}

      {user.referred_by && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm">Tebrikler! Bir arkadaşınızın referans kodunu kullanarak 1 aylık Premium kazandınız.</p>
        </div>
      )}

      <div>
        <h4 className="font-bold text-slate-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-slate-500" /> Davet Ettiğim Kişiler
        </h4>
        {isLoadingReferrals ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-300" />
          </div>
        ) : referredUsers.length > 0 ? (
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 uppercase text-slate-500 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">Katılan Meslektaşınız</th>
                  <th scope="col" className="px-6 py-3 font-medium">Kayıt Tarihi</th>
                  <th scope="col" className="px-6 py-3 font-medium text-right">Kazanılan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {referredUsers.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">{r.full_name}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(r.created_at).toLocaleDateString('tr-TR')}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        +1 Ay Premium
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>Henüz kimseyi davet etmediniz.</p>
          </div>
        )}
      </div>
    </div>
  );
};

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

  // Confirmation Modal State (Centralized)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false, title: '', message: '', onConfirm: () => { }, onCancel: () => { }
  });

  const askConfirmation = (options: { title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title,
      message: options.message,
      onConfirm: () => {
        options.onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
      confirmText: options.confirmText,
      cancelText: options.cancelText
    });
  };

  const tabs = [
    { id: 'personal', label: 'Kişisel Bilgiler', icon: UserIcon, component: <PersonalInfoTab showNotification={showNotification} user={user} onProfileUpdate={onProfileUpdate} /> },
    { id: 'authorization', label: 'Yetki Belgesi Bilgileri', icon: FileText, component: <AuthorizationTab showNotification={showNotification} user={user} onProfileUpdate={onProfileUpdate} /> },
    { id: 'courthouses', label: 'Görev Adliyeleriniz', icon: Gavel, component: <CourthousesTab showNotification={showNotification} askConfirmation={askConfirmation} user={user} onProfileUpdate={onProfileUpdate} /> },
    { id: 'specialization', label: 'Uzmanlık Alanları', icon: Award, component: <SpecializationTab showNotification={showNotification} user={user} onProfileUpdate={onProfileUpdate} /> },
    { id: 'about', label: 'Hakkımda', icon: Info, component: <AboutTab showNotification={showNotification} user={user} onProfileUpdate={onProfileUpdate} /> },
    { id: 'disputes', label: 'Görev Uyuşmazlıkları', icon: Gavel, component: <TaskDisputePage /> },
    { id: 'password', label: 'Şifre Değiştir', icon: Shield, component: <PasswordChangeTab showNotification={showNotification} /> },
    { id: 'photo', label: 'Profil Fotoğrafı', icon: Camera, component: <PhotoTab showNotification={showNotification} user={user} onProfileUpdate={onProfileUpdate} /> },
    { id: 'delete', label: 'Hesabı Sil', icon: Trash2, component: <DeleteAccountTab showNotification={showNotification} askConfirmation={askConfirmation} user={user} /> },
    { id: 'notifications', label: 'Bildirim Ayarları', icon: Bell, component: <NotificationSettingsTab user={user} onProfileUpdate={onProfileUpdate} showNotification={showNotification} askConfirmation={askConfirmation} /> },
    { id: 'referral', label: 'Referans Sistemi', icon: Gift, component: <ReferralTab showNotification={showNotification} user={user} onProfileUpdate={onProfileUpdate} /> },
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

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">{confirmModal.title}</h3>
            <p className="text-sm text-center text-slate-500 mb-6">{confirmModal.message}</p>
            <div className="flex space-x-3">
              <button onClick={confirmModal.onCancel} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">
                {confirmModal.cancelText || 'Vazgeç'}
              </button>
              <button onClick={confirmModal.onConfirm} className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200">
                {confirmModal.confirmText || 'Evet, Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

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
