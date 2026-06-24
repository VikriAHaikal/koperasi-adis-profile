import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BusinessUnit, ProfileContent, BusinessUnitBranch } from '../../services/db';
import * as Icons from 'lucide-react';
import { ArrowLeft, Clock, ShieldCheck, Truck, MapPin, Phone } from 'lucide-react';
import { SEO } from '../../components/SEO';

/* ─────────────────────────────────────────
   BRANCH CARD COMPONENT
───────────────────────────────────────── */
interface BranchCardProps {
  branch: BusinessUnitBranch;
  index: number;
  onZoom: (images: string[], startIndex: number, title: string) => void;
}

const BranchCard: React.FC<BranchCardProps> = ({ branch, index, onZoom }) => {
  const [activeImgIndex, setActiveImgIndex] = React.useState(0);
  const images =
    branch.images && branch.images.length > 0
      ? branch.images
      : ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const accentColors = [
    { bg: 'rgba(15,98,254,0.08)', border: 'rgba(15,98,254,0.15)', text: 'var(--primary)', badge: '#0f62fe' },
    { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: 'var(--accent)', badge: '#10b981' },
    { bg: 'rgba(250,191,0,0.10)', border: 'rgba(250,191,0,0.25)', text: '#b48600', badge: '#f59e0b' },
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div className="branch-card" style={{
      backgroundColor: 'white',
      borderRadius: '28px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(15,23,42,0.08)',
      border: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.35s ease, box-shadow 0.35s ease',
    }}>

      {/* ── Image Area ── */}
      <div
        className="branch-img-container"
        style={{ height: '260px', overflow: 'hidden', position: 'relative', cursor: 'zoom-in', flexShrink: 0 }}
        onClick={() => onZoom(images, activeImgIndex, branch.name)}
      >
        <img
          src={images[activeImgIndex]}
          alt={`${branch.name} foto ${activeImgIndex + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="branch-thumb"
        />

        {/* Dark gradient at bottom for readability */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Photo count badge */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', top: '14px', left: '14px', zIndex: 3,
            backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)',
            color: 'white', fontSize: '0.72rem', fontWeight: 800,
            padding: '4px 10px', borderRadius: '20px',
            display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.3px',
          }}>
            <Icons.Images size={12} />
            {images.length} Foto
          </div>
        )}

        {/* Hover overlay */}
        <div className="branch-img-overlay">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '9px 18px', borderRadius: '30px',
          }}>
            <Icons.ZoomIn size={16} color="white" />
            <span style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.2px' }}>Lihat Foto Penuh</span>
          </div>
        </div>

        {/* Prev / Next arrows — only shown when multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="slide-arrow"
              style={{ left: '12px' }}
              title="Foto Sebelumnya"
            >
              <Icons.ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="slide-arrow"
              style={{ right: '12px' }}
              title="Foto Selanjutnya"
            >
              <Icons.ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div style={{
              position: 'absolute', bottom: '12px', left: '50%',
              transform: 'translateX(-50%)', display: 'flex', gap: '5px', zIndex: 3,
            }}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActiveImgIndex(idx); }}
                  style={{
                    border: 'none', padding: 0, cursor: 'pointer',
                    width: idx === activeImgIndex ? '18px' : '6px',
                    height: '6px', borderRadius: '3px',
                    backgroundColor: idx === activeImgIndex ? 'white' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Card Body ── */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '14px' }}>
        {/* Name + accent line */}
        <div>
          <div style={{
            display: 'inline-block', height: '3px', width: '32px',
            backgroundColor: accent.badge, borderRadius: '4px', marginBottom: '8px',
          }} />
          <h3 style={{
            fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)',
            margin: 0, fontFamily: 'var(--font-heading)', lineHeight: 1.3,
          }}>
            {branch.name}
          </h3>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '0.88rem', color: 'var(--text-muted-dark)',
          lineHeight: 1.6, margin: 0, flexGrow: 1,
        }}>
          {branch.description}
        </p>

        {/* Hours */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: '#f8fafc', padding: '10px 14px',
          borderRadius: '14px', border: `1px solid ${accent.border}`,
        }}>
          <div style={{
            backgroundColor: accent.bg, color: accent.text,
            width: '30px', height: '30px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Clock size={15} />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            {branch.hours}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {branch.whatsapp && (
            <a
              href={`https://wa.me/${branch.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo Admin ${branch.name}, saya ingin bertanya...`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="branch-btn-wa"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '7px', padding: '11px 12px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: 'white', borderRadius: '14px',
                fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none',
                transition: 'opacity 0.2s, transform 0.2s',
                boxShadow: '0 3px 10px rgba(37,211,102,0.3)',
              }}
            >
              <Icons.MessageCircle size={15} />
              Hubungi WA
            </a>
          )}
          {branch.map_url && (
            <a
              href={branch.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="branch-btn-map"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '7px', padding: '11px 14px',
                backgroundColor: accent.bg, border: `1px solid ${accent.border}`,
                color: accent.text, borderRadius: '14px',
                fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none',
                transition: 'background-color 0.2s, transform 0.2s',
              }}
            >
              <MapPin size={15} />
              Rute
            </a>
          )}
        </div>
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
interface BusinessUnitDetailPageProps {
  units: BusinessUnit[];
  profile: ProfileContent | null;
}

