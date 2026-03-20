import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/context/AuthContext.tsx';
import { ROUTES, ROUTE_PATTERNS } from '@/app/routes';
import HomePage from '@/modules/pages/HomePage.tsx';
import CampaignsMarquee from '@/modules/campaigns/ui/CampaignsMarquee.tsx';
import RoleSelector from '@/shared/ui/RoleSelector.tsx';
import MobileLayout from '@/shared/ui/MobileLayout.tsx';
import CampaignsPage from '@/modules/campaigns/pages/CampaignsPage.tsx';
import CampaignDetailPage from '@/modules/campaigns/pages/CampaignDetailPage.tsx';
import CreateCampaignPage from '@/modules/campaigns/pages/CreateCampaignPage.tsx';
import VideoVerificationPage from '@/modules/campaigns/pages/VideoVerificationPage.tsx';
import MyCampaignsPage from '@/modules/campaigns/pages/MyCampaignsPage.tsx';
import MyCampaignDetailPage from '@/modules/campaigns/pages/MyCampaignDetailPage.tsx';
import CreatorVerificationsPage from '@/modules/campaigns/pages/CreatorVerificationsPage.tsx';
import CreatorAccessValidationPage from '@/modules/campaigns/pages/CreatorAccessValidationPage.tsx';
import ValidationVideosPage from '@/modules/campaigns/pages/ValidationVideosPage.tsx';
import MyVideosPage from '@/modules/pages/MyVideosPage.tsx';
import DashboardPage from '@/modules/pages/DashboardPage.tsx';
import NotificationsPage from '@/modules/pages/NotificationsPage.tsx';
import MessagingPage from '@/modules/pages/MessagingPage.tsx';
import CreatorSearchPage from '@/modules/pages/CreatorSearchPage.tsx';
import ProfilePage from '@/modules/pages/ProfilePage.tsx';
import EnterprisePage from '@/modules/pages/EnterprisePage.tsx';
import CreatorDetailPage from '@/modules/pages/CreatorDetailPage.tsx';
import UserProfilePage from '@/modules/pages/UserProfilePage.tsx';
import MyAccountPage from '@/modules/pages/MyAccountPage.tsx';
import SettingsPage from '@/modules/pages/SettingsPage.tsx';
import SavedCampaignsPage from '@/modules/campaigns/pages/SavedCampaignsPage.tsx';
import CreatorValidationsPage from '@/modules/pages/CreatorValidationsPage.tsx';
import GrapeLoader from '@/shared/ui/GrapeLoader.tsx';
import DashboardHome from '@/modules/pages/DashboardHomePage.tsx';

function AuthScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [view, setView] = useState<'home' | 'auth'>('home');
  const [initialRole, setInitialRole] = useState<'creator' | 'enterprise' | null>(null);

  useEffect(() => {
    if (user) {
      navigate(ROUTES.home, { replace: true });
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: '#050404' }}>
        <GrapeLoader size="lg" />
      </div>
    );
  }

  const handleAuthClick = (role: 'creator' | 'enterprise' | 'login') => {
    setInitialRole(role === 'login' ? null : role);
    setView('auth');
  };

  if (view === 'home') {
    return <HomePage onAuthClick={handleAuthClick} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="hidden md:flex flex-1 h-full overflow-hidden">
        <CampaignsMarquee onBack={() => setView('home')} />
      </div>
      <div className="hidden md:block w-px flex-shrink-0 h-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
      <div className="w-full md:w-[42%] flex-shrink-0 h-full overflow-hidden">
        <RoleSelector initialRole={initialRole} onBack={() => setView('home')} />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: '#050404' }}>
        <GrapeLoader size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.auth} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATTERNS.auth} element={<AuthScreen />} />
        <Route element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
          <Route path={ROUTE_PATTERNS.home} element={<DashboardHome />} />
          <Route path={ROUTE_PATTERNS.campagnes} element={<CampaignsPage />} />
          <Route path={ROUTE_PATTERNS.campagne} element={<CampaignDetailPage />} />
          <Route path={ROUTE_PATTERNS.creerCampagne} element={<CreateCampaignPage />} />
          <Route path={ROUTE_PATTERNS.modifierCampagne} element={<CreateCampaignPage />} />
          <Route path={ROUTE_PATTERNS.campagneVerification} element={<VideoVerificationPage />} />
          <Route path={ROUTE_PATTERNS.mesCampagnes} element={<MyCampaignsPage />} />
          <Route path={ROUTE_PATTERNS.maCampagne} element={<MyCampaignDetailPage />} />
          <Route path={ROUTE_PATTERNS.maCampagneVerifications} element={<CreatorVerificationsPage />} />
          <Route path={ROUTE_PATTERNS.maCampagneValidationCreateurs} element={<CreatorAccessValidationPage />} />
          <Route path={ROUTE_PATTERNS.validationVideos} element={<ValidationVideosPage />} />
          <Route path={ROUTE_PATTERNS.mesVideos} element={<MyVideosPage />} />
          <Route path={ROUTE_PATTERNS.dashboard} element={<DashboardPage />} />
          <Route path={ROUTE_PATTERNS.notifications} element={<NotificationsPage />} />
          <Route path={ROUTE_PATTERNS.messagerie} element={<MessagingPage />} />
          <Route path={ROUTE_PATTERNS.rechercheCreateurs} element={<CreatorSearchPage />} />
          <Route path={ROUTE_PATTERNS.profil} element={<ProfilePage />} />
          <Route path={ROUTE_PATTERNS.entreprise} element={<EnterprisePage />} />
          <Route path={ROUTE_PATTERNS.createur} element={<CreatorDetailPage />} />
          <Route path={ROUTE_PATTERNS.userProfile} element={<UserProfilePage />} />
          <Route path={ROUTE_PATTERNS.monCompte} element={<MyAccountPage />} />
          <Route path={ROUTE_PATTERNS.parametres} element={<SettingsPage />} />
          <Route path={ROUTE_PATTERNS.enregistre} element={<SavedCampaignsPage />} />
          <Route path={ROUTE_PATTERNS.mesValidations} element={<CreatorValidationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.auth} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
