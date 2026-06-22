import React, { useState } from 'react';
import type { ContactInfo } from '../services/db';
import { Send, FileText, CheckCircle } from 'lucide-react';

interface RegisterFormProps {
  contactInfo: ContactInfo;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ contactInfo }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nik: '',
    division: '',
    phone: '',
    reason: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.nik || !formData.division || !formData.phone) {
      setError('Semua kolom bertanda bintang (*) wajib diisi.');
      return;
    }

    // Format WhatsApp Number (remove '+' or leading spaces)
    let waNumber = contactInfo.whatsapp.replace(/\D/g, '');
    if (waNumber.startsWith('0')) {
      waNumber = '62' + waNumber.substring(1);
    }
    
    if (!waNumber) {
      setError('Nomor WhatsApp Admin Koperasi belum terkonfigurasi di sistem.');
      return;
    }

    // Format Message
    const message = `Halo Admin Koperasi Kopkar Adis,

Saya bermaksud untuk melakukan pendaftaran sebagai anggota Koperasi Konsumen Karyawan PT Adis Dimension Footwear. Berikut adalah data diri saya:

* DATA PENDAFTARAN ANGGOTA BARU *
• Nama Lengkap: ${formData.fullName.trim()}
• NIK Karyawan: ${formData.nik.trim()}
• Divisi / Departemen: ${formData.division.trim()}
• No. Telp/WA: ${formData.phone.trim()}
${formData.reason ? `• Alasan Bergabung: ${formData.reason.trim()}` : ''}

Mohon dapat diproses lebih lanjut. Terima kasih!`;

    // Encode URL and Redirect
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
    
    // Open in new window
    window.open(waUrl, '_blank');
  };

  return (
    <section id="register" className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-title-wrapper">
          <span className="section-subtitle">Pendaftaran</span>
          <h2 className="section-title">Formulir Anggota Baru</h2>
        </div>

        <div className="glass-card" style={{ padding: '40px', background: '#ffffff', borderRadius: '20px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
            <FileText size={32} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Pengajuan Cepat via WhatsApp</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)', margin: 0 }}>
                Isi data Anda di bawah ini untuk menghasilkan draf pendaftaran otomatis ke WhatsApp Admin Koperasi.
              </p>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Nama Lengkap *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contoh: Budi Santoso"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="nik">NIK Karyawan PT Adis *</label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contoh: ADIS-12345"
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="division">Divisi / Departemen *</label>
                <input
                  type="text"
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contoh: Production Line 3 / Assembly"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">Nomor Handphone / WA Aktif *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contoh: 081234567890"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reason">Alasan Bergabung Koperasi (Opsional)</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="form-input"
                style={{ minHeight: '100px', resize: 'vertical' }}
                placeholder="Tuliskan tujuan Anda bergabung (misal: ingin menabung rutin atau membeli produk Adis Mart secara kredit)..."
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '35px', alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', maxWidth: '350px', padding: '14px 28px', fontSize: '1rem', gap: '10px' }}>
                <Send size={18} />
                <span>Kirim Formulir ke WhatsApp</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle size={16} />
                <span>Data tidak disimpan di server luar, aman dan langsung terarah ke admin koperasi</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
