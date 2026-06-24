import { supabase, isSupabaseConfigured } from '../supabaseClient';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  order_index: number;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface OrgMember {
  role: string;
  name: string;
  avatar_url?: string;
}

export interface Achievement {
  year: string;
  title: string;
  awarder: string;
  description: string;
  level: string;
  image_url?: string;
}

export interface Partner {
  name: string;
  logo_url: string;
}

export interface BusinessUnitBranch {
  id: string;
  name: string;
  description: string;
  images: string[];
  hours: string;
  whatsapp: string;
  map_url?: string;
}

export interface BusinessUnitDetail {
  unit_id: string;
  logo_url?: string;
  long_description?: string;
  extra_info?: string;
  branches?: BusinessUnitBranch[];
}

export interface CultureValue {
  title: string;
  description: string;
  icon?: string;
}

export interface ProfileContent {
  sejarah: string;
  sejarah_image_url?: string;
  visi: string;
  misi: string[];
  stats_members?: string;
  stats_assets?: string;
  stats_growth?: string;
  milestones?: Milestone[];
  org_structure?: OrgMember[];
  prestasi?: Achievement[];
  partners?: Partner[];
  unit_details?: BusinessUnitDetail[];
  budaya?: CultureValue[];
}

export interface BusinessUnit {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  author: string;
  category?: 'Pengumuman' | 'Kegiatan' | 'Promo' | 'Edukasi';
}

export interface DocumentFile {
  id: string;
  name: string;
  file_url: string;
  size: string;
  uploaded_at: string;
}

export interface ContactInfo {
  whatsapp: string;
  address: string;
  email: string;
  phone: string;
  instagram?: string;
  youtube?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface Registration {
  id: string;
  full_name: string;
  nik: string;
  division: string;
  phone: string;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

// Initial Mock Data
const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'Koperasi Karyawan PT Adis Dimension Footwear',
    subtitle: 'Menyejahterakan karyawan, tumbuh bersama, dan membangun masa depan ekonomi anggota secara berkelanjutan.',
    image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
    order_index: 0,
  },
  {
    id: 'hero-2',
    title: 'Layanan Unit Usaha Terpercaya',
    subtitle: 'Menghadirkan Adis Mart, Unit Simpan Pinjam Syariah, dan Jasa Ekspedisi untuk kemudahan kebutuhan harian Anda.',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
    order_index: 1,
  }
];

