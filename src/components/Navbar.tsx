import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

interface NavbarProps {
  onGoToAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoToAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang Kami', path: '/tentang-kami' },
    { label: 'Unit Usaha', path: '/unit-usaha' },
    { label: 'Berita', path: '/berita' },
    { label: 'Laporan RAT', path: '/laporan-rat' },
    { label: 'Kontak', path: '/kontak' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`glass-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        {/* Logo Section */}
        <Link 
          to="/" 
          onClick={handleLinkClick} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }}
        >
          <img 
            src="/logo.png" 
            alt="Logo Kopkar Adis" 
            style={{
              width: '42px',
              height: '42px',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-sm)',
              backgroundColor: 'white',
              padding: '2px'
            }}
          />
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.5px', margin: 0 }}>
              Koperasi Konsumen Karyawan
            </h1>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted-dark)', fontWeight: 500, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PT Adis Dimension Footwear
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-muted-dark)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                position: 'relative',
                padding: '4px 0',
                textDecoration: 'none'
              })}
            >
              {item.label}
            </NavLink>
          ))}
          
          <button 
            onClick={onGoToAdmin}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
          >
            <LogIn size={14} />
            <span>Admin</span>
          </button>
        </nav>

        {/* Mobile Toggle */}
        <div style={{ display: 'none' }} className="mobile-toggle">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer' }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          width: '100%',
          backgroundColor: 'white',
          boxShadow: 'var(--shadow-lg)',
          borderBottom: '1px solid var(--border-light)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          zIndex: 999
        }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-dark)',
                fontSize: '1rem',
                fontWeight: 600,
                textAlign: 'left',
                padding: '10px 0',
                borderBottom: '1px solid #f1f5f9',
                cursor: 'pointer',
                textDecoration: 'none'
              })}
            >
              {item.label}
            </NavLink>
          ))}
          
          <button 
            onClick={() => { setIsOpen(false); onGoToAdmin(); }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem', gap: '6px', marginTop: '10px' }}
          >
            <LogIn size={16} />
            <span>Portal Admin</span>
          </button>
        </div>
      )}

      {/* Inline styles helper for responsive Navbar and active state */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        .nav-link:hover {
          color: var(--primary) !important;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--primary);
        }
      `}</style>
    </header>
  );
};
