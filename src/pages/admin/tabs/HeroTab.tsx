import React, { useState } from 'react';
import { dbService } from '../../../services/db';
import type { HeroSlide } from '../../../services/db';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ShieldAlert } from 'lucide-react';

interface HeroTabProps {
  heroSlides: HeroSlide[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
  isInitialLoading: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  role?: string;
}

export const HeroTab: React.FC<HeroTabProps> = ({
  heroSlides,
  setHeroSlides,
  isInitialLoading,
  showToast,
  triggerConfirm,
  role = 'editor'
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [heroForm, setHeroForm] = useState<Omit<HeroSlide, 'id'>>({
    title: '',
    subtitle: '',
    image_url: '',
    order_index: 0
  });

  const handleEditHero = (slide: HeroSlide) => {
    setHeroForm({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.image_url,
      order_index: slide.order_index
    });
    setIsEditing(slide.id);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `hero_${Date.now()}.${fileExt}`;
        const filePath = `hero/${fileName}`;
        
        const publicUrl = await dbService.uploadFile('images', filePath, file);
        setHeroForm(prev => ({ ...prev, image_url: publicUrl }));
        showToast('Gambar berhasil diunggah.', 'success');
      } catch (err: any) {
        console.error('Upload error:', err);
        showToast(err.message || 'Gagal mengunggah gambar.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.image_url) {
      showToast('Wajib memilih atau mengunggah gambar!', 'error');
      return;
    }

    setIsSaving(true);
    try {
      let updated: HeroSlide[];
      if (isEditing === 'new') {
        const newSlide: HeroSlide = {
          id: 'hero-' + Date.now(),
          ...heroForm
        };
        updated = [...heroSlides, newSlide].sort((a, b) => a.order_index - b.order_index);
      } else {
        updated = heroSlides.map(s => s.id === isEditing ? { ...s, ...heroForm } : s)
          .sort((a, b) => a.order_index - b.order_index);
      }
      await dbService.saveHeroSlides(updated);
      setHeroSlides(updated);
      setIsEditing(null);
      setHeroForm({ title: '', subtitle: '', image_url: '', order_index: 0 });
      showToast('Banner Slide berhasil disimpan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan Banner Slide.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHero = (id: string) => {
    triggerConfirm(
      'Hapus Banner Slide?',
      'Apakah Anda yakin ingin menghapus banner slide ini?',
      async () => {
        setIsSaving(true);
        try {
          const updated = heroSlides.filter(s => s.id !== id);
          await dbService.saveHeroSlides(updated);
          setHeroSlides(updated);
          showToast('Banner Slide berhasil dihapus.', 'success');
        } catch (err) {
          console.error(err);
          showToast('Gagal menghapus slide.', 'error');
        } finally {
          setIsSaving(false);
        }
      }
    );
  };

  const moveHero = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;
    
    setIsSaving(true);
    try {
      const updated = [...heroSlides];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      
      const reassigned = updated.map((slide, idx) => ({
        ...slide,
        order_index: idx
      }));
      
      await dbService.saveHeroSlides(reassigned);
      setHeroSlides(reassigned);
      showToast('Urutan banner berhasil diperbarui.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengubah urutan banner.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-card">
        {role === 'editor' && (
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#b45309',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>Akses Terbatas (Editor): Anda tidak memiliki wewenang untuk menghapus banner slide. Silakan hubungi Administrator.</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0 }}>Daftar Banner Utama</h4>
          <button 
            onClick={() => { 
              setHeroForm({ title: '', subtitle: '', image_url: '', order_index: heroSlides.length }); 
              setIsEditing('new'); 
            }} 
            className="btn btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Tambah Banner</span>
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px', textAlign: 'center' }}>Urutan</th>
                <th style={{ width: '80px' }}>Indeks</th>
                <th style={{ width: '120px' }}>Gambar Preview</th>
                <th>Judul Slide</th>
                <th>Sub-judul</th>
                <th style={{ width: '150px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isInitialLoading ? (
                Array.from({ length: 3 }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {Array.from({ length: 6 }).map((_, cIdx) => (
                      <td key={cIdx}>
                        <div className="skeleton-line" style={{ width: cIdx === 0 || cIdx === 1 ? '40px' : '90%' }}></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                heroSlides.map((slide, idx) => (
                  <tr key={slide.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button 
                          type="button"
                          onClick={() => moveHero(idx, 'up')} 
                          disabled={idx === 0 || isSaving}
                          className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: 'none', background: 'none' }}
                          title="Pindahkan ke atas"
                        >
                          ▲
                        </button>
                        <button 
                          type="button"
                          onClick={() => moveHero(idx, 'down')} 
                          disabled={idx === heroSlides.length - 1 || isSaving}
                          className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: 'none', background: 'none' }}
                          title="Pindahkan ke bawah"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td>{slide.order_index}</td>
                    <td>
                      <img src={slide.image_url} alt="" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td><strong>{slide.title}</strong></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)' }}>{slide.subtitle}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditHero(slide)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><Edit2 size={12} /></button>
                        {role === 'admin' && (
                          <button onClick={() => handleDeleteHero(slide.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><Trash2 size={12} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!isInitialLoading && heroSlides.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted-dark)', padding: '15px' }}>Belum ada banner slide.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop Up Modal: Tambah/Edit Hero Banner */}
      {isEditing !== null && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card">
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                {isEditing === 'new' ? 'Tambah Slide Banner Baru' : 'Sunting Slide Banner'}
              </h5>
              <button 
                type="button" 
                onClick={() => setIsEditing(null)} 
                className="popup-modal-close"
                title="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveHero}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Judul Slide Banner *</label>
                  <input 
                    type="text" 
                    required 
                    value={heroForm.title} 
                    onChange={e => setHeroForm(prev => ({ ...prev, title: e.target.value }))} 
                    className="form-input" 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Sub-judul Slide Banner *</label>
                  <textarea 
                    required 
                    value={heroForm.subtitle} 
                    onChange={e => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))} 
                    className="form-input" 
                    style={{ minHeight: '80px' }} 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Gambar Banner Hero *</label>
                  {heroForm.image_url && (
                    <div style={{ marginBottom: '12px' }}>
                      <img 
                        src={heroForm.image_url} 
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageFileChange} 
                      style={{ display: 'none' }} 
                      id="hero-file-upload-modal" 
                    />
                    <label 
                      htmlFor="hero-file-upload-modal" 
                      className="btn btn-secondary" 
                      style={{ 
                        cursor: 'pointer', 
                        gap: '8px',
                        borderColor: heroForm.image_url ? 'var(--accent)' : 'var(--primary)',
                        color: heroForm.image_url ? 'var(--accent)' : 'var(--primary)'
                      }}
                    >
                      <ImageIcon size={16} />
                      <span>{isUploading ? 'Memproses Gambar...' : (heroForm.image_url ? 'Ganti Gambar dari Device' : 'Pilih Gambar dari Device')}</span>
                    </label>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nomor Urut Tampil (Index) *</label>
                  <input 
                    type="number" 
                    required 
                    value={heroForm.order_index} 
                    onChange={e => setHeroForm(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))} 
                    className="form-input" 
                    style={{ width: '120px' }} 
                  />
                </div>
              </div>

              <div className="popup-modal-footer">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(null)} 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }} 
                  disabled={isSaving || isUploading}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }} 
                  disabled={isSaving || isUploading}
                >
                  {isSaving && <span className="spinner-mini" style={{ marginRight: '8px' }}></span>}
                  ✓ Simpan Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
