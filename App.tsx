import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { User } from './types';
import { supabase } from './supabaseClient';

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import MyJobs from './pages/MyJobs';
import CreateJob from './pages/CreateJob';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { LandingPage, LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/AuthPages';
import PremiumPage from './pages/PremiumPage';
import PaymentPage from './pages/Payment';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AcceptedJobs from './pages/AcceptedJobs';
import JobDetails from './pages/JobDetails';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HowItWorksPage from './pages/HowItWorksPage';
import LegalCompliancePage from './pages/LegalCompliancePage';
import AboutPage from './pages/AboutPage';
import DistanceSalesAgreementPage from './pages/DistanceSalesAgreementPage';

// Admin Imports
import RequireAdmin from './components/RequireAdmin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import AdminJobDetail from './pages/admin/AdminJobDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminDisputes from './pages/admin/AdminDisputes';
import { NotificationProvider } from './contexts/NotificationContext';
import { AlertProvider } from './contexts/AlertContext';

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

  const fetchUserProfile = async (uid: string) => {
    try {
      const { data: userData, error } = await supabase.from('users').select('*').eq('uid', uid).single();
      if (userData) {
        const mappedUser: User = {
          uid: userData.uid,
          email: userData.email,
          fullName: userData.full_name,
          baroNumber: userData.baro_number,
          baroCity: userData.baro_city,
          phone: userData.phone,
          specializations: userData.specializations,
          city: userData.city,
          preferredCourthouses: userData.preferred_courthouses,
          isPremium: userData.is_premium,
          membershipType: userData.membership_type,
          premiumUntil: userData.premium_until,
          premiumSince: userData.premium_since,
          premiumPlan: userData.premium_plan,
          premiumPrice: userData.premium_price,
          role: userData.role,
          rating: userData.rating,
          completedJobs: userData.completed_jobs,
          avatarUrl: userData.avatar_url,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
          jobStatus: userData.job_status,
          aboutMe: userData.about_me,
          title: userData.title,
          address: userData.address
        };
        setUser(mappedUser);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Redirect to reset password page when recovery link is clicked
        window.location.hash = '#/reset-password';
      }

      if (session?.user) {
        // Only fetch if we don't have the user or if the ID changed
        if (!user || user.uid !== session.user.id) {
          fetchUserProfile(session.user.id);
        }
      } else {
        setUser(null);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) { console.error(error); }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 text-primary-600 animate-spin" /></div>;

  // Footer visibility logic
  const showFooter = ['/', '/home', '/login', '/register', '/forgot-password', '/reset-password', '/terms', '/privacy'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/home" /> : <RegisterPage />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/home" /> : <ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/create-job" element={user ? <CreateJob user={user} /> : <Navigate to="/login" />} />
          <Route path="/premium" element={user ? <PremiumPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <PaymentPage onPaymentSuccess={() => fetchUserProfile(user.uid)} /> : <Navigate to="/login" />} />
          <Route path="/payment-success" element={user ? <PaymentSuccessPage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <SettingsPage user={user} onProfileUpdate={() => fetchUserProfile(user.uid)} /> : <Navigate to="/login" />} />
          <Route path="/my-jobs" element={user ? <MyJobs /> : <Navigate to="/login" />} />
          <Route path="/accepted-jobs" element={user ? <AcceptedJobs /> : <Navigate to="/login" />} />
          <Route path="/job/:jobId" element={user ? <JobDetails user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={user ? <ProfilePage currentUser={user} /> : <Navigate to="/login" />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/yasal-mevzuat" element={<LegalCompliancePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/distance-sales-agreement" element={<DistanceSalesAgreementPage />} />

          {/* Admin Routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="jobs/:jobId" element={<AdminJobDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:userId" element={<AdminUserDetail />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="disputes" element={<AdminDisputes />} />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

import { HelmetProvider } from 'react-helmet-async';

const App = () => {
  return (
    <HelmetProvider>
      <HashRouter>
        <NotificationProvider>
          <AlertProvider>
            <AppContent />
          </AlertProvider>
        </NotificationProvider>
      </HashRouter>
    </HelmetProvider>
  );
};

export default App;
