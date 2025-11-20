import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gavel, ArrowRight, Activity, CheckCircle, X, Star, ShieldCheck, Briefcase, Loader2, AlertCircle, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className="bg-primary-600 text-white p-1.5 rounded-lg">
      <Gavel className="h-6 w-6" />
    </div>
    <span className="font-bold text-xl tracking-tight text-slate-800">
      Avukat<span className="text-primary-600">Net</span>
    </span>
  </div>
);

export const LandingPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    {/* Hero Section */}
    <div className="bg-slate-50 pt-20 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-50 to-transparent opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-secondary-50 to-transparent opacity-60"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-primary-100 text-primary-700 font-medium text-sm mb-8 shadow-sm animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2"></span>
          Türkiye'nin En Büyük Hukuk Ağı
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
          Meslektaşlarınızla <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Güçlerinizi Birleştirin</span>
        </h1>

        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Duruşma, dosya inceleme ve haciz işlemleri için güvenilir avukatlarla
          anında eşleşin. Premium üyelik ile iş ağınızı genişletin.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-200 flex items-center justify-center">
            Ücretsiz Üye Ol
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:text-primary-600 hover:border-primary-200 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition duration-200">
            Sistemi İncele
          </Link>
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="bg-white border-y border-slate-100 relative z-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4 transition duration-300 hover:-translate-y-1">
            <div className="text-4xl md:text-5xl font-extrabold text-purple-600 mb-2">595</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Toplam Adliye</div>
          </div>
          <div className="p-4 transition duration-300 hover:-translate-y-1">
            <div className="text-4xl md:text-5xl font-extrabold text-emerald-500 mb-2">49.881</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Kayıtlı Avukat</div>
          </div>
          <div className="p-4 transition duration-300 hover:-translate-y-1">
            <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">12.543</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Tamamlanan Görev</div>
          </div>
          <div className="p-4 transition duration-300 hover:-translate-y-1">
            <div className="text-4xl md:text-5xl font-extrabold text-amber-600 mb-2">2.847</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Aktif Premium Üye</div>
          </div>
        </div>
      </div>
    </div>

    {/* Feature Cards */}
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Neden AvukatNet?</h2>
          <p className="mt-4 text-lg text-slate-600">Tek platformda güvenli ve hızlı hukuki işbirliği</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition duration-300 border border-slate-100 group">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
              <Briefcase className="h-7 w-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Kolay Görev Oluşturma</h3>
            <p className="text-slate-600 leading-relaxed">
              Yapay zeka desteği ile saniyeler içinde detaylı görev oluşturun. Şehir, adliye ve ücret bilgisini girin, gerisini bize bırakın.
            </p>
          </div>

          <div className="p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition duration-300 border border-slate-100 group">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
              <ShieldCheck className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">%100 Avukat Ağı</h3>
            <p className="text-slate-600 leading-relaxed">
              Sadece baro levhasına kayıtlı ve kimliği doğrulanmış avukatlar sisteme katılabilir. Güvenli bir ortamda çalışın.
            </p>
          </div>

          <div className="p-8 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl transition duration-300 border border-slate-100 group">
            <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
              <Star className="h-7 w-7 text-secondary-600" />
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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    barNo: '',
    barCity: 'İstanbul',
    preferredCourthouses: [] as string[]
  });

  const handleCourthouseToggle = (courthouse: string) => {
    setFormData(prev => {
      const current = prev.preferredCourthouses;
      if (current.includes(courthouse)) {
        return { ...prev, preferredCourthouses: current.filter(c => c !== courthouse) };
      } else {
        return { ...prev, preferredCourthouses: [...current, courthouse] };
      }
    });
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, preferredCourthouses: [] }));
  }, [formData.barCity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const userData: User = {
        uid: user.uid,
        email: formData.email,
        fullName: `${formData.firstName} ${formData.lastName}`,
        baroNumber: formData.barNo,
        baroCity: formData.barCity,
        city: formData.barCity,
        preferredCourthouses: formData.preferredCourthouses,
        isPremium: false,
        role: UserRole.FREE,
        rating: 0,
        completedJobs: 0,
        createdAt: serverTimestamp(),
        jobStatus: 'active'
      };

      await setDoc(doc(db, "users", user.uid), userData);
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error signing up:", error);
      alert("Kayıt hatası: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCourthouses = COURTHOUSES[formData.barCity] || [];

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

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Görev Almak İstediğiniz Adliyeler ({formData.barCity})
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Sadece ulaşım sağlayabileceğiniz ve göreve hazır olduğunuz adliyeleri seçiniz.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {currentCourthouses.length > 0 ? (
                currentCourthouses.map(ch => (
                  <label key={ch} className="flex items-center space-x-2 p-2 hover:bg-white rounded cursor-pointer">
                    <input type="checkbox" checked={formData.preferredCourthouses.includes(ch)} onChange={() => handleCourthouseToggle(ch)} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-slate-700">{ch}</span>
                  </label>
                ))
              ) : (
                <div className="col-span-2 text-center text-sm text-slate-400 italic py-2">
                  Bu şehir için kayıtlı adliye bulunamadı.
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <input type="password" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
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
      await signInWithEmailAndPassword(auth, email, password);
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
              <a href="#" className="text-xs text-primary-600 hover:underline font-medium">Şifremi Unuttum?</a>
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
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 animate-float">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Canlı Görevler</h3>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Canlı Akış</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-3 flex-shrink-0">AK</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Av. Ahmet K. <span className="text-slate-400 font-normal">İstanbul</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">Duruşma Yetki Belgesi • 1.500₺</p>
                  <p className="text-[10px] text-slate-400 mt-1">Az önce yayınlandı</p>
                </div>
              </div>
              <div className="flex items-start p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs mr-3 flex-shrink-0">ZD</div>
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
