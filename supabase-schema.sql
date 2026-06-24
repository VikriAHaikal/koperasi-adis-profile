-- SCRIPT INISIALISASI DATABASE KOPERASI ADIS DI SUPABASE
-- Salin dan jalankan script ini di SQL Editor Supabase Anda

-- 1. Tabel Hero Slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Hero" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Admin Write Hero" ON hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Tabel Profile Content
CREATE TABLE IF NOT EXISTS profile_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE profile_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Profile" ON profile_content FOR SELECT USING (true);
CREATE POLICY "Admin Write Profile" ON profile_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Tabel Business Units
CREATE TABLE IF NOT EXISTS business_units (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  image_url TEXT
);

ALTER TABLE business_units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Units" ON business_units FOR SELECT USING (true);
CREATE POLICY "Admin Write Units" ON business_units FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Tabel News Articles
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Pengumuman',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  author TEXT NOT NULL
);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read News" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Admin Write News" ON news_articles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Tabel Documents
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  size TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Docs" ON documents FOR SELECT USING (true);
CREATE POLICY "Admin Write Docs" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Tabel Contact Info
CREATE TABLE IF NOT EXISTS contact_info (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Contact" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Admin Write Contact" ON contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Insert Data Awal secara otomatis ke dalam database Supabase
INSERT INTO hero_slides (id, title, subtitle, image_url, order_index) VALUES 
('hero-1', 'Koperasi Karyawan PT Adis Dimension Footwear', 'Menyejahterakan karyawan, tumbuh bersama, dan membangun masa depan ekonomi anggota secara berkelanjutan.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80', 0),
('hero-2', 'Layanan Unit Usaha Terpercaya', 'Menghadirkan Adis Mart, Unit Simpan Pinjam Syariah, dan Jasa Ekspedisi untuk kemudahan kebutuhan harian Anda.', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profile_content (key, value) VALUES
('sejarah', 'Koperasi Konsumen Karyawan PT Adis Dimension Footwear didirikan atas komitmen bersama untuk meningkatkan kesejahteraan finansial dan sosial seluruh karyawan PT Adis. Seiring perkembangan perusahaan sebagai salah satu produsen sepatu olahraga terkemuka di Indonesia, Koperasi kami bertransformasi menjadi mitra tepercaya dengan berbagai unit bisnis mandiri yang dikelola secara profesional.'),
('visi', 'Menjadi koperasi konsumen karyawan teladan nasional yang mandiri, sehat, amanah, dan menjadi motor penggerak kesejahteraan anggota.'),
('misi', '["Menyediakan kebutuhan konsumsi harian berkualitas dengan harga terjangkau bagi seluruh anggota.", "Menyelenggarakan unit simpan pinjam dengan skema syariah yang mendidik, transparan, dan adil.", "Meningkatkan kompetensi SDM pengelola koperasi melalui teknologi digital yang transparan dan akuntabel.", "Memberikan kontribusi sosial yang nyata bagi keluarga karyawan dan komunitas sekitar."]'),
('milestones', '[{"year": "2003", "title": "Pendirian Koperasi", "description": "Koperasi Karyawan PT Adis Dimension Footwear resmi didirikan pada November 2003 dengan Badan Hukum resmi No: 518/193/BH-DINKOP/XI/2003."}, {"year": "2010", "title": "Ekspansi Adis Mart", "description": "Mendirikan unit usaha minimarket Adis Mart guna menyediakan bahan pokok dan konsumsi harian berkualitas dengan harga terjangkau bagi anggota."}, {"year": "2018", "title": "Simpan Pinjam Syariah", "description": "Meluncurkan program simpan pinjam berbasis Syariah (bagi hasil) untuk menjunjung asas gotong royong tanpa adanya unsur riba."}, {"year": "2023", "title": "Armada Logistik", "description": "Mendirikan unit ekspedisi logistik internal untuk memperkuat distribusi barang operasional pabrik dan koperasi."}, {"year": "2026", "title": "Transformasi Digital", "description": "Implementasi digital penuh, integrasi database pendaftaran, dan kemudahan akses Laporan Pertanggungjawaban RAT."}]'),
('org_structure', '[{"role": "Ketua Koperasi", "name": "H. Didin Syarifudin", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"}, {"role": "Sekretaris", "name": "Ahmad Fauzi", "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}, {"role": "Bendahara", "name": "Sri Wahyuni", "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"}, {"role": "Ketua Pengawas", "name": "Budi Santoso", "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"}, {"role": "Anggota Pengawas", "name": "Hendra Wijaya", "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"}]'),
('prestasi', '[{"year": "2024", "title": "Sertifikat Klasifikasi Sehat (Nilai A)", "awarder": "Dinas Koperasi Kab. Tangerang", "description": "Penghargaan atas kepatuhan regulasi, tata kelola keuangan yang transparan, serta pengelolaan risiko usaha yang sangat sehat.", "level": "Kabupaten/Kota", "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}, {"year": "2023", "title": "Koperasi Karyawan Teraktif", "awarder": "Kadin Bidang Koperasi Wilayah Banten", "description": "Apresiasi atas keberhasilan pelaksanaan program rapat anggota tahunan (RAT) online dan digitalisasi pendaftaran anggota terintegrasi.", "level": "Provinsi", "image_url": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80"}, {"year": "2021", "title": "Ritel Koperasi Percontohan", "awarder": "Dinas Perindustrian & Perdagangan", "description": "Pencapaian unit Adis Mart sebagai ritel modern mandiri terbaik dalam menyuplai kebutuhan pokok karyawan secara konsisten.", "level": "Kabupaten/Kota", "image_url": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80"}]'),
('stats_members', '5280'),
('stats_assets', '12.5'),
('stats_growth', '12'),
('partners', '[{"name": "PT Adis Dimension Footwear", "logo_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80"}, {"name": "Nike Indonesia", "logo_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80"}, {"name": "Bank Syariah Indonesia", "logo_url": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80"}, {"name": "BPJS Ketenagakerjaan", "logo_url": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80"}]'),
('unit_details', '[{"unit_id": "unit-1", "logo_url": "/logo-adismart.png", "long_description": "Adismart menyediakan sembako, makanan ringan, perlengkapan rumah tangga, pakaian kerja, hingga barang elektronik. Transaksi sangat mudah dengan dukungan cash, QRIS, maupun sistem potong gaji bulanan yang memudahkan keuangan karyawan.", "extra_info": "Senin - Jum''at:\\nAdismart 1: 06:00 - 21:00 WIB\\nAdismart 2: 06:30 - 17:00 WIB\\n\\nSetiap Hari:\\nAdismart Balaraja: 06:00 - 22:00 WIB", "branches": [{"id": "br-1", "name": "Adis Mart 1", "description": "Terletak strategis di lingkungan Gedung A PT Adis Dimension Footwear, menyediakan kebutuhan pokok harian, minuman segar, dan camilan bagi karyawan di jam kerja.", "images": ["/adismart-1.png", "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"], "hours": "Senin - Jum''at: 06:00 - 21:00 WIB", "whatsapp": "628123456789"}, {"id": "br-2", "name": "Adis Mart 2", "description": "Terletak di area produksi Gedung B, menyediakan minimarket belanja cepat, kebutuhan seragam kerja karyawan, serta ATK penunjang administrasi internal.", "images": ["/adismart-2.png", "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"], "hours": "Senin - Jum''at: 06:30 - 17:00 WIB", "whatsapp": "628123456789"}, {"id": "br-3", "name": "Adis Mart Balaraja", "description": "Cabang retail mandiri di luar kawasan industri Balaraja, terbuka penuh untuk umum serta melayani pembelian dalam volume besar bagi anggota dan keluarga karyawan.", "images": ["/adismart-balaraja.png", "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80"], "hours": "Setiap Hari: 06:00 - 22:00 WIB", "whatsapp": "628123456789", "map_url": "https://maps.google.com"}]}, {"unit_id": "unit-2", "logo_url": "", "long_description": "Unit Simpan Pinjam Koperasi Karyawan PT Adis Dimension Footwear menyediakan solusi finansial syariah murni bebas riba untuk membantu anggota dalam mengelola dan merencanakan keuangan secara amanah dan adil.", "extra_info": "Akad Mudharabah (Bagi Hasil investasi setara 5% per tahun)\\nAkad Wadiah Yad Dhamanah (Tabungan murni titipan)\\nAkad Qardhul Hasan (Pinjaman darurat margin 0%)"}, {"unit_id": "unit-3", "logo_url": "", "long_description": "Unit Jasa Distribusi & Logistik mengelola armada pengiriman untuk menyokong kebutuhan distribusi material pabrik PT Adis serta memperkuat rantai pasokan produk ritel koperasi.", "extra_info": "10+ Unit Armada Truk Box & Pickup\\nLayanan Operasional Siaga 24/7 Hari\\nPengiriman Cepat, Aman, dan Profesional"}]'),
('budaya', '[{"title": "Integritas & Amanah", "description": "Mengelola dana dan kepercayaan anggota secara jujur, bertanggung jawab, serta transparan.", "icon": "ShieldCheck"}, {"title": "Kekeluargaan", "description": "Mengedepankan asas gotong royong dan saling membantu untuk kemaslahatan seluruh karyawan.", "icon": "Users"}, {"title": "Kemudahan & Layanan", "description": "Memberikan pelayanan prima yang solutif, cepat, dan terdigitalisasi untuk memudahkan kebutuhan harian.", "icon": "HeartHandshake"}]')
ON CONFLICT (key) DO NOTHING;

INSERT INTO business_units (id, name, description, icon, image_url) VALUES 
('unit-1', 'Adis Mart (Toko Koperasi)', 'Minimarket penyedia bahan pokok, kebutuhan rumah tangga, dan perlengkapan harian karyawan dengan sistem pembayaran tunai maupun potong gaji.', 'ShoppingBag', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'),
('unit-2', 'Unit Simpan Pinjam', 'Solusi finansial darurat dan investasi masa depan berbasis bagi hasil yang adil, menghindari praktik riba, dan membantu pengelolaan keuangan anggota.', 'Wallet', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'),
('unit-3', 'Jasa Distribusi & Logistik', 'Menyediakan armada logistik pendukung kegiatan pengiriman barang operasional pabrik serta distribusi internal produk koperasi.', 'Truck', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO news_articles (id, title, excerpt, content, image_url, category, created_at, author) VALUES 
('news-1', 'Rapat Anggota Tahunan (RAT) Buku 2025 Sukses Digelar', 'RAT tahun buku 2025 berjalan lancar dengan menyepakati kenaikan SHU sebesar 12% yang langsung didistribusikan ke rekening anggota.', 'Koperasi Karyawan PT Adis Dimension Footwear sukses menggelar Rapat Anggota Tahunan (RAT) Tahun Buku 2025 yang dihadiri oleh jajaran direksi PT Adis, perwakilan Dinas Koperasi Kabupaten Tangerang, serta perwakilan anggota dari masing-masing divisi. Dalam rapat ini dilaporkan kinerja keuangan koperasi yang menunjukkan pertumbuhan positif dengan kenaikan laba bersih. Selain itu, diputuskan pembagian Sisa Hasil Usaha (SHU) yang meningkat sebesar 12% dibandingkan tahun lalu. Koperasi juga berkomitmen melakukan digitalisasi layanan transaksi pada tahun 2026 ini.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', 'Pengumuman', '2026-03-15 09:00:00+00', 'Pengurus Koperasi'),
('news-2', 'Pemberian Beasiswa Prestasi bagi Anak Anggota Koperasi', 'Sebagai bentuk tanggung jawab sosial, Koperasi membagikan beasiswa pendidikan kepada 150 anak anggota dari tingkat SD hingga Perguruan Tinggi.', 'Komitmen Koperasi Karyawan PT Adis dalam mencerdaskan anak bangsa diwujudkan melalui program Beasiswa Pendidikan Tahunan. Pada gelombang ini, sebanyak 150 anak anggota koperasi yang memiliki prestasi akademik gemilang di sekolah masing-masing menerima dana bantuan pendidikan. Kategori penerima beasiswa meliputi jenjang SD, SMP, SMA, hingga perguruan tinggi. Penyerahan secara simbolis dilakukan di Aula PT Adis Dimension Footwear oleh Ketua Koperasi beserta perwakilan Manajemen HRD.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', 'Kegiatan', '2026-05-12 10:30:00+00', 'Bidang Sosial & Pendidikan')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contact_info (key, value) VALUES
('whatsapp', '628123456789'),
('address', 'Jl. Raya Serang Km. 24, Balaraja, Tangerang, Banten 15610 (Kawasan Industri PT Adis)'),
('email', 'koperasi@adis.co.id'),
('phone', '021-5951660 ext. 204')
ON CONFLICT (key) DO NOTHING;

-- 8. Tabel Contact Messages (Kritik & Saran)
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert Messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Messages" ON contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. Tabel Pendaftaran Anggota Baru
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  nik TEXT NOT NULL UNIQUE,
  division TEXT NOT NULL,
  phone TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "Public Insert Registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Registrations" ON registrations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Benih Data Awal untuk Demo NIK Checker
INSERT INTO registrations (id, full_name, nik, division, phone, reason, status, created_at) VALUES
('reg-1', 'Budi Santoso', 'ADIS-10123', 'Production Line 3 / Assembly', '628123456780', 'Ingin memanfaatkan Adis Mart kredit', 'Approved', '2024-04-12T08:00:00Z'),
('reg-2', 'Siti Aminah', 'ADIS-20456', 'HRD / Administration', '628123456781', 'Untuk tabungan rutin bulanan', 'Approved', '2023-09-05T08:00:00Z'),
('reg-3', 'Joko Susilo', 'ADIS-30789', 'Logistics / Warehouse', '628123456782', 'Butuh simpan pinjam syariah', 'Pending', '2026-06-14T08:00:00Z')
ON CONFLICT (nik) DO NOTHING;


