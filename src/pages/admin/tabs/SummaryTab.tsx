import React, { useMemo } from 'react';
import { 
  Users, Briefcase, TrendingUp, MessageSquare, 
  Award, FileText, Bell 
} from 'lucide-react';
import type { 
  HeroSlide, ProfileContent, BusinessUnit, NewsArticle, DocumentFile, ContactMessage 
} from '../../../services/db';

interface SummaryTabProps {
  heroSlides: HeroSlide[];
  profile: ProfileContent | null;
  units: BusinessUnit[];
  news: NewsArticle[];
  docs: DocumentFile[];
  messages: ContactMessage[];
}

export const SummaryTab: React.FC<SummaryTabProps> = ({
  heroSlides,
  profile,
  units,
  news,
  docs,
  messages
}) => {
  // 1. STATS CALCULATIONS
  const stats = useMemo(() => {
    const currentMembers = parseInt(profile?.stats_members || '5280') || 5280;
    const currentAssets = parseFloat(profile?.stats_assets || '12.5') || 12.5;
    const totalInbox = messages.length;

    return {
      members: currentMembers,
      assets: currentAssets,
      inbox: totalInbox,
      unitsCount: units.length,
      newsCount: news.length,
      docsCount: docs.length,
      slidesCount: heroSlides.length
    };
  }, [profile, units, news, docs, heroSlides, messages]);



  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Ringkasan Analitik Koperasi</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(15, 98, 254, 0.1)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Bell size={12} /> Live Data
            </span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted-dark)', margin: 0 }}>
            Selamat datang di Portal Utama. Berikut adalah statistik kinerja, inbox pesan, dan pertumbuhan koperasi secara real-time.
          </p>
        </div>
      </div>



      {/* Row 1: KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>
        {/* Card 1: Members */}
        <div className="summary-card" style={{
          background: 'linear-gradient(135deg, #0f62fe 0%, #002d9c 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Anggota</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {stats.members.toLocaleString('id-ID')}
              </h3>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
              <Users size={22} color="white" />
            </div>
          </div>
        </div>

        {/* Card 2: Assets */}
        <div className="summary-card" style={{
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Aset (Milyar)</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                Rp {stats.assets}M
              </h3>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
              <TrendingUp size={22} color="white" />
            </div>
          </div>
        </div>

        {/* Card 3: Messages */}
        <div className="summary-card" style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kritik & Saran</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {stats.inbox} <span style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.8 }}>Pesan</span>
              </h3>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
              <MessageSquare size={22} color="white" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Checklist */}
      <div style={{ marginBottom: '35px' }}>
        {/* Database Checklist Info */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '18px' }}>Ringkasan Data Content Management</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Units Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: 'rgba(15, 98, 254, 0.1)', color: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <h5 style={{ margin: '0 0 2px 0', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dark)' }}>Unit Usaha</h5>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted-dark)' }}>Layanan mandiri anggota</p>
                </div>
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>{stats.unitsCount} Unit</span>
            </div>

            {/* News Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px', borderRadius: '8px' }}>
                  <Award size={18} />
                </div>
                <div>
                  <h5 style={{ margin: '0 0 2px 0', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dark)' }}>Berita & Kegiatan</h5>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted-dark)' }}>Informasi resmi terpublikasi</p>
                </div>
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>{stats.newsCount} Rilis</span>
            </div>

            {/* RAT Docs Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '8px', borderRadius: '8px' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h5 style={{ margin: '0 0 2px 0', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dark)' }}>Dokumen & Laporan</h5>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted-dark)' }}>File pertanggungjawaban RAT</p>
                </div>
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>{stats.docsCount} Berkas</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .summary-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg) !important;
        }
      `}</style>
    </div>
  );
};
