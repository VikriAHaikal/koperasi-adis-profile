import React, { useState } from 'react';
import { dbService } from '../../../services/db';
import type { DocumentFile } from '../../../services/db';
import { Plus, Trash2, X, Download, Upload, ExternalLink, ShieldAlert } from 'lucide-react';

interface DocsTabProps {
  documents: DocumentFile[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[]>>;
  isInitialLoading: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  role?: string;
}

export const DocsTab: React.FC<DocsTabProps> = ({
  documents,
  setDocuments,
  isInitialLoading,
  showToast,
  triggerConfirm,
  role = 'editor'
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');

  const [docForm, setDocForm] = useState({
    name: '',
    file_url: '',
    size: '1.5 MB'
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showToast('Hanya berkas PDF yang diperbolehkan!', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('Ukuran berkas melebihi batas 10 MB!', 'error');
        return;
      }

      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `lpj_${Date.now()}.${fileExt}`;
        const filePath = `rat/${fileName}`;
        
        // Auto-fill file size
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        
        const publicUrl = await dbService.uploadFile('documents', filePath, file);
        
        setDocForm(prev => ({
          ...prev,
          file_url: publicUrl,
          size: fileSizeMB,
          name: prev.name || file.name // Auto-fill name if empty
        }));
        showToast('Berkas PDF berhasil diunggah.', 'success');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah berkas PDF.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.file_url) {
      showToast('Tautan dokumen wajib ada! Silakan unggah berkas atau masukkan URL.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const newDoc: DocumentFile = {
        id: 'doc-' + Date.now(),
        name: docForm.name,
        file_url: docForm.file_url,
        size: docForm.size || '1.5 MB',
        uploaded_at: new Date().toISOString()
      };
      const updated = [newDoc, ...documents];
      await dbService.saveDocuments(updated);
      setDocuments(updated);
      setIsEditing(null);
      setDocForm({ name: '', file_url: '', size: '' });
      showToast('Dokumen laporan berhasil ditambahkan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menambahkan dokumen.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDoc = (id: string) => {
    triggerConfirm(
      'Hapus Dokumen?',
      'Apakah Anda yakin ingin menghapus dokumen laporan ini?',
      async () => {
        setIsSaving(true);
        try {
          const updated = documents.filter(d => d.id !== id);
          await dbService.saveDocuments(updated);
          setDocuments(updated);
          showToast('Dokumen berhasil dihapus.', 'success');
        } catch (err) {
          console.error(err);
          showToast('Gagal menghapus dokumen.', 'error');
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
            <span>Akses Terbatas (Editor): Anda tidak memiliki wewenang untuk menghapus dokumen keuangan RAT. Silakan hubungi Administrator.</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0 }}>Daftar Dokumen Laporan RAT</h4>
          <button 
            onClick={() => { 
              setDocForm({ name: '', file_url: '', size: '1.5 MB' }); 
              setUploadMode('upload');
              setIsEditing('new'); 
            }} 
            className="btn btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Upload Laporan</span>
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama File Dokumen</th>
                <th>Ukuran</th>
                <th>Link Unduh</th>
                <th style={{ width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isInitialLoading ? (
                Array.from({ length: 3 }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {Array.from({ length: 4 }).map((_, cIdx) => (
                      <td key={cIdx}>
                        <div className="skeleton-line" style={{ width: cIdx === 0 ? '120px' : '90%' }}></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td><strong>{doc.name}</strong></td>
                    <td><code>{doc.size}</code></td>
                    <td>
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Buka Link <ExternalLink size={12} />
                      </a>
                    </td>
                    <td>
                      {role === 'admin' && (
                        <button onClick={() => handleDeleteDoc(doc.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><Trash2 size={12} /></button>
                      )}
                    </td>
                  </tr>
                ))
              )}
              {!isInitialLoading && documents.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted-dark)', padding: '15px' }}>Belum ada dokumen laporan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop Up Modal: Tambah Dokumen Laporan Baru */}
      {isEditing === 'new' && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card" style={{ maxWidth: '550px' }}>
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Tambahkan Dokumen Laporan Baru
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

            <form onSubmit={handleSaveDoc}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nama Laporan / Dokumen *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Laporan RAT Buku 2025.pdf" 
                    value={docForm.name} 
                    onChange={e => setDocForm(prev => ({ ...prev, name: e.target.value }))} 
                    className="form-input" 
                  />
                </div>

                <div style={{ marginBottom: 0 }}>
                  <label className="form-label">Metode Input Dokumen *</label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <button
                      type="button"
                      onClick={() => setUploadMode('upload')}
                      className={`btn ${uploadMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '8px 16px', fontSize: '0.8rem', width: '50%' }}
                    >
                      <Upload size={14} /> Unggah File PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`btn ${uploadMode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '8px 16px', fontSize: '0.8rem', width: '50%' }}
                    >
                      <ExternalLink size={14} /> Masukkan URL Manual
                    </button>
                  </div>
                </div>

                {uploadMode === 'upload' ? (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Pilih Berkas PDF Dokumen *</label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 }}>
                        <input 
                          type="file" 
                          accept="application/pdf" 
                          onChange={handleFileChange} 
                          style={{ display: 'none' }} 
                          id="doc-pdf-upload-modal" 
                        />
                        <label 
                          htmlFor="doc-pdf-upload-modal" 
                          className="btn btn-secondary" 
                          style={{ 
                            cursor: 'pointer', 
                            padding: '10px 16px', 
                            fontSize: '0.82rem', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderColor: docForm.file_url ? 'var(--accent)' : 'var(--primary)',
                            color: docForm.file_url ? 'var(--accent)' : 'var(--primary)',
                            background: 'white',
                            width: 'fit-content',
                            marginBottom: 0
                          }}
                        >
                          <Download size={14} style={{ transform: 'rotate(180deg)', marginRight: '4px' }} />
                          <span>{isUploading ? 'Mengunggah PDF...' : (docForm.file_url ? 'Ganti File PDF' : 'Pilih File PDF dari Device')}</span>
                        </label>
                        {docForm.file_url && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                            ✓ Berkas PDF Siap. Ukuran: {docForm.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Tautan Dokumen URL (Google Drive/Share Link) *</label>
                      <input 
                        type="url" 
                        required 
                        placeholder="https://drive.google.com/..." 
                        value={docForm.file_url} 
                        onChange={e => setDocForm(prev => ({ ...prev, file_url: e.target.value }))} 
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Ukuran Berkas Tautan *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Contoh: 4.8 MB" 
                        value={docForm.size} 
                        onChange={e => setDocForm(prev => ({ ...prev, size: e.target.value }))} 
                        className="form-input" 
                        style={{ width: '150px' }} 
                      />
                    </div>
                  </>
                )}
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
                  ✓ Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
