import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  // Auto redirect after 10 seconds
  useEffect(() => {
    if (count <= 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  const quickLinks = [
    { label: 'Beranda', to: '/', icon: <Home size={16} /> },
    { label: 'Unit Usaha', to: '/unit-usaha', icon: <Compass size={16} /> },
    { label: 'Berita', to: '/berita', icon: <Search size={16} /> },
    { label: 'Hubungi Kami', to: '/kontak', icon: <ArrowLeft size={16} /> },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--dark-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15, 98, 254, 0.15) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
        animation: 'float 10s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Content Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        textAlign: 'center',
        maxWidth: '560px',
        width: '100%',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/logo.png"
            alt="KOPKAR ADIS"
            style={{
              width: '64px', height: '64px', objectFit: 'contain',
              borderRadius: '16px', backgroundColor: 'white', padding: '8px',
              boxShadow: '0 0 40px rgba(15, 98, 254, 0.3)',
            }}
          />
        </div>

        {/* 404 Number */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <h1 style={{
            fontSize: 'clamp(7rem, 20vw, 10rem)',
            fontWeight: 900,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.05em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #0f62fe 0%, #4f8aff 40%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            userSelect: 'none',
          }}>
            404
          </h1>
          {/* Glowing underline */}
          <div style={{
            position: 'absolute', bottom: '-4px', left: '50%',
            transform: 'translateX(-50%)',
            width: '120px', height: '3px',
            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
            borderRadius: '2px',
            boxShadow: '0 0 12px rgba(15, 98, 254, 0.6)',
          }} />
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
          fontWeight: 700,
          color: 'white',
          fontFamily: 'var(--font-heading)',
          marginBottom: '12px',
          marginTop: '16px',
        }}>
          Halaman Tidak Ditemukan
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '1rem',
          color: 'var(--text-muted-light)',
          lineHeight: 1.7,
          marginBottom: '36px',
          maxWidth: '420px',
          margin: '0 auto 36px',
        }}>
          Maaf, halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
          Jangan khawatir — kami antarkan Anda kembali.
        </p>

        {/* Primary Actions */}
        <div style={{
          display: 'flex', gap: '12px', justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: '40px',
        }}>
          <Link
            to="/"
            className="btn btn-primary"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', fontSize: '1rem', borderRadius: '50px',
              textDecoration: 'none', fontWeight: 700,
            }}
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', fontSize: '1rem', borderRadius: '50px',
              fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted-light)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'var(--text-muted-light)';
            }}
          >
            <ArrowLeft size={18} />
            Halaman Sebelumnya
          </button>
        </div>

        {/* Quick links */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '28px',
          marginBottom: '24px',
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted-light)', marginBottom: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Atau kunjungi halaman lainnya:
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {quickLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600,
                  backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--text-muted-light)',
                  border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 98, 254, 0.2)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'var(--text-muted-light)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auto redirect counter */}
        <p style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.6)', fontWeight: 500 }}>
          Dialihkan otomatis ke beranda dalam{' '}
          <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>{count}</span> detik...
        </p>
      </div>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </div>
  );
};
