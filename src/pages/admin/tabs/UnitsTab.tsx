import React, { useState } from 'react';
import { dbService } from '../../../services/db';
import type { BusinessUnit, ProfileContent, BusinessUnitDetail, BusinessUnitBranch } from '../../../services/db';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ShieldAlert, ShoppingBag, Wallet, Truck, Award, Info, MapPin, Clock, UploadCloud, Check, ArrowLeft } from 'lucide-react';

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
  const [modalTab, setModalTab] = useState<'info' | 'branches'>('info');
  const [showBranchForm, setShowBranchForm] = useState(false);
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

  // Dynamic branches list
  const [branches, setBranches] = useState<BusinessUnitBranch[]>([]);

  // Branch editor form states
  const [branchForm, setBranchForm] = useState<Omit<BusinessUnitBranch, 'id'>>({
    name: '',
    description: '',
    images: [],
    hours: '',
    whatsapp: '',
    map_url: ''
  });
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [isBranchUploading, setIsBranchUploading] = useState(false);

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
    setBranches(details?.branches || []);
    
    setModalTab('info');
    setShowBranchForm(false);
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

  const handleBranchPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsBranchUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `branch_${Date.now()}.${fileExt}`;
        const filePath = `branches/${fileName}`;
        
        const publicUrl = await dbService.uploadFile('images', filePath, file);
        setBranchForm(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
        showToast('Foto cabang berhasil ditambahkan.', 'success');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah foto cabang.', 'error');
      } finally {
        setIsBranchUploading(false);
      }
    }
  };

  const handleRemoveBranchPhoto = (imgIndex: number) => {
    setBranchForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== imgIndex)
    }));
  };

  const handleAddOrUpdateBranch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.hours || !branchForm.images || branchForm.images.length === 0) {
      showToast('Nama, Jam Operasional, dan minimal satu Foto Cabang wajib diisi.', 'error');
      return;
    }

    if (editingBranchId) {
      setBranches(prev => prev.map(b => b.id === editingBranchId ? { ...b, ...branchForm } : b));
      setEditingBranchId(null);
      showToast('Data cabang berhasil diperbarui.', 'success');
    } else {
      const newBranch: BusinessUnitBranch = {
        id: `br-${Date.now()}`,
        ...branchForm
      };
      setBranches(prev => [...prev, newBranch]);
      showToast('Cabang baru ditambahkan ke daftar.', 'success');
    }

    setBranchForm({
      name: '',
      description: '',
      images: [],
      hours: '',
      whatsapp: '',
      map_url: ''
    });
    setShowBranchForm(false);
  };

  const handleEditBranchClick = (branch: BusinessUnitBranch) => {
    setBranchForm({
      name: branch.name,
      description: branch.description,
      images: branch.images || [],
      hours: branch.hours,
      whatsapp: branch.whatsapp,
      map_url: branch.map_url || ''
    });
    setEditingBranchId(branch.id);
    setShowBranchForm(true);
  };

  const handleDeleteBranchClick = (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    if (editingBranchId === id) {
      setEditingBranchId(null);
      setBranchForm({
        name: '',
        description: '',
        images: [],
        hours: '',
        whatsapp: '',
        map_url: ''
      });
    }
    showToast('Cabang dihapus dari daftar.', 'success');
  };

  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Manual client-side validation
    if (!unitForm.name.trim()) {
      showToast('Nama Unit Usaha wajib diisi.', 'error');
      setModalTab('info');
      return;
    }
    if (!unitForm.image_url) {
      showToast('Gambar Cover Utama wajib diunggah.', 'error');
      setModalTab('info');
      return;
    }
    if (!unitForm.description.trim()) {
      showToast('Deskripsi Singkat wajib diisi.', 'error');
      setModalTab('info');
      return;
    }
    if (!longDesc.trim()) {
      showToast('Deskripsi Detail / Penjelasan Lengkap wajib diisi.', 'error');
      setModalTab('info');
      return;
    }

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
        // Keep existing extra_info if we want, or remove it. Since it's unused, we omit it.
        const newDetail: BusinessUnitDetail = {
          unit_id: targetUnitId,
          logo_url: logoUrl,
          long_description: longDesc,
          branches: branches
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
              setBranches([]);
              setBranchForm({ name: '', description: '', images: [], hours: '', whatsapp: '', map_url: '' });
              setEditingBranchId(null);
              setModalTab('info');
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
          <div className="popup-modal-card" style={{ maxWidth: '850px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: '24px' }}>
            <div className="popup-modal-header" style={{ marginBottom: '15px', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  backgroundColor: 'rgba(15, 98, 254, 0.08)',
                  color: 'var(--primary)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unitForm.icon === 'ShoppingBag' && <ShoppingBag size={20} />}
                  {unitForm.icon === 'Wallet' && <Wallet size={20} />}
                  {unitForm.icon === 'Truck' && <Truck size={20} />}
                  {unitForm.icon === 'Award' && <Award size={20} />}
                </div>
                <div>
                  <h5 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                    {isEditing === 'new' ? 'Tambah Unit Usaha Baru' : `Sunting: ${unitForm.name || 'Unit Usaha'}`}
                  </h5>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Kelola data utama dan daftar cabang/lokasi usaha</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditing(null)} 
                className="popup-modal-close"
                title="Tutup"
                style={{ width: '32px', height: '32px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div style={{
              display: 'flex',
              gap: '6px',
              borderBottom: '1px solid #e2e8f0',
              marginBottom: '20px',
              paddingBottom: '2px'
            }}>
              <button
                type="button"
                onClick={() => setModalTab('info')}
                style={{
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: modalTab === 'info' ? 'var(--primary)' : '#64748b',
                  border: 'none',
                  background: 'none',
                  borderBottom: modalTab === 'info' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Info size={15} />
                <span>Informasi Unit</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('branches')}
                style={{
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: modalTab === 'branches' ? 'var(--primary)' : '#64748b',
                  border: 'none',
                  background: 'none',
                  borderBottom: modalTab === 'branches' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MapPin size={15} />
                <span>Cabang & Lokasi ({branches.length})</span>
              </button>
            </div>

            <form onSubmit={handleSaveUnit} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', marginBottom: '15px' }}>
                
                {/* ─── TAB 1: INFORMASI UTAMA UNIT ─── */}
                {modalTab === 'info' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <div className="form-group" style={{ flex: '1 1 300px', marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 650, fontSize: '0.82rem', color: '#475569', marginBottom: '5px', display: 'block' }}>Nama Unit Usaha <span style={{ color: '#ef4444' }}>*</span></label>
                        <input 
                          type="text" 
                          required 
                          value={unitForm.name} 
                          onChange={e => setUnitForm(prev => ({ ...prev, name: e.target.value }))} 
                          className="form-input" 
                          placeholder="Masukkan nama unit bisnis..."
                          style={{ borderRadius: '10px', padding: '10px 14px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 650, fontSize: '0.82rem', color: '#475569', marginBottom: '5px', display: 'block' }}>Pilih Ikon Representasi <span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ display: 'flex', gap: '8px' }}>
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
                                  background: isSelected ? 'rgba(15, 98, 254, 0.08)' : '#f8fafc',
                                  border: isSelected ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                                  borderRadius: '10px',
                                  width: '45px',
                                  height: '45px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: isSelected ? 'var(--primary)' : '#64748b',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <IconComp size={18} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {/* Cover Photo Dropzone */}
                      <div className="form-group" style={{ flex: '1 1 280px', marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 650, fontSize: '0.82rem', color: '#475569', marginBottom: '5px', display: 'block' }}>Cover Utama Unit Usaha <span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '12px',
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '130px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {unitForm.image_url ? (
                            <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                              <img 
                                src={unitForm.image_url} 
                                alt="Cover" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              />
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer'
                              }}
                              className="hover-trigger"
                              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                              onMouseLeave={e => { e.currentTarget.style.opacity = '0'; }}
                              >
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleCoverPhotoChange} 
                                  style={{ display: 'none' }} 
                                  id="unit-cover-upload" 
                                />
                                <label 
                                  htmlFor="unit-cover-upload"
                                  style={{
                                    cursor: 'pointer',
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    color: 'var(--text-dark)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <UploadCloud size={14} />
                                  <span>{isUploading ? 'Mengunggah...' : 'Ubah Gambar'}</span>
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'inherit', alignItems: 'center', gap: '6px' }}>
                              <div style={{ color: 'var(--primary)', backgroundColor: 'rgba(15, 98, 254, 0.05)', padding: '8px', borderRadius: '50%' }}>
                                <ImageIcon size={20} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleCoverPhotoChange} 
                                  style={{ display: 'none' }} 
                                  id="unit-cover-upload-new" 
                                />
                                <label 
                                  htmlFor="unit-cover-upload-new"
                                  style={{
                                    cursor: 'pointer',
                                    color: 'var(--primary)',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    textDecoration: 'underline'
                                  }}
                                >
                                  {isUploading ? 'Memproses...' : 'Unggah Cover'}
                                </label>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>Dimensi 1200x600 px (Lanskap)</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Logo Photo Dropzone */}
                      <div className="form-group" style={{ flex: '1 1 280px', marginBottom: 0 }}>
                        <label className="form-label" style={{ fontWeight: 650, fontSize: '0.82rem', color: '#475569', marginBottom: '5px', display: 'block' }}>Logo Unit Usaha (PNG Transparan)</label>
                        <div style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '12px',
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '130px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {logoUrl ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                              <img 
                                src={logoUrl} 
                                alt="Logo" 
                                style={{ maxHeight: '90px', maxWidth: '85%', objectFit: 'contain' }} 
                              />
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s ease',
                                cursor: 'pointer'
                              }}
                              className="hover-trigger"
                              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                              onMouseLeave={e => { e.currentTarget.style.opacity = '0'; }}
                              >
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleLogoPhotoChange} 
                                  style={{ display: 'none' }} 
                                  id="unit-logo-upload" 
                                />
                                <label 
                                  htmlFor="unit-logo-upload"
                                  style={{
                                    cursor: 'pointer',
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    color: 'var(--text-dark)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <UploadCloud size={14} />
                                  <span>{isUploading ? 'Mengunggah...' : 'Ubah Logo'}</span>
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                              <div style={{ color: 'var(--primary)', backgroundColor: 'rgba(15, 98, 254, 0.05)', padding: '8px', borderRadius: '50%' }}>
                                <ImageIcon size={20} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleLogoPhotoChange} 
                                  style={{ display: 'none' }} 
                                  id="unit-logo-upload-new" 
                                />
                                <label 
                                  htmlFor="unit-logo-upload-new"
                                  style={{
                                    cursor: 'pointer',
                                    color: 'var(--primary)',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    textDecoration: 'underline'
                                  }}
                                >
                                  {isUploading ? 'Memproses...' : 'Unggah Logo'}
                                </label>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>Format PNG dengan background transparan</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontWeight: 650, fontSize: '0.82rem', color: '#475569', marginBottom: '5px', display: 'block' }}>Deskripsi Singkat (Tampil di List Kartu Beranda) <span style={{ color: '#ef4444' }}>*</span></label>
                      <input 
                        type="text"
                        required 
                        value={unitForm.description} 
                        onChange={e => setUnitForm(prev => ({ ...prev, description: e.target.value }))} 
                        className="form-input" 
                        placeholder="Contoh: Menyediakan berbagai kebutuhan pokok harian anggota..."
                        style={{ borderRadius: '10px', padding: '10px 14px', border: '1px solid #cbd5e1' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontWeight: 650, fontSize: '0.82rem', color: '#475569', marginBottom: '5px', display: 'block' }}>Deskripsi Detail / Penjelasan Lengkap (Halaman Detail Subpage) <span style={{ color: '#ef4444' }}>*</span></label>
                      <textarea 
                        required
                        value={longDesc} 
                        onChange={e => setLongDesc(e.target.value)} 
                        className="form-input" 
                        style={{ minHeight: '140px', borderRadius: '10px', padding: '12px 14px', border: '1px solid #cbd5e1', lineHeight: '1.6' }}
                        placeholder="Tuliskan detail layanan, profil lengkap, visi misi, atau tata cara pemesanan dari unit usaha ini..."
                      />
                    </div>
                  </div>
                )}

                {/* ─── TAB 2: CABANG DAN LOKASI (Responsive Dynamic View Layout) ─── */}
                {modalTab === 'branches' && (
                  <div>
                    {!showBranchForm ? (
                      /* VIEW 1: BRANCHES LIST (Clean & Uncluttered) */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>
                            Cabang Terdaftar ({branches.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setBranchForm({ name: '', description: '', images: [], hours: '', whatsapp: '', map_url: '' });
                              setEditingBranchId(null);
                              setShowBranchForm(true);
                            }}
                            className="btn btn-primary"
                            style={{
                              padding: '8px 14px',
                              fontSize: '0.78rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Plus size={14} />
                            <span>Tambah Cabang</span>
                          </button>
                        </div>

                        {branches.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
                            {branches.map(branch => (
                              <div 
                                key={branch.id} 
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '12px',
                                  borderRadius: '12px',
                                  border: '1px solid #e2e8f0',
                                  backgroundColor: 'white',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '60px', height: '45px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', position: 'relative', flexShrink: 0 }}>
                                    <img 
                                      src={branch.images?.[0] || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'} 
                                      alt={branch.name} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                    {branch.images && branch.images.length > 1 && (
                                      <span style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        right: '2px',
                                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                        color: 'white',
                                        fontSize: '0.55rem',
                                        padding: '1px 3px',
                                        borderRadius: '3px',
                                        fontWeight: 700
                                      }}>
                                        +{branch.images.length - 1}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-dark)' }}>{branch.name}</strong>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                      <Clock size={10} />
                                      {branch.hours}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button 
                                    type="button" 
                                    onClick={() => handleEditBranchClick(branch)}
                                    className="btn btn-secondary" 
                                    style={{ padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Sunting Cabang"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button 
                                    type="button" 
                                    onClick={() => handleDeleteBranchClick(branch.id)}
                                    className="btn btn-danger" 
                                    style={{ padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Hapus Cabang"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', border: '2px dashed #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                            <MapPin size={32} color="#94a3b8" style={{ marginBottom: '10px' }} />
                            <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Belum Ada Cabang</span>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px', textAlign: 'center', marginBottom: '10px' }}>Unit usaha ini belum memiliki cabang terdaftar.</span>
                            <button
                              type="button"
                              onClick={() => {
                                setBranchForm({ name: '', description: '', images: [], hours: '', whatsapp: '', map_url: '' });
                                setEditingBranchId(null);
                                setShowBranchForm(true);
                              }}
                              className="btn btn-primary"
                              style={{ padding: '8px 16px', fontSize: '0.78rem', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                            >
                              Buat Cabang Pertama
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* VIEW 2: BRANCH FORM (Spacious, Focus-Mode, 100% Mobile Responsive) */
                      <div style={{
                        padding: '18px',
                        borderRadius: '16px',
                        border: '1px solid rgba(15, 98, 254, 0.15)',
                        backgroundColor: 'rgba(15, 98, 254, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid rgba(15, 98, 254, 0.1)', paddingBottom: '10px', marginBottom: '4px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setShowBranchForm(false);
                              setEditingBranchId(null);
                              setBranchForm({ name: '', description: '', images: [], hours: '', whatsapp: '', map_url: '' });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              border: 'none',
                              background: 'none',
                              color: 'var(--primary)',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              padding: '5px 10px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(15, 98, 254, 0.06)'
                            }}
                          >
                            <ArrowLeft size={13} />
                            <span>Kembali</span>
                          </button>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {editingBranchId ? 'Sunting Cabang' : 'Tambah Cabang Baru'}
                          </strong>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <div className="form-group" style={{ flex: '1 1 180px', marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Nama Cabang *</label>
                            <input 
                              type="text" 
                              value={branchForm.name} 
                              onChange={e => setBranchForm(prev => ({ ...prev, name: e.target.value }))}
                              className="form-input"
                              style={{ width: '100%', fontSize: '0.8rem', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                              placeholder="Contoh: Adismart 1"
                            />
                          </div>
                          <div className="form-group" style={{ flex: '1 1 180px', marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Jam Operasional *</label>
                            <input 
                              type="text" 
                              value={branchForm.hours} 
                              onChange={e => setBranchForm(prev => ({ ...prev, hours: e.target.value }))}
                              className="form-input"
                              style={{ width: '100%', fontSize: '0.8rem', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                              placeholder="Contoh: 06:00 - 21:00"
                            />
                          </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>Keterangan Lokasi / Detail Cabang</label>
                          <textarea 
                            value={branchForm.description} 
                            onChange={e => setBranchForm(prev => ({ ...prev, description: e.target.value }))}
                            className="form-input"
                            style={{ width: '100%', fontSize: '0.8rem', padding: '8px 10px', minHeight: '50px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            placeholder="Masukkan alamat singkat atau deskripsi lokasi cabang..."
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <div className="form-group" style={{ flex: '1 1 180px', marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>WhatsApp Admin (62xxx)</label>
                            <input 
                              type="text" 
                              value={branchForm.whatsapp} 
                              onChange={e => setBranchForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                              className="form-input"
                              style={{ width: '100%', fontSize: '0.8rem', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                              placeholder="Contoh: 628123456789"
                            />
                          </div>
                          <div className="form-group" style={{ flex: '1 1 180px', marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>URL Google Maps</label>
                            <input 
                              type="text" 
                              value={branchForm.map_url} 
                              onChange={e => setBranchForm(prev => ({ ...prev, map_url: e.target.value }))}
                              className="form-input"
                              style={{ width: '100%', fontSize: '0.8rem', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                              placeholder="https://maps.google.com/..."
                            />
                          </div>
                        </div>

                        {/* Branch gallery uploads */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '5px', display: 'block' }}>Galeri Foto Cabang (Minimal 1) *</label>
                          
                          {branchForm.images && branchForm.images.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              {branchForm.images.map((imgUrl, idx) => (
                                <div 
                                  key={idx} 
                                  style={{ 
                                    position: 'relative', 
                                    width: '65px', 
                                    height: '48px', 
                                    borderRadius: '6px', 
                                    overflow: 'hidden', 
                                    border: '1px solid #cbd5e1',
                                    flexShrink: 0
                                  }}
                                >
                                  <img 
                                    src={imgUrl} 
                                    alt="" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBranchPhoto(idx)}
                                    style={{
                                      position: 'absolute',
                                      top: '2px',
                                      right: '2px',
                                      backgroundColor: 'rgba(239, 68, 68, 0.85)',
                                      border: 'none',
                                      color: 'white',
                                      width: '15px',
                                      height: '15px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '8px',
                                      cursor: 'pointer',
                                      padding: 0
                                    }}
                                    title="Hapus foto"
                                  >
                                    <X size={8} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleBranchPhotoChange} 
                              style={{ display: 'none' }} 
                              id="branch-file-upload-modal" 
                            />
                            <label 
                              htmlFor="branch-file-upload-modal" 
                              className="btn btn-secondary" 
                              style={{ 
                                cursor: 'pointer', 
                                padding: '6px 12px',
                                fontSize: '0.72rem',
                                gap: '6px',
                                borderColor: 'var(--primary)',
                                color: 'var(--primary)',
                                background: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '8px'
                              }}
                            >
                              <ImageIcon size={12} />
                              <span>{isBranchUploading ? 'Memproses...' : 'Tambah Foto Cabang'}</span>
                            </label>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                          <button 
                            type="button"
                            onClick={() => {
                              setShowBranchForm(false);
                              setEditingBranchId(null);
                              setBranchForm({ name: '', description: '', images: [], hours: '', whatsapp: '', map_url: '' });
                            }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                          >
                            Batal
                          </button>
                          <button 
                            type="button" 
                            onClick={handleAddOrUpdateBranch}
                            className="btn btn-primary" 
                            style={{ 
                              padding: '6px 14px', 
                              fontSize: '0.75rem', 
                              borderRadius: '8px',
                              backgroundColor: editingBranchId ? 'var(--accent)' : 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            disabled={isBranchUploading}
                          >
                            {editingBranchId ? '✓ Perbarui' : '✓ Simpan Cabang'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="popup-modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', marginTop: 'auto', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(null)} 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '0.82rem', borderRadius: '8px' }} 
                  disabled={isSaving || isUploading}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }} 
                  disabled={isSaving || isUploading}
                >
                  {isSaving ? (
                    <span className="spinner-mini" style={{ width: '12px', height: '12px' }}></span>
                  ) : (
                    <Check size={14} />
                  )}
                  <span>✓ Simpan Unit & Detail</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
