import React, { useState } from 'react';
import type { DocumentFile } from '../services/db';
import { FileDown, Database } from 'lucide-react';

interface DocumentsProps {
  documents: DocumentFile[];
}

export const Documents: React.FC<DocumentsProps> = ({ documents }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (e: React.MouseEvent, url: string) => {
    if (url === '#' || !url) {
      e.preventDefault();
      alert('File contoh demo. Pada sistem produksi, tombol ini akan mengunduh dokumen asli (PDF) dari Supabase Storage.');
    }
  };

  return (
    <section id="docs" className="section" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Transparansi Keuangan</span>
          <h2 className="section-title">Laporan Pertanggungjawaban RAT</h2>
        </div>

        <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '30px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <Database size={20} color="var(--primary)" />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0, fontWeight: 500 }}>
              Komitmen keterbukaan informasi. Anggota dapat membaca dan mengunduh berkas Laporan Keuangan RAT serta Anggaran Dasar / Anggaran Rumah Tangga (AD-ART) terbaru.
            </p>
          </div>

          {/* Search Input */}
          {documents.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <input 
                type="text" 
                placeholder="Cari laporan RAT, AD-ART, atau berdasarkan tahun (misal: 2025)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          )}

          {filteredDocs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted-dark)' }}>
              {documents.length === 0 
                ? 'Tidak ada dokumen tersedia saat ini.' 
                : 'Dokumen yang Anda cari tidak ditemukan.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filteredDocs.map((doc) => (
                <div 
                  key={doc.id} 
                  className="document-row"
                >
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: 'rgba(13, 148, 136, 0.1)',
                      color: 'var(--primary)',
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileDown size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '4px' }}>
                        {doc.name}
                      </h4>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--text-muted-dark)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Ukuran: {doc.size}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Diunggah: {formatDate(doc.uploaded_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={doc.file_url} 
                    onClick={(e) => handleDownload(e, doc.file_url)}
                    download
                    className="btn btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
                  >
                    <FileDown size={14} />
                    <span>Unduh PDF</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .document-row:hover {
          border-color: var(--primary) !important;
          box-shadow: var(--shadow-sm);
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
};
