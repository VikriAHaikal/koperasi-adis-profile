import React, { useState, useEffect, useRef } from 'react';
import type { ProfileContent, Milestone } from '../../services/db';
import { Users, Compass, Eye, CheckCircle2, ShieldCheck, HeartHandshake, Trophy } from 'lucide-react';
import { SEO } from '../../components/SEO';

const TimelineCard: React.FC<{ milestone: Milestone; index: number }> = ({ milestone, index }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div 
      ref={ref}
      className={`timeline-item ${isLeft ? 'timeline-left' : 'timeline-right'}`}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      <div className="timeline-content">
        <div className="timeline-year">{milestone.year}</div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {milestone.title}
        </h4>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted-dark)', lineHeight: 1.6, margin: 0, textAlign: 'justify' }}>
          {milestone.description}
        </p>
      </div>
    </div>
  );
};


interface AboutPageProps {
  profile: ProfileContent | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ profile }) => {
  const [expandedAwards, setExpandedAwards] = useState<Record<number, boolean>>({});

  if (!profile) return null;

  const toggleAward = (index: number) => {
    setExpandedAwards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getCultureIcon = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck size={36} color="var(--primary)" />;
      case 'Users':
        return <Users size={36} color="var(--primary)" />;
      case 'HeartHandshake':
        return <HeartHandshake size={36} color="var(--primary)" />;
      case 'Trophy':
        return <Trophy size={36} color="var(--primary)" />;
      case 'Compass':
        return <Compass size={36} color="var(--primary)" />;
      case 'Eye':
        return <Eye size={36} color="var(--primary)" />;
      default:
        return <ShieldCheck size={36} color="var(--primary)" />;
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out', paddingTop: '70px' }}>
      <SEO 
        title="Tentang Kami" 
        description="Mengenal profil, sejarah berdiri, struktur kepengurusan, visi dan misi Koperasi Karyawan PT Adis Dimension Footwear (KOPKAR ADIS) di Balaraja, Tangerang, Banten." 
        canonicalPath="/tentang-kami"
      />
      {/* Page Header */}
      <section className="page-header">
        <div className="page-header-orb-1" />
        <div className="page-header-orb-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-header-title">Tentang Kami</h1>
          <p className="page-header-subtitle">
            Mengenal sejarah, visi, misi, dan landasan koperasi karyawan PT Adis Dimension Footwear.
          </p>
        </div>
      </section>

      {/* Sejarah & Visual */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <span className="section-subtitle">Sejarah Singkat</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)' }}>Berdirinya Kopkar Adis</h2>
                <div style={{ width: '50px', height: '4px', backgroundColor: 'var(--primary)', borderRadius: '2px', marginTop: '8px' }} />
              </div>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted-dark)', lineHeight: 1.8, marginBottom: '20px', textAlign: 'justify' }}>
                {profile.sejarah}
              </p>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted-dark)', lineHeight: 1.8, textAlign: 'justify' }}>
                Hingga hari ini, Koperasi terus berinovasi dalam pemanfaatan teknologi digital untuk memudahkan transaksi harian, pengelolaan modal anggota, serta penyebaran laporan keuangan secara terbuka bagi seluruh pihak yang berkepentingan.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <img 
                src={profile.sejarah_image_url || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'} 
                alt="Pengurus Koperasi" 
                style={{ width: '100%', maxWidth: '480px', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Profil Section */}
      <section className="section" style={{ backgroundColor: 'var(--light-bg)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div className="section-title-wrapper" style={{ marginBottom: '40px' }}>
            <span className="section-subtitle">Kenali Kami Lebih Dekat</span>
            <h2 className="section-title">Video Profil Koperasi</h2>
          </div>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
            height: 0, 
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: 'var(--shadow-lg)',
            border: '4px solid white',
            backgroundColor: 'var(--dark-bg)'
          }}>
            <iframe
              src="https://www.youtube.com/embed/W0KIOCt_VA0"
              title="Profil Koperasi Karyawan PT Adis"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* Milestone / Timeline Section */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">Garis Waktu</span>
            <h2 className="section-title">Milestone & Perjalanan Kami</h2>
          </div>

          <div className="timeline">
            {((profile.milestones && profile.milestones.length > 0) ? profile.milestones : [
              { year: '2003', title: 'Pendirian Koperasi', description: 'Koperasi Karyawan PT Adis Dimension Footwear resmi didirikan pada November 2003 dengan Badan Hukum resmi No: 518/193/BH-DINKOP/XI/2003.' },
              { year: '2010', title: 'Ekspansi Adis Mart', description: 'Mendirikan unit usaha minimarket Adis Mart guna menyediakan bahan pokok dan konsumsi harian berkualitas dengan harga terjangkau bagi anggota.' },
              { year: '2018', title: 'Simpan Pinjam Syariah', description: 'Meluncurkan program simpan pinjam berbasis Syariah (bagi hasil) untuk menjunjung asas gotong royong tanpa adanya unsur riba.' },
              { year: '2023', title: 'Armada Logistik', description: 'Mendirikan unit ekspedisi logistik internal untuk memperkuat distribusi barang operasional pabrik dan koperasi.' },
              { year: '2026', title: 'Transformasi Digital', description: 'Implementasi digital penuh, integrasi database pendaftaran, dan kemudahan akses Laporan Pertanggungjawaban RAT.' }
            ]).map((milestone, index) => (
              <TimelineCard key={index} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-title-wrapper">
            <span className="section-subtitle">Landasan Operasional</span>
            <h2 className="section-title">Visi & Misi Koperasi</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Visi */}
            <div className="glass-card" style={{ background: '#ffffff', padding: '35px', borderRadius: '20px', borderLeft: '6px solid var(--primary)' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <Eye size={30} color="var(--primary)" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Visi Koperasi</h3>
              </div>
              <p style={{ color: 'var(--text-muted-dark)', fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                "{profile.visi}"
              </p>
            </div>

            {/* Misi */}
            <div className="glass-card" style={{ background: '#ffffff', padding: '35px', borderRadius: '20px', borderLeft: '6px solid var(--secondary)' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                <Compass size={30} color="var(--secondary)" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Misi Koperasi</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {profile.misi && profile.misi.map((m, i) => (
                  <li 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      gap: '15px', 
                      alignItems: 'flex-start', 
                      marginBottom: '15px',
                      color: 'var(--text-muted-dark)',
                      fontSize: '1.05rem',
                      lineHeight: 1.5
                    }}
                  >
                    <CheckCircle2 size={22} color="var(--accent)" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Section */}
      {profile.org_structure && profile.org_structure.length > 0 && (
        <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
          <div className="container">
            <div className="section-title-wrapper" style={{ marginBottom: '50px' }}>
              <span className="section-subtitle">Pilar Kepemimpinan</span>
              <h2 className="section-title">Struktur Organisasi</h2>
            </div>

            {/* Hierarchical Org Tree Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
              
              {/* Level 1: Ketua Koperasi */}
              {profile.org_structure.filter(m => m.role.toLowerCase().includes('ketua') && !m.role.toLowerCase().includes('pengawas')).length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  {profile.org_structure.filter(m => m.role.toLowerCase().includes('ketua') && !m.role.toLowerCase().includes('pengawas')).map((member, i) => (
                    <div key={i} className="glass-card" style={{ width: '100%', maxWidth: '280px', padding: '24px', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '4px solid var(--primary)' }}>
                      <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 15px auto', border: '3px solid white', boxShadow: 'var(--shadow-md)' }}>
                        <img src={member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '5px' }}>{member.name}</h4>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'rgba(15, 98, 254, 0.1)', padding: '4px 12px', borderRadius: '50px', display: 'inline-block' }}>{member.role}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Level 2: Pengurus Harian (Sekretaris, Bendahara) */}
              {profile.org_structure.filter(m => m.role.toLowerCase().includes('sekretaris') || m.role.toLowerCase().includes('bendahara')).length > 0 && (
                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                  {profile.org_structure.filter(m => m.role.toLowerCase().includes('sekretaris') || m.role.toLowerCase().includes('bendahara')).map((member, i) => (
                    <div key={i} className="glass-card" style={{ width: '100%', maxWidth: '260px', padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '4px solid var(--secondary)' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 15px auto', border: '3px solid white', boxShadow: 'var(--shadow-md)' }}>
                        <img src={member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '5px' }}>{member.name}</h4>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--secondary)', backgroundColor: 'rgba(79, 138, 255, 0.1)', padding: '4px 12px', borderRadius: '50px', display: 'inline-block' }}>{member.role}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Level 3: Dewan Pengawas */}
              {profile.org_structure.filter(m => m.role.toLowerCase().includes('pengawas')).length > 0 && (
                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', width: '100%', borderTop: '1px dashed #e2e8f0', paddingTop: '30px' }}>
                  {profile.org_structure.filter(m => m.role.toLowerCase().includes('pengawas')).map((member, i) => (
                    <div key={i} className="glass-card" style={{ width: '100%', maxWidth: '240px', padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '4px solid var(--accent)' }}>
                      <div style={{ width: '75px', height: '75px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 15px auto', border: '3px solid white', boxShadow: 'var(--shadow-md)' }}>
                        <img src={member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '5px' }}>{member.name}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '50px', display: 'inline-block' }}>{member.role}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* Nilai-Nilai Koperasi */}
      <section className="section" style={{ backgroundColor: 'var(--light-bg)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-title-wrapper">
            <span className="section-subtitle">Budaya Kerja</span>
            <h2 className="section-title">Nilai Utama Koperasi</h2>
          </div>

          <div className="grid-3">
            {((profile.budaya && profile.budaya.length > 0) ? profile.budaya : [
              { title: 'Integritas & Amanah', description: 'Mengelola dana dan kepercayaan anggota secara jujur, bertanggung jawab, serta transparan.', icon: 'ShieldCheck' },
              { title: 'Kekeluargaan', description: 'Mengedepankan asas gotong royong dan saling membantu untuk kemaslahatan seluruh karyawan.', icon: 'Users' },
              { title: 'Kemudahan & Layanan', description: 'Memberikan pelayanan prima yang solutif, cepat, dan terdigitalisasi untuk memudahkan kebutuhan harian.', icon: 'HeartHandshake' }
            ]).map((item, index) => (
              <div key={index} className="glass-card" style={{ padding: '30px', textAlign: 'center', background: '#ffffff', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                  {getCultureIcon(item.icon)}
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prestasi & Penghargaan Section */}
      {profile.prestasi && profile.prestasi.length > 0 && (
        <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
          <div className="container">
            <div className="section-title-wrapper">
              <span className="section-subtitle">Komitmen & Apresiasi</span>
              <h2 className="section-title">Prestasi & Penghargaan</h2>
            </div>

            <div className="grid-3">
              {profile.prestasi.map((award, index) => (
                <div key={index} className="award-flip-container">
                  <div 
                    className={`award-flipper ${expandedAwards[index] ? 'is-flipped' : ''}`}
                    onClick={() => toggleAward(index)}
                  >
                    {/* Front Side */}
                    <div className="award-face award-front">
                      {/* Image header if exists */}
                      {award.image_url ? (
                        <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                          <img src={award.image_url} alt={award.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '50%', 
                            background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' 
                          }} />
                        </div>
                      ) : (
                        /* Premium visual placeholder if no image */
                        <div style={{ 
                          height: '180px', 
                          width: '100%', 
                          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'rgba(255,255,255,0.2)'
                        }}>
                          <Compass size={60} />
                        </div>
                      )}

                      {/* Card Content */}
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ 
                            fontSize: '1rem', 
                            fontWeight: 800, 
                            color: 'var(--primary)', 
                            fontFamily: 'var(--font-heading)',
                            backgroundColor: 'rgba(15, 98, 254, 0.1)',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            {award.year}
                          </span>
                          <span style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 700, 
                            color: award.level === 'Nasional' ? 'white' : 'var(--text-dark)', 
                            backgroundColor: award.level === 'Nasional' ? 'var(--primary)' : award.level === 'Provinsi' ? 'rgba(79, 138, 255, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px'
                          }}>
                            {award.level}
                          </span>
                        </div>

                        <h4 style={{ 
                          fontSize: '1.05rem', 
                          fontWeight: 800, 
                          color: 'var(--text-dark)', 
                          lineHeight: 1.4, 
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {award.title}
                        </h4>
                      </div>

                      <div className="award-flip-hint">
                        <span>Lihat Deskripsi</span>
                        <span style={{ transition: 'transform 0.3s ease' }}>➔</span>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="award-face award-back">
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: 'calc(100% - 35px)', overflow: 'hidden' }}>
                        <span className="award-back-awarder" onClick={(e) => e.stopPropagation()}>Pemberi: {award.awarder}</span>
                        <h5 className="award-back-title" onClick={(e) => e.stopPropagation()}>{award.title}</h5>
                        <p className="award-back-desc no-scrollbar" onClick={(e) => e.stopPropagation()}>
                          {award.description}
                        </p>
                      </div>
                      <div className="award-flip-hint">
                        <span>← Kembali</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            <style>{`
              .award-flip-container {
                perspective: 1000px;
                height: 380px;
                width: 100%;
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              }

              .award-flip-container:hover {
                transform: translateY(-6px);
              }

              .award-flipper {
                position: relative;
                width: 100%;
                height: 100%;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                transform-style: preserve-3d;
                cursor: pointer;
              }

              .award-flipper.is-flipped {
                transform: rotateY(180deg);
              }

              .award-face {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                border-radius: 20px;
                border: 1px solid var(--border-light);
                box-shadow: var(--shadow-md);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                background-color: #ffffff;
                transition: box-shadow 0.3s ease, border-color 0.3s ease;
              }

              .award-flip-container:hover .award-face {
                box-shadow: var(--shadow-lg);
                border-color: rgba(15, 98, 254, 0.2);
              }

              .award-front {
                z-index: 2;
                transform: rotateY(0deg);
              }

              .award-back {
                transform: rotateY(180deg);
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #ffffff;
                border-color: rgba(255, 255, 255, 0.1);
                padding: 30px;
                justify-content: space-between;
              }

              .award-back-title {
                font-size: 1.1rem;
                font-weight: 800;
                color: var(--gold);
                margin-bottom: 12px;
                line-height: 1.4;
                border-bottom: 1px solid rgba(255, 255, 255, 0.15);
                padding-bottom: 10px;
              }

              .award-back-awarder {
                font-size: 0.75rem;
                font-weight: 700;
                color: var(--secondary);
                text-transform: uppercase;
                letter-spacing: 0.8px;
                margin-bottom: 8px;
              }

              .award-back-desc {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.6;
                text-align: justify;
                margin: 0;
                overflow-y: auto;
                flex-grow: 1;
              }

              .award-flip-hint {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                font-size: 0.78rem;
                font-weight: 700;
                margin-top: auto;
              }

              .award-front .award-flip-hint {
                color: var(--primary);
                padding: 15px 30px;
                border-top: 1px solid var(--border-light);
              }

              .award-back .award-flip-hint {
                color: var(--gold);
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
              }

              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </section>
      )}
    </div>
  );
};
