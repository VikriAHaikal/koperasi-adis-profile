import React from 'react';
import { ArrowUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ContactInfo } from '../services/db';

const InstagramIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

interface FooterProps {
  contactInfo?: ContactInfo | null;
}

export const Footer: React.FC<FooterProps> = ({ contactInfo }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: 'var(--dark-bg)', color: 'var(--text-light)', padding: '60px 0 30px 0', borderTop: '1px solid var(--border-dark)' }}>
      <div className="container">
        <div className="grid-3" style={{ marginBottom: '40px' }}>
          {/* Col 1: Brand & Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="/logo.png" 
                alt="Logo Kopkar Adis" 
                style={{
                  width: '38px',
                  height: '38px',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  padding: '2px'
                }}
              />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>KOPKAR ADIS</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-light)', lineHeight: 1.6 }}>
              Koperasi Konsumen Karyawan PT Adis Dimension Footwear.<br />
              Dikelola secara mandiri, transparan, dan profesional untuk meningkatkan martabat ekonomi anggota.
            </p>
            {/* Social Icons Row */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              {contactInfo?.instagram && (
                <a 
                  href={contactInfo.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: 'var(--text-muted-light)', transition: 'var(--transition-fast)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e1306c'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted-light)'}
                  title="Instagram Koperasi"
                >
                  <InstagramIcon size={20} />
                </a>
              )}
              {contactInfo?.youtube && (
                <a 
                  href={contactInfo.youtube} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: 'var(--text-muted-light)', transition: 'var(--transition-fast)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ff0000'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted-light)'}
                  title="YouTube Koperasi"
                >
                  <YoutubeIcon size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--secondary)' }}>
              Tautan Cepat
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <Link to="/tentang-kami" onClick={scrollToTop} style={{ color: 'var(--text-muted-light)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted-light)'}>Tentang Kami</Link>
              <Link to="/unit-usaha" onClick={scrollToTop} style={{ color: 'var(--text-muted-light)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted-light)'}>Unit Bisnis</Link>
              <Link to="/berita" onClick={scrollToTop} style={{ color: 'var(--text-muted-light)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted-light)'}>Berita & Agenda</Link>
              <Link to="/laporan-rat" onClick={scrollToTop} style={{ color: 'var(--text-muted-light)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted-light)'}>Unduh LPJ RAT</Link>
            </div>
          </div>

          {/* Col 3: Legal & Certification */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--secondary)' }}>
              Legalitas & Izin
            </h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Award size={32} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted-light)', lineHeight: 1.5 }}>
                <p style={{ fontWeight: 600, color: 'white', margin: '0 0 2px 0' }}>Badan Hukum Koperasi</p>
                <p style={{ margin: '0 0 8px 0' }}>No: 518/193/BH-DINKOP/XI/2003</p>
                <p style={{ fontWeight: 600, color: 'white', margin: '0 0 2px 0' }}>Sertifikat Klasifikasi</p>
                <p style={{ margin: 0 }}>Sertifikat Nomor: 124/DINKOP-UMKM/V/2024 (Klasifikasi Sehat)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="lower-footer">
          <p>© {new Date().getFullYear()} Koperasi Konsumen Karyawan PT Adis Dimension Footwear. Hak Cipta Dilindungi.</p>
          <button
            onClick={scrollToTop}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};
