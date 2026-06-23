import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hero } from '../../components/Hero';
import { Users, Briefcase, TrendingUp, Award, ArrowRight } from 'lucide-react';
import type { HeroSlide, ProfileContent, BusinessUnit, NewsArticle, ContactInfo } from '../../services/db';
import { SEO } from '../../components/SEO';

interface HomeProps {
  slides: HeroSlide[];
  profile: ProfileContent | null;
  units: BusinessUnit[];
  news: NewsArticle[];
  contactInfo?: ContactInfo | null;
}

export const Home: React.FC<HomeProps> = ({ slides, profile, units, news, contactInfo }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    members: 0,
    unitsCount: 0,
    assets: 0,
    growth: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = React.useRef<HTMLDivElement>(null);

  // Target numbers from DB profile
  const targetMembers = parseInt(profile?.stats_members || '5280') || 5280;
  const targetAssets = parseFloat(profile?.stats_assets || '12.5') || 12.5;
  const targetGrowth = parseInt(profile?.stats_growth || '12') || 12;
  const targetUnits = units.length || 3;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // trigger only once
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [profile, units]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500; // ms
    const steps = 40;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setStats({
        members: Math.floor((targetMembers / steps) * currentStep),
        unitsCount: Math.min(targetUnits, Math.floor((targetUnits / steps) * currentStep) || 1),
        assets: Math.floor((targetAssets / steps) * currentStep * 10) / 10,
        growth: Math.floor((targetGrowth / steps) * currentStep)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setStats({
          members: targetMembers,
          unitsCount: targetUnits,
          assets: targetAssets,
          growth: targetGrowth
        });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, targetMembers, targetAssets, targetGrowth, targetUnits]);

  // Take only latest 2 news articles for homepage preview
  const previewNews = news.slice(0, 2);

  // Take only latest 3 business units for homepage preview
  const previewUnits = units.slice(0, 3);

  const partners = profile?.partners || [];
  
  const getMarqueeList = (list: typeof partners) => {
    if (list.length === 0) return [];
    let repeated = [...list];
    while (repeated.length < 10) {
      repeated = [...repeated, ...list];
    }
    return [...repeated, ...repeated];
  };

  const marqueePartners = getMarqueeList(partners);

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <SEO 
        title="Beranda" 
        description="Website Resmi Koperasi Karyawan PT Adis Dimension Footwear (KOPKAR ADIS) — Adis Mart, Simpan Pinjam Syariah bebas riba, Jasa Logistik, Laporan RAT, dan Pendaftaran Anggota Online di Balaraja, Tangerang."
        canonicalPath="/"
      />
      {/* Hero Slider */}
      <Hero slides={slides} onCtaClick={() => navigate('/kontak')} whatsappNumber={contactInfo?.whatsapp} />

      {/* 📊 Statistics Counter Section */}
      <section ref={statsRef} className="section" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div className="glass-card stat-card-hover" style={{ padding: '30px 20px', textAlign: 'center', background: '#f8fafc', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <Users size={36} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '5px', fontFamily: 'var(--font-heading)' }}>
                {stats.members.toLocaleString('id-ID')}+
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', fontWeight: 600 }}>Anggota Karyawan Aktif</p>
            </div>

            <div className="glass-card stat-card-hover" style={{ padding: '30px 20px', textAlign: 'center', background: '#f8fafc', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <Briefcase size={36} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '5px', fontFamily: 'var(--font-heading)' }}>
                {stats.unitsCount}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', fontWeight: 600 }}>Unit Usaha Mandiri</p>
            </div>

            <div className="glass-card stat-card-hover" style={{ padding: '30px 20px', textAlign: 'center', background: '#f8fafc', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <TrendingUp size={36} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '5px', fontFamily: 'var(--font-heading)' }}>
                Rp {stats.assets}M+
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', fontWeight: 600 }}>Total Aset Koperasi</p>
            </div>

            <div className="glass-card stat-card-hover" style={{ padding: '30px 20px', textAlign: 'center', background: '#f8fafc', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <Award size={36} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '5px', fontFamily: 'var(--font-heading)' }}>
                {stats.growth}%
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', fontWeight: 600 }}>Kenaikan SHU RAT 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Section Preview */}
      {profile && (
        <section className="section" style={{ backgroundColor: '#ffffff' }}>
          <div className="container">
            <div className="grid-2" style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                  <span className="section-subtitle">Profil Singkat</span>
                  <h2 className="section-title" style={{ display: 'block', textAlign: 'left', paddingBottom: '10px' }}>Siapa Kami?</h2>
                  <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '2px', marginTop: '10px' }} />
                </div>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-muted-dark)', lineHeight: 1.7, textAlign: 'justify' }}>
                  {profile.sejarah.substring(0, 240)}...
                </p>
                <div>
                  <Link to="/tentang-kami" className="btn btn-primary" style={{ gap: '8px' }}>
                    <span>Kenali Selengkapnya</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Graphic illustration */}
              <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <img 
                  src={profile.sejarah_image_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"} 
                  alt="Tentang Kopkar Adis"
                  style={{ width: '100%', maxWidth: '450px', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Business Units Preview */}
      {previewUnits.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-subtitle">Fasilitas Anggota</span>
              <h2 className="section-title">Unit Usaha Utama</h2>
            </div>

            <div className="grid-3" style={{ marginBottom: '40px' }}>
              {previewUnits.map((unit) => (
                <div key={unit.id} className="glass-card unit-preview-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0px', overflow: 'hidden', backgroundColor: 'white', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  {unit.image_url && (
                    <div style={{ height: '180px', width: '100%', overflow: 'hidden' }}>
                      <img
                        src={unit.image_url}
                        alt={unit.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-dark)' }}>
                      {unit.name}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', lineHeight: 1.5, marginBottom: '15px', flexGrow: 1 }}>
                      {unit.description.substring(0, 100)}...
                    </p>
                    <div style={{ marginTop: 'auto' }}>
                      <Link 
                        to={`/unit-usaha/${unit.id}`} 
                        style={{ 
                          fontSize: '0.88rem', 
                          fontWeight: 700, 
                          color: 'var(--primary)', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px' 
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-hover)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--primary)'}
                      >
                        <span>Selengkapnya</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/unit-usaha" className="btn btn-secondary" style={{ gap: '8px' }}>
                <span>Lihat Seluruh Unit Usaha</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 🤝 Partners & Mitra Kerja Sama Section */}
      {partners.length > 0 && (
        <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', overflow: 'hidden', padding: '60px 0' }}>
          <div className="container" style={{ marginBottom: '35px' }}>
            <div className="section-title-wrapper" style={{ marginBottom: '0px' }}>
              <span className="section-subtitle">Kolaborasi Strategis</span>
              <h2 className="section-title">Mitra Kerja Sama Kami</h2>
            </div>
          </div>
          
          <div className="marquee-container">
            <div className="marquee-track">
              {marqueePartners.map((partner, pIdx) => (
                <div key={pIdx} className="marquee-item" title={partner.name}>
                  {partner.logo_url ? (
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name} 
                      className="marquee-logo"
                      loading="lazy"
                    />
                  ) : (
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted-dark)', textAlign: 'center' }}>
                      {partner.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News Preview */}
      {previewNews.length > 0 && (
        <section className="section" style={{ backgroundColor: '#ffffff' }}>
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-subtitle">Informasi Terkini</span>
              <h2 className="section-title">Berita Koperasi Terbaru</h2>
            </div>

            <div className="grid-2" style={{ marginBottom: '40px' }}>
              {previewNews.map((article) => (
                <div 
                  key={article.id} 
                  className="glass-card news-card news-preview-card"
                  style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#f8fafc', border: '1px solid var(--border-light)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <div className="news-thumbnail-sm">
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} 
                      loading="lazy"
                    />
                  </div>
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                      {article.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)', margin: 0 }}>
                      {article.excerpt.substring(0, 80)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/berita" className="btn btn-secondary" style={{ gap: '8px' }}>
                <span>Buka Portal Berita</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Local hover states styles */}
      <style>{`
        .stat-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(15, 98, 254, 0.08) !important;
          border-color: var(--primary) !important;
        }
        .unit-preview-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(15, 98, 254, 0.08) !important;
          border-color: var(--primary) !important;
        }
        .news-preview-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(15, 98, 254, 0.08) !important;
          border-color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
};
