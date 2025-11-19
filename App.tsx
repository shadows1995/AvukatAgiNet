
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { 
  Briefcase, 
  Gavel, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Search, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Loader2,
  DollarSign,
  Menu,
  X,
  Users,
  Building2,
  ArrowRight,
  ChevronDown,
  Settings,
  Save,
  Camera,
  Lock,
  Bell,
  FileText,
  Info,
  Eye,
  CreditCard,
  Check,
  Timer,
  Phone,
  Send,
  Mail,
  Award,
  Globe
} from 'lucide-react';
import { User, Job, UserRole, JobType, Application, Notification } from './types';
import { COURTHOUSES, TURKISH_CITIES } from './data/courthouses';
import { refineJobDescription } from './services/geminiService';
import { auth, db } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  updateDoc,
  Timestamp,
  increment,
  getDocs,
  or,
  and
} from 'firebase/firestore';

// --- COMPONENTS ---

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

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path ? "text-primary-600 font-semibold bg-primary-50 rounded-md px-3 py-2" : "text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-md px-3 py-2 transition";

  // Listen for Notifications
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"), 
      where("userId", "==", user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      snapshot.forEach(doc => {
        notifs.push({ id: doc.id, ...doc.data() } as Notification);
      });
      
      // Sort client-side
      notifs.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleReadNotifications = async () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      notifications.forEach(async (n) => {
        if (!n.read && n.id) {
           await updateDoc(doc(db, "notifications", n.id), { read: true });
        }
      });
    }
  };

  const goToProfile = () => {
    if(user) navigate(`/profile/${user.uid}`);
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>
            {user && (
              <div className="hidden md:flex ml-10 space-x-4">
                <Link to="/dashboard" className={isActive('/dashboard')}>İlanlar</Link>
                <Link to="/my-jobs" className={isActive('/my-jobs')}>İşlerim</Link>
                <Link to="/create-job" className={isActive('/create-job')}>İlan Ver</Link>
                {!user.isPremium && (
                  <Link to="/premium" className="flex items-center text-secondary-600 font-medium bg-secondary-50 px-3 py-2 rounded-md hover:bg-secondary-100 transition">
                    <Sparkles className="w-4 h-4 mr-1" /> Premium
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.isPremium && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full">
                    PREMIUM
                  </span>
                )}
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                  
                  {/* Notification Bell */}
                  <div className="relative">
                    <button 
                      onClick={handleReadNotifications}
                      className="p-2 text-slate-400 hover:text-primary-600 transition relative"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white"></span>
                      )}
                    </button>
                    
                    {showNotifs && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700 text-sm">
                          Bildirimler
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">Bildiriminiz yok.</div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className={`p-3 border-b border-slate-50 hover:bg-slate-50 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                <div className="text-sm font-medium text-slate-800">{n.title}</div>
                                <div className="text-xs text-slate-500 mt-1">{n.message}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-right hidden lg:block cursor-pointer" onClick={goToProfile}>
                    <p className="text-sm font-medium text-slate-900 hover:text-primary-600 transition">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.baroCity} Barosu</p>
                  </div>
                  <div onClick={goToProfile} className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-primary-50 cursor-pointer hover:border-primary-200 transition">
                     {user.fullName.charAt(0)}
                  </div>
                  <Link to="/settings" className="p-2 text-slate-400 hover:text-primary-600 transition" title="Ayarlar">
                    <Settings className="h-5 w-5" />
                  </Link>
                  <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition" title="Çıkış Yap">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium px-3 py-2">
                  Giriş Yap
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm hover:shadow-md">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
             <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
               {isOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && user && (
        <div className="md:hidden bg-white border-t border-slate-100 px-2 pt-2 pb-3 space-y-1">
          <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">İlanlar</Link>
          <Link to="/create-job" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">İlan Ver</Link>
          <Link to="/my-jobs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">İşlerim</Link>
          <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Ayarlar</Link>
          <Link to={`/profile/${user.uid}`} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Profilim</Link>
          <button onClick={onLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50">Çıkış Yap</button>
        </div>
      )}
    </nav>
  );
};

