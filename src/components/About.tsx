import React, { useState } from 'react';
import type { ProfileContent } from '../services/db';
import { Award, Compass, Eye, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  profile: ProfileContent;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'sejarah' | 'visi-misi'>('sejarah');

  if (!profile) return null;

  return (
    <section id="about" className="section" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Mengenal Koperasi</span>
          <h2 className="section-title">Tentang Kami</h2>
        </div>

        <div className="grid-2" style={{ alignItems: 'center' }}>
          {/* Left Side: Modern Interactive Info Board */}
          <div className="animate-fade-in">
            {/* Tabs Navigation */}
            <div className="about-tabs">
              <button
                onClick={() => setActiveTab('sejarah')}
                className="about-tab-btn"
                style={{
                  borderBottom: activeTab === 'sejarah' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'sejarah' ? 'var(--primary)' : 'var(--text-muted-dark)'
                }}
              >
                Sejarah Singkat
              </button>
              <button
                onClick={() => setActiveTab('visi-misi')}
                className="about-tab-btn"
                style={{
                  borderBottom: activeTab === 'visi-misi' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'visi-misi' ? 'var(--primary)' : 'var(--text-muted-dark)'
                }}
              >
                Visi & Misi
              </button>
            </div>

            {/* Tab Contents */}
            <div style={{ minHeight: '300px' }}>
              {activeTab === 'sejarah' ? (
                <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-muted-dark)', marginBottom: '20px', textAlign: 'justify' }}>
                    {profile.sejarah}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <Award size={36} color="var(--primary)" />
                      <div>
                        <h4 style={{ fontWeight: 700, margin: 0 }}>Berlisensi Resmi</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted-dark)', margin: 0 }}>Dinas Koperasi & UMKM</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                  <div className="glass-card" style={{ marginBottom: '24px', background: '#f8fafc', padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                      <Eye size={24} color="var(--primary)" />
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>Visi Koperasi</h4>
                    </div>
                    <p style={{ color: 'var(--text-muted-dark)', fontSize: '1.05rem', fontStyle: 'italic', margin: 0 }}>
                      "{profile.visi}"
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
                      <Compass size={24} color="var(--secondary)" />
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Misi Koperasi</h4>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {profile.misi && profile.misi.map((m, i) => (
                        <li 
                          key={i} 
                          style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            alignItems: 'flex-start', 
                            marginBottom: '12px',
                            color: 'var(--text-muted-dark)',
                            fontSize: '0.98rem'
                          }}
                        >
                          <CheckCircle2 size={18} color="var(--accent)" style={{ marginTop: '3px', flexShrink: 0 }} />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Premium Graphics / Image block */}
          <div className="about-graphics-container">
            <div 
              className="about-image"
              style={{
                backgroundImage: `url("${profile.sejarah_image_url || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'} ")`
              }}
            />
            {/* Background absolute floating design cards */}
            <div className="about-floating-card">
              <h5 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>100%</h5>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Transparan & Profesional berbasis digital</p>
            </div>
            
            <div className="about-decorative-box" />
          </div>
        </div>
      </div>
    </section>
  );
};
