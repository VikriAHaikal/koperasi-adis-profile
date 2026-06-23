import React, { useState } from 'react';
import { dbService } from '../services/db';
import type { ContactInfo } from '../services/db';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';

interface ContactProps {
  contactInfo: ContactInfo;
}

export const Contact: React.FC<ContactProps> = ({ contactInfo }) => {
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
    <section id="contact" className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Hubungi Kami</span>
          <h2 className="section-title">Kontak & Lokasi</h2>
        </div>

        <div className="contact-grid">
          {/* Left Column: Contact details & Map Placeholder */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="glass-card" style={{ background: '#ffffff', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-dark)' }}>
                Informasi Kontak
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <MapPin size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Alamat Kantor</h5>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0, wordBreak: 'break-word' }}>
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <Phone size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Telepon</h5>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0, wordBreak: 'break-word' }}>
                      {contactInfo.phone}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <Mail size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Surel / Email</h5>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0, wordBreak: 'break-word' }}>
                      {contactInfo.email}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <Clock size={20} color="var(--primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontWeight: 600, fontSize: '0.92rem', margin: '0 0 4px 0' }}>Jam Operasional Kantor</h5>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0 }}>
                      Senin - Jumat: 08:00 - 17:00 WIB<br />Sabtu - Minggu: Tutup
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps */}
            <div style={{ 
              height: '220px', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}>
              <iframe 
                title="Peta Lokasi Koperasi Kopkar Adis"
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

          {/* Right Column: Contact form */}
          <div className="glass-card" style={{ background: '#ffffff', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
              <MessageSquare size={24} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>
                Kirim Kritik & Saran
              </h3>
            </div>

            {submitted && (
              <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
                Terima kasih! Pesan Anda telah berhasil dikirimkan ke pengurus koperasi.
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
                  placeholder="Masukkan email aktif"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subjek / Topik</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contoh: Pertanyaan Simpan Pinjam, Keluhan Adis Mart"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Pesan / Masukan</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  placeholder="Tulis detail masukan atau saran Anda di sini..."
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', gap: '8px', marginTop: '10px' }}>
                <Send size={16} />
                <span>{loading ? 'Mengirim...' : 'Kirim Pesan'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
