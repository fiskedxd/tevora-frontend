import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import SpacesPage from './pages/SpacesPage';
import SafetyPage from './pages/SafetyPage';
import SupportPage from './pages/SupportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LegalPage from './pages/LegalPage';
import AppHomePage from './pages/AppHomePage';
import ServerStudioPage from './pages/ServerStudioPage';
import PublicPlaylistPage from './pages/PublicPlaylistPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import MusicLibraryPage from './pages/MusicLibraryPage';
import ModerationPage from './pages/ModerationPage';
import ModerationReviewPage from './pages/ModerationReviewPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

function AppContent() {
  const { isBanned, user } = useAuth();
  const location = useLocation();

  if (isBanned) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
        <div className="text-center text-white/70">Ton compte a été banni.</div>
      </div>
    );
  }

  return (
    <>
      <div key={`${location.pathname}${location.search}`} className="tavora-route-view">
      <Routes>
        <Route path="/" element={user ? <AppHomePage /> : <HomePage />} />
        <Route path="/home" element={<ProtectedRoute user={user}><AppHomePage /></ProtectedRoute>} />
        <Route path="/:sessionId/home" element={<ProtectedRoute user={user}><AppHomePage /></ProtectedRoute>} />
        <Route path="/dm/:userId" element={<ProtectedRoute user={user}><AppHomePage /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute user={user}><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings/*" element={<ProtectedRoute user={user}><AppHomePage /></ProtectedRoute>} />
        <Route path="/server/:serverId/studio" element={<ProtectedRoute user={user}><ServerStudioPage /></ProtectedRoute>} />
        <Route path="/server/:serverId/channel/:channelId" element={<ProtectedRoute user={user}><AppHomePage /></ProtectedRoute>} />
        <Route path="/server/:serverId/:channelId" element={<ProtectedRoute user={user}><AppHomePage /></ProtectedRoute>} />
        <Route path="/server/:serverId" element={<ProtectedRoute user={user}><AppHomePage /></ProtectedRoute>} />
        <Route path="/discover" element={user ? <AppHomePage /> : <DiscoverPage />} />
        <Route path="/spaces" element={user ? <AppHomePage /> : <SpacesPage />} />
        <Route path="/safety" element={user ? <AppHomePage /> : <SafetyPage />} />
        <Route path="/support" element={user ? <AppHomePage /> : <SupportPage />} />
        <Route path="/invite/:inviteId" element={<ProtectedRoute user={user}><AppHomePage /></ProtectedRoute>} />
        <Route path="/music" element={<MusicLibraryPage mode="music" />} />
        <Route path="/playlists" element={<MusicLibraryPage mode="playlists" />} />
        <Route path="/moderation" element={<ProtectedRoute user={user}><ModerationPage /></ProtectedRoute>} />
        <Route path="/moderation/review/:reportId" element={<ModerationReviewPage />} />
        <Route path="/playlist/:id" element={<PublicPlaylistPage />} />
        <Route path="/login" element={user ? <AppHomePage /> : <LoginPage />} />
        <Route path="/register" element={user ? <AppHomePage /> : <RegisterPage />} />
        <Route path="/terms" element={<LegalPage title="Conditions d’utilisation" intro="Ces conditions régissent l’utilisation de Tavora et de ses services." sections={[{ title: 'Utilisation du service', content: 'Vous acceptez d’utiliser Tavora de manière responsable et conforme aux lois applicables.' }, { title: 'Comptes utilisateurs', content: 'Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités menées depuis votre compte.' }, { title: 'Modifications', content: 'Nous pouvons modifier ces conditions à tout moment, avec notification sur la plateforme.' }]} />} />
        <Route path="/privacy-policy" element={<LegalPage title="Politique de confidentialité" intro="Nous protégeons vos données personnelles et vous expliquons comment elles sont utilisées." sections={[{ title: 'Données collectées', content: 'Nous collectons votre nom, votre email, votre numéro de téléphone et les informations nécessaires à votre compte.' }, { title: 'Utilisation', content: 'Ces informations servent à créer et gérer votre compte, à vous contacter et à améliorer l’expérience Tavora.' }, { title: 'Sécurité', content: 'Les mots de passe sont stockés de manière sécurisée via un hash.' }]} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </div>
    </>
  );
}

function ProtectedRoute({ user, children }) {
  const location = useLocation();
  if (user) return children;
  const redirect = `${location.pathname}${location.search}${location.hash}`;
  return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace state={{ from: redirect }} />;
}