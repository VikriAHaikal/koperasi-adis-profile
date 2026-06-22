import React, { useState } from 'react';
import { dbService } from '../../../services/db';
import type { NewsArticle } from '../../../services/db';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ShieldAlert, Search } from 'lucide-react';
import { RichTextEditor } from '../../../components/admin/RichTextEditor';

interface NewsTabProps {
  news: NewsArticle[];
  setNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  isInitialLoading: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  role?: string;
}

export const NewsTab: React.FC<NewsTabProps> = ({
  news,
  setNews,
  isInitialLoading,
  showToast,
  triggerConfirm,
  role = 'editor'
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Pengumuman' | 'Kegiatan' | 'Promo' | 'Edukasi'>('All');

  const filteredNews = news.filter((art) => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.author && art.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (art.excerpt && art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'All' ? true : art.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const [newsForm, setNewsForm] = useState<Omit<NewsArticle, 'id' | 'created_at'>>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    author: 'Pengurus Koperasi',
    category: 'Pengumuman'
  });

  const handleEditNews = (art: NewsArticle) => {
    setNewsForm({
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      image_url: art.image_url,
      author: art.author,
      category: art.category || 'Pengumuman'
    });
    setIsEditing(art.id);
  };

  const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `news_${Date.now()}.${fileExt}`;
        const filePath = `news/${fileName}`;
        
        const publicUrl = await dbService.uploadFile('images', filePath, file);
        setNewsForm(prev => ({ ...prev, image_url: publicUrl }));
        showToast('Gambar cover berita berhasil diunggah.', 'success');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah gambar cover.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updated: NewsArticle[];
      if (isEditing === 'new') {
        const nextIdNumber = news.reduce((max, item) => {
          const match = item.id.match(/^news-(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num < 100000) {
              return num > max ? num : max;
            }
          }
          return max;
        }, 0) + 1;

        const newArt: NewsArticle = {
          id: `news-${nextIdNumber}`,
          created_at: new Date().toISOString(),
          ...newsForm
        };
        updated = [newArt, ...news];
      } else {
        updated = news.map(n => n.id === isEditing ? { 
          ...n, 
          ...newsForm 
        } : n);
      }
      await dbService.saveNews(updated);
      setNews(updated);
      setIsEditing(null);
      setNewsForm({ title: '', excerpt: '', content: '', image_url: '', author: 'Pengurus Koperasi', category: 'Pengumuman' });
      showToast('Berita / Kegiatan berhasil disimpan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan berita.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = (id: string) => {
    triggerConfirm(
      'Hapus Berita/Kegiatan?',
      'Apakah Anda yakin ingin menghapus berita/kegiatan ini?',
      async () => {
        setIsSaving(true);
        try {
          const updated = news.filter(n => n.id !== id);
          await dbService.saveNews(updated);
          setNews(updated);
          showToast('Berita / Kegiatan berhasil dihapus.', 'success');
        } catch (err) {
          console.error(err);
          showToast('Gagal menghapus berita.', 'error');
        } finally {
          setIsSaving(false);
        }
      }
    );
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
            <span>Akses Terbatas (Editor): Anda tidak memiliki wewenang untuk menghapus berita. Silakan hubungi Administrator.</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h4 style={{ margin: 0 }}>Daftar Artikel & Berita Koperasi</h4>
          <button 
            onClick={() => { 
              setNewsForm({ title: '', excerpt: '', content: '', image_url: '', author: 'Pengurus Koperasi', category: 'Pengumuman' }); 
              setIsEditing('new'); 
            }} 
            className="btn btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Tambah Berita</span>
          </button>
        </div>

        {/* Search & Category Filter Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
            {(['All', 'Pengumuman', 'Kegiatan', 'Promo', 'Edukasi'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className="btn"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  borderRadius: '20px',
                  border: categoryFilter === cat ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                  backgroundColor: categoryFilter === cat ? 'var(--primary)' : '#ffffff',
                  color: categoryFilter === cat ? '#ffffff' : 'var(--text-muted-dark)',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {cat === 'All' ? 'Semua' : cat} ({
                  cat === 'All' 
                    ? news.length 
                    : news.filter(n => n.category === cat).length
                })
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Cari judul, ringkasan, penulis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '36px',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                margin: 0
              }}
            />
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Gambar</th>
                <th>Judul Berita</th>
                <th>Kategori</th>
                <th>Penulis</th>
                <th>Ringkasan</th>
                <th style={{ width: '150px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isInitialLoading ? (
                Array.from({ length: 3 }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {Array.from({ length: 6 }).map((_, cIdx) => (
                      <td key={cIdx}>
                        <div className="skeleton-line" style={{ width: cIdx === 0 ? '60px' : '90%' }}></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted-dark)', padding: '30px' }}>
                    {news.length === 0 ? 'Belum ada artikel berita.' : 'Tidak ada berita yang cocok dengan kriteria pencarian / filter Anda.'}
                  </td>
                </tr>
              ) : (
                filteredNews.map((art) => (
                  <tr key={art.id}>
                    <td>
                      <img src={art.image_url} alt="" style={{ width: '75px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td><strong>{art.title}</strong></td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: 
                          art.category === 'Pengumuman' ? 'rgba(239, 68, 68, 0.08)' :
                          art.category === 'Kegiatan' ? 'rgba(59, 130, 246, 0.08)' :
                          art.category === 'Promo' ? 'rgba(16, 185, 129, 0.08)' :
                          'rgba(245, 158, 11, 0.08)',
                        color: 
                          art.category === 'Pengumuman' ? '#ef4444' :
                          art.category === 'Kegiatan' ? '#3b82f6' :
                          art.category === 'Promo' ? '#10b981' :
                          '#f59e0b'
                      }}>
                        {art.category || 'Pengumuman'}
                      </span>
                    </td>
                    <td>{art.author}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)' }}>{art.excerpt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditNews(art)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><Edit2 size={12} /></button>
                        {role === 'admin' && (
                          <button onClick={() => handleDeleteNews(art.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><Trash2 size={12} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop Up Modal: Tambah/Edit Berita Koperasi */}
      {isEditing !== null && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card" style={{ maxWidth: '750px' }}>
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                {isEditing === 'new' ? 'Tulis Berita / Kegiatan Baru' : 'Sunting Berita / Kegiatan'}
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

            <form onSubmit={handleSaveNews}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Judul Artikel Berita *</label>
                    <input 
                      type="text" 
                      required 
                      value={newsForm.title} 
                      onChange={e => setNewsForm(prev => ({ ...prev, title: e.target.value }))} 
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Kategori Berita *</label>
                    <select 
                      value={newsForm.category || 'Pengumuman'} 
                      onChange={e => setNewsForm(prev => ({ ...prev, category: e.target.value as any }))} 
                      className="form-input"
                      style={{ height: '42px', cursor: 'pointer' }}
                    >
                      <option value="Pengumuman">Pengumuman</option>
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Promo">Promo</option>
                      <option value="Edukasi">Edukasi</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Penulis / Publikator *</label>
                    <input 
                      type="text" 
                      required 
                      value={newsForm.author} 
                      onChange={e => setNewsForm(prev => ({ ...prev, author: e.target.value }))} 
                      className="form-input" 
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Gambar Cover Berita *</label>
                  {newsForm.image_url && (
                    <div style={{ marginBottom: '12px' }}>
                      <img 
                        src={newsForm.image_url} 
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCoverPhotoChange} 
                      style={{ display: 'none' }} 
                      id="news-file-upload-modal" 
                    />
                    <label 
                      htmlFor="news-file-upload-modal" 
                      className="btn btn-secondary" 
                      style={{ 
                        cursor: 'pointer', 
                        gap: '8px',
                        borderColor: newsForm.image_url ? 'var(--accent)' : 'var(--primary)',
                        color: newsForm.image_url ? 'var(--accent)' : 'var(--primary)'
                      }}
                    >
                      <ImageIcon size={16} />
                      <span>{isUploading ? 'Memproses...' : (newsForm.image_url ? 'Ganti Cover Gambar dari Device' : 'Pilih Cover Gambar dari Device')}</span>
                    </label>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ringkasan Singkat (Excerpt) *</label>
                  <input 
                    type="text" 
                    required 
                    value={newsForm.excerpt} 
                    onChange={e => setNewsForm(prev => ({ ...prev, excerpt: e.target.value }))} 
                    className="form-input" 
                    placeholder="Tulis ringkasan satu kalimat untuk tampilan card depan..." 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Isi Lengkap Berita & Kegiatan *</label>
                  <RichTextEditor 
                    value={newsForm.content} 
                    onChange={val => setNewsForm(prev => ({ ...prev, content: val }))} 
                    placeholder="Tuliskan berita lengkap di sini..." 
                    onUploadImage={async (file) => {
                      const fileExt = file.name.split('.').pop();
                      const fileName = `news_inline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                      const filePath = `news/${fileName}`;
                      return await dbService.uploadFile('images', filePath, file);
                    }}
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
                  ✓ Simpan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