export const BusinessUnitDetailPage: React.FC<BusinessUnitDetailPageProps> = ({ units, profile }) => {
  const { id } = useParams<{ id: string }>();
  const unit = units.find(u => u.id === id);
  const details = profile?.unit_details?.find(d => d.unit_id === id);

  const [activePhoto, setActivePhoto] = React.useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  // Close lightbox on Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhoto(null);
      if (e.key === 'ArrowRight' && activePhoto) {
        setActivePhoto(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
      }
      if (e.key === 'ArrowLeft' && activePhoto) {
        setActivePhoto(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activePhoto]);

  if (!unit) {
    return (
      <div style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <SEO title="Unit Tidak Ditemukan" description="Unit usaha koperasi tidak ditemukan." />
        <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', borderRadius: '50%', marginBottom: '20px' }}>
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
    return IconComponent
      ? <IconComponent size={size} color="var(--primary)" />
      : <Icons.Award size={size} color="var(--primary)" />;
  };

  const isAdisMart = unit.id === 'unit-1' || unit.name.toLowerCase().includes('mart') || unit.name.toLowerCase().includes('toko');
  const isSimpanPinjam = unit.id === 'unit-2' || unit.name.toLowerCase().includes('simpan') || unit.name.toLowerCase().includes('pinjam') || unit.name.toLowerCase().includes('syariah');

  const totalBranches = details?.branches?.length ?? 0;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', paddingTop: '75px', backgroundColor: 'var(--light-bg)', minHeight: '100vh', paddingBottom: '80px' }}>
      <SEO
        title={`${unit.name}`}
        description={`Pelajari layanan detail unit usaha ${unit.name} Koperasi Karyawan PT Adis Dimension Footwear secara lengkap dan dinamis.`}
      />

      {/* ── Breadcrumb ── */}
      <div className="container" style={{ paddingTop: '20px', marginBottom: '20px' }}>
        <Link
          to="/unit-usaha"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: 'var(--text-muted-dark)', fontWeight: 700, fontSize: '0.88rem',
            textDecoration: 'none', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted-dark)'}
        >
          <ArrowLeft size={15} />
          <span>Unit Usaha</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: 'var(--primary)' }}>{unit.name}</span>
        </Link>
      </div>

      {/* ── 1. HERO HEADER ── */}
      <div className="container" style={{ marginBottom: '36px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0f62fe 100%)',
          borderRadius: '28px', overflow: 'hidden', position: 'relative',
          padding: '48px 40px', display: 'flex', alignItems: 'center',
          gap: '40px', flexWrap: 'wrap',
          boxShadow: '0 20px 60px rgba(15,98,254,0.25)',
        }}>
          {/* Background decorations */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '250px', height: '250px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '30%',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Logo Box */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '20px 36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minWidth: '140px', minHeight: '100px', flexShrink: 0,
          }}>
            {details?.logo_url ? (
              <img src={details.logo_url} alt={`Logo ${unit.name}`}
                style={{ maxHeight: '70px', maxWidth: '220px', objectFit: 'contain', filter: 'brightness(1.1)' }} />
            ) : (
              renderIcon(unit.icon, 52)
            )}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 800, color: 'rgba(147,197,253,0.9)',
              letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px',
            }}>
              Unit Usaha Koperasi
            </span>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900,
              color: 'white', margin: '0 0 10px 0',
              fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px', lineHeight: 1.2,
            }}>
              {unit.name}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Koperasi Karyawan PT Adis Dimension Footwear
            </p>

            {/* Quick stats */}
            {totalBranches > 0 && (
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', padding: '8px 16px',
                }}>
                  <Icons.Store size={16} color="rgba(147,197,253,0.9)" />
                  <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>
                    {totalBranches} Cabang
                  </span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', padding: '8px 16px',
                }}>
                  <Icons.ShieldCheck size={16} color="rgba(147,197,253,0.9)" />
                  <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>
                    Resmi Koperasi
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. DESCRIPTION ── */}
      <div className="container" style={{ marginBottom: '36px' }}>
        <div style={{
          backgroundColor: 'white', padding: '36px 40px',
          borderRadius: '24px', border: '1px solid var(--border-light)',
          boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{
              backgroundColor: 'rgba(15,98,254,0.08)', color: 'var(--primary)',
              width: '40px', height: '40px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icons.FileText size={20} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Profil &amp; Deskripsi Layanan
            </h2>
          </div>
          <p style={{
            fontSize: '1.0rem', color: 'var(--text-muted-dark)',
            lineHeight: 1.85, textAlign: 'justify', whiteSpace: 'pre-wrap', margin: 0,
          }}>
            {details?.long_description || unit.description}
          </p>
        </div>
      </div>

      {/* ── 3. BRANCHES GALLERY ── */}
      {details?.branches && details.branches.length > 0 && (
        <div className="container" style={{ marginBottom: '50px' }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{
                fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px',
              }}>
                <Icons.Camera size={13} />
                Galeri Foto &amp; Lokasi Cabang
              </span>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', fontWeight: 800,
                color: 'var(--text-dark)', fontFamily: 'var(--font-heading)',
                margin: 0, letterSpacing: '-0.3px',
              }}>
                Kunjungi Cabang Resmi <span style={{ color: 'var(--primary)' }}>{unit.name}</span>
              </h2>
            </div>
            <div style={{
              backgroundColor: 'rgba(15,98,254,0.07)', border: '1px solid rgba(15,98,254,0.15)',
              borderRadius: '12px', padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Icons.Info size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                Klik foto untuk memperbesar
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '28px' }}>
            {details.branches.map((branch, idx) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                index={idx}
                onZoom={(imgs, startIdx, title) => setActivePhoto({ images: imgs, index: startIdx, title })}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── 4. EXTRA INFO (non-Adismart) ── */}
      {!isAdisMart && (details?.extra_info || isSimpanPinjam) && (
        <div className="container" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {details?.extra_info && (
              <div style={{
                backgroundColor: 'white', padding: '35px',
                borderRadius: '24px', border: '1px solid var(--border-light)',
                borderLeft: `5px solid ${isSimpanPinjam ? 'var(--accent)' : 'var(--gold)'}`,
                boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    backgroundColor: isSimpanPinjam ? 'rgba(16,185,129,0.08)' : 'rgba(250,191,0,0.12)',
                    color: isSimpanPinjam ? 'var(--accent)' : '#b48600',
                    width: '42px', height: '42px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isSimpanPinjam ? <ShieldCheck size={20} /> : <Truck size={20} />}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                    {isSimpanPinjam ? 'Pilar Program & Akad Transaksi' : 'Kinerja Armada & Operasional'}
                  </h3>
                </div>
                <div style={{
                  backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px',
                  fontSize: '0.93rem', color: 'var(--text-dark)', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                }}>
                  {details.extra_info}
                </div>
              </div>
            )}
            {isSimpanPinjam && (
              <div style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary-hover) 100%)',
                padding: '35px', borderRadius: '24px', color: 'white',
                boxShadow: '0 8px 30px rgba(16,185,129,0.25)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={20} color="var(--gold)" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Prinsip Akad Syariah</span>
                </div>
                <p style={{ fontSize: '0.93rem', lineHeight: 1.7, margin: 0, opacity: 0.95 }}>
                  Seluruh program simpan pinjam syariah kami diawasi secara independen untuk menjamin kesesuaian transaksi dengan prinsip-prinsip syariat Islam tanpa adanya unsur riba, gharar, maupun maysir demi ketenteraman dan keberkahan ekonomi seluruh anggota koperasi.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 4.5 SYARIAH CTA ── */}
      {isSimpanPinjam && (
        <div className="container" style={{ marginBottom: '50px' }}>
          <div style={{
            padding: '44px 40px', backgroundColor: 'white',
            borderRadius: '24px', border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(15,23,42,0.06)', textAlign: 'center',
          }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Informasi Pembiayaan</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', marginTop: '6px', marginBottom: '14px' }}>
              Pengajuan Pembiayaan &amp; Investasi Syariah
            </h2>
            <p style={{ color: 'var(--text-muted-dark)', maxWidth: '700px', margin: '0 auto 25px auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Untuk menjaga kesesuaian akad dan kenyamanan transaksi Anda, pengajuan pembiayaan syariah (Mudharabah, Qardhul Hasan, Wadiah) kini dapat dilakukan dengan menghubungi pengurus/Customer Service secara langsung melalui halaman Kontak atau berkonsultasi di Kantor Koperasi.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/kontak" className="btn btn-primary" style={{ padding: '12px 28px' }}>Hubungi Kami</Link>
              <a
                href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ padding: '12px 28px', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(16,185,129,0.05)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Tanya via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. PAYMENT METHODS (Adismart) ── */}
      {isAdisMart && (
        <div className="container" style={{ marginBottom: '48px' }}>
          <div style={{
            backgroundColor: 'white', padding: '36px 40px',
            borderRadius: '24px', border: '1px solid var(--border-light)',
            boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                backgroundColor: 'rgba(15,98,254,0.08)', color: 'var(--primary)',
                width: '40px', height: '40px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icons.CreditCard size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Metode Transaksi &amp; Pembayaran
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                {
                  icon: <Icons.Banknote size={28} />,
                  label: 'Potong Gaji',
                  sub: 'Khusus Karyawan PT Adis',
                  bg: '#eff6ff', border: '#dbeafe', icon_color: 'var(--primary)',
                },
                {
                  icon: <Icons.QrCode size={28} />,
                  label: 'Pembayaran QRIS',
                  sub: 'E-Wallet & M-Banking',
                  bg: '#ecfdf5', border: '#d1fae5', icon_color: 'var(--accent)',
                },
                {
                  icon: <Icons.Wallet size={28} />,
                  label: 'Tunai (Cash)',
                  sub: 'Tersedia di semua cabang',
                  bg: '#fcf8e3', border: '#faebcc', icon_color: '#b48600',
                },
              ].map((m, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', gap: '12px',
                  alignItems: 'flex-start', padding: '20px',
                  backgroundColor: m.bg, borderRadius: '18px', border: `1px solid ${m.border}`,
                }}>
                  <div style={{ color: m.icon_color }}>{m.icon}</div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--text-dark)', marginBottom: '2px' }}>{m.label}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>{m.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. CTA CONTACT BOX ── */}
      <div className="container" style={{ marginBottom: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 60%, #0f62fe 100%)',
          padding: '48px 40px', borderRadius: '28px', color: 'white',
          boxShadow: '0 20px 60px rgba(15,98,254,0.25)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '16px', textAlign: 'center',
        }}>
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
            width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.Headphones size={26} color="white" />
          </div>
          <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
            Butuh Bantuan atau Informasi Lebih?
          </h3>
          <p style={{ fontSize: '0.95rem', opacity: 0.85, maxWidth: '580px', margin: 0, lineHeight: 1.65 }}>
            Hubungi Customer Service Koperasi Karyawan PT Adis Dimension Footwear untuk informasi belanja, kemitraan produk, atau pengaduan layanan.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
            <a
              href="https://wa.me/628123456789"
              target="_blank" rel="noopener noreferrer"
              className="cta-wa-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                backgroundColor: '#25D366', color: 'white',
                fontWeight: 800, padding: '13px 28px', borderRadius: '14px',
                textDecoration: 'none', fontSize: '0.92rem',
                boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(37,211,102,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.35)'; }}
            >
              <Icons.MessageCircle size={18} />
              Chat via WhatsApp
            </a>
            <Link
              to="/kontak"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'white', fontWeight: 700, padding: '13px 24px',
                borderRadius: '14px', textDecoration: 'none', fontSize: '0.92rem',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
            >
              <Phone size={17} />
              Halaman Kontak
            </Link>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {activePhoto && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, animation: 'fadeIn 0.2s ease-out', padding: '24px',
          }}
          onClick={() => setActivePhoto(null)}
        >
          {/* Close */}
          <button
            onClick={() => setActivePhoto(null)}
            style={{
              position: 'fixed', top: '20px', right: '20px',
              backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', width: '44px', height: '44px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.4rem', zIndex: 10002,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
          >
            <Icons.X size={20} />
          </button>

          <div
            style={{
              position: 'relative', display: 'flex', flexDirection: 'column',
              alignItems: 'center', maxWidth: '90vw', animation: 'scaleUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Prev arrow */}
            {activePhoto.images.length > 1 && (
              <button
                onClick={() => setActivePhoto(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null)}
                className="lightbox-nav-btn lightbox-prev-btn"
                style={{
                  position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                  width: '52px', height: '52px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10001, cursor: 'pointer', transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
              >
                <Icons.ChevronLeft size={26} />
              </button>
            )}

            {/* Image */}
            <img
              key={activePhoto.index}
              src={activePhoto.images[activePhoto.index]}
              alt={`${activePhoto.title} ${activePhoto.index + 1}`}
              style={{
                maxWidth: '100%', maxHeight: '75vh',
                borderRadius: '20px',
                boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
                border: '3px solid rgba(255,255,255,0.08)',
                animation: 'scaleUp 0.25s ease-out',
              }}
            />

            {/* Caption */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 8px 0', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                {activePhoto.title}
              </p>
              {activePhoto.images.length > 1 && (
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', fontWeight: 600 }}>
                  {activePhoto.index + 1} / {activePhoto.images.length}
                </span>
              )}
            </div>

            {/* Dot indicators */}
            {activePhoto.images.length > 1 && (
              <div style={{ display: 'flex', gap: '7px', marginTop: '12px' }}>
                {activePhoto.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(prev => prev ? { ...prev, index: idx } : null)}
                    style={{
                      border: 'none', padding: 0, cursor: 'pointer',
                      width: idx === activePhoto.index ? '22px' : '7px',
                      height: '7px', borderRadius: '4px',
                      backgroundColor: idx === activePhoto.index ? 'white' : 'rgba(255,255,255,0.35)',
                      transition: 'all 0.25s ease',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Next arrow */}
            {activePhoto.images.length > 1 && (
              <button
                onClick={() => setActivePhoto(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null)}
                className="lightbox-nav-btn lightbox-next-btn"
                style={{
                  position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                  width: '52px', height: '52px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10001, cursor: 'pointer', transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.22)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
              >
                <Icons.ChevronRight size={26} />
              </button>
            )}

            {/* Keyboard hint */}
            <p style={{ marginTop: '14px', color: 'rgba(255,255,255,0.3)', fontSize: '0.74rem' }}>
              Gunakan tombol ← → atau klik di luar untuk menutup
            </p>
          </div>
        </div>
      )}

      {/* ── Styles ── */}
      <style>{`
        .branch-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(15,23,42,0.14) !important;
        }
        .branch-thumb {
          transition: transform 0.5s ease;
        }
        .branch-img-container:hover .branch-thumb {
          transform: scale(1.07);
        }
        .branch-img-overlay {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15,23,42,0.3);
          opacity: 0; transition: opacity 0.3s ease;
          z-index: 2; display: flex; align-items: center; justify-content: center;
        }
        .branch-img-container:hover .branch-img-overlay { opacity: 1; }

        .slide-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(15,23,42,0.6); backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.15); color: white;
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          z-index: 5; cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
          opacity: 0;
        }
        .branch-img-container:hover .slide-arrow { opacity: 1; }
        .slide-arrow:hover {
          background: rgba(15,23,42,0.85) !important;
          transform: translateY(-50%) scale(1.08);
        }

        .branch-btn-wa:hover { opacity: 0.88; transform: translateY(-1px); }
        .branch-btn-map:hover { transform: translateY(-1px); }
        .cta-wa-btn:hover { opacity: 0.92; }

        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 640px) {
          .lightbox-prev-btn { left: 8px !important; width: 42px !important; height: 42px !important; }
          .lightbox-next-btn { right: 8px !important; width: 42px !important; height: 42px !important; }
        }
      `}</style>
    </div>
  );
};

// Dummy icon fallback
const Sparkles = ({ size, color }: { size: number; color: string }) => (
  <Icons.Sparkles size={size} color={color} />
);
