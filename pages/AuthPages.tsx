import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gavel, ArrowRight, Activity, CheckCircle, X, Star, ShieldCheck, Briefcase, Loader2, AlertCircle, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';
import { supabase } from '../supabaseClient';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { useNotification } from '../contexts/NotificationContext';
import { useAlert } from '../contexts/AlertContext';

import InteractiveSphere from '../components/InteractiveSphere';

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className="bg-primary-600 text-white p-1.5 rounded-lg">
      <Gavel className="h-6 w-6" />
    </div>
    <span className="font-bold text-xl tracking-tight text-slate-800">
      Avukat<span className="text-primary-600">Ağı</span>
    </span>
  </div>
);

export const LandingPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    {/* Hero Section */}
    {/* Hero Section */}
    <div className="bg-slate-50 pt-24 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-primary-100/50 to-transparent opacity-70 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-to-tr from-secondary-100/50 to-transparent opacity-70 blur-3xl"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-primary-100 text-primary-700 font-bold text-sm mb-8 shadow-glow animate-bounce">
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary-500 mr-2 animate-pulse"></span>
          Türkiye'nin En Büyük Hukuk Ağı
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[500px] -z-10 opacity-50 pointer-events-none">
            <InteractiveSphere dotColor="#d946ef" lineColor="#4f46e5" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight relative z-10">
            Meslektaşlarınızla <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 animate-text">Güçlerinizi Birleştirin</span>
          </h1>
        </div>

        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Duruşma, dosya inceleme ve haciz işlemleri için güvenilir avukatlarla
          anında eşleşin. Premium üyelik ile iş ağınızı genişletin.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/register" className="px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-2xl font-bold text-lg shadow-glow hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
            Ücretsiz Üye Ol
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/login" className="px-10 py-4 bg-white border border-slate-200 text-slate-700 hover:text-primary-600 hover:border-primary-200 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            Sistemi İncele
          </Link>
        </div>
      </div>
    </div>

    {/* Stats Section */}
    {/* Stats Section */}
    <div className="bg-white border-y border-slate-100 relative z-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="text-4xl md:text-5xl font-extrabold text-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300">595</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Toplam Adliye</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="text-4xl md:text-5xl font-extrabold text-secondary-500 mb-2 group-hover:scale-110 transition-transform duration-300">49.881</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Kayıtlı Avukat</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-2 group-hover:scale-110 transition-transform duration-300">12.543</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tamamlanan Görev</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="text-4xl md:text-5xl font-extrabold text-primary-800 mb-2 group-hover:scale-110 transition-transform duration-300">2.847</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Aktif Premium Üye</div>
          </div>
        </div>
      </div>
    </div>

    {/* Feature Cards */}
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Process Infographic */}
        <div className="mb-20">
          <img
            src="/process-infographic.png"
            alt="Avukat Görevlendirme Süreci"
            className="w-full max-w-5xl mx-auto rounded-2xl shadow-xl border border-slate-200"
          />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Neden AvukatAğı?</h2>
          <p className="mt-4 text-lg text-slate-600">Tek platformda güvenli ve hızlı hukuki işbirliği</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-600 group-hover:text-white">
              <Briefcase className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Kolay Görev Oluşturma</h3>
            <p className="text-slate-600 leading-relaxed">
              Kolay arayüz ile saniyeler içinde detaylı görev oluşturun. Şehir, adliye ve ücret bilgisini girin, gerisini bize bırakın.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-600 group-hover:text-white">
              <ShieldCheck className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">%100 Avukat Ağı</h3>
            <p className="text-slate-600 leading-relaxed">
              Sadece baro levhasına kayıtlı ve kimliği doğrulanmış avukatlar sisteme katılabilir. Güvenli bir ortamda çalışın.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary-100 group hover:-translate-y-2">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-600 group-hover:text-white">
              <Star className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Puanlama Sistemi</h3>
            <p className="text-slate-600 leading-relaxed">
              Tamamlanan işler sonrası meslektaşlarınızı puanlayın. Yüksek puanlı avukatlarla çalışarak riskleri minimize edin.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);




