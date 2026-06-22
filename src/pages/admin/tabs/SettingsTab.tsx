import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../../supabaseClient';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface SettingsTabProps {
  session: any;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ session, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Get current active email
  const currentEmail = session?.user?.email || localStorage.getItem('demo_admin_email') || 'admin@kopkaradis.com';

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Email baru tidak boleh kosong.', 'error');
      return;
    }

    setEmailLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ email: email.trim() });
        if (error) throw error;
        showToast('Email konfirmasi telah dikirim ke email lama dan baru Anda. Silakan verifikasi untuk menerapkan perubahan.', 'info');
      } else {
        // Local demo storage update
        localStorage.setItem('demo_admin_email', email.trim());
        showToast('Email demo berhasil diperbarui. Silakan login kembali menggunakan email baru.', 'success');
      }
      setEmail('');
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui email.', 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      showToast('Password baru tidak boleh kosong.', 'error');
      return;
    }
    if (password.length < 5) {
      showToast('Password minimal harus 5 karakter.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Konfirmasi password tidak cocok.', 'error');
      return;
    }

    setPassLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        showToast('Password berhasil diperbarui.', 'success');
      } else {
        // Local demo storage update
        localStorage.setItem('demo_admin_password', password);
        showToast('Password demo berhasil diperbarui. Silakan gunakan password baru ini pada login berikutnya.', 'success');
      }
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui password.', 'error');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '25px', backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(15, 98, 254, 0.1)', borderRadius: '10px', color: 'var(--primary)' }}>
            <Shield size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Pengaturan Akun Pengurus</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)' }}>Kelola kredensial akses masuk portal administrator</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
        {/* Update Email Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <Mail size={18} color="var(--primary)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Ubah Email Pengurus</h4>
          </div>

          <form onSubmit={handleUpdateEmail} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Email Aktif Saat Ini</label>
              <input type="text" className="form-input" value={currentEmail} disabled style={{ backgroundColor: '#f8fafc', color: 'var(--text-muted-dark)', cursor: 'not-allowed' }} />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Email Baru</label>
              <input type="email" className="form-input" placeholder="contoh@mail.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <button type="submit" disabled={emailLoading} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              {emailLoading ? 'Menyimpan...' : 'Perbarui Email'}
            </button>
          </form>
        </div>

        {/* Update Password Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <Lock size={18} color="var(--primary)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>Ubah Password</h4>
          </div>

          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Password Baru</label>
              <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Minimal 5 karakter" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '45px' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', bottom: '10px', background: 'none', border: 'none', color: 'var(--text-muted-dark)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.82rem' }}>Konfirmasi Password Baru</label>
              <input type={showConfirmPassword ? 'text' : 'password'} className="form-input" placeholder="Ulangi password baru" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ paddingRight: '45px' }} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '15px', bottom: '10px', background: 'none', border: 'none', color: 'var(--text-muted-dark)', cursor: 'pointer' }}>
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={passLoading} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              {passLoading ? 'Menyimpan...' : 'Perbarui Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
