import React, { useState } from 'react';
import { dbService } from '../../services/db';
import type { ContactInfo } from '../../services/db';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { SEO } from '../../components/SEO';


const InstagramIcon = ({ size = 20, color = 'currentColor', className, style }: { size?: number; color?: string; className?: string; style?: React.CSSProperties }) => (
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
    className={className}
    style={style}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 20, color = 'currentColor', className, style }: { size?: number; color?: string; className?: string; style?: React.CSSProperties }) => (
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
    className={className}
    style={style}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

interface ContactPageProps {
  contactInfo: ContactInfo | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ contactInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await dbService.saveMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setError('Gagal mengirim pesan. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!contactInfo) return null;

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out', paddingTop: '70px' }}>
      <SEO 
        title="Hubungi Kami" 
        description="Hubungi sekretariat KOPKAR ADIS, kirimkan kritik & saran anggota, atau kunjungi kantor koperasi di Balaraja, Tangerang. Kami siap membantu Anda."
        canonicalPath="/kontak"
      />
      {/* Page Header */}
      <section className="page-header">
        <div className="page-header-orb-1" />
        <div className="page-header-orb-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-header-title">Hubungi Kami</h1>
          <p className="page-header-subtitle">
            Hubungi sekretariat, kirimkan kritik & saran, atau kunjungi kantor koperasi kami di Balaraja.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="grid-2">
            {/* Left Column: Details & Google Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="glass-card" style={{ background: '#f8fafc', padding: '30px', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-dark)' }}>
                  Informasi Kontak
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <MapPin size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Alamat Kantor Sekretariat</h5>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0, lineHeight: 1.5 }}>
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <Phone size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Nomor Telepon</h5>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0 }}>
                        {contactInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <Mail size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Surel / Email Resmi</h5>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0 }}>
                        {contactInfo.email}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <Clock size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Jam Kerja Kantor</h5>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0, lineHeight: 1.5 }}>
                        Senin - Jumat: 08:00 - 17:00 WIB<br />Sabtu - Minggu / Libur Nasional: Tutup
                      </p>
                    </div>
                  </div>

                  {contactInfo.instagram && (
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                      <InstagramIcon size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                      <div>
                        <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Instagram Resmi</h5>
                        <a href={contactInfo.instagram} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                          {contactInfo.instagram.replace('https://instagram.com/', '@')}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo.youtube && (
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                      <YoutubeIcon size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                      <div>
                        <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Saluran YouTube</h5>
                        <a href={contactInfo.youtube} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                          Kopkar Adis Channel
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Google Maps Embed */}
              <div style={{ 
                height: '260px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-light)'
              }}>
                <iframe 
                  title="Peta Lokasi Kopkar Adis"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    (() => {
                      const addr = contactInfo.address;
                      if (addr.includes('(') && addr.includes(')')) {
                        const match = addr.match(/\(([^)]+)\)/);
                        if (match && match[1]) {
                          return `${match[1]}, Balaraja`;
                        }
                      }
                      return addr;
                    })()
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Feedback Form */}
            <div className="glass-card" style={{ background: '#ffffff', padding: '30px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                <MessageSquare size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>
                  Kirim Kritik & Saran
                </h3>
              </div>

              {submitted && (
                <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
                  Pesan Anda telah berhasil disimpan ke database. Pengurus koperasi akan segera meninjau kritik & saran Anda.
                </div>
              )}

              {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Masukkan nama lengkap Anda"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Karyawan</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Contoh: Budi@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subjek Keluhan / Topik</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Contoh: Saran Pembayaran Kredit, Masalah Simpan Pinjam"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Detail Kritik, Saran, atau Keluhan</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input"
                    style={{ minHeight: '140px', resize: 'vertical' }}
                    placeholder="Tulis kritik, keluhan, atau saran konstruktif Anda di sini..."
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', gap: '8px', marginTop: '10px' }}>
                  <Send size={16} />
                  <span>{loading ? 'Mengirim...' : 'Kirim Kritik & Saran'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
