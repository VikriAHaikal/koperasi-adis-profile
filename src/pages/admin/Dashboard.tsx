import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import type { 
  HeroSlide, ProfileContent, BusinessUnit, NewsArticle, DocumentFile, ContactInfo, ContactMessage 
} from '../../services/db';
import { 
  Image as ImageIcon, Briefcase, Download, Phone, 
  LogOut, X, MessageSquare, ArrowLeft, Menu, TrendingUp, Settings,
  Building, Newspaper, Inbox
} from 'lucide-react';

// Subcomponents / Tabs
import { HeroTab } from './tabs/HeroTab';
import { ProfileTab } from './tabs/ProfileTab';
import { UnitsTab } from './tabs/UnitsTab';
import { NewsTab } from './tabs/NewsTab';
import { DocsTab } from './tabs/DocsTab';
import { ContactTab } from './tabs/ContactTab';
import { MessagesTab } from './tabs/MessagesTab';
import { SummaryTab } from './tabs/SummaryTab';
import { SettingsTab } from './tabs/SettingsTab';

interface DashboardProps {
  session: any;
  onLogout: () => void;
  onGoHome: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ session, onLogout, onGoHome }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'hero' | 'profile' | 'units' | 'news' | 'docs' | 'contact' | 'messages' | 'settings'>('summary');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data States
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [profile, setProfile] = useState<ProfileContent | null>(null);
  const [units, setUnits] = useState<BusinessUnit[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [docs, setDocs] = useState<DocumentFile[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Loading States
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Custom Toasts State
  interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Custom Confirm Dialog State
  interface ConfirmConfig {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
  }
  const [confirmDialog, setConfirmDialog] = useState<ConfirmConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Ya, Hapus'
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'Ya, Hapus') => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
      confirmText
    });
  };

  // Load Data
  const loadAllData = async () => {
    setIsInitialLoading(true);
    try {
      const fetchedHero = await dbService.getHeroSlides();
      const fetchedProfile = await dbService.getProfile();
      const fetchedUnits = await dbService.getBusinessUnits();
      const fetchedNews = await dbService.getNews();
      const fetchedDocs = await dbService.getDocuments();
      const fetchedContact = await dbService.getContact();
      const fetchedMessages = await dbService.getMessages();

      setHeroSlides(fetchedHero);
      setProfile(fetchedProfile);
      setUnits(fetchedUnits);
      setNews(fetchedNews);
      setDocs(fetchedDocs);
      setContact(fetchedContact);
      setMessages(fetchedMessages);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data dari database.', 'error');
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogoutClick = () => {
    triggerConfirm(
      'Keluar Sesi Admin',
      'Apakah Anda yakin ingin keluar dari sesi admin? Seluruh data perubahan Anda telah tersimpan dengan aman ke database.',
      () => {
        setIsLoggingOut(true);
        setTimeout(() => {
          onLogout();
        }, 1500);
      },
      'Ya, Keluar'
    );
  };

  return (
    <div className="admin-layout">
      {/* Sidebar styling overrides for premium UI/UX */}
      <style>{`
        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 11px 16px;
          background: transparent;
          color: var(--text-muted-light);
          border: none;
          border-left: 4px solid transparent;
          border-radius: 0 8px 8px 0;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
          padding-left: 18px;
        }
        .sidebar-btn.active {
          background: rgba(15, 98, 254, 0.08) !important;
          color: white !important;
          border-left-color: var(--primary) !important;
          padding-left: 14px !important;
        }
        .sidebar-btn.active svg {
          color: var(--secondary) !important;
          filter: drop-shadow(0 0 5px rgba(79, 138, 255, 0.4));
        }
        .sidebar-btn svg {
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .sidebar-btn:hover svg {
          transform: scale(1.08);
          color: white;
        }
      `}</style>
      {/* Mobile Top Bar */}
      <div className="admin-mobile-header">
        <button onClick={() => setIsSidebarOpen(true)} className="admin-menu-toggle" title="Buka Menu">
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '0.95rem', letterSpacing: '0.5px' }}>KOPKAR ADIS ADMIN</span>
        <div style={{ width: '40px' }} /> {/* Spacing helper */}
      </div>

      {/* Sidebar Overlay Backdrop on Mobile */}
      <div className={`admin-sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Close Button on Mobile */}
        <div className="admin-sidebar-close">
          <button onClick={() => setIsSidebarOpen(false)} title="Tutup Menu">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', borderBottom: '1px solid var(--border-dark)', paddingBottom: '18px' }}>
          <img 
            src="/logo.png" 
            alt="Logo Kopkar Adis" 
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              borderRadius: '6px',
              backgroundColor: 'white',
              padding: '2px'
            }}
          />
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', margin: 0 }}>KOPKAR ADIS</h3>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted-light)', fontWeight: 600 }}>DASHBOARD ADMIN</span>
          </div>
        </div>

        {/* Admin Profile Widget */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          marginBottom: '25px',
          position: 'relative'
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: 'white',
              boxShadow: '0 4px 10px rgba(15, 98, 254, 0.2)',
              fontFamily: 'var(--font-heading)'
            }}>
              {session.user?.email ? session.user.email[0].toUpperCase() : 'A'}
            </div>
            <span style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              border: '2px solid var(--dark-bg)',
              boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.2)'
            }} />
          </div>
          <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
               fontSize: '0.8rem', 
               fontWeight: 700, 
               color: 'white',
               whiteSpace: 'nowrap',
               overflow: 'hidden',
               textOverflow: 'ellipsis'
            }}>
              {session.user?.email?.split('@')[0] || 'Administrator'}
            </span>
            <span style={{ 
               fontSize: '0.62rem', 
               color: 'var(--text-muted-light)',
               fontWeight: 700,
               textTransform: 'uppercase',
               letterSpacing: '0.5px'
            }}>
              Pengurus Koperasi
            </span>
          </div>
        </div>



        {/* Tab Navigations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
          <button 
            onClick={() => { setActiveTab('summary'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'summary' ? 'active' : ''}`}
          >
            <TrendingUp size={18} />
            <span>Ringkasan Analitik</span>
          </button>

          <button 
            onClick={() => { setActiveTab('hero'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'hero' ? 'active' : ''}`}
          >
            <ImageIcon size={18} />
            <span>Banner Hero</span>
          </button>

          <button 
            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <Building size={18} />
            <span>Profil & Visi Misi</span>
          </button>

          <button 
            onClick={() => { setActiveTab('units'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'units' ? 'active' : ''}`}
          >
            <Briefcase size={18} />
            <span>Unit Usaha</span>
          </button>

          <button 
            onClick={() => { setActiveTab('news'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'news' ? 'active' : ''}`}
          >
            <Newspaper size={18} />
            <span>Berita Koperasi</span>
          </button>

          <button 
            onClick={() => { setActiveTab('docs'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'docs' ? 'active' : ''}`}
          >
            <Download size={18} />
            <span>Laporan RAT</span>
          </button>

          <button 
            onClick={() => { setActiveTab('contact'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'contact' ? 'active' : ''}`}
          >
            <Phone size={18} />
            <span>Kontak & WA</span>
          </button>

          <button 
            onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'messages' ? 'active' : ''}`}
          >
            <Inbox size={18} />
            <span>Inbox Pesan ({messages.length})</span>
          </button>

          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} 
            className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Pengaturan Akun</span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-dark)', paddingTop: '16px' }}>
          <button onClick={() => { setIsSidebarOpen(false); onGoHome(); }} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'none', border: 'none',
            color: 'var(--text-muted-light)', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', transition: 'color 0.2s'
          }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted-light)'}>
            <ArrowLeft size={16} />
            <span>Lihat Website</span>
          </button>

          <button onClick={() => { setIsSidebarOpen(false); handleLogoutClick(); }} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'none', border: 'none',
            color: '#fca5a5', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s'
          }} onMouseEnter={e => e.currentTarget.style.color = '#fee2e2'} onMouseLeave={e => e.currentTarget.style.color = '#fca5a5'}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="admin-main">
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
            {activeTab === 'summary' && 'Ringkasan Analitik Utama'}
            {activeTab === 'hero' && 'Kelola Banner Hero'}
            {activeTab === 'profile' && 'Kelola Profil & Visi Misi'}
            {activeTab === 'units' && 'Kelola Unit Usaha'}
            {activeTab === 'news' && 'Kelola Berita & Kegiatan'}
            {activeTab === 'docs' && 'Kelola Laporan Keuangan'}
            {activeTab === 'contact' && 'Kelola Kontak & WhatsApp'}
            {activeTab === 'messages' && 'Inbox Masukan Anggota'}
            {activeTab === 'settings' && 'Pengaturan Akun Admin'}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)', backgroundColor: '#e2e8f0', padding: '6px 12px', borderRadius: '50px', fontWeight: 600 }}>
              Admin: {session.user?.email || 'Administrator'}
            </span>
          </div>
        </div>

        {/* Mini Stats Panel Widget Row */}
        {!isInitialLoading && activeTab === 'summary' && (
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '30px', 
            flexWrap: 'wrap' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: 'white', 
              padding: '12px 18px', 
              borderRadius: '12px', 
              border: '1px solid var(--border-light)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.01)',
              flex: '1 1 180px'
            }}>
              <div style={{ backgroundColor: 'rgba(15, 98, 254, 0.08)', color: 'var(--primary)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted-dark)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Banner Slide</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>{heroSlides.length} Berkas</strong>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: 'white', 
              padding: '12px 18px', 
              borderRadius: '12px', 
              border: '1px solid var(--border-light)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.01)',
              flex: '1 1 180px'
            }}>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', color: 'var(--accent)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted-dark)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit Usaha</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>{units.length} Unit</strong>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              backgroundColor: 'white', 
              padding: '12px 18px', 
              borderRadius: '12px', 
              border: '1px solid var(--border-light)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.01)',
              flex: '1 1 180px'
            }}>
              <div style={{ backgroundColor: messages.length > 0 ? 'rgba(250, 191, 0, 0.12)' : 'rgba(226, 232, 240, 0.8)', color: messages.length > 0 ? '#b48600' : '#64748b', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted-dark)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inbox Pesan</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>{messages.length} Masukan</strong>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toasts */}
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              <span>{t.message}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0.8
                }} 
                title="Tutup"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Custom Confirmation Modal */}
        {confirmDialog.isOpen && (
          <div className="popup-modal-overlay">
            <div className="popup-modal-card" style={{ maxWidth: '400px' }}>
              <div className="popup-modal-header" style={{ borderBottom: 'none', marginBottom: '10px', paddingBottom: 0 }}>
                <h5 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>
                  {confirmDialog.title}
                </h5>
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted-dark)', marginBottom: '20px' }}>
                {confirmDialog.message}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Batal
                </button>
                <button 
                  onClick={confirmDialog.onConfirm} 
                  className="btn btn-danger" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  {confirmDialog.confirmText || 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content area based on active tab */}
        {!isInitialLoading && activeTab === 'summary' && (
          <SummaryTab 
            heroSlides={heroSlides}
            profile={profile}
            units={units}
            news={news}
            docs={docs}
            messages={messages}
          />
        )}
        {!isInitialLoading && activeTab === 'hero' && (
          <HeroTab 
            heroSlides={heroSlides} 
            setHeroSlides={setHeroSlides} 
            isInitialLoading={isInitialLoading} 
            showToast={showToast} 
            triggerConfirm={triggerConfirm} 
            role={session.user?.role || 'editor'}
          />
        )}
        {!isInitialLoading && activeTab === 'profile' && (
          <ProfileTab 
            profile={profile} 
            setProfile={setProfile} 
            isInitialLoading={isInitialLoading} 
            showToast={showToast} 
            triggerConfirm={triggerConfirm} 
            role={session.user?.role || 'editor'}
          />
        )}
        {!isInitialLoading && activeTab === 'units' && (
          <UnitsTab 
            units={units} 
            setUnits={setUnits} 
            profile={profile}
            setProfile={setProfile}
            isInitialLoading={isInitialLoading} 
            showToast={showToast} 
            triggerConfirm={triggerConfirm} 
            role={session.user?.role || 'editor'}
          />
        )}
        {!isInitialLoading && activeTab === 'news' && (
          <NewsTab 
            news={news} 
            setNews={setNews} 
            isInitialLoading={isInitialLoading} 
            showToast={showToast} 
            triggerConfirm={triggerConfirm} 
            role={session.user?.role || 'editor'}
          />
        )}
        {!isInitialLoading && activeTab === 'docs' && (
          <DocsTab 
            documents={docs} 
            setDocuments={setDocs} 
            isInitialLoading={isInitialLoading} 
            showToast={showToast} 
            triggerConfirm={triggerConfirm} 
            role={session.user?.role || 'editor'}
          />
        )}
        {!isInitialLoading && activeTab === 'contact' && (
          <ContactTab 
            contact={contact} 
            setContact={setContact} 
            showToast={showToast} 
            role={session.user?.role || 'editor'}
          />
        )}
        {!isInitialLoading && activeTab === 'messages' && (
          <MessagesTab 
            messages={messages} 
            setMessages={setMessages} 
            showToast={showToast} 
            triggerConfirm={triggerConfirm} 
            role={session.user?.role || 'editor'}
          />
        )}
        {!isInitialLoading && activeTab === 'settings' && (
          <SettingsTab 
            session={session}
            showToast={showToast}
          />
        )}


        {isInitialLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <span className="spinner-mini" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></span>
          </div>
        )}
      </main>

      {/* Logout exit loading transition screen */}
      {isLoggingOut && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          gap: '20px',
          animation: 'modalFadeIn 0.3s ease-out'
        }}>
          <div style={{
            width: '45px',
            height: '45px',
            border: '4px solid rgba(255, 255, 255, 0.15)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', margin: 0, letterSpacing: '0.5px' }}>
            Mengamankan Sesi Admin...
          </h4>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted-light)' }}>
            Sampai jumpa kembali di portal pengurus Kopkar Adis.
          </span>
        </div>
      )}
    </div>
  );
};
