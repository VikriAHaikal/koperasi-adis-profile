import React, { useState, useEffect } from 'react';
import { dbService } from '../../../services/db';
import type { ContactInfo } from '../../../services/db';
import { Check, ShieldAlert } from 'lucide-react';


interface ContactTabProps {
  contact: ContactInfo | null;
  setContact: React.Dispatch<React.SetStateAction<ContactInfo | null>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  role?: string;
}

export const ContactTab: React.FC<ContactTabProps> = ({
  contact,
  setContact,
  showToast,
  role = 'editor'
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [waNum, setWaNum] = useState('');
  const [addressVal, setAddressVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [phoneVal, setPhoneVal] = useState('');
  const [igVal, setIgVal] = useState('');
  const [ytVal, setYtVal] = useState('');

  useEffect(() => {
    if (contact) {
      setWaNum(contact.whatsapp || '');
      setAddressVal(contact.address || '');
      setEmailVal(contact.email || '');
      setPhoneVal(contact.phone || '');
      setIgVal(contact.instagram || '');
      setYtVal(contact.youtube || '');
    }
  }, [contact]);

  const handleSaveContact = async () => {
    if (!waNum || !addressVal || !emailVal || !phoneVal) {
      showToast('Kolom bertanda bintang (*) wajib diisi!', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const updated: ContactInfo = {
        whatsapp: waNum,
        address: addressVal,
        email: emailVal,
        phone: phoneVal,
        instagram: igVal,
        youtube: ytVal
      };
      await dbService.saveContact(updated);
      setContact(updated);
      showToast('Kontak Koperasi berhasil diperbarui!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan kontak.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-card" style={{ maxWidth: '650px' }}>
      {role === 'editor' && (
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#1d4ed8',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <ShieldAlert size={16} style={{ flexShrink: 0 }} />
          <span>Akses Editor Aktif: Anda memiliki akses penuh untuk memperbarui kontak resmi & WhatsApp koperasi.</span>
        </div>
      )}
      <h4 style={{ marginBottom: '25px' }}>Edit Kontak Resmi & WhatsApp Koperasi</h4>
      
      <div className="form-group">
        <label className="form-label">Nomor WhatsApp Admin Pendaftaran *</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-muted-dark)' }}>+</span>
          <input 
            type="text" 
            required 
            placeholder="62812345678" 
            value={waNum} 
            onChange={e => setWaNum(e.target.value)} 
            className="form-input" 
          />
        </div>
        <small style={{ color: 'var(--text-muted-dark)', marginTop: '4px', display: 'block' }}>
          Gunakan format kode negara tanpa spasi atau tanda hubung. (Contoh: <strong>628123456789</strong>). Nomor ini digunakan untuk fitur formulir pendaftaran anggota otomatis.
        </small>
      </div>

      <div className="form-group">
        <label className="form-label">Alamat Kantor Koperasi PT Adis *</label>
        <textarea 
          required 
          value={addressVal} 
          onChange={e => setAddressVal(e.target.value)} 
          className="form-input" 
          style={{ minHeight: '80px' }} 
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Email Hubungan Anggota *</label>
          <input 
            type="email" 
            required 
            value={emailVal} 
            onChange={e => setEmailVal(e.target.value)} 
            className="form-input" 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Telepon / Ext *</label>
          <input 
            type="text" 
            required 
            value={phoneVal} 
            onChange={e => setPhoneVal(e.target.value)} 
            className="form-input" 
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Tautan Instagram Koperasi</label>
          <input 
            type="url" 
            placeholder="Contoh: https://instagram.com/kopkar_adis" 
            value={igVal} 
            onChange={e => setIgVal(e.target.value)} 
            className="form-input" 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tautan YouTube Koperasi</label>
          <input 
            type="url" 
            placeholder="Contoh: https://youtube.com/c/KopkarAdis" 
            value={ytVal} 
            onChange={e => setYtVal(e.target.value)} 
            className="form-input" 
          />
        </div>
      </div>

      <button 
        onClick={handleSaveContact} 
        disabled={isSaving} 
        className="btn btn-primary" 
        style={{ padding: '12px 24px', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '15px' }}
      >
        {isSaving ? <span className="spinner-mini"></span> : <Check size={16} />}
        <span>Simpan Kontak Resmi</span>
      </button>
    </div>
  );
};