// --- PAGES ---

const LandingPage = () => (
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
              Yapay zeka desteği ile saniyeler içinde detaylı görev ilanı oluşturun. Şehir, adliye ve ücret bilgisini girin, gerisini bize bırakın.
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

const ProfilePage = ({ currentUser }: { currentUser: User }) => {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [canViewContact, setCanViewContact] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        // 1. Fetch User Profile
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileUser({ uid: docSnap.id, ...docSnap.data() } as User);
        }

        // 2. Check Relationship (for contact info visibility)
        // Logic: Can view if (Current User is Owner AND Profile User is Selected Applicant) OR (Current User is Selected Applicant AND Profile User is Owner)
        // We check 'jobs' collection.
        
        // Case A: I am owner, looking at applicant
        const q1 = query(
          collection(db, "jobs"), 
          where("createdBy", "==", currentUser.uid),
          where("selectedApplicant", "==", userId),
          where("status", "in", ["in_progress", "completed"])
        );

        // Case B: I am applicant, looking at owner
        const q2 = query(
           collection(db, "jobs"),
           where("createdBy", "==", userId),
           where("selectedApplicant", "==", currentUser.uid),
           where("status", "in", ["in_progress", "completed"])
        );

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        if (!snap1.empty || !snap2.empty || currentUser.uid === userId) {
          setCanViewContact(true);
        } else {
           setCanViewContact(false);
        }

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, currentUser]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary-600"/></div>;
  if (!profileUser) return <div className="text-center p-20 text-slate-500">Kullanıcı bulunamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
              <div className="h-full w-full rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-3xl font-bold">
                {profileUser.fullName.charAt(0)}
              </div>
            </div>
            <div className="md:ml-6 mt-4 md:mt-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                {profileUser.title || 'Av.'} {profileUser.fullName}
                {profileUser.isPremium && <Sparkles className="w-5 h-5 text-amber-500 ml-2 fill-current" />}
              </h1>
              <p className="text-slate-500 flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" /> {profileUser.city} • {profileUser.baroCity} Barosu ({profileUser.baroNumber})
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
               <Star className="w-5 h-5 text-amber-500 fill-current mr-2" />
               <span className="text-lg font-bold text-amber-700">{profileUser.rating ? profileUser.rating.toFixed(1) : '0.0'}</span>
               <span className="text-sm text-amber-600 ml-1">/ 5.0</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Hakkında</h3>
            <p className="text-slate-600 leading-relaxed">
              {profileUser.aboutMe || "Bu kullanıcı henüz kendini tanıtan bir yazı eklememiş."}
            </p>
          </div>

          {/* Specializations */}
          <div className="mb-6">
             <h3 className="text-lg font-semibold text-slate-800 mb-3">Uzmanlık Alanları</h3>
             <div className="flex flex-wrap gap-2">
               {profileUser.specializations && profileUser.specializations.length > 0 ? (
                 profileUser.specializations.map(spec => (
                   <span key={spec} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                     {spec}
                   </span>
                 ))
               ) : (
                 <span className="text-slate-400 italic text-sm">Belirtilmemiş</span>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Contact Information - Conditional Visibility */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden ${canViewContact ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'}`}>
         <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-primary-600" /> İletişim Bilgileri
            </h3>
         </div>
         <div className="p-6">
            {canViewContact ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                       <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                       <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Telefon</p>
                       <p className="text-lg font-bold text-slate-800">{profileUser.phone || 'Belirtilmemiş'}</p>
                    </div>
                 </div>
                 <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                       <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                       <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">E-Posta</p>
                       <p className="text-lg font-bold text-slate-800">{profileUser.email}</p>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="text-center py-8">
                 <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                 <h4 className="text-slate-800 font-medium mb-1">İletişim Bilgileri Gizli</h4>
                 <p className="text-sm text-slate-500 max-w-md mx-auto">
                   Telefon ve E-posta bilgilerini görüntüleyebilmek için bu kullanıcı ile aranızda 
                   onaylanmış bir görev (İşveren veya Çalışan olarak) bulunmalıdır.
                 </p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

const Dashboard = ({ user }: { user: User }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    // Real-time job updates
    // Removed orderBy to prevent index issues, filtering client side if needed
    const q = query(collection(db, "jobs"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData: Job[] = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ jobId: doc.id, ...doc.data() } as Job);
      });
      
      // Client-side sorting
      jobsData.sort((a, b) => {
         const timeA = a.createdAt?.seconds || 0;
         const timeB = b.createdAt?.seconds || 0;
         return timeB - timeA;
      });

      setJobs(jobsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Track applied jobs by user
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "applications"), where("applicantId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.data().jobId);
      setAppliedJobIds(ids);
    });
    return () => unsubscribe();
  }, [user]);

  const userCourthouses = user.preferredCourthouses || [];

  const filteredJobs = jobs.filter(job => {
    // 1. Her zaman kendi ilanlarımızı görelim
    if (job.createdBy === user.uid) return true;

    // 2. Başkasının ilanları "açık" durumda olmalı
    if (job.status !== 'open') return false;

    // 3. Görev Tipi Filtresi
    if (filterType !== 'ALL' && job.jobType !== filterType) return false;
    
    // 4. KRİTİK: Sadece kullanıcının seçtiği adliyelerdeki ilanlar
    return userCourthouses.includes(job.courthouse);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">İlanlar</h2>
          <p className="text-slate-500 text-sm mt-1">Seçtiğiniz adliyelerdeki aktif görevler</p>
        </div>
        <Link to="/create-job" className="mt-4 md:mt-0 flex items-center bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <PlusCircle className="h-5 w-5 mr-2" /> Yeni İlan Oluştur
        </Link>
      </div>

      {/* Warning if no courthouses selected */}
      {userCourthouses.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Henüz görev almak istediğiniz bir adliye seçmediniz. Size uygun ilanları görebilmek için 
                <Link to="/settings" className="font-medium underline text-yellow-800 ml-1 hover:text-yellow-900">
                  Ayarlar sayfasından seçim yapınız.
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
            <Briefcase className="h-5 w-5 text-slate-400" />
            <select 
                className="bg-transparent border-none focus:ring-0 text-slate-700 font-medium text-sm pr-8 cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
            >
                <option value="ALL">Tüm Görev Tipleri</option>
                {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            </div>
        </div>
        
        <div className="text-sm text-slate-500">
             {userCourthouses.length > 0 ? (
                 <span className="flex items-center">
                     <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                     <strong>{userCourthouses.length}</strong> adliye izleniyor
                 </span>
             ) : (
                 <span>Tüm Türkiye (Filtresiz)</span>
             )}
        </div>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Şu an için uygun ilan bulunamadı.</p>
              <p className="text-sm mt-2 text-center max-w-md">
                 Seçtiğiniz adliyelerde ({userCourthouses.join(', ') || 'Yok'}) henüz açık bir görev yok veya kriterlerinize uymuyor.
                 <br/>
                 <Link to="/settings" className="text-primary-600 hover:underline mt-1 inline-block">Çalışma alanlarınızı genişletmek ister misiniz?</Link>
              </p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <JobCard 
                key={job.jobId} 
                job={job} 
                user={user} 
                hasApplied={appliedJobIds.includes(job.jobId || '')}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const ApplyModal = ({ job, user, onClose }: { job: Job, user: User, onClose: () => void }) => {
  const [message, setMessage] = useState('İlanınızla ilgileniyorum. Müsaitim.');
  const [bid, setBid] = useState(job.offeredFee.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Check if already applied
      const q = query(
        collection(db, "applications"), 
        where("jobId", "==", job.jobId),
        where("applicantId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        alert("Bu ilana zaten başvurdunuz.");
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
      await updateDoc(doc(db, "jobs", job.jobId!), {
        applicationsCount: increment(1)
      });

      // 4. Notify Job Owner
      await addDoc(collection(db, "notifications"), {
        userId: job.createdBy,
        title: "Yeni Başvuru Geldi 📢",
        message: `${user.fullName}, "${job.title}" ilanınıza başvurdu.`,
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
            <p className="text-sm text-slate-500">Başvurulan İlan:</p>
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

const JobCard: React.FC<{ job: Job, user: User, hasApplied?: boolean }> = ({ job, user, hasApplied }) => {
  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const isPremium = user.isPremium || user.role === UserRole.ADMIN;
  const isOwner = job.createdBy === user.uid;
  const isSelected = job.selectedApplicant === user.uid;
  
  const formattedFee = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(job.offeredFee);

  const handleApplyClick = () => {
    if (isPremium) {
      setShowApplyModal(true);
    } else {
      navigate('/premium');
    }
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 border flex flex-col h-full group ${job.isUrgent ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'}`}>
        {job.isUrgent && (
          <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-1 border-b border-red-100 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1" /> ACİL İLAN - 5 DK
          </div>
        )}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              job.jobType === JobType.DURUSMA ? 'bg-blue-50 text-blue-700' :
              job.jobType === JobType.ICRA ? 'bg-orange-50 text-orange-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {job.jobType}
            </span>
            <span className="text-lg font-bold text-primary-600">{formattedFee}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition">
            {job.title}
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-slate-500 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-slate-400" /> 
              <span className="truncate">{job.city} • {job.courthouse}</span>
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <Clock className="h-4 w-4 mr-2 text-slate-400" /> 
              {job.date} | {job.time}
            </div>
             <div className="flex items-center text-slate-500 text-sm">
              <Users className="h-4 w-4 mr-2 text-slate-400" /> 
              {job.applicationsCount || 0} Başvuru
            </div>
          </div>
          
          <div className="flex items-center pt-4 border-t border-slate-50">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold ring-2 ring-white cursor-pointer" onClick={() => navigate(`/profile/${job.createdBy}`)}>
              {job.ownerName ? job.ownerName.charAt(0) : '?'}
            </div>
            <div className="ml-3">
              <p 
                onClick={() => navigate(`/profile/${job.createdBy}`)}
                className="text-sm font-medium text-slate-900 cursor-pointer hover:text-primary-600 hover:underline"
              >
                {job.ownerName || 'Bilinmeyen Kullanıcı'}
              </p>
              {isOwner && <span className="text-xs text-primary-600 font-semibold">(Sizin İlanınız)</span>}
            </div>
          </div>

          {/* Selected Applicant View */}
          {isSelected && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in zoom-in duration-300">
              <div className="flex items-center text-green-800 font-bold text-sm mb-1">
                 <CheckCircle className="w-4 h-4 mr-1.5" /> TEBRİKLER! GÖREV SİZİN
              </div>
              <div className="text-xs text-green-700 mb-2">İlan sahibi ile iletişime geçebilirsiniz.</div>
              <button 
                onClick={() => navigate(`/profile/${job.createdBy}`)}
                className="w-full text-center bg-white border border-green-200 text-green-700 text-xs font-bold py-1.5 rounded hover:bg-green-50 transition"
              >
                İletişim Bilgilerini Gör
              </button>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
          {isOwner ? (
            <Link to="/my-jobs" className="w-full flex justify-center items-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm font-semibold text-slate-600 hover:bg-white hover:text-primary-600 transition">
              Yönet
            </Link>
          ) : (
            <button 
              onClick={handleApplyClick}
              disabled={hasApplied}
              className={`w-full flex justify-center items-center px-4 py-2.5 rounded-lg shadow-sm text-sm font-semibold text-white transition duration-200 ${
                hasApplied 
                  ? 'bg-slate-400 cursor-not-allowed'
                  : isPremium 
                    ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-200' 
                    : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              {hasApplied 
                ? 'Başvuru Yapıldı' 
                : isPremium 
                  ? 'Hemen Başvur' 
                  : 'Premium ile Başvur'}
            </button>
          )}
        </div>
      </div>
      
      {showApplyModal && (
        <ApplyModal job={job} user={user} onClose={() => setShowApplyModal(false)} />
      )}
    </>
  );
};

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [_, setTicker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "jobs"), where("createdBy", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((doc) => {
        jobsData.push({ jobId: doc.id, ...doc.data() } as Job);
      });

      jobsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setMyJobs(jobsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const fetchApplications = async (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
    if (expandedJobId === jobId) return;

    setLoadingApps(true);
    try {
      const q = query(collection(db, "applications"), where("jobId", "==", jobId));
      const snapshot = await getDocs(q);
      const apps: Application[] = [];
      snapshot.forEach(doc => apps.push({ applicationId: doc.id, ...doc.data() } as Application));
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleSelectApplicant = async (job: Job, app: Application) => {
    if (!confirm(`Av. ${app.applicantName} isimli avukata görevi vermek istediğinize emin misiniz?`)) return;

    try {
      // 1. Update Job with selected applicant and status
      await updateDoc(doc(db, "jobs", job.jobId!), {
        selectedApplicant: app.applicantId,
        status: 'in_progress'
      });

      // 2. Update Application Status (CRITICAL FIX)
      await updateDoc(doc(db, "applications", app.applicationId!), {
        status: 'accepted'
      });

      // 3. Send Notification
      await addDoc(collection(db, "notifications"), {
        userId: app.applicantId,
        title: "Başvurunuz Kabul Edildi! 🎉",
        message: `Tebrikler! "${job.title}" ilanı için seçildiniz. İlan sahibiyle iletişime geçebilirsiniz.`,
        type: "success",
        read: false,
        createdAt: serverTimestamp()
      });

      alert("Görev ataması başarıyla yapıldı!");
    } catch (error) {
      console.error("Error selecting applicant:", error);
      alert("Hata oluştu.");
    }
  };

  const getTimeLeft = (deadline: any) => {
    if (!deadline) return 0;
    const deadlineDate = deadline.toDate ? deadline.toDate() : new Date(deadline);
    const diff = deadlineDate.getTime() - new Date().getTime();
    return diff > 0 ? diff : 0;
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Yayınladığım İlanlar</h2>
      
      <div className="space-y-4">
        {myJobs.length === 0 && <p className="text-slate-500">Henüz ilan yayınlamadınız.</p>}
        {myJobs.map(job => {
          const timeLeft = getTimeLeft(job.applicationDeadline);
          const isSelectionLocked = timeLeft > 0;
          
          return (
            <div key={job.jobId} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                       <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                         job.status === 'open' ? 'bg-green-100 text-green-700' : 
                         job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                         'bg-gray-100 text-gray-700'
                       }`}>
                         {job.status === 'open' ? 'Başvuruya Açık' : job.status === 'in_progress' ? 'Atandı' : job.status}
                       </span>
                       {job.isUrgent && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">ACİL</span>}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.city} • {job.courthouse} • {job.date}</p>
                 </div>
                 
                 <div className="flex flex-col items-end space-y-2">
                    {job.status === 'open' && (
                      <div className={`flex items-center font-mono text-sm px-3 py-1 rounded-md ${isSelectionLocked ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                         <Timer className="w-4 h-4 mr-2" />
                         {isSelectionLocked ? (
                           <span>Başvurular Toplanıyor: {formatTime(timeLeft)}</span>
                         ) : (
                           <span>Süre Doldu - Seçim Yapabilirsiniz</span>
                         )}
                      </div>
                    )}

                    <button 
                      onClick={() => fetchApplications(job.jobId!)}
                      className="flex items-center text-primary-600 font-medium hover:bg-primary-50 px-4 py-2 rounded-lg transition"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Başvuruları Yönet {expandedJobId === job.jobId ? <ChevronDown className="ml-1 w-4 h-4 rotate-180" /> : <ChevronDown className="ml-1 w-4 h-4" />}
                    </button>
                 </div>
              </div>

              {expandedJobId === job.jobId && (
                <div className="bg-slate-50 border-t border-slate-200 p-6 animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-slate-800 mb-4">Gelen Başvurular ({applications.length})</h4>
                  {loadingApps ? (
                    <Loader2 className="animate-spin text-slate-400" />
                  ) : applications.length === 0 ? (
                    <p className="text-sm text-slate-500">Henüz başvuru yok.</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.map(app => {
                        const isSelected = job.selectedApplicant === app.applicantId;
                        
                        return (
                          <div key={app.applicationId} className={`bg-white p-4 rounded-lg border ${isSelected ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-200'} flex justify-between items-center`}>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span 
                                  onClick={() => navigate(`/profile/${app.applicantId}`)}
                                  className="font-bold text-slate-800 cursor-pointer hover:text-primary-600 hover:underline"
                                >
                                  {app.applicantName}
                                </span>
                                <span className="flex items-center text-amber-500 text-xs">
                                   <Star className="w-3 h-3 fill-current mr-0.5" />
                                   {app.applicantRating ? app.applicantRating.toFixed(1) : '0.0'}
                                </span>
                                {isSelected && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">SEÇİLDİ</span>}
                              </div>
                              <p className="text-sm text-slate-600 mt-1">"{app.message}"</p>
                              <div className="flex items-center mt-2 text-xs text-slate-500 space-x-4">
                                <span className="flex items-center text-primary-600 font-bold"><DollarSign className="w-3 h-3 mr-1"/> Teklif: {app.proposedFee} TL</span>
                              </div>
                            </div>
                            
                            {!isSelected && (
                              <button
                                onClick={() => handleSelectApplicant(job, app)}
                                disabled={isSelectionLocked}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                                  isSelectionLocked 
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                  : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                              >
                                {isSelectionLocked ? 'Süre Bekleniyor' : 'Görevi Ver'}
                              </button>
                            )}
                            {isSelected && (
                              <button 
                                onClick={() => navigate(`/profile/${app.applicantId}`)}
                                className="text-green-600 font-bold text-sm flex items-center hover:underline"
                              >
                                <CheckCircle className="w-5 h-5 mr-1" /> Profiline Git
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

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

const SettingsPage = ({ user }: { user: User }) => {
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

// Premium Page and Register/Login components
const PremiumPage = ({ user }: { user: User }) => {
  const handleUpgrade = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        isPremium: true,
        role: UserRole.PREMIUM
      });
      alert("Tebrikler! Hesabınız Premium'a yükseltildi.");
    } catch (error) {
      console.error("Error upgrading user:", error);
      alert("Yükseltme sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-100 text-secondary-700 text-sm font-semibold mb-4">
          <Star className="w-4 h-4 mr-2 fill-current" /> Premium Üyelik
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Mesleğinizi Zirveye Taşıyın</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Premium ayrıcalıklar ile iş hacminizi artırın, güvenilirliğinizi kanıtlayın ve daha fazla kazanın.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 relative z-0">
          <h3 className="text-xl font-bold text-slate-800">Standart Üyelik</h3>
          <p className="text-4xl font-bold text-slate-900 mt-4">Ücretsiz</p>
          <p className="text-slate-500 mt-2">İlan açmak ve ağı kullanmak için</p>
          <hr className="my-8 border-slate-100" />
          <ul className="space-y-4">
            <li className="flex items-center text-slate-700"><CheckCircle className="h-5 w-5 text-green-500 mr-3" /> Sınırsız Görev İlanı Açma</li>
            <li className="flex items-center text-slate-700"><CheckCircle className="h-5 w-5 text-green-500 mr-3" /> Başvuruları Görüntüleme</li>
            <li className="flex items-center text-slate-400"><X className="h-5 w-5 mr-3" /> İlanlara Başvuru Yapma</li>
            <li className="flex items-center text-slate-400"><X className="h-5 w-5 mr-3" /> Onaylı Profil Rozeti</li>
          </ul>
          <button disabled className="w-full mt-8 py-3.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-sm tracking-wide cursor-default">MEVCUT PLAN</button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white p-10 rounded-2xl border border-secondary-200 shadow-xl relative z-10 transform md:scale-105">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-2xl"></div>
          <div className="absolute top-4 right-4">
            <span className="bg-secondary-100 text-secondary-700 text-xs font-bold px-3 py-1.5 rounded-full">EN POPÜLER</span>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900">Premium Avukat</h3>
          <div className="flex items-baseline mt-4">
             <p className="text-5xl font-bold text-primary-600">₺249</p>
             <p className="text-slate-500 ml-2">/ay</p>
          </div>
          <p className="text-slate-500 mt-2">Aktif çalışmak ve gelir elde etmek için</p>
          
          <hr className="my-8 border-slate-100" />
          
          <ul className="space-y-5">
            <li className="flex items-center text-slate-800 font-medium"><CheckCircle className="h-5 w-5 text-primary-600 mr-3" /> Tüm Standart Özellikler</li>
            <li className="flex items-center text-slate-800 font-medium"><CheckCircle className="h-5 w-5 text-primary-600 mr-3" /> Sınırsız İlana Başvuru Hakkı</li>
            <li className="flex items-center text-slate-800 font-medium"><CheckCircle className="h-5 w-5 text-primary-600 mr-3" /> "Premium" Profil Rozeti</li>
            <li className="flex items-center text-slate-800 font-medium"><CheckCircle className="h-5 w-5 text-primary-600 mr-3" /> Öncelikli Destek Hattı</li>
          </ul>
          
          {user.isPremium ? (
             <button disabled className="w-full mt-10 py-4 rounded-xl bg-green-600 text-white font-bold shadow-lg cursor-default">
               ZATEN PREMIUM ÜYESİNİZ
             </button>
          ) : (
             <button 
              onClick={handleUpgrade}
              className="w-full mt-10 py-4 rounded-xl bg-primary-600 text-white font-bold shadow-lg hover:bg-primary-700 hover:shadow-primary-500/30 transition transform hover:-translate-y-1"
            >
              PREMIUM'A GEÇ (DEMO)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
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
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
            <input type="email" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Baro / Şehir</label>
               <select className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.barCity} onChange={e => setFormData({...formData, barCity: e.target.value})}>
                 {TURKISH_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sicil No</label>
              <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.barNo} onChange={e => setFormData({...formData, barNo: e.target.value})} />
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
            <input type="password" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-10" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
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

const LoginPage = () => {
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

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const unsubDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...docSnap.data() } as User);
          }
        });
        setAuthLoading(false);
        return () => unsubDoc();
      } else {
        setUser(null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) { console.error(error); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 text-primary-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/create-job" element={user ? <CreateJob user={user} /> : <Navigate to="/login" />} />
          <Route path="/premium" element={user ? <PremiumPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <SettingsPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/my-jobs" element={user ? <MyJobs /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={user ? <ProfilePage currentUser={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      {!user && <footer className="bg-slate-50 text-slate-500 py-8 border-t border-slate-200"><div className="max-w-7xl mx-auto px-4 text-center"><p>© 2024 AvukatNet. Tüm hakları saklıdır.</p></div></footer>}
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
