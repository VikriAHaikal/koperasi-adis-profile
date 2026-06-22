import React, { useState } from 'react';
import { dbService } from '../../../services/db';
import type { BusinessUnit, ProfileContent, BusinessUnitDetail } from '../../../services/db';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ShieldAlert, ShoppingBag, Wallet, Truck, Award } from 'lucide-react';

interface UnitsTabProps {
  units: BusinessUnit[];
  setUnits: React.Dispatch<React.SetStateAction<BusinessUnit[]>>;
  profile: ProfileContent | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileContent | null>>;
  isInitialLoading: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  role?: string;
}

export const UnitsTab: React.FC<UnitsTabProps> = ({
  units,
  setUnits,
  profile,
  setProfile,
  isInitialLoading,
  showToast,
  triggerConfirm,
  role = 'editor'
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Basic unit fields
  const [unitForm, setUnitForm] = useState<Omit<BusinessUnit, 'id'>>({
    name: '',
    description: '',
    icon: 'ShoppingBag',
    image_url: ''
  });

  // Dynamic unit detail fields
  const [logoUrl, setLogoUrl] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [extraInfo, setExtraInfo] = useState('');

  const handleEditUnit = (unit: BusinessUnit) => {
    setUnitForm({
      name: unit.name,
      description: unit.description,
      icon: unit.icon,
      image_url: unit.image_url || ''
    });
    
    // Find details
    const details = profile?.unit_details?.find(d => d.unit_id === unit.id);
    setLogoUrl(details?.logo_url || '');
    setLongDesc(details?.long_description || '');
    setExtraInfo(details?.extra_info || '');
    
    setIsEditing(unit.id);
  };

  const handleCoverPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `unit_${Date.now()}.${fileExt}`;
        const filePath = `units/${fileName}`;
        
        const publicUrl = await dbService.uploadFile('images', filePath, file);
        setUnitForm(prev => ({ ...prev, image_url: publicUrl }));
        showToast('Gambar cover unit usaha berhasil diunggah.', 'success');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah gambar cover.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleLogoPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `unit_logo_${Date.now()}.${fileExt}`;
        const filePath = `units/${fileName}`;
        
        const publicUrl = await dbService.uploadFile('images', filePath, file);
        setLogoUrl(publicUrl);
        showToast('Logo unit usaha berhasil diunggah.', 'success');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah logo unit.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updated: BusinessUnit[];
      let targetUnitId = isEditing || '';
      
      if (isEditing === 'new') {
        targetUnitId = 'unit-' + Date.now();
        const newUnit: BusinessUnit = {
          id: targetUnitId,
          ...unitForm
        };
        updated = [...units, newUnit];
      } else {
        updated = units.map(u => u.id === isEditing ? { ...u, ...unitForm } : u);
      }
      
      // 1. Save basics to business_units
      await dbService.saveBusinessUnits(updated);
      setUnits(updated);
      
      // 2. Save details to profile.unit_details
      if (profile && setProfile) {
        const newDetail: BusinessUnitDetail = {
          unit_id: targetUnitId,
          logo_url: logoUrl,
          long_description: longDesc,
          extra_info: extraInfo
        };
        
        let updatedDetails = [...(profile.unit_details || [])];
        if (updatedDetails.some(d => d.unit_id === targetUnitId)) {
          updatedDetails = updatedDetails.map(d => d.unit_id === targetUnitId ? newDetail : d);
        } else {
          updatedDetails.push(newDetail);
        }
        
        const updatedProfile = { ...profile, unit_details: updatedDetails };
        await dbService.saveProfile(updatedProfile);
        setProfile(updatedProfile);
      }
      
      setIsEditing(null);
      setUnitForm({ name: '', description: '', icon: 'ShoppingBag', image_url: '' });
      setLogoUrl('');
      setLongDesc('');
      setExtraInfo('');
      showToast('Unit Usaha dan Halaman Detail berhasil disimpan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan Unit Usaha.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUnit = (id: string) => {
    triggerConfirm(
      'Hapus Unit Usaha?',
      'Apakah Anda yakin ingin menghapus unit usaha ini beserta halaman detailnya?',
      async () => {
        setIsSaving(true);
        try {
          // Remove basic
          const updated = units.filter(u => u.id !== id);
          await dbService.saveBusinessUnits(updated);
          setUnits(updated);
          
          // Remove details
          if (profile && setProfile) {
            const updatedDetails = (profile.unit_details || []).filter(d => d.unit_id !== id);
            const updatedProfile = { ...profile, unit_details: updatedDetails };
            await dbService.saveProfile(updatedProfile);
            setProfile(updatedProfile);
          }
          
          showToast('Unit Usaha berhasil dihapus.', 'success');
        } catch (err) {
          console.error(err);
          showToast('Gagal menghapus unit usaha.', 'error');
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
            <span>Akses Terbatas (Editor): Anda tidak memiliki wewenang untuk menghapus unit usaha. Silakan hubungi Administrator.</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0 }}>Daftar Unit Usaha & Detail Konten</h4>
          <button 
            onClick={() => { 
              setUnitForm({ name: '', description: '', icon: 'ShoppingBag', image_url: '' }); 
              setLogoUrl('');
              setLongDesc('');
              setExtraInfo('');
              setIsEditing('new'); 
            }} 
            className="btn btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Tambah Unit Usaha</span>
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Logo / Icon</th>
                <th>Nama Unit Bisnis</th>
                <th>Deskripsi Singkat</th>
                <th>Detail Subpage</th>
                <th style={{ width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isInitialLoading ? (
                Array.from({ length: 3 }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {Array.from({ length: 5 }).map((_, cIdx) => (
                      <td key={cIdx}>
                        <div className="skeleton-line" style={{ width: cIdx === 0 ? '60px' : '90%' }}></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                units.map((unit) => {
                  const details = profile?.unit_details?.find(d => d.unit_id === unit.id);
                  return (
                    <tr key={unit.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {details?.logo_url ? (
                            <img src={details.logo_url} alt="" style={{ width: '45px', height: '35px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e2e8f0', padding: '2px', backgroundColor: 'white' }} />
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-dark)', fontStyle: 'italic' }}>No Logo</span>
                          )}
                        </div>
                      </td>
                      <td><strong>{unit.name}</strong></td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted-dark)' }}>{unit.description}</td>
                      <td>
                        {details?.long_description ? (
                          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>Dinamis Aktif</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '3px 8px', borderRadius: '4px' }}>Deskripsi Dasar</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEditUnit(unit)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="Sunting Unit & Halaman Detail"><Edit2 size={12} /></button>
                          {role === 'admin' && (
                            <button onClick={() => handleDeleteUnit(unit.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} title="Hapus"><Trash2 size={12} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {!isInitialLoading && units.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted-dark)', padding: '15px' }}>Belum ada unit usaha.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop Up Modal: Tambah/Edit Unit Usaha */}
      {isEditing !== null && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                {isEditing === 'new' ? 'Tambah Unit & Halaman Detail' : 'Sunting Unit & Halaman Detail'}
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

            <form onSubmit={handleSaveUnit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Nama Unit Usaha *</label>
                  <input 
                    type="text" 
                    required 
                    value={unitForm.name} 
                    onChange={e => setUnitForm(prev => ({ ...prev, name: e.target.value }))} 
                    className="form-input" 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Pilih Ikon Unit Usaha *</label>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    {[
                      { name: 'ShoppingBag', component: ShoppingBag, label: 'Toko/Mart' },
                      { name: 'Wallet', component: Wallet, label: 'Simpan Pinjam' },
                      { name: 'Truck', component: Truck, label: 'Logistik' },
                      { name: 'Award', component: Award, label: 'Umum' }
                    ].map(iconItem => {
                      const IconComp = iconItem.component;
                      const isSelected = unitForm.icon === iconItem.name;
                      return (
                        <button
                          key={iconItem.name}
                          type="button"
                          onClick={() => setUnitForm(prev => ({ ...prev, icon: iconItem.name }))}
                          title={iconItem.label}
                          style={{
                            background: isSelected ? 'rgba(15, 98, 254, 0.08)' : 'white',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                            borderRadius: '12px',
                            width: '56px',
                            height: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isSelected ? 'var(--primary)' : 'var(--text-muted-dark)',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(15, 98, 254, 0.4)';
                              e.currentTarget.style.color = 'var(--primary)';
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'var(--border-light)';
                              e.currentTarget.style.color = 'var(--text-muted-dark)';
                            }
                          }}
                        >
                          <IconComp size={24} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Cover Gambar Utama Unit *</label>
                  {unitForm.image_url && (
                    <div style={{ marginBottom: '12px' }}>
                      <img 
                        src={unitForm.image_url} 
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCoverPhotoChange} 
                      style={{ display: 'none' }} 
                      id="unit-file-upload-modal" 
                    />
                    <label 
                      htmlFor="unit-file-upload-modal" 
                      className="btn btn-secondary" 
                      style={{ 
                        cursor: 'pointer', 
                        gap: '8px',
                        borderColor: unitForm.image_url ? 'var(--accent)' : 'var(--primary)',
                        color: unitForm.image_url ? 'var(--accent)' : 'var(--primary)',
                        background: 'white',
                        width: 'fit-content'
                      }}
                    >
                      <ImageIcon size={16} />
                      <span>{isUploading ? 'Memproses...' : (unitForm.image_url ? 'Ganti Cover Gambar' : 'Pilih Cover Gambar')}</span>
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Deskripsi Singkat (List Unit Usaha) *</label>
                  <input 
                    type="text"
                    required 
                    value={unitForm.description} 
                    onChange={e => setUnitForm(prev => ({ ...prev, description: e.target.value }))} 
                    className="form-input" 
                  />
                </div>

                {/* ---------------- NEW DYNAMIC DETAILS FIELDS ---------------- */}
                <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '15px', marginTop: '5px' }}>
                  <h6 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>KONTEN DINAMIS HALAMAN DETAIL SUB-PAGE</h6>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Logo Unit Usaha (Optional)</label>
                  {logoUrl && (
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      <img 
                        src={logoUrl} 
                        alt="Logo Preview" 
                        style={{ maxHeight: '80px', objectFit: 'contain' }} 
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoPhotoChange} 
                      style={{ display: 'none' }} 
                      id="unit-logo-upload-modal" 
                    />
                    <label 
                      htmlFor="unit-logo-upload-modal" 
                      className="btn btn-secondary" 
                      style={{ 
                        cursor: 'pointer', 
                        gap: '8px',
                        borderColor: logoUrl ? 'var(--accent)' : 'var(--primary)',
                        color: logoUrl ? 'var(--accent)' : 'var(--primary)',
                        background: 'white',
                        width: 'fit-content'
                      }}
                    >
                      <ImageIcon size={16} />
                      <span>{isUploading ? 'Memproses...' : (logoUrl ? 'Ganti Logo Unit' : 'Pilih Logo Unit')}</span>
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Deskripsi Detail / Panjang (CRUD) *</label>
                  <textarea 
                    required
                    value={longDesc} 
                    onChange={e => setLongDesc(e.target.value)} 
                    className="form-input" 
                    style={{ minHeight: '100px' }}
                    placeholder="Tulis penjelasan lengkap unit usaha untuk subpage..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Informasi Tambahan (Jam Operasional / Akad / Detil Lain)</label>
                  <textarea 
                    value={extraInfo} 
                    onChange={e => setExtraInfo(e.target.value)} 
                    className="form-input" 
                    style={{ minHeight: '100px' }}
                    placeholder="Tulis jam operasional khusus, akad simpan pinjam, dll."
                  />
                </div>

              </div>

              <div className="popup-modal-footer" style={{ marginTop: '20px' }}>
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
                  ✓ Simpan Unit & Detail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
