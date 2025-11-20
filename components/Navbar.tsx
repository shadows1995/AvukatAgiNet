import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Gavel, Bell, Settings, LogOut, Sparkles, Menu, X, Crown, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import { User, Notification } from '../types';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path ? "text-primary-600 font-semibold bg-primary-50 rounded-md px-3 py-2" : "text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-md px-3 py-2 transition";

  useEffect(() => {
    if (!user) return;
    let unsubscribe: () => void;

    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs: Notification[] = [];
        snapshot.forEach(doc => {
          notifs.push({ id: doc.id, ...doc.data() } as Notification);
        });

        notifs.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setNotifications(notifs);
      }, (error) => {
        // Permission denied can happen on initial load or slow auth
        console.warn("Notification listener warning:", error);
      });
    } catch (e) {
      console.error("Notification setup error:", e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, [user]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleReadNotifications = async () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      notifications.forEach(async (n) => {
        if (!n.read && n.id) {
          try {
            await updateDoc(doc(db, "notifications", n.id), { read: true });
          } catch (e) { console.error("Err marking read:", e); }
        }
      });
    }
  };

  const goToProfile = () => {
    if (user) navigate(`/profile/${user.uid}`);
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
                <Link to="/home" className={isActive('/home')}>Anasayfa</Link>
                <Link to="/dashboard" className={isActive('/dashboard')}>Görevler</Link>
                <Link to="/my-jobs" className={isActive('/my-jobs')}>Görevlerim</Link>
                <Link to="/accepted-jobs" className={isActive('/accepted-jobs')}>Aldığım Görevler</Link>
                <Link to="/create-job" className={isActive('/create-job')}>Görev Ver</Link>
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
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
                  >
                    <Crown className="w-3 h-3 mr-1" /> PREMIUM
                  </button>
                )}
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">

                  {/* Notification Bell */}
                  <div className="relative" ref={notificationRef}>
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
          <Link to="/home" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Anasayfa</Link>
          <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Görevler</Link>
          <Link to="/create-job" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Görev Ver</Link>
          <Link to="/my-jobs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Görevlerim</Link>
          <Link to="/accepted-jobs" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Aldığım Görevler</Link>
          <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Ayarlar</Link>
          <Link to={`/profile/${user.uid}`} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Profilim</Link>
          <button onClick={onLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50">Çıkış Yap</button>
        </div>
      )}
      {/* Premium Details Modal */}
      {showPremiumModal && user && user.isPremium && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white relative">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center mb-2">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Premium Üyelik</h3>
                  <p className="text-amber-100 text-sm">Aktif ve Onaylı</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Mevcut Plan</p>
                    <p className="text-slate-900 font-bold">
                      {user.premiumPlan === 'yearly' ? 'Yıllık Plan' : 'Aylık Plan'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Ücret</p>
                  <p className="text-slate-900 font-bold">{user.premiumPrice || 299} TL<span className="text-xs font-normal text-slate-500">/ay</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="text-sm">Başlangıç Tarihi</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {user.premiumSince ? new Date(user.premiumSince).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="text-sm">Yenileme Tarihi</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {user.premiumUntil ? new Date(user.premiumUntil).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-600">
                    <Sparkles className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="text-sm">Kalan Süre</span>
                  </div>
                  <span className="text-sm font-bold text-amber-600">
                    {user.premiumUntil ? Math.ceil((user.premiumUntil - Date.now()) / (1000 * 60 * 60 * 24)) : 0} Gün
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;