const defaultProfile: ProfileContent = {
  sejarah: 'Koperasi Konsumen Karyawan PT Adis Dimension Footwear didirikan atas komitmen bersama untuk meningkatkan kesejahteraan finansial dan sosial seluruh karyawan PT Adis. Seiring perkembangan perusahaan sebagai salah satu produsen sepatu olahraga terkemuka di Indonesia, Koperasi kami bertransformasi menjadi mitra tepercaya dengan berbagai unit bisnis mandiri yang dikelola secara profesional.',
  sejarah_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  visi: 'Menjadi koperasi konsumen karyawan teladan nasional yang mandiri, sehat, amanah, dan menjadi motor penggerak kesejahteraan anggota.',
  misi: [
    'Menyediakan kebutuhan konsumsi harian berkualitas dengan harga terjangkau bagi seluruh anggota.',
    'Menyelenggarakan unit simpan pinjam dengan skema syariah yang mendidik, transparan, dan adil.',
    'Meningkatkan kompetensi SDM pengelola koperasi melalui teknologi digital yang transparan dan akuntabel.',
    'Give kontribusi sosial yang nyata bagi keluarga karyawan dan komunitas sekitar.'
  ],
  stats_members: '5280',
  stats_assets: '12.5',
  stats_growth: '12',
  milestones: [
    { year: '2003', title: 'Pendirian Koperasi', description: 'Koperasi Karyawan PT Adis Dimension Footwear resmi didirikan pada November 2003 dengan Badan Hukum resmi No: 518/193/BH-DINKOP/XI/2003.' },
    { year: '2010', title: 'Ekspansi Adis Mart', description: 'Mendirikan unit usaha minimarket Adis Mart guna menyediakan bahan pokok dan konsumsi harian berkualitas dengan harga terjangkau bagi anggota.' },
    { year: '2018', title: 'Simpan Pinjam Syariah', description: 'Meluncurkan program simpan pinjam berbasis Syariah (bagi hasil) untuk menjunjung asas gotong royong tanpa adanya unsur riba.' },
    { year: '2023', title: 'Armada Logistik', description: 'Mendirikan unit ekspedisi logistik internal untuk memperkuat distribusi barang operasional pabrik dan koperasi.' },
    { year: '2026', title: 'Transformasi Digital', description: 'Implementasi digital penuh, integrasi database pendaftaran, dan kemudahan akses Laporan Pertanggungjawaban RAT.' }
  ],
  org_structure: [
    { role: 'Ketua Koperasi', name: 'H. Didin Syarifudin', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { role: 'Sekretaris', name: 'Ahmad Fauzi', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { role: 'Bendahara', name: 'Sri Wahyuni', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    { role: 'Ketua Pengawas', name: 'Budi Santoso', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' },
    { role: 'Anggota Pengawas', name: 'Hendra Wijaya', avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80' }
  ],
  prestasi: [
    { 
      year: '2024', 
      title: 'Sertifikat Klasifikasi Sehat (Nilai A)', 
      awarder: 'Dinas Koperasi Kab. Tangerang', 
      description: 'Penghargaan atas kepatuhan regulasi, tata kelola keuangan yang transparan, serta pengelolaan risiko usaha yang sangat sehat.',
      level: 'Kabupaten/Kota',
      image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
    },
    { 
      year: '2023', 
      title: 'Koperasi Karyawan Teraktif', 
      awarder: 'Kadin Bidang Koperasi Wilayah Banten', 
      description: 'Apresiasi atas keberhasilan pelaksanaan program rapat anggota tahunan (RAT) online dan digitalisasi pendaftaran anggota terintegrasi.',
      level: 'Provinsi',
      image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80'
    },
    { 
      year: '2021', 
      title: 'Ritel Koperasi Percontohan', 
      awarder: 'Dinas Perindustrian & Perdagangan', 
      description: 'Pencapaian unit Adis Mart sebagai ritel modern mandiri terbaik dalam menyuplai kebutuhan pokok karyawan secara konsisten.',
      level: 'Kabupaten/Kota',
      image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'
    }
  ],
  partners: [
    { name: 'PT Adis Dimension Footwear', logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80' },
    { name: 'Nike Indonesia', logo_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80' },
    { name: 'Bank Syariah Indonesia', logo_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80' },
    { name: 'BPJS Ketenagakerjaan', logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80' }
  ],
  unit_details: [
    {
      unit_id: 'unit-1',
      logo_url: '/logo-adismart.png',
      long_description: 'Adismart menyediakan sembako, makanan ringan, perlengkapan rumah tangga, pakaian kerja, hingga barang elektronik. Transaksi sangat mudah dengan dukungan cash, QRIS, maupun sistem potong gaji bulanan yang memudahkan keuangan karyawan.',
      extra_info: 'Senin - Jum\'at:\nAdismart 1: 06:00 - 21:00 WIB\nAdismart 2: 06:30 - 17:00 WIB\n\nSetiap Hari:\nAdismart Balaraja: 06:00 - 22:00 WIB',
      branches: [
        {
          id: 'br-1',
          name: 'Adis Mart 1',
          description: 'Terletak strategis di lingkungan Gedung A PT Adis Dimension Footwear, menyediakan kebutuhan pokok harian, minuman segar, dan camilan bagi karyawan di jam kerja.',
          images: ['/adismart-1.png', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'],
          hours: 'Senin - Jum\'at: 06:00 - 21:00 WIB',
          whatsapp: '628123456789',
          map_url: 'https://maps.google.com/?q=PT+Adis+Dimension+Footwear+Balaraja'
        },
        {
          id: 'br-2',
          name: 'Adis Mart 2',
          description: 'Terletak di area produksi Gedung B, menyediakan minimarket belanja cepat, kebutuhan seragam kerja karyawan, serta ATK penunjang administrasi internal.',
          images: ['/adismart-2.png', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'],
          hours: 'Senin - Jum\'at: 06:30 - 17:00 WIB',
          whatsapp: '628123456789',
          map_url: 'https://maps.google.com/?q=PT+Adis+Dimension+Footwear+Balaraja'
        },
        {
          id: 'br-3',
          name: 'Adis Mart Balaraja',
          description: 'Cabang retail mandiri di luar kawasan industri Balaraja, terbuka penuh untuk umum serta melayani pembelian dalam volume besar bagi anggota dan keluarga karyawan.',
          images: ['/adismart-balaraja.png', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'],
          hours: 'Setiap Hari: 06:00 - 22:00 WIB',
          whatsapp: '628123456789',
          map_url: 'https://maps.google.com/?q=PT+Adis+Dimension+Footwear+Balaraja'
        }
      ]
    },
    {
      unit_id: 'unit-2',
      logo_url: '',
      long_description: 'Unit Simpan Pinjam Koperasi Karyawan PT Adis Dimension Footwear menyediakan solusi finansial syariah murni bebas riba untuk membantu anggota dalam mengelola dan merencanakan keuangan secara amanah dan adil.',
      extra_info: 'Akad Mudharabah (Bagi Hasil investasi setara 5% per tahun)\nAkad Wadiah Yad Dhamanah (Tabungan murni titipan)\nAkad Qardhul Hasan (Pinjaman darurat margin 0%)'
    },
    {
      unit_id: 'unit-3',
      logo_url: '',
      long_description: 'Unit Jasa Distribusi & Logistik mengelola armada pengiriman untuk menyokong kebutuhan distribusi material pabrik PT Adis serta memperkuat rantai pasokan produk ritel koperasi.',
      extra_info: '10+ Unit Armada Truk Box & Pickup\nLayanan Operasional Siaga 24/7 Hari\nPengiriman Cepat, Aman, dan Profesional'
    }
  ],
  budaya: [
    { title: 'Integritas & Amanah', description: 'Mengelola dana dan kepercayaan anggota secara jujur, bertanggung jawab, serta transparan.', icon: 'ShieldCheck' },
    { title: 'Kekeluargaan', description: 'Mengedepankan asas gotong royong dan saling membantu untuk kemaslahatan seluruh karyawan.', icon: 'Users' },
    { title: 'Kemudahan & Layanan', description: 'Memberikan pelayanan prima yang solutif, cepat, dan terdigitalisasi untuk memudahkan kebutuhan harian.', icon: 'HeartHandshake' }
  ]
};

const defaultUnits: BusinessUnit[] = [
  {
    id: 'unit-1',
    name: 'Adis Mart (Toko Koperasi)',
    description: 'Minimarket penyedia bahan pokok, kebutuhan rumah tangga, dan perlengkapan harian karyawan dengan sistem pembayaran tunai maupun potong gaji.',
    icon: 'ShoppingBag',
    image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'unit-2',
    name: 'Unit Simpan Pinjam',
    description: 'Solusi finansial darurat dan investasi masa depan berbasis bagi hasil yang adil, menghindari praktik riba, dan membantu pengelolaan keuangan anggota.',
    icon: 'Wallet',
    image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'unit-3',
    name: 'Jasa Distribusi & Logistik',
    description: 'Menyediakan armada logistik pendukung kegiatan pengiriman barang operasional pabrik serta distribusi internal produk koperasi.',
    icon: 'Truck',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  }
];

const defaultNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Rapat Anggota Tahunan (RAT) Buku 2025 Sukses Digelar',
    excerpt: 'RAT tahun buku 2025 berjalan lancar dengan menyepakati kenaikan SHU sebesar 12% yang langsung didistribusikan ke rekening anggota.',
    content: 'Koperasi Karyawan PT Adis Dimension Footwear sukses menggelar Rapat Anggota Tahunan (RAT) Tahun Buku 2025 yang dihadiri oleh jajaran direksi PT Adis, perwakilan Dinas Koperasi Kabupaten Tangerang, serta perwakilan anggota dari masing-masing divisi. Dalam rapat ini dilaporkan kinerja keuangan koperasi yang menunjukkan pertumbuhan positif dengan kenaikan laba bersih. Selain itu, diputuskan pembagian Sisa Hasil Usaha (SHU) yang meningkat sebesar 12% dibandingkan tahun lalu. Koperasi juga berkomitmen melakukan digitalisasi layanan transaksi pada tahun 2026 ini.',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-03-15T09:00:00Z',
    author: 'Pengurus Koperasi',
    category: 'Pengumuman'
  },
  {
    id: 'news-2',
    title: 'Pemberian Beasiswa Prestasi bagi Anak Anggota Koperasi',
    excerpt: 'Sebagai bentuk tanggung jawab sosial, Koperasi membagikan beasiswa pendidikan kepada 150 anak anggota dari tingkat SD hingga Perguruan Tinggi.',
    content: 'Komitmen Koperasi Karyawan PT Adis dalam mencerdaskan anak bangsa diwujudkan melalui program Beasiswa Pendidikan Tahunan. Pada gelombang ini, sebanyak 150 anak anggota koperasi yang memiliki prestasi akademik gemilang di sekolah masing-masing menerima dana bantuan pendidikan. Kategori penerima beasiswa meliputi jenjang SD, SMP, SMA, hingga perguruan tinggi. Penyerahan secara simbolis dilakukan di Aula PT Adis Dimension Footwear oleh Ketua Koperasi beserta perwakilan Manajemen HRD.',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-05-12T10:30:00Z',
    author: 'Bidang Sosial & Pendidikan',
    category: 'Kegiatan'
  }
];

const defaultDocuments: DocumentFile[] = [
  {
    id: 'doc-1',
    name: 'Laporan Pertanggungjawaban Pengurus RAT 2025.pdf',
    file_url: '#',
    size: '4.8 MB',
    uploaded_at: '2026-03-10T08:00:00Z'
  },
  {
    id: 'doc-2',
    name: 'AD-ART Koperasi Adis Footwear Revisi 2024.pdf',
    file_url: '#',
    size: '2.1 MB',
    uploaded_at: '2024-08-20T08:00:00Z'
  }
];

const defaultContact: ContactInfo = {
  whatsapp: '628123456789',
  address: 'Jl. Raya Serang Km. 24, Balaraja, Tangerang, Banten 15610 (Kawasan Industri PT Adis)',
  email: 'koperasi@adis.co.id',
  phone: '021-5951660 ext. 204',
  instagram: 'https://instagram.com/kopkar_adis',
  youtube: 'https://youtube.com/c/KopkarAdis'
};

// Initialize LocalStorage if empty
const initLocalDB = () => {
  if (!localStorage.getItem('koperasi_hero')) localStorage.setItem('koperasi_hero', JSON.stringify(defaultHeroSlides));
  if (!localStorage.getItem('koperasi_profile')) {
    localStorage.setItem('koperasi_profile', JSON.stringify(defaultProfile));
  } else {
    try {
      const profile = JSON.parse(localStorage.getItem('koperasi_profile') || '{}');
      let changed = false;
      if (!profile.partners) {
        profile.partners = defaultProfile.partners;
        changed = true;
      }
      if (!profile.unit_details) {
        profile.unit_details = defaultProfile.unit_details;
        changed = true;
      } else {
        const adisMartDetails = profile.unit_details.find((d: any) => d.unit_id === 'unit-1');
        if (adisMartDetails) {
          if (!adisMartDetails.branches) {
            const defaultAdisMart = defaultProfile.unit_details?.find(d => d.unit_id === 'unit-1');
            if (defaultAdisMart) {
              adisMartDetails.branches = defaultAdisMart.branches;
              changed = true;
            }
          } else {
            let migrated = false;
            adisMartDetails.branches = adisMartDetails.branches.map((b: any) => {
              if (b.image_url) {
                b.images = [b.image_url];
                delete b.image_url;
                migrated = true;
              }
              if (!b.images) {
                b.images = [];
                migrated = true;
              }
              const defaultBranch = defaultProfile.unit_details?.find(d => d.unit_id === 'unit-1')?.branches?.find(db => db.id === b.id);
              if (defaultBranch) {
                if (!b.map_url && defaultBranch.map_url) {
                  b.map_url = defaultBranch.map_url;
                  migrated = true;
                }
              }
              return b;
            });
            if (migrated) changed = true;
          }
        }
      }
      if (!profile.budaya) {
        profile.budaya = defaultProfile.budaya;
        changed = true;
      }
      if (changed) {
        localStorage.setItem('koperasi_profile', JSON.stringify(profile));
      }
    } catch (e) {
      console.error('Migration error for partners:', e);
    }
  }
  if (!localStorage.getItem('koperasi_units')) localStorage.setItem('koperasi_units', JSON.stringify(defaultUnits));
  if (!localStorage.getItem('koperasi_news')) {
    localStorage.setItem('koperasi_news', JSON.stringify(defaultNews));
  } else {
    try {
      const news = JSON.parse(localStorage.getItem('koperasi_news') || '[]');
      let updated = false;
      const migratedNews = news.map((n: any, idx: number) => {
        if (!n.category) {
          n.category = idx % 2 === 0 ? 'Pengumuman' : 'Kegiatan';
          updated = true;
        }
        return n;
      });
      if (updated) {
        localStorage.setItem('koperasi_news', JSON.stringify(migratedNews));
      }
    } catch (e) {
      console.error('Migration error for news categories:', e);
    }
  }
  if (!localStorage.getItem('koperasi_docs')) localStorage.setItem('koperasi_docs', JSON.stringify(defaultDocuments));
  if (!localStorage.getItem('koperasi_contact')) localStorage.setItem('koperasi_contact', JSON.stringify(defaultContact));
  if (!localStorage.getItem('koperasi_messages')) localStorage.setItem('koperasi_messages', JSON.stringify([]));

  const defaultRegistrations: Registration[] = [
    {
      id: 'reg-1',
      full_name: 'Budi Santoso',
      nik: 'ADIS-10123',
      division: 'Production Line 3 / Assembly',
      phone: '628123456780',
      reason: 'Ingin memanfaatkan Adis Mart kredit',
      status: 'Approved',
      created_at: '2024-04-12T08:00:00Z'
    },
    {
      id: 'reg-2',
      full_name: 'Siti Aminah',
      nik: 'ADIS-20456',
      division: 'HRD / Administration',
      phone: '628123456781',
      reason: 'Untuk tabungan rutin bulanan',
      status: 'Approved',
      created_at: '2023-09-05T08:00:00Z'
    },
    {
      id: 'reg-3',
      full_name: 'Joko Susilo',
      nik: 'ADIS-30789',
      division: 'Logistics / Warehouse',
      phone: '628123456782',
      reason: 'Butuh simpan pinjam syariah',
      status: 'Pending',
      created_at: '2026-06-14T08:00:00Z'
    }
  ];
  if (!localStorage.getItem('koperasi_registrations')) {
    localStorage.setItem('koperasi_registrations', JSON.stringify(defaultRegistrations));
  }
};

initLocalDB();

// DB Service Helpers
const getFilePathFromUrl = (bucketName: string, url: string): string | null => {
  if (!url || url.startsWith('#') || !url.startsWith('http')) return null;
  const marker = `/storage/v1/object/public/${bucketName}/`;
  const index = url.indexOf(marker);
  if (index !== -1) {
    let path = url.substring(index + marker.length);
    const qIndex = path.indexOf('?');
    if (qIndex !== -1) {
      path = path.substring(0, qIndex);
    }
    return decodeURIComponent(path);
  }
  return null;
};

export const dbService = {
  // STORAGE DELETE METHOD
  async deleteFile(bucketName: string, fileUrl: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const filePath = getFilePathFromUrl(bucketName, fileUrl);
      if (filePath) {
        const { error } = await supabase.storage.from(bucketName).remove([filePath]);
        if (error) console.error(`Gagal menghapus berkas ${filePath} dari bucket ${bucketName}:`, error);
      }
    }
  },

  // HERO SLIDES
  async getHeroSlides(): Promise<HeroSlide[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('hero_slides').select('*').order('order_index', { ascending: true });
      if (!error && data) return data;
      console.error('Supabase error fetching hero_slides, using local storage fallback:', error);
    }
    return JSON.parse(localStorage.getItem('koperasi_hero') || '[]');
  },
  async saveHeroSlides(slides: HeroSlide[]): Promise<void> {
    localStorage.setItem('koperasi_hero', JSON.stringify(slides));
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingData } = await supabase.from('hero_slides').select('id, image_url');
        if (existingData) {
          const payloadIds = new Set(slides.map(s => s.id));
          const deletedItems = existingData.filter(item => !payloadIds.has(item.id));
          
          if (deletedItems.length > 0) {
            const deleteIds = deletedItems.map(item => item.id);
            await supabase.from('hero_slides').delete().in('id', deleteIds);
            for (const item of deletedItems) {
              if (item.image_url) await this.deleteFile('images', item.image_url);
            }
          }

          for (const slide of slides) {
            const existing = existingData.find(d => d.id === slide.id);
            if (existing && existing.image_url && existing.image_url !== slide.image_url) {
              await this.deleteFile('images', existing.image_url);
            }
          }
        }
      } catch (err) {
        console.error('Error during hero slides sync delete:', err);
      }
      const { error } = await supabase.from('hero_slides').upsert(slides);
      if (error) console.error('Supabase error upserting hero_slides:', error);
    }
  },

  // PROFILE CONTENT
  async getProfile(): Promise<ProfileContent> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profile_content').select('*');
      if (!error && data && data.length > 0) {
        const sejarah = data.find(d => d.key === 'sejarah')?.value || '';
        const sejarah_image_url = data.find(d => d.key === 'sejarah_image_url')?.value || '';
        const visi = data.find(d => d.key === 'visi')?.value || '';
        const misi = JSON.parse(data.find(d => d.key === 'misi')?.value || '[]');
        const stats_members = data.find(d => d.key === 'stats_members')?.value || '5280';
        const stats_assets = data.find(d => d.key === 'stats_assets')?.value || '12.5';
        const stats_growth = data.find(d => d.key === 'stats_growth')?.value || '12';
        const milestonesRaw = data.find(d => d.key === 'milestones')?.value;
        const milestones = milestonesRaw ? JSON.parse(milestonesRaw) : undefined;
        const orgRaw = data.find(d => d.key === 'org_structure')?.value;
        const org_structure = orgRaw ? JSON.parse(orgRaw) : undefined;
        const prestasiRaw = data.find(d => d.key === 'prestasi')?.value;
        const prestasi = prestasiRaw ? JSON.parse(prestasiRaw) : undefined;
        const partnersRaw = data.find(d => d.key === 'partners')?.value;
        const partners = partnersRaw ? JSON.parse(partnersRaw) : undefined;
        const unitDetailsRaw = data.find(d => d.key === 'unit_details')?.value;
        const unit_details = unitDetailsRaw ? JSON.parse(unitDetailsRaw) : undefined;
        const budayaRaw = data.find(d => d.key === 'budaya')?.value;
        const budaya = budayaRaw ? JSON.parse(budayaRaw) : undefined;
        return { sejarah, sejarah_image_url, visi, misi, stats_members, stats_assets, stats_growth, milestones, org_structure, prestasi, partners, unit_details, budaya };
      }
      console.error('Supabase error fetching profile_content, using local storage fallback:', error);
    }
    const local = JSON.parse(localStorage.getItem('koperasi_profile') || '{}');
    return {
      sejarah: local.sejarah || defaultProfile.sejarah,
      sejarah_image_url: local.sejarah_image_url || defaultProfile.sejarah_image_url,
      visi: local.visi || defaultProfile.visi,
      misi: local.misi || defaultProfile.misi,
      stats_members: local.stats_members || defaultProfile.stats_members,
      stats_assets: local.stats_assets || defaultProfile.stats_assets,
      stats_growth: local.stats_growth || defaultProfile.stats_growth,
      milestones: local.milestones || defaultProfile.milestones,
      org_structure: local.org_structure || defaultProfile.org_structure,
      prestasi: local.prestasi || defaultProfile.prestasi,
      partners: local.partners || defaultProfile.partners,
      unit_details: local.unit_details || defaultProfile.unit_details,
      budaya: local.budaya || defaultProfile.budaya
    };
  },
  async saveProfile(profile: ProfileContent): Promise<void> {
    localStorage.setItem('koperasi_profile', JSON.stringify(profile));
    if (isSupabaseConfigured && supabase) {
      try {
        const oldProfile = await this.getProfile();
        const oldUrls: string[] = [];
        const newUrls: string[] = [];
        
        const collectUrls = (prof: ProfileContent, list: string[]) => {
          if (prof.sejarah_image_url) {
            list.push(prof.sejarah_image_url);
          }
          if (prof.org_structure) {
            prof.org_structure.forEach(m => m.avatar_url && list.push(m.avatar_url));
          }
          if (prof.prestasi) {
            prof.prestasi.forEach(p => p.image_url && list.push(p.image_url));
          }
          if (prof.partners) {
            prof.partners.forEach(p => p.logo_url && list.push(p.logo_url));
          }
          if (prof.unit_details) {
            prof.unit_details.forEach(d => d.logo_url && list.push(d.logo_url));
          }
        };

        collectUrls(oldProfile, oldUrls);
        collectUrls(profile, newUrls);

        const newUrlsSet = new Set(newUrls);
        const deletedUrls = oldUrls.filter(url => !newUrlsSet.has(url));
        
        for (const url of deletedUrls) {
          await this.deleteFile('images', url);
        }
      } catch (err) {
        console.error('Error during profile files sync cleanup:', err);
      }

      const rows = [
        { key: 'sejarah', value: profile.sejarah },
        { key: 'sejarah_image_url', value: profile.sejarah_image_url || '' },
        { key: 'visi', value: profile.visi },
        { key: 'misi', value: JSON.stringify(profile.misi) },
        { key: 'stats_members', value: profile.stats_members || '5280' },
        { key: 'stats_assets', value: profile.stats_assets || '12.5' },
        { key: 'stats_growth', value: profile.stats_growth || '12' },
        { key: 'milestones', value: JSON.stringify(profile.milestones || []) },
        { key: 'org_structure', value: JSON.stringify(profile.org_structure || []) },
        { key: 'prestasi', value: JSON.stringify(profile.prestasi || []) },
        { key: 'partners', value: JSON.stringify(profile.partners || []) },
        { key: 'unit_details', value: JSON.stringify(profile.unit_details || []) },
        { key: 'budaya', value: JSON.stringify(profile.budaya || []) }
      ];
      const { error } = await supabase.from('profile_content').upsert(rows, { onConflict: 'key' });
      if (error) {
        console.error('Supabase error upserting profile_content:', error);
        throw error;
      }
    }
  },

  // BUSINESS UNITS
  async getBusinessUnits(): Promise<BusinessUnit[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('business_units').select('*');
      if (!error && data) return data;
      console.error('Supabase error fetching business_units, using local storage fallback:', error);
    }
    return JSON.parse(localStorage.getItem('koperasi_units') || '[]');
  },
  async saveBusinessUnits(units: BusinessUnit[]): Promise<void> {
    localStorage.setItem('koperasi_units', JSON.stringify(units));
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingData } = await supabase.from('business_units').select('id, image_url');
        if (existingData) {
          const payloadIds = new Set(units.map(u => u.id));
          const deletedItems = existingData.filter(item => !payloadIds.has(item.id));
          
          if (deletedItems.length > 0) {
            const deleteIds = deletedItems.map(item => item.id);
            await supabase.from('business_units').delete().in('id', deleteIds);
            for (const item of deletedItems) {
              if (item.image_url) await this.deleteFile('images', item.image_url);
            }
          }

          for (const unit of units) {
            const existing = existingData.find(d => d.id === unit.id);
            if (existing && existing.image_url && existing.image_url !== unit.image_url) {
              await this.deleteFile('images', existing.image_url);
            }
          }
        }
      } catch (err) {
        console.error('Error during business units sync delete:', err);
      }
      const { error } = await supabase.from('business_units').upsert(units);
      if (error) {
        console.error('Supabase error upserting business_units:', error);
        throw error;
      }
    }
  },

  // NEWS ARTICLES
  async getNews(): Promise<NewsArticle[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('news_articles').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase error fetching news_articles, using local storage fallback:', error);
    }
    return JSON.parse(localStorage.getItem('koperasi_news') || '[]');
  },
  async saveNews(news: NewsArticle[]): Promise<void> {
    localStorage.setItem('koperasi_news', JSON.stringify(news));
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingData } = await supabase.from('news_articles').select('id, image_url');
        if (existingData) {
          const payloadIds = new Set(news.map(n => n.id));
          const deletedItems = existingData.filter(item => !payloadIds.has(item.id));
          
          if (deletedItems.length > 0) {
            const deleteIds = deletedItems.map(item => item.id);
            await supabase.from('news_articles').delete().in('id', deleteIds);
            for (const item of deletedItems) {
              if (item.image_url) await this.deleteFile('images', item.image_url);
            }
          }

          for (const article of news) {
            const existing = existingData.find(d => d.id === article.id);
            if (existing && existing.image_url && existing.image_url !== article.image_url) {
              await this.deleteFile('images', existing.image_url);
            }
          }
        }
      } catch (err) {
        console.error('Error during news sync delete:', err);
      }
      const { error } = await supabase.from('news_articles').upsert(news);
      if (error) {
        console.error('Supabase error upserting news_articles:', error);
        throw error;
      }
    }
  },

  // DOCUMENTS
  async getDocuments(): Promise<DocumentFile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase error fetching documents, using local storage fallback:', error);
    }
    return JSON.parse(localStorage.getItem('koperasi_docs') || '[]');
  },
  async saveDocuments(docs: DocumentFile[]): Promise<void> {
    localStorage.setItem('koperasi_docs', JSON.stringify(docs));
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingData } = await supabase.from('documents').select('id, file_url');
        if (existingData) {
          const payloadIds = new Set(docs.map(d => d.id));
          const deletedItems = existingData.filter(item => !payloadIds.has(item.id));
          
          if (deletedItems.length > 0) {
            const deleteIds = deletedItems.map(item => item.id);
            await supabase.from('documents').delete().in('id', deleteIds);
            for (const item of deletedItems) {
              if (item.file_url) await this.deleteFile('documents', item.file_url);
            }
          }

          for (const doc of docs) {
            const existing = existingData.find(d => d.id === doc.id);
            if (existing && existing.file_url && existing.file_url !== doc.file_url) {
              await this.deleteFile('documents', existing.file_url);
            }
          }
        }
      } catch (err) {
        console.error('Error during documents sync delete:', err);
      }
      const { error } = await supabase.from('documents').upsert(docs);
      if (error) {
        console.error('Supabase error upserting documents:', error);
        throw error;
      }
    }
  },

  // CONTACT INFO
  async getContact(): Promise<ContactInfo> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('contact_info').select('*');
      if (!error && data && data.length > 0) {
        const whatsapp = data.find(d => d.key === 'whatsapp')?.value || '';
        const address = data.find(d => d.key === 'address')?.value || '';
        const email = data.find(d => d.key === 'email')?.value || '';
        const phone = data.find(d => d.key === 'phone')?.value || '';
        const instagram = data.find(d => d.key === 'instagram')?.value || '';
        const youtube = data.find(d => d.key === 'youtube')?.value || '';
        return { whatsapp, address, email, phone, instagram, youtube };
      }
      console.error('Supabase error fetching contact_info, using local storage fallback:', error);
    }
    // Fallback merge to guarantee keys exist
    const local = JSON.parse(localStorage.getItem('koperasi_contact') || '{}');
    return {
      whatsapp: local.whatsapp || defaultContact.whatsapp,
      address: local.address || defaultContact.address,
      email: local.email || defaultContact.email,
      phone: local.phone || defaultContact.phone,
      instagram: local.instagram || defaultContact.instagram,
      youtube: local.youtube || defaultContact.youtube
    };
  },
  async saveContact(contact: ContactInfo): Promise<void> {
    localStorage.setItem('koperasi_contact', JSON.stringify(contact));
    if (isSupabaseConfigured && supabase) {
      const rows = [
        { key: 'whatsapp', value: contact.whatsapp },
        { key: 'address', value: contact.address },
        { key: 'email', value: contact.email },
        { key: 'phone', value: contact.phone },
        { key: 'instagram', value: contact.instagram || '' },
        { key: 'youtube', value: contact.youtube || '' }
      ];
      const { error } = await supabase.from('contact_info').upsert(rows, { onConflict: 'key' });
      if (error) {
        console.error('Supabase error upserting contact_info:', error);
        throw error;
      }
    }
  },

  // CONTACT MESSAGES
  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase error fetching contact_messages, using local storage fallback:', error);
    }
    return JSON.parse(localStorage.getItem('koperasi_messages') || '[]');
  },
  async saveMessage(msg: { name: string; email: string; subject: string; message: string }): Promise<void> {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      created_at: new Date().toISOString()
    };
    
    // Save to local storage first as fallback
    const localMsgs = JSON.parse(localStorage.getItem('koperasi_messages') || '[]');
    localMsgs.push(newMsg);
    localStorage.setItem('koperasi_messages', JSON.stringify(localMsgs));

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('contact_messages').insert(newMsg);
      if (error) console.error('Supabase error inserting contact_messages:', error);
    }
  },
  async deleteMessage(id: string): Promise<void> {
    // Delete from local storage
    const localMsgs = JSON.parse(localStorage.getItem('koperasi_messages') || '[]');
    const filtered = localMsgs.filter((m: ContactMessage) => m.id !== id);
    localStorage.setItem('koperasi_messages', JSON.stringify(filtered));

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) console.error('Supabase error deleting contact_messages:', error);
    }
  },

  // STORAGE UPLOAD METHOD
  async uploadFile(bucketName: string, filePath: string, file: File): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      });
      if (error) {
        throw new Error(`Gagal mengunggah berkas ke Supabase: ${error.message}`);
      }
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    }
    
    // Fallback if not configured: convert to Base64 (for images) or standard DataURL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Gagal membaca berkas'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  // REGISTRATIONS SERVICE
  async getRegistrations(): Promise<Registration[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
      console.error('Supabase error fetching registrations, using local storage fallback:', error);
    }
    return JSON.parse(localStorage.getItem('koperasi_registrations') || '[]');
  },

  async saveRegistration(reg: Omit<Registration, 'id' | 'status' | 'created_at'>): Promise<void> {
    const newReg: Registration = {
      id: 'reg-' + Date.now(),
      status: 'Pending',
      created_at: new Date().toISOString(),
      ...reg
    };

    // Save locally
    const localRegs = JSON.parse(localStorage.getItem('koperasi_registrations') || '[]');
    // Check duplication locally
    if (localRegs.some((r: Registration) => r.nik.trim().toUpperCase() === reg.nik.trim().toUpperCase())) {
      throw new Error(`NIK ${reg.nik} sudah terdaftar di sistem.`);
    }
    localRegs.unshift(newReg);
    localStorage.setItem('koperasi_registrations', JSON.stringify(localRegs));

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('registrations').insert(newReg);
      if (error) {
        if (error.code === '23505') {
          throw new Error(`NIK ${reg.nik} sudah terdaftar di sistem.`);
        }
        console.error('Supabase error inserting registrations:', error);
      }
    }
  },

  async updateRegistrationStatus(id: string, status: 'Pending' | 'Approved' | 'Rejected'): Promise<void> {
    const localRegs = JSON.parse(localStorage.getItem('koperasi_registrations') || '[]');
    const updated = localRegs.map((r: Registration) => r.id === id ? { ...r, status } : r);
    localStorage.setItem('koperasi_registrations', JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('registrations').update({ status }).eq('id', id);
      if (error) console.error('Supabase error updating registration status:', error);
    }
  },

  async deleteRegistration(id: string): Promise<void> {
    const localRegs = JSON.parse(localStorage.getItem('koperasi_registrations') || '[]');
    const filtered = localRegs.filter((r: Registration) => r.id !== id);
    localStorage.setItem('koperasi_registrations', JSON.stringify(filtered));

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('registrations').delete().eq('id', id);
      if (error) console.error('Supabase error deleting registration:', error);
    }
  },

  async checkRegistrationNik(nik: string): Promise<Registration | null> {
    const cleanNik = nik.trim().toUpperCase();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('registrations').select('*').eq('nik', cleanNik).maybeSingle();
      if (!error && data) return data;
      if (error) console.error('Supabase error checking NIK:', error);
    }
    const localRegs = JSON.parse(localStorage.getItem('koperasi_registrations') || '[]');
    return localRegs.find((r: Registration) => r.nik.trim().toUpperCase() === cleanNik) || null;
  }
};