export const RegisterPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    barNo: '',
    barCity: 'İstanbul'
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      showNotification('warning', "Lütfen Kullanıcı Sözleşmesi ve Gizlilik Politikasını onaylayın.");
      return;
    }

    // Password Complexity Check
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      showNotification('error', "Şifreniz en az 6 karakter olmalı ve en az bir harf ile bir rakam içermelidir.");
      return;
    }

    setIsLoading(true);
    try {
      // Normalize phone number (remove spaces, parentheses, etc.)
      const cleanPhone = formData.phone.replace(/\s/g, '').replace(/[()]/g, '');

      // Use RPC function to check duplicates (bypasses RLS)
      const { data: duplicateCheck, error: rpcError } = await supabase
        .rpc('check_duplicate_user', {
          check_email: formData.email,
          check_phone: cleanPhone
        });

      if (rpcError) {
        console.error("Error checking duplicates:", rpcError);
        // Fail open or handle error
      } else if (duplicateCheck) {
        if (duplicateCheck.email_exists) {
          showNotification('error', "Bu e-posta adresi zaten kullanılıyor.");
          setIsLoading(false);
          return;
        }

        if (duplicateCheck.phone_exists) {
          showNotification('error', "Bu telefon numarası zaten kayıtlı.");
          setIsLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Update additional fields that might not be handled by trigger or need explicit setting
        const { error: updateError } = await supabase.from('users').update({
          baro_number: formData.barNo,
          baro_city: formData.barCity,
          city: formData.barCity,
          phone: cleanPhone, // Save normalized phone
          role: UserRole.FREE,
          rating: 0,
          completed_jobs: 0,
          job_status: 'active'
        }).eq('uid', data.user.id);

        if (updateError) {
          console.error("Error updating user profile:", updateError);
          // Continue anyway as the user is created
        }

        showAlert({
          title: "Kayıt Başarılı",
          message: "E-mail adresinize Doğrulama maili gönderildi. Lütfen kutunuzu kontrol ediniz.",
          type: "success",
          confirmText: "Giriş Yap",
          onConfirm: () => navigate('/login')
        });
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      showNotification('error', "Kayıt hatası: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Gavel className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Hesap Oluştur</h2>
          <p className="text-slate-500 mt-2">Baro sicil numaranız ile hemen katılın</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <input type="email" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefon Numarası</label>
            <input type="tel" required placeholder="0555 555 55 55" className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Baro / Şehir</label>
              <select className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.barCity} onChange={e => setFormData({ ...formData, barCity: e.target.value })}>
                {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sicil No</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.barNo} onChange={e => setFormData({ ...formData, barNo: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <input type="password" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-slate-700">
                <Link to="/terms" className="text-primary-600 hover:underline" target="_blank">Kullanıcı Sözleşmesi</Link>'ni ve <Link to="/privacy" className="text-primary-600 hover:underline" target="_blank">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
              </label>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 disabled:opacity-70">
            {isLoading ? <Loader2 className="animate-spin inline h-5 w-5" /> : 'Kayıt Ol'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          Zaten hesabınız var mı? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError('Giriş yapılamadı. E-posta veya şifre hatalı.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 z-10">
        <div className="mb-10">
          <Link to="/" className="inline-block">
            <Logo className="scale-110 origin-left" />
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">Tekrar Hoşgeldiniz</h2>
        <p className="text-slate-500 mb-8">Lütfen hesabınıza giriş yapın.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 h-12" placeholder="ornek@avukat.com" />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">Şifre</label>
              <Link to="/forgot-password" class="text-xs text-primary-600 hover:underline font-medium">Şifremi Unuttum?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 h-12" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-primary-600 text-white py-3.5 rounded-lg font-bold hover:bg-primary-700 transition duration-200 shadow-lg shadow-primary-500/30 disabled:opacity-70">
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Giriş Yap'}
          </button>
        </form>
        <p className="mt-10 text-center text-sm text-slate-500">
          Hesabınız yok mu? <Link to="/register" className="text-primary-600 font-bold hover:underline">Hemen Kayıt Ol</Link>
        </p>
      </div>
      {/* Right Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 animate-float">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Canlı Görevler</h3>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Canlı Akış</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs mr-3 flex-shrink-0">AK</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Av. Ahmet K. <span className="text-slate-400 font-normal">İstanbul</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">Duruşma Yetki Belgesi • 1.500₺</p>
                  <p className="text-[10px] text-slate-400 mt-1">Az önce yayınlandı</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs mr-3 flex-shrink-0">ZD</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Av. Zeynep D. <span className="text-slate-400 font-normal">Ankara</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">Dosya İnceleme • 750₺</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 dakika önce</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur p-4 rounded-xl border border-white/50">
              <div className="text-2xl font-bold text-primary-700">12,542</div>
              <div className="text-sm text-slate-600">Kayıtlı Avukat</div>
            </div>
            <div className="bg-white/60 backdrop-blur p-4 rounded-xl border border-white/50">
              <div className="text-2xl font-bold text-primary-700">595</div>
              <div className="text-sm text-slate-600">Aktif Adliye</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      setMessage({
        text: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
        type: 'success'
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      setMessage({
        text: 'Bir hata oluştu: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Şifremi Unuttum</h2>
          <p className="text-slate-500 mt-2">E-posta adresinizi girerek şifrenizi sıfırlayabilirsiniz.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ornek@avukat.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sıfırlama Bağlantısı Gönder'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <Link to="/login" className="text-primary-600 font-semibold hover:underline flex items-center justify-center gap-1">
            <ArrowRight className="w-4 h-4 rotate-180" /> Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (which happens after clicking the email link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setMessage({
          text: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen tekrar deneyin.',
          type: 'error'
        });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ text: 'Şifreler eşleşmiyor.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) throw error;

      setMessage({
        text: 'Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...',
        type: 'success'
      });

      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      console.error("Update password error:", error);
      setMessage({
        text: 'Bir hata oluştu: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Yeni Şifre Belirle</h2>
          <p className="text-slate-500 mt-2">Lütfen hesabınız için yeni bir şifre girin.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Şifreyi Güncelle'}
          </button>
        </form>
      </div>
    </div>
  );
};
