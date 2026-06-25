import React, { useState } from 'react';
import type { DocumentFile } from '../../services/db';
import { FileDown, Database, FileText } from 'lucide-react';
import { SEO } from '../../components/SEO';


interface DocumentsPageProps {
  documents: DocumentFile[];
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ documents }) => {
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
    <div style={{ animation: 'fadeIn 0.6s ease-out', paddingTop: '70px' }}>
      <SEO 
        title="Laporan RAT & Dokumen" 
        description="Akses transparansi keuangan, Laporan Pertanggungjawaban RAT tahunan, dan dokumen regulasi AD-ART Koperasi Konsumen Karyawan PT Adis Dimension Footwear (KOPKAR ADIS)."
        canonicalPath="/laporan-rat"
      />
      {/* Page Header */}
      <section className="page-header">
        <div className="page-header-orb-1" />
        <div className="page-header-orb-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-header-title">Laporan & Dokumen</h1>
          <p className="page-header-subtitle">
            Dokumen regulasi AD-ART Koperasi Konsumen Karyawan PT Adis Dimension Footwear.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px', backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
              <Database size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 4px 0' }}>Prinsip Keterbukaan Informasi</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted-dark)', margin: 0, fontWeight: 500 }}>
                  Sebagai bagian dari akuntabilitas publik, anggota koperasi berhak mengakses berkas Laporan Keuangan RAT serta AD-ART terbaru secara digital di mana saja.
                </p>
              </div>
            </div>

            {/* Search Input */}
            {documents.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <input 
                  type="text" 
                  placeholder="Cari laporan RAT, AD-ART, atau berdasarkan tahun (misal: 2025)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    fontSize: '1rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              </div>
            )}

            {filteredDocs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted-dark)', fontSize: '1.05rem' }}>
                {documents.length === 0 
                  ? 'Tidak ada dokumen tersedia saat ini.' 
                  : 'Dokumen yang Anda cari tidak ditemukan.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="document-row"
                    style={{ backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', transition: 'var(--transition-fast)' }}
                  >
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        color: '#ef4444',
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(239, 68, 68, 0.15)'
                      }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                          {doc.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-muted-dark)' }}>
                          <span>Ukuran: {doc.size}</span>
                          <span>•</span>
                          <span>Diunggah: {formatDate(doc.uploaded_at)}</span>
                        </div>
                      </div>
                    </div>

                    <a 
                      href={doc.file_url} 
                      onClick={(e) => handleDownload(e, doc.file_url)}
                      download
                      className="btn btn-secondary" 
                      style={{ padding: '10px 20px', fontSize: '0.9rem', gap: '6px', flexShrink: 0 }}
                    >
                      <FileDown size={16} />
                      <span>Unduh PDF</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {styleElement}
    </div>
  );
};

// Reuse key styles safely
const styleElement = (
  <style>{`
    .document-row:hover {
      border-color: var(--primary) !important;
      box-shadow: var(--shadow-md);
      transform: translateX(6px);
    }
    @media (max-width: 768px) {
      .document-row {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 15px;
      }
      .document-row a {
        text-align: center;
        width: 100%;
      }
    }
  `}</style>
);
