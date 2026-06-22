import React, { useState } from 'react';
import { dbService } from '../../../services/db';
import type { ContactMessage } from '../../../services/db';
import { Trash2, ShieldAlert, Search } from 'lucide-react';

interface MessagesTabProps {
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  role?: string;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  messages,
  setMessages,
  showToast,
  triggerConfirm,
  role = 'editor'
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = messages.filter((msg) => {
    return (
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteMessage = (id: string) => {
    triggerConfirm(
      'Hapus Pesan Masukan?',
      'Apakah Anda yakin ingin menghapus pesan masukan dari inbox?',
      async () => {
        setIsSaving(true);
        try {
          await dbService.deleteMessage(id);
          const updated = messages.filter(m => m.id !== id);
          setMessages(updated);
          showToast('Pesan berhasil dihapus dari Inbox.', 'success');
        } catch (err) {
          console.error(err);
          showToast('Gagal menghapus pesan.', 'error');
        } finally {
          setIsSaving(false);
        }
      }
    );
  };

  return (
    <div className="admin-card">
      <h4 style={{ marginBottom: '20px' }}>Inbox Kritik, Saran, & Pertanyaan Anggota ({messages.length})</h4>
      
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
          <span>Akses Terbatas (Editor): Anda tidak memiliki wewenang untuk menghapus pesan masuk. Silakan hubungi Administrator.</span>
        </div>
      )}

      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '350px', marginBottom: '20px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Cari nama, email, subjek, pesan..."
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

      {filteredMessages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted-dark)' }}>
          {messages.length === 0 ? 'Tidak ada masukan masuk saat ini.' : 'Tidak ada masukan yang cocok dengan kriteria pencarian Anda.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredMessages.map((msg) => (
            <div key={msg.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <div>
                  <h5 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 4px 0' }}>{msg.subject}</h5>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-dark)' }}>
                    Dari: <strong>{msg.name}</strong> ({msg.email})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>
                    {new Date(msg.created_at).toLocaleString('id-ID')}
                  </span>
                  {role === 'admin' && (
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)} 
                      className="btn btn-danger" 
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                      disabled={isSaving}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted-dark)', whiteSpace: 'pre-wrap', margin: 0 }}>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
