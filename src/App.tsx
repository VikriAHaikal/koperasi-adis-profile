import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Subpages
import { Home } from './pages/public/Home';
import { AboutPage } from './pages/public/AboutPage';
import { BusinessUnitsPage } from './pages/public/BusinessUnitsPage';
import { BusinessUnitDetailPage } from './pages/public/BusinessUnitDetailPage';
import { NewsPage } from './pages/public/NewsPage';
import { DocumentsPage } from './pages/public/DocumentsPage';
import { ContactPage } from './pages/public/ContactPage';

// Cookie & Cache Consent Banner
import { CookieConsent } from './components/CookieConsent';

// Admin Pages (Lazy Loaded)
const Login = React.lazy(() => import('./pages/admin/Login').then(m => ({ default: m.Login })));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));

// DB Service & Types
import { dbService } from './services/db';
import type { 
  HeroSlide, ProfileContent, BusinessUnit, NewsArticle, DocumentFile, ContactInfo 
} from './services/db';

// Icons
import { MessageCircle, ArrowUp } from 'lucide-react';

const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '105px',
        right: '30px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        zIndex: 999,
        transition: 'all 0.3s ease',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; 
        e.currentTarget.style.transform = 'translateY(-3px)'; 
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.backgroundColor = 'var(--primary)'; 
        e.currentTarget.style.transform = 'translateY(0)'; 
      }}
      title="Kembali ke Atas"
    >
      <ArrowUp size={24} />
    </button>
  );
};

// Public Layout wrapper containing Navbar, Footer, and Floating WhatsApp
interface PublicLayoutProps {
  children: React.ReactNode;
  onGoToAdmin: () => void;
  contactInfo: ContactInfo | null;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children, onGoToAdmin, contactInfo }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onGoToAdmin={onGoToAdmin} />
      
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>

      {/* Floating WhatsApp Button */}
      {contactInfo?.whatsapp && (
        <a 
          href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Halo Admin KOPKAR ADIS 👋, saya ingin bertanya-tanya seputar koperasi dan layanannya. Boleh dibantu?')}`}
          target="_blank" 
          rel="noreferrer" 
          className="wa-float"
          title="Hubungi Admin Koperasi via WhatsApp"
        >
          <MessageCircle size={30} />
        </a>
      )}

      {/* Floating Back to Top Button */}
      <BackToTopButton />
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
      
      <Footer contactInfo={contactInfo} />
    </div>
  );
};

const RouteLoader = () => (
  <div style={{
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px'
  }}>
    <span className="spinner-mini" style={{ width: '40px', height: '40px', borderWidth: '3px', borderTopColor: 'var(--primary)' }}></span>
    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)', fontWeight: 600 }}>Memuat Halaman...</span>
  </div>
);

function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(() => {
    // Synchronous check to prevent redirect flickers
    const savedSession = sessionStorage.getItem('koperasi_session');
    return savedSession ? JSON.parse(savedSession) : null;
  });

  // Dynamic Data States
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [profile, setProfile] = useState<ProfileContent | null>(null);
  const [units, setUnits] = useState<BusinessUnit[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [docs, setDocs] = useState<DocumentFile[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Content for Public Pages
  const loadPublicContent = async () => {
    try {
      const fetchedHero = await dbService.getHeroSlides();
      const fetchedProfile = await dbService.getProfile();
      const fetchedUnits = await dbService.getBusinessUnits();
      const fetchedNews = await dbService.getNews();
      const fetchedDocs = await dbService.getDocuments();
      const fetchedContact = await dbService.getContact();

      setHeroSlides(fetchedHero);
      setProfile(fetchedProfile);
      setUnits(fetchedUnits);
      setNews(fetchedNews);
      setDocs(fetchedDocs);
      setContact(fetchedContact);
    } catch (error) {
      console.error('Failed to load database content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicContent();
  }, []);

  const handleLoginSuccess = (userSession: any) => {
    setSession(userSession);
    sessionStorage.setItem('koperasi_session', JSON.stringify(userSession));
    loadPublicContent(); // reload content in case admin saved changes
    navigate('/admin');
  };

  const handleLogout = () => {
    setSession(null);
    sessionStorage.removeItem('koperasi_session');
    loadPublicContent(); // reload content
    navigate('/');
  };

  const handleGoToAdmin = () => {
    if (session) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--light-bg)',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e2e8f0',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text-dark)' }}>
          Memuat Website Koperasi...
        </h3>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* 1. PUBLIC ROUTES (Wrapped in Layout) */}
        <Route path="/" element={
          <PublicLayout onGoToAdmin={handleGoToAdmin} contactInfo={contact}>
            <Home slides={heroSlides} profile={profile} units={units} news={news} contactInfo={contact} />
          </PublicLayout>
        } />
        
        <Route path="/tentang-kami" element={
          <PublicLayout onGoToAdmin={handleGoToAdmin} contactInfo={contact}>
            <AboutPage profile={profile} />
          </PublicLayout>
        } />

        <Route path="/unit-usaha" element={
          <PublicLayout onGoToAdmin={handleGoToAdmin} contactInfo={contact}>
            <BusinessUnitsPage units={units} />
          </PublicLayout>
        } />
        
        <Route path="/unit-usaha/:id" element={
          <PublicLayout onGoToAdmin={handleGoToAdmin} contactInfo={contact}>
            <BusinessUnitDetailPage units={units} profile={profile} />
          </PublicLayout>
        } />

        <Route path="/berita" element={
          <PublicLayout onGoToAdmin={handleGoToAdmin} contactInfo={contact}>
            <NewsPage news={news} />
          </PublicLayout>
        } />

        <Route path="/laporan-rat" element={
          <PublicLayout onGoToAdmin={handleGoToAdmin} contactInfo={contact}>
            <DocumentsPage documents={docs} />
          </PublicLayout>
        } />

        <Route path="/kontak" element={
          <PublicLayout onGoToAdmin={handleGoToAdmin} contactInfo={contact}>
            <ContactPage contactInfo={contact} />
          </PublicLayout>
        } />

        {/* 2. ADMIN PORTAL LOGIN */}
        <Route path="/login" element={
          session ? <Navigate to="/admin" replace /> : (
            <Login 
              onLoginSuccess={handleLoginSuccess} 
              onGoHome={() => navigate('/')} 
            />
          )
        } />

        {/* 3. ADMIN PORTAL DASHBOARD (Guarded) */}
        <Route path="/admin" element={
          session ? (
            <Dashboard 
              session={session} 
              onLogout={handleLogout} 
              onGoHome={() => navigate('/')}
              onDataSaved={loadPublicContent}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* 4. FALLBACK REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
