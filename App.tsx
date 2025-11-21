import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { User } from './types';
import { auth, db } from './firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import MyJobs from './pages/MyJobs';
import CreateJob from './pages/CreateJob';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { LandingPage, LoginPage, RegisterPage } from './pages/AuthPages';
import PremiumPage from './pages/Premium';
import PaymentPage from './pages/Payment';
import AcceptedJobs from './pages/AcceptedJobs';
import JobDetails from './pages/JobDetails';

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

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

  // Footer visibility logic
  const showFooter = ['/', '/home', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterPage />} />
          <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/create-job" element={user ? <CreateJob user={user} /> : <Navigate to="/login" />} />
          <Route path="/premium" element={user ? <PremiumPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <PaymentPage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <SettingsPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/my-jobs" element={user ? <MyJobs /> : <Navigate to="/login" />} />
          <Route path="/accepted-jobs" element={user ? <AcceptedJobs /> : <Navigate to="/login" />} />
          <Route path="/job/:jobId" element={user ? <JobDetails user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={user ? <ProfilePage currentUser={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
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
