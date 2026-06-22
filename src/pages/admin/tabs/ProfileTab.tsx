import React, { useState, useEffect } from 'react';
import { dbService } from '../../../services/db';
import type { ProfileContent, OrgMember, Achievement, Partner, Milestone, CultureValue } from '../../../services/db';
import { 
  BookOpen, TrendingUp, Users, Award, Edit2, Plus, Trash2, X, Check, ShieldAlert, Handshake, Clock, ShieldCheck, HeartHandshake, Trophy, Compass, Eye
} from 'lucide-react';

interface ProfileTabProps {
  profile: ProfileContent | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileContent | null>>;
  isInitialLoading: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  role?: string;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  setProfile,
  // isInitialLoading is not used in the component, so we don't destructure it to avoid TS6133
  showToast,
  triggerConfirm,
  role = 'editor'
}) => {
  const [profileSubTab, setProfileSubTab] = useState<'info' | 'stats' | 'org' | 'awards' | 'milestones' | 'partners' | 'budaya'>('info');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [sejarahText, setSejarahText] = useState('');
  const [visiText, setVisiText] = useState('');
  const [misiList, setMisiList] = useState<string[]>([]);
  const [newMisiInput, setNewMisiInput] = useState('');
  const [statsMembers, setStatsMembers] = useState('5280');
  const [statsAssets, setStatsAssets] = useState('12.5');
  const [statsGrowth, setStatsGrowth] = useState('12');
  const [orgList, setOrgList] = useState<OrgMember[]>([]);
  const [newOrgMember, setNewOrgMember] = useState<OrgMember>({ name: '', role: 'Pengurus Koperasi', avatar_url: '' });
  const [prestasiList, setPrestasiList] = useState<Achievement[]>([]);
  const [newPrestasi, setNewPrestasi] = useState<Achievement>({ year: '', title: '', awarder: '', description: '', level: 'Kabupaten/Kota', image_url: '' });
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [newPartner, setNewPartner] = useState<Partner>({ name: '', logo_url: '' });
  const [milestonesList, setMilestonesList] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState<Milestone>({ year: '', title: '', description: '' });
  const [budayaList, setBudayaList] = useState<CultureValue[]>([]);
  const [newBudaya, setNewBudaya] = useState<CultureValue>({ title: '', description: '', icon: 'ShieldCheck' });

  // Modal open states
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isPrestasiModalOpen, setIsPrestasiModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isBudayaModalOpen, setIsBudayaModalOpen] = useState(false);

  // Edit trackers
  const [editingOrgIdx, setEditingOrgIdx] = useState<number | null>(null);
  const [editingPrestasiIdx, setEditingPrestasiIdx] = useState<number | null>(null);
  const [editingPartnerIdx, setEditingPartnerIdx] = useState<number | null>(null);
  const [editingMilestoneIdx, setEditingMilestoneIdx] = useState<number | null>(null);
  const [editingBudayaIdx, setEditingBudayaIdx] = useState<number | null>(null);

  useEffect(() => {
    if (profile) {
      setSejarahText(profile.sejarah || '');
      setVisiText(profile.visi || '');
      setMisiList(profile.misi || []);
      setStatsMembers(profile.stats_members || '5280');
      setStatsAssets(profile.stats_assets || '12.5');
      setStatsGrowth(profile.stats_growth || '12');
      setOrgList(profile.org_structure || []);
      setPrestasiList(profile.prestasi || []);
      setPartnersList(profile.partners || []);
      setMilestonesList(profile.milestones || []);
      setBudayaList(profile.budaya || []);
    }
  }, [profile]);

  const handleSubTabChange = (tab: 'info' | 'stats' | 'org' | 'awards' | 'milestones' | 'partners' | 'budaya') => {
    setProfileSubTab(tab);
    setEditingOrgIdx(null);
    setEditingPrestasiIdx(null);
    setEditingPartnerIdx(null);
    setEditingMilestoneIdx(null);
    setEditingBudayaIdx(null);
    setIsOrgModalOpen(false);
    setIsPrestasiModalOpen(false);
    setIsPartnerModalOpen(false);
    setIsMilestoneModalOpen(false);
    setIsBudayaModalOpen(false);
    setNewOrgMember({ name: '', role: 'Pengurus Koperasi', avatar_url: '' });
    setNewPrestasi({ year: '', title: '', awarder: '', description: '', level: 'Kabupaten/Kota', image_url: '' });
    setNewPartner({ name: '', logo_url: '' });
    setNewMilestone({ year: '', title: '', description: '' });
    setNewBudaya({ title: '', description: '', icon: 'ShieldCheck' });
  };

  // UNIFIED AUTO-SAVE HANDLER
  const saveProfileData = async (fields: {
    sejarah?: string;
    visi?: string;
    misi?: string[];
    stats_members?: string;
    stats_assets?: string;
    stats_growth?: string;
    org_structure?: OrgMember[];
    prestasi?: Achievement[];
    partners?: Partner[];
    milestones?: Milestone[];
    budaya?: CultureValue[];
  }) => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const updated: ProfileContent = {
        ...profile,
        sejarah: fields.sejarah !== undefined ? fields.sejarah : sejarahText,
        visi: fields.visi !== undefined ? fields.visi : visiText,
        misi: fields.misi !== undefined ? fields.misi : misiList,
        stats_members: fields.stats_members !== undefined ? fields.stats_members : statsMembers,
        stats_assets: fields.stats_assets !== undefined ? fields.stats_assets : statsAssets,
        stats_growth: fields.stats_growth !== undefined ? fields.stats_growth : statsGrowth,
        org_structure: fields.org_structure !== undefined ? fields.org_structure : orgList,
        prestasi: fields.prestasi !== undefined ? fields.prestasi : prestasiList,
        partners: fields.partners !== undefined ? fields.partners : partnersList,
        milestones: fields.milestones !== undefined ? fields.milestones : milestonesList,
        budaya: fields.budaya !== undefined ? fields.budaya : budayaList,
      };

      await dbService.saveProfile(updated);
      setProfile(updated);

      // Sync React states
      if (fields.sejarah !== undefined) setSejarahText(fields.sejarah);
      if (fields.visi !== undefined) setVisiText(fields.visi);
      if (fields.misi !== undefined) setMisiList(fields.misi);
      if (fields.stats_members !== undefined) setStatsMembers(fields.stats_members);
      if (fields.stats_assets !== undefined) setStatsAssets(fields.stats_assets);
      if (fields.stats_growth !== undefined) setStatsGrowth(fields.stats_growth);
      if (fields.org_structure !== undefined) setOrgList(fields.org_structure);
      if (fields.prestasi !== undefined) setPrestasiList(fields.prestasi);
      if (fields.partners !== undefined) setPartnersList(fields.partners);
      if (fields.milestones !== undefined) setMilestonesList(fields.milestones);
      if (fields.budaya !== undefined) setBudayaList(fields.budaya);

      showToast('Perubahan berhasil disimpan!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan perubahan ke database.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reordering functions (automatically saves changes)
  const moveOrgMember = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= orgList.length) return;

    const updated = [...orgList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveProfileData({ org_structure: updated });
  };

  const movePartner = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= partnersList.length) return;

    const updated = [...partnersList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveProfileData({ partners: updated });
  };

  const movePrestasi = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= prestasiList.length) return;

    const updated = [...prestasiList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveProfileData({ prestasi: updated });
  };

  const moveMilestone = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= milestonesList.length) return;

    const updated = [...milestonesList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveProfileData({ milestones: updated });
  };

  const moveBudaya = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= budayaList.length) return;

    const updated = [...budayaList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveProfileData({ budaya: updated });
  };

  // Image Upload Handlers
  const handlePartnerLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `partner_${Date.now()}.${fileExt}`;
        const filePath = `partners/${fileName}`;
        
        const publicUrl = await dbService.uploadFile('images', filePath, file);
        setNewPartner(prev => ({ ...prev, logo_url: publicUrl }));
        showToast('Logo mitra berhasil diunggah.', 'success');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah logo.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleOrgMemberPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `org_${Date.now()}.${fileExt}`;
        const filePath = `profile/${fileName}`;
        
        const publicUrl = await dbService.uploadFile('images', filePath, file);
        setNewOrgMember(prev => ({ ...prev, avatar_url: publicUrl }));
        showToast('Foto pengurus berhasil diunggah.', 'success');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah foto.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handlePrestasiPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `award_${Date.now()}.${fileExt}`;
        const filePath = `awards/${fileName}`;
        
        const publicUrl = await dbService.uploadFile('images', filePath, file);
        setNewPrestasi(prev => ({ ...prev, image_url: publicUrl }));
        showToast('Gambar prestasi berhasil diunggah.', 'success');
      } catch (err: any) {
        console.error(err);
        showToast(err.message || 'Gagal mengunggah gambar.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="admin-card" style={{ maxWidth: '1000px', padding: '25px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)', backgroundColor: 'white' }}>
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
          <span>Akses Terbatas (Editor): Anda tidak memiliki wewenang untuk menghapus kepengurusan atau prestasi. Silakan hubungi Administrator.</span>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
            Pengaturan Profil & Visi Misi
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-dark)', marginTop: '2px', display: 'block' }}>
            Kelola data sejarah, visi misi, statistik, kepengurusan, dan pencapaian koperasi
          </span>
        </div>
        
        {/* Sub-Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          backgroundColor: '#f1f5f9',
          padding: '5px',
          borderRadius: '12px',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          {[
            { id: 'info', label: 'Visi & Misi', icon: BookOpen },
            { id: 'stats', label: 'Statistik Koperasi', icon: TrendingUp },
            { id: 'org', label: 'Struktur Organisasi', icon: Users },
            { id: 'awards', label: 'Prestasi', icon: Award },
            { id: 'milestones', label: 'Garis Waktu', icon: Clock },
            { id: 'partners', label: 'Mitra Kerja Sama', icon: Handshake },
            { id: 'budaya', label: 'Budaya Kerja', icon: ShieldCheck }
          ].map(subTab => {
            const IconComponent = subTab.icon;
            const isActive = profileSubTab === subTab.id;
            return (
              <button 
                key={subTab.id}
                type="button" 
                onClick={() => handleSubTabChange(subTab.id as any)} 
                style={{
                  background: isActive ? 'white' : 'transparent',
                  border: 'none',
                  padding: '10px 16px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted-dark)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: '1 1 auto',
                  justifyContent: 'center',
                  minWidth: '130px'
                }}
              >
                <IconComponent size={14} style={{ flexShrink: 0 }} />
                <span>{subTab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab 1: Visi, Misi & Sejarah (Inline & Direct Edit) */}
      {profileSubTab === 'info' && (
        <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem' }}>Sejarah Singkat Koperasi</label>
              <textarea 
                value={sejarahText} 
                onChange={e => setSejarahText(e.target.value)} 
                className="form-input" 
                style={{ minHeight: '140px', resize: 'vertical', lineHeight: 1.6 }} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem' }}>Visi Utama Koperasi</label>
              <textarea 
                value={visiText} 
                onChange={e => setVisiText(e.target.value)} 
                className="form-input" 
                style={{ minHeight: '70px', resize: 'vertical', lineHeight: 1.6 }} 
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem' }}>Poin-poin Misi Koperasi</label>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Tuliskan misi baru..." 
                  value={newMisiInput} 
                  onChange={e => setNewMisiInput(e.target.value)} 
                  className="form-input" 
                  style={{ borderRadius: '8px', fontSize: '0.88rem' }}
                />
                <button 
                  type="button" 
                  onClick={() => { 
                    if (newMisiInput.trim()) { 
                      const updatedMisi = [...misiList, newMisiInput.trim()];
                      setMisiList(updatedMisi);
                      setNewMisiInput(''); 
                      saveProfileData({ misi: updatedMisi });
                    } 
                  }} 
                  className="btn btn-primary" 
                  style={{ padding: '8px 20px', fontSize: '0.85rem', flexShrink: 0 }}
                >
                  Tambah Misi
                </button>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '8px', backgroundColor: '#f8fafc' }}>
                {misiList.map((misi, index) => (
                  <li key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ minWidth: '20px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>{index + 1}.</span>
                    <input 
                      type="text" 
                      value={misi} 
                      onChange={e => {
                        const updated = [...misiList];
                        updated[index] = e.target.value;
                        setMisiList(updated);
                      }} 
                      onBlur={() => saveProfileData({ misi: misiList })}
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.88rem', border: '1px solid #cbd5e1' }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        const updated = misiList.filter((_, i) => i !== index);
                        setMisiList(updated);
                        saveProfileData({ misi: updated });
                      }} 
                      className="btn btn-danger" 
                      style={{ padding: '6px 10px', fontSize: '0.8rem', flexShrink: 0, height: '32px' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
                {misiList.length === 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-dark)', fontStyle: 'italic', textAlign: 'center', display: 'block', padding: '10px' }}>
                    Belum ada misi. Tambahkan misi di atas.
                  </span>
                )}
              </ul>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                type="button" 
                onClick={() => saveProfileData({ sejarah: sejarahText, visi: visiText })} 
                disabled={isSaving}
                className="btn btn-primary" 
                style={{ padding: '10px 24px', fontSize: '0.88rem', borderRadius: '8px' }}
              >
                {isSaving ? <span className="spinner-mini" style={{ marginRight: '6px' }}></span> : <Check size={14} style={{ marginRight: '6px' }} />}
                <span>Simpan Visi & Sejarah</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Statistik Koperasi (Inline Edit) */}
      {profileSubTab === 'stats' && (
        <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '20px' }}>
            <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '18px', fontFamily: 'var(--font-heading)' }}>
              Data Statistik Koperasi
            </h5>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>Jumlah Anggota Karyawan *</label>
                <input 
                  type="text" 
                  value={statsMembers} 
                  onChange={e => setStatsMembers(e.target.value)} 
                  className="form-input" 
                  style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>Total Aset (Miliar Rupiah) *</label>
                <input 
                  type="text" 
                  value={statsAssets} 
                  onChange={e => setStatsAssets(e.target.value)} 
                  className="form-input" 
                  style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>Persentase Kenaikan SHU (%) *</label>
                <input 
                  type="text" 
                  value={statsGrowth} 
                  onChange={e => setStatsGrowth(e.target.value)} 
                  className="form-input" 
                  style={{ borderRadius: '8px', fontSize: '0.9rem' }}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                type="button" 
                onClick={() => saveProfileData({ stats_members: statsMembers, stats_assets: statsAssets, stats_growth: statsGrowth })} 
                disabled={isSaving}
                className="btn btn-primary" 
                style={{ padding: '10px 24px', fontSize: '0.88rem', borderRadius: '8px' }}
              >
                {isSaving ? <span className="spinner-mini" style={{ marginRight: '6px' }}></span> : <Check size={14} style={{ marginRight: '6px' }} />}
                <span>Simpan Statistik</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Struktur Organisasi (Row Table) */}
      {profileSubTab === 'org' && (
        <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h5 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Struktur Organisasi</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>Kelola bagan struktur pengurus dan pengawas</span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setEditingOrgIdx(null);
                setNewOrgMember({ name: '', role: 'Pengurus Koperasi', avatar_url: '' });
                setIsOrgModalOpen(true);
              }} 
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
            >
              <Plus size={14} />
              <span>Tambah Anggota</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '380px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px' }} className="admin-table-wrapper">
            <table className="admin-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th style={{ width: '80px' }}>Foto</th>
                  <th>Nama Pengurus</th>
                  <th>Jabatan / Peran</th>
                  <th style={{ width: '100px' }}>Urutan</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orgList.map((member, idx) => (
                  <tr key={idx}>
                    <td><strong>{idx + 1}</strong></td>
                    <td>
                      <img 
                        src={member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} 
                        alt={member.name} 
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} 
                      />
                    </td>
                    <td><strong style={{ color: 'var(--text-dark)' }}>{member.name}</strong></td>
                    <td>
                      <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, backgroundColor: 'rgba(15, 98, 254, 0.08)', color: 'var(--primary)' }}>
                        {member.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button" onClick={() => moveOrgMember(idx, 'up')} disabled={idx === 0 || isSaving} className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Naikkan"
                        >
                          ▲
                        </button>
                        <button 
                          type="button" onClick={() => moveOrgMember(idx, 'down')} disabled={idx === orgList.length - 1 || isSaving} className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Turunkan"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => { setEditingOrgIdx(idx); setNewOrgMember(member); setIsOrgModalOpen(true); }} 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--primary)', borderColor: 'rgba(15,98,254,0.3)', borderRadius: '6px', height: '26px', background: 'white' }}
                          title="Sunting"
                        >
                          <Edit2 size={12} />
                        </button>
                        {role === 'admin' && (
                          <button 
                            type="button" 
                            onClick={() => {
                              triggerConfirm(
                                'Hapus Anggota Struktur?',
                                `Apakah Anda yakin ingin menghapus "${member.name}" dari struktur organisasi?`,
                                () => {
                                  const updated = orgList.filter((_, i) => i !== idx);
                                  saveProfileData({ org_structure: updated });
                                }
                              );
                            }} 
                            className="btn btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'none', borderRadius: '6px', height: '26px' }}
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {orgList.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted-dark)', fontStyle: 'italic' }}>
                      Belum ada data anggota pengurus.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Prestasi (Row Table) */}
      {profileSubTab === 'awards' && (
        <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h5 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Daftar Prestasi & Penghargaan</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>Kelola data akreditasi dan piagam kehormatan resmi</span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setEditingPrestasiIdx(null);
                setNewPrestasi({ year: '', title: '', awarder: '', description: '', level: 'Kabupaten/Kota', image_url: '' });
                setIsPrestasiModalOpen(true);
              }} 
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
            >
              <Plus size={14} />
              <span>Tambah Prestasi</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '380px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px' }} className="admin-table-wrapper">
            <table className="admin-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Tahun</th>
                  <th style={{ width: '120px' }}>Tingkat</th>
                  <th>Nama Penghargaan</th>
                  <th>Pemberi</th>
                  <th style={{ width: '100px' }}>Urutan</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {prestasiList.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.year}</strong></td>
                    <td>
                      <span style={{ 
                        fontSize: '0.68rem', padding: '3px 8px', borderRadius: '50px', fontWeight: 800, textTransform: 'uppercase',
                        backgroundColor: item.level === 'Nasional' ? 'rgba(239, 68, 68, 0.1)' : item.level === 'Provinsi' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                        color: item.level === 'Nasional' ? '#ef4444' : item.level === 'Provinsi' ? '#3b82f6' : '#10b981'
                      }}>{item.level}</span>
                    </td>
                    <td><strong style={{ color: 'var(--text-dark)' }}>{item.title}</strong></td>
                    <td><span style={{ fontSize: '0.85rem', color: '#475569' }}>{item.awarder}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button" onClick={() => movePrestasi(idx, 'up')} disabled={idx === 0 || isSaving} className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Naikkan"
                        >
                          ▲
                        </button>
                        <button 
                          type="button" onClick={() => movePrestasi(idx, 'down')} disabled={idx === prestasiList.length - 1 || isSaving} className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Turunkan"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => { setEditingPrestasiIdx(idx); setNewPrestasi(item); setIsPrestasiModalOpen(true); }} 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--primary)', borderColor: 'rgba(15,98,254,0.3)', borderRadius: '6px', height: '26px', background: 'white' }}
                          title="Sunting"
                        >
                          <Edit2 size={12} />
                        </button>
                        {role === 'admin' && (
                          <button 
                            type="button" 
                            onClick={() => {
                              triggerConfirm(
                                'Hapus Prestasi?',
                                `Apakah Anda yakin ingin menghapus prestasi "${item.title}"?`,
                                () => {
                                  const updated = prestasiList.filter((_, i) => i !== idx);
                                  saveProfileData({ prestasi: updated });
                                }
                              );
                            }} 
                            className="btn btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'none', borderRadius: '6px', height: '26px' }}
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {prestasiList.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted-dark)', fontStyle: 'italic' }}>
                      Belum ada data prestasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Garis Waktu Milestones (Row Table) */}
      {profileSubTab === 'milestones' && (
        <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h5 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Perjalanan Garis Waktu (Milestones)</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>Kelola pencapaian tonggak sejarah penting koperasi</span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setEditingMilestoneIdx(null);
                setNewMilestone({ year: '', title: '', description: '' });
                setIsMilestoneModalOpen(true);
              }} 
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
            >
              <Plus size={14} />
              <span>Tambah Milestone</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '380px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px' }} className="admin-table-wrapper">
            <table className="admin-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Tahun</th>
                  <th style={{ width: '180px' }}>Judul Milestone</th>
                  <th>Deskripsi Rincian</th>
                  <th style={{ width: '100px' }}>Urutan</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {milestonesList.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.year}</strong></td>
                    <td><strong style={{ color: 'var(--text-dark)' }}>{item.title}</strong></td>
                    <td><span style={{ fontSize: '0.85rem', color: '#475569' }}>{item.description}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button" onClick={() => moveMilestone(idx, 'up')} disabled={idx === 0 || isSaving} className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Naikkan"
                        >
                          ▲
                        </button>
                        <button 
                          type="button" onClick={() => moveMilestone(idx, 'down')} disabled={idx === milestonesList.length - 1 || isSaving} className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Turunkan"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => { setEditingMilestoneIdx(idx); setNewMilestone(item); setIsMilestoneModalOpen(true); }} 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--primary)', borderColor: 'rgba(15,98,254,0.3)', borderRadius: '6px', height: '26px', background: 'white' }}
                          title="Sunting"
                        >
                          <Edit2 size={12} />
                        </button>
                        {role === 'admin' && (
                          <button 
                            type="button" 
                            onClick={() => {
                              triggerConfirm(
                                'Hapus Milestone?',
                                `Apakah Anda yakin ingin menghapus milestone tahun "${item.year}"?`,
                                () => {
                                  const updated = milestonesList.filter((_, i) => i !== idx);
                                  saveProfileData({ milestones: updated });
                                }
                              );
                            }} 
                            className="btn btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'none', borderRadius: '6px', height: '26px' }}
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {milestonesList.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted-dark)', fontStyle: 'italic' }}>
                      Belum ada data milestone.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 6: Mitra Kerja Sama (Row Table) */}
      {profileSubTab === 'partners' && (
        <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h5 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Daftar Mitra Kerja Sama</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>Kelola data logo instansi mitra kerja sama</span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setEditingPartnerIdx(null);
                setNewPartner({ name: '', logo_url: '' });
                setIsPartnerModalOpen(true);
              }} 
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
            >
              <Plus size={14} />
              <span>Tambah Mitra</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '380px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px' }} className="admin-table-wrapper">
            <table className="admin-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th style={{ width: '120px' }}>Logo</th>
                  <th>Nama Instansi / Mitra</th>
                  <th style={{ width: '100px' }}>Urutan</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {partnersList.map((partner, idx) => (
                  <tr key={idx}>
                    <td><strong>{idx + 1}</strong></td>
                    <td>
                      {partner.logo_url ? (
                        <img 
                          src={partner.logo_url} 
                          alt={partner.name} 
                          style={{ maxHeight: '30px', maxWidth: '90px', objectFit: 'contain', borderRadius: '4px', backgroundColor: 'white', padding: '2px', border: '1px solid #cbd5e1' }} 
                        />
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>Tanpa Logo</span>
                      )}
                    </td>
                    <td><strong style={{ color: 'var(--text-dark)' }}>{partner.name}</strong></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button" onClick={() => movePartner(idx, 'up')} disabled={idx === 0 || isSaving} className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Naikkan"
                        >
                          ▲
                        </button>
                        <button 
                          type="button" onClick={() => movePartner(idx, 'down')} disabled={idx === partnersList.length - 1 || isSaving} className="btn btn-secondary"
                          style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Turunkan"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          type="button" 
                          onClick={() => { setEditingPartnerIdx(idx); setNewPartner(partner); setIsPartnerModalOpen(true); }} 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--primary)', borderColor: 'rgba(15,98,254,0.3)', borderRadius: '6px', height: '26px', background: 'white' }}
                          title="Sunting"
                        >
                          <Edit2 size={12} />
                        </button>
                        {role === 'admin' && (
                          <button 
                            type="button" 
                            onClick={() => {
                              triggerConfirm(
                                'Hapus Mitra Kerja Sama?',
                                `Apakah Anda yakin ingin menghapus "${partner.name}" dari mitra kerja sama?`,
                                () => {
                                  const updated = partnersList.filter((_, i) => i !== idx);
                                  saveProfileData({ partners: updated });
                                }
                              );
                            }} 
                            className="btn btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'none', borderRadius: '6px', height: '26px' }}
                            title="Hapus"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {partnersList.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted-dark)', fontStyle: 'italic' }}>
                      Belum ada data mitra kerja sama.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 7: Budaya Kerja (Row Table) */}
      {profileSubTab === 'budaya' && (
        <div className="animate-fade-in" style={{ animationDuration: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h5 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>Budaya Kerja & Nilai Utama</h5>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>Kelola budaya kerja koperasi yang ditampilkan di Tentang Kami</span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setEditingBudayaIdx(null);
                setNewBudaya({ title: '', description: '', icon: 'ShieldCheck' });
                setIsBudayaModalOpen(true);
              }} 
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
            >
              <Plus size={14} />
              <span>Tambah Budaya Kerja</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '380px', overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: '12px' }} className="admin-table-wrapper">
            <table className="admin-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Ikon</th>
                  <th style={{ width: '200px' }}>Judul Budaya</th>
                  <th>Deskripsi Budaya</th>
                  <th style={{ width: '100px' }}>Urutan</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {budayaList.map((item, idx) => {
                  return (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ 
                          display: 'inline-flex', 
                          padding: '6px', 
                          borderRadius: '8px', 
                          backgroundColor: 'rgba(15, 98, 254, 0.08)', 
                          color: 'var(--primary)' 
                        }}>
                          {item.icon === 'ShieldCheck' && <ShieldCheck size={20} />}
                          {item.icon === 'Users' && <Users size={20} />}
                          {item.icon === 'HeartHandshake' && <HeartHandshake size={20} />}
                          {item.icon === 'Trophy' && <Trophy size={20} />}
                          {item.icon === 'Compass' && <Compass size={20} />}
                          {item.icon === 'Eye' && <Eye size={20} />}
                        </div>
                      </td>
                      <td><strong style={{ color: 'var(--text-dark)' }}>{item.title}</strong></td>
                      <td><span style={{ fontSize: '0.85rem', color: '#475569' }}>{item.description}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            type="button" onClick={() => moveBudaya(idx, 'up')} disabled={idx === 0 || isSaving} className="btn btn-secondary"
                            style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Naikkan"
                          >
                            ▲
                          </button>
                          <button 
                            type="button" onClick={() => moveBudaya(idx, 'down')} disabled={idx === budayaList.length - 1 || isSaving} className="btn btn-secondary"
                            style={{ padding: '4px 6px', fontSize: '0.65rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', height: '24px' }} title="Turunkan"
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button 
                            type="button" 
                            onClick={() => { setEditingBudayaIdx(idx); setNewBudaya(item); setIsBudayaModalOpen(true); }} 
                            className="btn btn-secondary" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--primary)', borderColor: 'rgba(15,98,254,0.3)', borderRadius: '6px', height: '26px', background: 'white' }}
                            title="Sunting"
                          >
                            <Edit2 size={12} />
                          </button>
                          {role === 'admin' && (
                            <button 
                              type="button" 
                              onClick={() => {
                                triggerConfirm(
                                  'Hapus Budaya Kerja?',
                                  `Apakah Anda yakin ingin menghapus budaya kerja "${item.title}"?`,
                                  () => {
                                    const updated = budayaList.filter((_, i) => i !== idx);
                                    saveProfileData({ budaya: updated });
                                  }
                                );
                              }} 
                              className="btn btn-danger" 
                              style={{ padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'none', borderRadius: '6px', height: '26px' }}
                              title="Hapus"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {budayaList.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted-dark)', fontStyle: 'italic' }}>
                      Belum ada data budaya kerja.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pop Up Modal: Tambah/Edit Member Organisasi */}
      {isOrgModalOpen && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card" style={{ maxWidth: '460px' }}>
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {editingOrgIdx !== null ? 'Sunting Data Pengurus' : 'Tambah Pengurus Baru'}
              </h5>
              <button 
                type="button" 
                onClick={() => { setIsOrgModalOpen(false); setEditingOrgIdx(null); setNewOrgMember({ name: '', role: 'Pengurus Koperasi', avatar_url: '' }); }} 
                className="popup-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Nama Lengkap Pengurus *</label>
                <input type="text" placeholder="Nama Lengkap" value={newOrgMember.name} onChange={e => setNewOrgMember({...newOrgMember, name: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Jabatan / Peran *</label>
                <input type="text" placeholder="Contoh: Ketua Koperasi" value={newOrgMember.role} onChange={e => setNewOrgMember({...newOrgMember, role: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Foto Profil Pengurus</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <img 
                    src={newOrgMember.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} 
                    alt="Preview" 
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }} 
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 }}>
                    <input type="file" accept="image/*" onChange={handleOrgMemberPhotoChange} style={{ display: 'none' }} id="org-member-upload-modal" />
                    <label 
                      htmlFor="org-member-upload-modal" className="btn btn-secondary" 
                      style={{ 
                        cursor: 'pointer', padding: '8px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        borderColor: newOrgMember.avatar_url ? 'var(--accent)' : 'var(--primary)', color: newOrgMember.avatar_url ? 'var(--accent)' : 'var(--primary)',
                        background: 'white', width: 'fit-content', marginBottom: 0
                      }}
                    >
                      <span>{isUploading ? 'Memproses...' : (newOrgMember.avatar_url ? 'Ganti Foto' : 'Pilih Foto')}</span>
                    </label>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Maksimal 300KB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="popup-modal-footer">
              <button 
                type="button" 
                onClick={() => { setIsOrgModalOpen(false); setEditingOrgIdx(null); setNewOrgMember({ name: '', role: 'Pengurus Koperasi', avatar_url: '' }); }} 
                className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving || isUploading}
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (newOrgMember.name.trim() && newOrgMember.role.trim()) {
                    let updated: OrgMember[];
                    if (editingOrgIdx !== null) {
                      updated = orgList.map((m, i) => i === editingOrgIdx ? newOrgMember : m);
                      setEditingOrgIdx(null);
                    } else {
                      updated = [...orgList, newOrgMember];
                    }
                    setNewOrgMember({ name: '', role: 'Pengurus Koperasi', avatar_url: '' });
                    setIsOrgModalOpen(false);
                    saveProfileData({ org_structure: updated });
                  } else {
                    showToast('Nama dan Jabatan wajib diisi!', 'error');
                  }
                }} 
                className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving || isUploading}
              >
                {editingOrgIdx !== null ? '✓ Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up Modal: Tambah/Edit Prestasi */}
      {isPrestasiModalOpen && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card" style={{ maxWidth: '520px' }}>
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {editingPrestasiIdx !== null ? 'Sunting Data Prestasi' : 'Tambah Prestasi Baru'}
              </h5>
              <button 
                type="button" 
                onClick={() => { setIsPrestasiModalOpen(false); setEditingPrestasiIdx(null); setNewPrestasi({ year: '', title: '', awarder: '', description: '', level: 'Kabupaten/Kota', image_url: '' }); }} 
                className="popup-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Tahun Penghargaan *</label>
                  <input type="text" placeholder="Contoh: 2024" value={newPrestasi.year} onChange={e => setNewPrestasi({...newPrestasi, year: e.target.value})} className="form-input" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Tingkat / Level *</label>
                  <select value={newPrestasi.level} onChange={e => setNewPrestasi({...newPrestasi, level: e.target.value})} className="form-input">
                    <option value="Nasional">Nasional</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Internal">Internal (Perusahaan)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Nama Penghargaan *</label>
                <input type="text" placeholder="Nama Penghargaan" value={newPrestasi.title} onChange={e => setNewPrestasi({...newPrestasi, title: e.target.value})} className="form-input" required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Pemberi Penghargaan *</label>
                <input type="text" placeholder="Pemberi Penghargaan" value={newPrestasi.awarder} onChange={e => setNewPrestasi({...newPrestasi, awarder: e.target.value})} className="form-input" required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Gambar / Piagam Penghargaan</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  {newPrestasi.image_url ? (
                    <img src={newPrestasi.image_url} alt="" style={{ width: '80px', height: '55px', borderRadius: '6px', objectFit: 'cover', border: '2px solid white', boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }} />
                  ) : (
                    <div style={{ width: '80px', height: '55px', borderRadius: '6px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#94a3b8', background: 'white' }}>No Image</div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 }}>
                    <input type="file" accept="image/*" onChange={handlePrestasiPhotoChange} style={{ display: 'none' }} id="prestasi-upload-modal" />
                    <label 
                      htmlFor="prestasi-upload-modal" className="btn btn-secondary" 
                      style={{ 
                        cursor: 'pointer', padding: '8px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        borderColor: newPrestasi.image_url ? 'var(--accent)' : 'var(--primary)', color: newPrestasi.image_url ? 'var(--accent)' : 'var(--primary)',
                        background: 'white', width: 'fit-content', marginBottom: 0
                      }}
                    >
                      <span>{isUploading ? 'Memproses...' : (newPrestasi.image_url ? 'Ganti Gambar' : 'Pilih Gambar')}</span>
                    </label>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Maksimal 500KB</span>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Deskripsi Singkat Penghargaan *</label>
                <textarea placeholder="Deskripsi lengkap..." value={newPrestasi.description} onChange={e => setNewPrestasi({...newPrestasi, description: e.target.value})} className="form-input" style={{ minHeight: '90px', resize: 'vertical' }} required />
              </div>
            </div>

            <div className="popup-modal-footer">
              <button 
                type="button" 
                onClick={() => { setIsPrestasiModalOpen(false); setEditingPrestasiIdx(null); setNewPrestasi({ year: '', title: '', awarder: '', description: '', level: 'Kabupaten/Kota', image_url: '' }); }} 
                className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving || isUploading}
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (newPrestasi.year.trim() && newPrestasi.title.trim() && newPrestasi.awarder.trim() && newPrestasi.description.trim()) {
                    let updated: Achievement[];
                    if (editingPrestasiIdx !== null) {
                      updated = prestasiList.map((p, i) => i === editingPrestasiIdx ? newPrestasi : p);
                      setEditingPrestasiIdx(null);
                    } else {
                      updated = [...prestasiList, newPrestasi];
                    }
                    setNewPrestasi({ year: '', title: '', awarder: '', description: '', level: 'Kabupaten/Kota', image_url: '' });
                    setIsPrestasiModalOpen(false);
                    saveProfileData({ prestasi: updated });
                  } else {
                    showToast('Semua field bertanda * wajib diisi!', 'error');
                  }
                }} 
                className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving || isUploading}
              >
                {editingPrestasiIdx !== null ? '✓ Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up Modal: Tambah/Edit Mitra */}
      {isPartnerModalOpen && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card" style={{ maxWidth: '450px' }}>
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {editingPartnerIdx !== null ? 'Sunting Mitra' : 'Tambah Mitra Baru'}
              </h5>
              <button 
                type="button" 
                onClick={() => { setIsPartnerModalOpen(false); setEditingPartnerIdx(null); setNewPartner({ name: '', logo_url: '' }); }} 
                className="popup-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Nama Instansi / Mitra *</label>
                <input type="text" placeholder="Contoh: PT Adis Dimension Footwear" value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} className="form-input" required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Logo Instansi / Mitra</label>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  {newPartner.logo_url ? (
                    <img src={newPartner.logo_url} alt="" style={{ width: '80px', height: '55px', borderRadius: '6px', objectFit: 'contain', border: '2px solid white', backgroundColor: 'white', padding: '4px', boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }} />
                  ) : (
                    <div style={{ width: '80px', height: '55px', borderRadius: '6px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#94a3b8', background: 'white' }}>No Logo</div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 }}>
                    <input type="file" accept="image/*" onChange={handlePartnerLogoChange} style={{ display: 'none' }} id="partner-logo-upload-modal" />
                    <label 
                      htmlFor="partner-logo-upload-modal" className="btn btn-secondary" 
                      style={{ 
                        cursor: 'pointer', padding: '8px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        borderColor: newPartner.logo_url ? 'var(--accent)' : 'var(--primary)', color: newPartner.logo_url ? 'var(--accent)' : 'var(--primary)',
                        background: 'white', width: 'fit-content', marginBottom: 0
                      }}
                    >
                      <span>{isUploading ? 'Memproses...' : (newPartner.logo_url ? 'Ganti Logo' : 'Pilih Logo')}</span>
                    </label>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Maksimal 300KB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="popup-modal-footer">
              <button 
                type="button" 
                onClick={() => { setIsPartnerModalOpen(false); setEditingPartnerIdx(null); setNewPartner({ name: '', logo_url: '' }); }} 
                className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving || isUploading}
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (newPartner.name.trim()) {
                    let updated: Partner[];
                    if (editingPartnerIdx !== null) {
                      updated = partnersList.map((p, i) => i === editingPartnerIdx ? newPartner : p);
                      setEditingPartnerIdx(null);
                    } else {
                      updated = [...partnersList, newPartner];
                    }
                    setNewPartner({ name: '', logo_url: '' });
                    setIsPartnerModalOpen(false);
                    saveProfileData({ partners: updated });
                  } else {
                    showToast('Nama Mitra wajib diisi!', 'error');
                  }
                }} 
                className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving || isUploading}
              >
                {editingPartnerIdx !== null ? '✓ Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up Modal: Tambah/Edit Milestone */}
      {isMilestoneModalOpen && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card" style={{ maxWidth: '480px' }}>
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {editingMilestoneIdx !== null ? 'Sunting Milestone' : 'Tambah Milestone Baru'}
              </h5>
              <button 
                type="button" 
                onClick={() => { setIsMilestoneModalOpen(false); setEditingMilestoneIdx(null); setNewMilestone({ year: '', title: '', description: '' }); }} 
                className="popup-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Tahun Milestone *</label>
                <input type="text" placeholder="Contoh: 2024" value={newMilestone.year} onChange={e => setNewMilestone({...newMilestone, year: e.target.value})} className="form-input" required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Judul Pencapaian *</label>
                <input type="text" placeholder="Contoh: Pendirian Cabang Baru" value={newMilestone.title} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} className="form-input" required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Deskripsi Singkat *</label>
                <textarea placeholder="Tulis rincian pencapaian..." value={newMilestone.description} onChange={e => setNewMilestone({...newMilestone, description: e.target.value})} className="form-input" style={{ minHeight: '90px', resize: 'vertical' }} required />
              </div>
            </div>

            <div className="popup-modal-footer">
              <button 
                type="button" 
                onClick={() => { setIsMilestoneModalOpen(false); setEditingMilestoneIdx(null); setNewMilestone({ year: '', title: '', description: '' }); }} 
                className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving}
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (newMilestone.year.trim() && newMilestone.title.trim() && newMilestone.description.trim()) {
                    let updated: Milestone[];
                    if (editingMilestoneIdx !== null) {
                      updated = milestonesList.map((m, i) => i === editingMilestoneIdx ? newMilestone : m);
                      setEditingMilestoneIdx(null);
                    } else {
                      updated = [...milestonesList, newMilestone];
                    }
                    setNewMilestone({ year: '', title: '', description: '' });
                    setIsMilestoneModalOpen(false);
                    saveProfileData({ milestones: updated });
                  } else {
                    showToast('Semua field wajib diisi!', 'error');
                  }
                }} 
                className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving}
              >
                {editingMilestoneIdx !== null ? '✓ Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up Modal: Tambah/Edit Budaya */}
      {isBudayaModalOpen && (
        <div className="popup-modal-overlay">
          <div className="popup-modal-card" style={{ maxWidth: '480px' }}>
            <div className="popup-modal-header">
              <h5 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {editingBudayaIdx !== null ? 'Sunting Budaya Kerja' : 'Tambah Budaya Kerja Baru'}
              </h5>
              <button 
                type="button" 
                onClick={() => { setIsBudayaModalOpen(false); setEditingBudayaIdx(null); setNewBudaya({ title: '', description: '', icon: 'ShieldCheck' }); }} 
                className="popup-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Judul Budaya Kerja *</label>
                <input type="text" placeholder="Contoh: Integritas & Amanah" value={newBudaya.title} onChange={e => setNewBudaya({...newBudaya, title: e.target.value})} className="form-input" required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Pilih Ikon Utama *</label>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {[
                    { name: 'ShieldCheck', component: ShieldCheck, label: 'Integritas / Keamanan' },
                    { name: 'Users', component: Users, label: 'Kekeluargaan / Kolaborasi' },
                    { name: 'HeartHandshake', component: HeartHandshake, label: 'Layanan / Kepedulian' },
                    { name: 'Trophy', component: Trophy, label: 'Prestasi / Keunggulan' },
                    { name: 'Compass', component: Compass, label: 'Arah / Visi' },
                    { name: 'Eye', component: Eye, label: 'Pengawasan / Transparansi' }
                  ].map(iconItem => {
                    const IconComp = iconItem.component;
                    const isSelected = newBudaya.icon === iconItem.name;
                    return (
                      <button
                        key={iconItem.name}
                        type="button"
                        onClick={() => setNewBudaya(prev => ({ ...prev, icon: iconItem.name }))}
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
                <label className="form-label" style={{ fontWeight: 700 }}>Deskripsi Singkat *</label>
                <textarea placeholder="Tulis deskripsi nilai budaya kerja..." value={newBudaya.description} onChange={e => setNewBudaya({...newBudaya, description: e.target.value})} className="form-input" style={{ minHeight: '90px', resize: 'vertical' }} required />
              </div>
            </div>

            <div className="popup-modal-footer">
              <button 
                type="button" 
                onClick={() => { setIsBudayaModalOpen(false); setEditingBudayaIdx(null); setNewBudaya({ title: '', description: '', icon: 'ShieldCheck' }); }} 
                className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving}
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (newBudaya.title.trim() && newBudaya.description.trim()) {
                    let updated: CultureValue[];
                    if (editingBudayaIdx !== null) {
                      updated = budayaList.map((b, i) => i === editingBudayaIdx ? newBudaya : b);
                      setEditingBudayaIdx(null);
                    } else {
                      updated = [...budayaList, newBudaya];
                    }
                    setNewBudaya({ title: '', description: '', icon: 'ShieldCheck' });
                    setIsBudayaModalOpen(false);
                    saveProfileData({ budaya: updated });
                  } else {
                    showToast('Semua field wajib diisi!', 'error');
                  }
                }} 
                className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={isSaving}
              >
                {editingBudayaIdx !== null ? '✓ Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
