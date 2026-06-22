import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BusinessUnit, ProfileContent } from '../../services/db';
import * as Icons from 'lucide-react';
import { ArrowLeft, Clock, ShieldCheck, Truck, BadgeCheck } from 'lucide-react';
import { SEO } from '../../components/SEO';

interface BusinessUnitDetailPageProps {
  units: BusinessUnit[];
  profile: ProfileContent | null;
}

export const BusinessUnitDetailPage: React.FC<BusinessUnitDetailPageProps> = ({ units, profile }) => {
  const { id } = useParams<{ id: string }>();
  const unit = units.find(u => u.id === id);
  const details = profile?.unit_details?.find(d => d.unit_id === id);
  
  // Lightbox active photo state
  const [activePhoto, setActivePhoto] = React.useState<{ src: string; title: string } | null>(null);

  if (!unit) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <SEO title="Unit Tidak Ditemukan" description="Unit usaha koperasi tidak ditemukan." />
        <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderRadius: '50%', marginBottom: '20px' }}>
          <Icons.ShieldAlert size={48} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '10px' }}>
          Unit Usaha Tidak Ditemukan
        </h2>
        <p style={{ color: 'var(--text-muted-dark)', marginBottom: '30px' }}>
          Mohon maaf, halaman unit usaha yang Anda cari tidak tersedia atau telah dihapus oleh pengurus.
        </p>
        <Link to="/unit-usaha" className="btn btn-primary" style={{ gap: '8px' }}>
          <ArrowLeft size={16} />
          <span>Kembali ke Unit Usaha</span>
        </Link>
      </div>
    );
  }

  const renderIcon = (iconName: string, size = 36) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={size} color="var(--primary)" />;
    }
    return <Icons.Award size={size} color="var(--primary)" />;
  };

  // Check which unit it is
  const isAdisMart = unit.id === 'unit-1' || unit.name.toLowerCase().includes('mart') || unit.name.toLowerCase().includes('toko');
  const isSimpanPinjam = unit.id === 'unit-2' || unit.name.toLowerCase().includes('simpan') || unit.name.toLowerCase().includes('pinjam') || unit.name.toLowerCase().includes('syariah');

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out', paddingTop: '75px', backgroundColor: 'var(--light-bg)', minHeight: '100vh', paddingBottom: '80px' }}>
      <SEO 
        title={`${unit.name}`} 
        description={`Pelajari layanan detail unit usaha ${unit.name} Koperasi Karyawan PT Adis Dimension Footwear secara lengkap dan dinamis.`} 
      />

      {/* Back Button / Breadcrumbs */}
      <div className="container" style={{ paddingTop: '20px', marginBottom: '10px' }}>
        <Link 
          to="/unit-usaha" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-muted-dark)', 
            fontWeight: 700, 
            fontSize: '0.9rem', 
            transition: 'color 0.2s ease',
            textDecoration: 'none'
          }} 
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} 
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted-dark)'}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Unit Usaha</span>
        </Link>
      </div>

      {/* 1. BRAND LOGO HEADER SECTION (Diawali dengan Logo Adismart / Logo Unit) */}
      <div className="container" style={{ marginBottom: '40px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-md)',
          padding: '40px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background decoration */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15, 98, 254, 0.05) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none'
          }} />

          {/* Logo Container */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px 45px',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #f1f5f9',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '110px',
            transition: 'transform 0.3s ease'
          }} className="logo-header-box">
            {details?.logo_url ? (
              <img 
                src={details.logo_url} 
                alt={`Logo ${unit.name}`} 
                style={{ maxHeight: '80px', maxWidth: '280px', objectFit: 'contain' }} 
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted-dark)' }}>
                {renderIcon(unit.icon, 48)}
              </div>
            )}
          </div>

          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 8px 0', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
              {unit.name}
            </h1>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>
              Koperasi Karyawan PT Adis Dimension Footwear
            </p>
          </div>
        </div>
      </div>

      {/* 2. DESCRIPTION & CONTENT SECTION */}
      <div className="container" style={{ marginBottom: '40px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>
            Profil & Deskripsi Layanan
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted-dark)', lineHeight: 1.8, textAlign: 'justify', whiteSpace: 'pre-wrap', margin: 0 }}>
            {details?.long_description || unit.description}
          </p>
        </div>
      </div>

      {/* 3. MULTIPLE PHOTOS SHOWCASE (Khusus Adis Mart) */}
      {isAdisMart && (
        <div className="container" style={{ marginBottom: '50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>GALERI FOTO & CABANG</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', marginTop: '5px', marginBottom: '10px' }}>
              Kunjungi Cabang Resmi Adis Mart
            </h2>
            <p style={{ color: 'var(--text-muted-dark)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
              Adis Mart siap melayani kebutuhan harian Anda di berbagai lokasi strategis pabrik dan wilayah luar pabrik. Klik foto untuk memperbesar tampilan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            {/* Cabang 1: Adis Mart 1 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }} className="branch-card">
              <div 
                className="branch-img-container" 
                style={{ height: '220px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                onClick={() => setActivePhoto({ src: '/adismart-1.png', title: 'Interior Minimarket Adis Mart 1' })}
              >
                <img 
                  src="/adismart-1.png" 
                  alt="Adis Mart 1" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="branch-img-overlay">
                  <Icons.ZoomIn size={32} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
                </div>
                <span style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  zIndex: 2
                }}>
                  CABANG INTERNAL 1
                </span>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Adis Mart 1
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted-dark)', lineHeight: 1.5, marginBottom: '15px', flexGrow: 1 }}>
                  Terletak strategis di lingkungan Gedung A PT Adis Dimension Footwear, menyediakan kebutuhan pokok harian, minuman segar, dan camilan bagi karyawan di jam kerja.
                </p>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <Clock size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Senin - Jum'at: 06:00 - 21:00 WIB
                  </span>
                </div>
                <a 
                  href="https://wa.me/628123456789?text=Halo%20Admin%20Adis%20Mart%201,%20saya%20ingin%20bertanya..."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '10px 15px',
                    backgroundColor: 'rgba(15, 98, 254, 0.08)',
                    color: 'var(--primary)',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                  className="branch-action-btn"
                >
                  Hubungi Admin Cabang 1
                </a>
              </div>
            </div>

            {/* Cabang 2: Adis Mart 2 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }} className="branch-card">
              <div 
                className="branch-img-container" 
                style={{ height: '220px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                onClick={() => setActivePhoto({ src: '/adismart-2.png', title: 'Konter Transaksi Belanja Adis Mart 2' })}
              >
                <img 
                  src="/adismart-2.png" 
                  alt="Adis Mart 2" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="branch-img-overlay">
                  <Icons.ZoomIn size={32} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
                </div>
                <span style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  zIndex: 2
                }}>
                  CABANG INTERNAL 2
                </span>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Adis Mart 2
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted-dark)', lineHeight: 1.5, marginBottom: '15px', flexGrow: 1 }}>
                  Terletak di area produksi Gedung B, menyediakan minimarket belanja cepat, kebutuhan seragam kerja karyawan, serta ATK penunjang administrasi internal.
                </p>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <Clock size={16} color="var(--accent)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Senin - Jum'at: 06:30 - 17:00 WIB
                  </span>
                </div>
                <a 
                  href="https://wa.me/628123456789?text=Halo%20Admin%20Adis%20Mart%202,%20saya%20ingin%20bertanya..."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '10px 15px',
                    backgroundColor: 'rgba(15, 98, 254, 0.08)',
                    color: 'var(--primary)',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                  className="branch-action-btn"
                >
                  Hubungi Admin Cabang 2
                </a>
              </div>
            </div>

            {/* Cabang 3: Adis Mart Balaraja */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }} className="branch-card">
              <div 
                className="branch-img-container" 
                style={{ height: '220px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                onClick={() => setActivePhoto({ src: '/adismart-balaraja.png', title: 'Tampak Depan Adis Mart Balaraja' })}
              >
                <img 
                  src="/adismart-balaraja.png" 
                  alt="Adis Mart Balaraja" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="branch-img-overlay">
                  <Icons.ZoomIn size={32} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
                </div>
                <span style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'var(--gold)',
                  color: 'var(--text-dark)',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  zIndex: 2
                }}>
                  CABANG EKSTERNAL
                </span>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Adis Mart Balaraja
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted-dark)', lineHeight: 1.5, marginBottom: '15px', flexGrow: 1 }}>
                  Cabang retail mandiri di luar kawasan industri Balaraja, terbuka penuh untuk umum serta melayani pembelian dalam volume besar bagi anggota dan keluarga karyawan.
                </p>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <Clock size={16} color="var(--gold)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    Buka Setiap Hari: 06:00 - 22:00 WIB
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a 
                    href="https://wa.me/628123456789?text=Halo%20Admin%20Adis%20Mart%20Balaraja,%20saya%20ingin%20bertanya..."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      backgroundColor: 'rgba(15, 98, 254, 0.08)',
                      color: 'var(--primary)',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    className="branch-action-btn"
                  >
                    Hubungi WA
                  </a>
                  <a 
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 15px',
                      backgroundColor: 'rgba(250, 191, 0, 0.12)',
                      color: '#b48600',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s'
                    }}
                    className="branch-action-btn-gold"
                  >
                    Petunjuk Rute
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. DYNAMIC DETAILS / SPECS (Khusus Simpan Pinjam / Jasa Distribusi) */}
      {!isAdisMart && (details?.extra_info || isSimpanPinjam) && (
        <div className="container" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            {/* Info Operasional / Akad Syariah Card */}
            {details?.extra_info && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '35px', 
                borderRadius: '24px', 
                border: '1px solid var(--border-light)', 
                borderLeft: `6px solid ${isSimpanPinjam ? 'var(--accent)' : 'var(--gold)'}`,
                boxShadow: 'var(--shadow-md)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ 
                    backgroundColor: isSimpanPinjam ? 'rgba(16, 185, 129, 0.08)' : 'rgba(250, 191, 0, 0.12)', 
                    color: isSimpanPinjam ? 'var(--accent)' : '#b48600', 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {isSimpanPinjam ? <ShieldCheck size={20} /> : <Truck size={20} />}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                    {isSimpanPinjam ? 'Pilar Program & Akad Transaksi' : 'Kinerja Armada & Operasional'}
                  </h3>
                </div>
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '20px', 
                  borderRadius: '16px', 
                  fontSize: '0.94rem',
                  color: 'var(--text-dark)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {details.extra_info}
                </div>
              </div>
            )}

            {/* Simpan Pinjam Syariah Interactive Callout */}
            {isSimpanPinjam && (
              <div style={{ 
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary-hover) 100%)', 
                padding: '35px', 
                borderRadius: '24px', 
                color: 'white', 
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={20} color="var(--gold)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Prinsip Akad Syariah</span>
                </div>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
                  Seluruh program simpan pinjam syariah kami diawasi secara independen untuk menjamin kesesuaian transaksi dengan prinsip-prinsip syariat Islam tanpa adanya unsur riba, gharar, maupun maysir demi ketenteraman dan keberkahan ekonomi seluruh anggota koperasi.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 4.5 INFO TAMBAHAN AKAD SYARIAH (Khusus Simpan Pinjam Syariah) */}
      {isSimpanPinjam && (
        <div className="container" style={{ marginBottom: '50px' }}>
          <div style={{ 
            padding: '40px', 
            backgroundColor: 'white', 
            borderRadius: '24px', 
            border: '1px solid var(--border-light)', 
            boxShadow: 'var(--shadow-md)', 
            textAlign: 'center' 
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase' }}>Informasi Pembiayaan</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', marginTop: '5px', marginBottom: '15px' }}>
              Pengajuan Pembiayaan & Investasi Syariah
            </h2>
            <p style={{ color: 'var(--text-muted-dark)', maxWidth: '700px', margin: '0 auto 25px auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Untuk menjaga kesesuaian akad dan kenyamanan transaksi Anda, pengajuan pembiayaan syariah (Mudharabah, Qardhul Hasan, Wadiah) kini dapat dilakukan dengan menghubungi pengurus/Customer Service secara langsung melalui halaman Kontak atau berkonsultasi di Kantor Koperasi.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <Link to="/kontak" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Hubungi Kami
              </Link>
              <a 
                href="https://wa.me/628123456789" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary" 
                style={{ padding: '12px 28px', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Tanya via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. PAYMENTS & BENEFITS BAR (Untuk Adis Mart) */}
      {isAdisMart && (
        <div className="container" style={{ marginBottom: '50px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '35px', 
            borderRadius: '24px', 
            border: '1px solid var(--border-light)', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
              Metode Transaksi & Pembayaran Mudah
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                <div style={{ color: 'var(--primary)' }}><BadgeCheck size={24} /></div>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-dark)' }}>Sistem Potong Gaji</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>Khusus Karyawan PT Adis</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '16px', border: '1px solid #d1fae5' }}>
                <div style={{ color: 'var(--accent)' }}><BadgeCheck size={24} /></div>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-dark)' }}>Pembayaran QRIS</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>Mendukung E-Wallet & M-Banking</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', backgroundColor: '#fcf8e3', borderRadius: '16px', border: '1px solid #faebcc' }}>
                <div style={{ color: '#b48600' }}><BadgeCheck size={24} /></div>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-dark)' }}>Tunai (Cash)</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>Tersedia di semua cabang</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. CALL TO ACTION CONTACT BOX (WhatsApp CS) */}
      <div className="container" style={{ marginBottom: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          padding: '40px',
          borderRadius: '24px',
          color: 'white',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
            Butuh Layanan Lebih Lanjut?
          </h3>
          <p style={{ fontSize: '0.96rem', opacity: 0.9, maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
            Hubungi Customer Service Koperasi Karyawan PT Adis Dimension Footwear untuk informasi belanja grosir, kemitraan produk, atau pengaduan layanan.
          </p>
          <a
            href="https://wa.me/628123456789"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'white',
              color: 'var(--primary)',
              fontWeight: 800,
              padding: '12px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              marginTop: '10px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Icons.MessageCircle size={18} />
            <span>Hubungi CS WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Lightbox Modal for Photo Zoom */}
      {activePhoto && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.25s ease-out',
            padding: '20px'
          }}
          onClick={() => setActivePhoto(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              style={{
                position: 'absolute',
                top: '-50px',
                right: '0',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.5rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
              onClick={() => setActivePhoto(null)}
            >
              &times;
            </button>
            
            <img 
              src={activePhoto.src} 
              alt={activePhoto.title} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '70vh', 
                borderRadius: '16px', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                border: '4px solid rgba(255,255,255,0.1)'
              }}
            />
            
            <div style={{
              marginTop: '15px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              textAlign: 'center'
            }}>
              {activePhoto.title}
            </div>
          </div>
        </div>
      )}
      
      {/* Styles for Logo and Card Micro-animations */}
      <style>{`
        .logo-header-box:hover {
          transform: scale(1.03);
        }
        .branch-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg) !important;
        }
        .branch-img-container img {
          transition: transform 0.4s ease;
        }
        .branch-img-container:hover img {
          transform: scale(1.06);
        }
        .branch-img-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 98, 254, 0.2);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justifyContent: center;
          z-index: 1;
        }
        .branch-img-container:hover .branch-img-overlay {
          opacity: 1;
        }
        .branch-action-btn:hover {
          background-color: rgba(15, 98, 254, 0.15) !important;
        }
        .branch-action-btn-gold:hover {
          background-color: rgba(250, 191, 0, 0.2) !important;
        }
        .calculator-tab {
          border-bottom: 2px solid transparent !important;
        }
        .calculator-tab.active {
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);
        }
        .calculator-tab:hover:not(.active) {
          background-color: #f1f5f9 !important;
          color: var(--text-dark) !important;
        }
        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Dummy icon component fallback
const Sparkles = ({ size, color }: { size: number, color: string }) => {
  return <Icons.Sparkles size={size} color={color} />;
};
