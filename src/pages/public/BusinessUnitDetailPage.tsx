import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BusinessUnit, ProfileContent, BusinessUnitBranch } from '../../services/db';
import * as Icons from 'lucide-react';
import { ArrowLeft, Clock, ShieldCheck, Truck, BadgeCheck } from 'lucide-react';
import { SEO } from '../../components/SEO';

interface BranchCardProps {
  branch: BusinessUnitBranch;
  onZoom: (images: string[], index: number, title: string) => void;
}

const BranchCard: React.FC<BranchCardProps> = ({ branch, onZoom }) => {
  const [activeImgIndex, setActiveImgIndex] = React.useState(0);
  const images = branch.images && branch.images.length > 0 ? branch.images : ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'];

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
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
        style={{ height: '220px', overflow: 'hidden', position: 'relative', cursor: 'zoom-in' }}
        onClick={() => onZoom(images, activeImgIndex, branch.name)}
      >
        <img 
          src={images[activeImgIndex]} 
          alt={`${branch.name} ${activeImgIndex + 1}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Hover overlay hint */}
        <div className="branch-img-overlay">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            padding: '8px 16px',
            borderRadius: '30px',
            backdropFilter: 'blur(4px)'
          }}>
            <Icons.ZoomIn size={18} color="white" />
            <span style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700 }}>Lihat Foto</span>
          </div>
        </div>

        {/* Slideshow controls inside card image */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(e); }}
              type="button"
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: 'none',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 4,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.65)'}
              title="Foto Sebelumnya"
            >
              <Icons.ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(e); }}
              type="button"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: 'none',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 4,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.65)'}
              title="Foto Selanjutnya"
            >
              <Icons.ChevronRight size={18} />
            </button>

            {/* Dots Indicator */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 2,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              padding: '4px 8px',
              borderRadius: '20px'
            }}>
              {images.map((_, idx) => (
                <div 
                  key={idx}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: idx === activeImgIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>
          {branch.name}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted-dark)', lineHeight: 1.5, marginBottom: '15px', flexGrow: 1 }}>
          {branch.description}
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
            {branch.hours}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {branch.whatsapp && branch.map_url ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={`https://wa.me/${branch.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo Admin ${branch.name}, saya ingin bertanya...`)}`}
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
                href={branch.map_url}
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
          ) : (
            <>
              {branch.whatsapp && (
                <a 
                  href={`https://wa.me/${branch.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo Admin ${branch.name}, saya ingin bertanya...`)}`}
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
                  Hubungi Admin {branch.name}
                </a>
              )}
              {branch.map_url && (
                <a 
                  href={branch.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface BusinessUnitDetailPageProps {
  units: BusinessUnit[];
  profile: ProfileContent | null;
}

export const BusinessUnitDetailPage: React.FC<BusinessUnitDetailPageProps> = ({ units, profile }) => {
  const { id } = useParams<{ id: string }>();
  const unit = units.find(u => u.id === id);
  const details = profile?.unit_details?.find(d => d.unit_id === id);
  
  // Lightbox active photo state
  const [activePhoto, setActivePhoto] = React.useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

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

      {/* 3. DYNAMIC BRANCHES SHOWCASE */}
      {details?.branches && details.branches.length > 0 && (
        <div className="container" style={{ marginBottom: '50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>GALERI FOTO & CABANG</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', marginTop: '5px', marginBottom: '10px' }}>
              Kunjungi Cabang Resmi {unit.name}
            </h2>
            <p style={{ color: 'var(--text-muted-dark)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
              Kami siap melayani kebutuhan Anda di berbagai lokasi resmi kami. Klik foto untuk memperbesar tampilan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {details.branches.map((branch) => (
              <BranchCard 
                key={branch.id} 
                branch={branch} 
                onZoom={(images, index, title) => setActivePhoto({ images, index, title })} 
              />
            ))}
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
                transition: 'background-color 0.2s',
                zIndex: 10001
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
              onClick={() => setActivePhoto(null)}
            >
              &times;
            </button>
            
            {/* Slideshow controls inside zoom lightbox */}
            {activePhoto.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhoto(prev => prev ? {
                      ...prev,
                      index: (prev.index - 1 + prev.images.length) % prev.images.length
                    } : null);
                  }}
                  type="button"
                  className="lightbox-nav-btn lightbox-prev-btn"
                  style={{
                    position: 'absolute',
                    left: '-70px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    color: 'white',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                  title="Foto Sebelumnya"
                >
                  <Icons.ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhoto(prev => prev ? {
                      ...prev,
                      index: (prev.index + 1) % prev.images.length
                    } : null);
                  }}
                  type="button"
                  className="lightbox-nav-btn lightbox-next-btn"
                  style={{
                    position: 'absolute',
                    right: '-70px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    color: 'white',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                  title="Foto Selanjutnya"
                >
                  <Icons.ChevronRight size={24} />
                </button>
              </>
            )}

            <img 
              src={activePhoto.images[activePhoto.index]} 
              alt={`${activePhoto.title} ${activePhoto.index + 1}`} 
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
              {activePhoto.title} {activePhoto.images.length > 1 ? `(${activePhoto.index + 1}/${activePhoto.images.length})` : ''}
            </div>

            {/* Dots Indicator inside zoom lightbox */}
            {activePhoto.images.length > 1 && (
              <div style={{
                marginTop: '12px',
                display: 'flex',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '6px 12px',
                borderRadius: '20px'
              }}>
                {activePhoto.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhoto(prev => prev ? { ...prev, index: idx } : null);
                    }}
                    style={{
                      border: 'none',
                      padding: 0,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: idx === activePhoto.index ? 'white' : 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            )}
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
          background: rgba(15, 23, 42, 0.25);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
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
        @media (max-width: 768px) {
          .lightbox-prev-btn {
            left: 10px !important;
            width: 40px !important;
            height: 40px !important;
            background-color: rgba(15, 23, 42, 0.6) !important;
          }
          .lightbox-next-btn {
            right: 10px !important;
            width: 40px !important;
            height: 40px !important;
            background-color: rgba(15, 23, 42, 0.6) !important;
          }
        }
      `}</style>
    </div>
  );
};

// Dummy icon component fallback
const Sparkles = ({ size, color }: { size: number, color: string }) => {
  return <Icons.Sparkles size={size} color={color} />;
};
