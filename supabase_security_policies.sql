-- ====================================================================
-- SUPABASE DATABASE ROW LEVEL SECURITY (RLS) POLICIES FOR KOPKAR ADIS
-- ====================================================================
--
-- CARA PENGGUNAAN:
-- 1. Masuk ke Dashboard Supabase Anda (https://supabase.com).
-- 2. Pilih Proyek Anda.
-- 3. Di bilah menu sebelah kiri, buka menu "SQL Editor".
-- 4. Klik "New query" untuk membuat tab query baru.
-- 5. Salin (copy) seluruh isi berkas SQL ini, lalu tempel (paste) ke SQL Editor tersebut.
-- 6. Klik tombol "Run" di kanan bawah untuk mengeksekusi skrip ini.
--
-- Skrip ini akan mengaktifkan pengamanan RLS sehingga kunci publik (Anon Key)
-- di browser TIDAK BISA digunakan oleh hacker untuk merusak atau menghapus data.
-- ====================================================================

-- 1. AKTIFKAN ROW LEVEL SECURITY (RLS) PADA SEMUA TABEL
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;


-- 2. KEBIJAKAN UNTUK TABEL CONTENT (BACA UMUM, TULIS HANYA ADMIN SAH)

-- Tabel: hero_slides
DROP POLICY IF EXISTS "Allow public read access for hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Allow admin write access for hero_slides" ON hero_slides;
CREATE POLICY "Allow public read access for hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Allow admin write access for hero_slides" ON hero_slides FOR ALL TO authenticated USING (true);

-- Tabel: profile_content
DROP POLICY IF EXISTS "Allow public read access for profile_content" ON profile_content;
DROP POLICY IF EXISTS "Allow admin write access for profile_content" ON profile_content;
CREATE POLICY "Allow public read access for profile_content" ON profile_content FOR SELECT USING (true);
CREATE POLICY "Allow admin write access for profile_content" ON profile_content FOR ALL TO authenticated USING (true);

-- Tabel: business_units
DROP POLICY IF EXISTS "Allow public read access for business_units" ON business_units;
DROP POLICY IF EXISTS "Allow admin write access for business_units" ON business_units;
CREATE POLICY "Allow public read access for business_units" ON business_units FOR SELECT USING (true);
CREATE POLICY "Allow admin write access for business_units" ON business_units FOR ALL TO authenticated USING (true);

-- Tabel: news_articles
DROP POLICY IF EXISTS "Allow public read access for news_articles" ON news_articles;
DROP POLICY IF EXISTS "Allow admin write access for news_articles" ON news_articles;
CREATE POLICY "Allow public read access for news_articles" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Allow admin write access for news_articles" ON news_articles FOR ALL TO authenticated USING (true);

-- Tabel: documents
DROP POLICY IF EXISTS "Allow public read access for documents" ON documents;
DROP POLICY IF EXISTS "Allow admin write access for documents" ON documents;
CREATE POLICY "Allow public read access for documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Allow admin write access for documents" ON documents FOR ALL TO authenticated USING (true);

-- Tabel: contact_info
DROP POLICY IF EXISTS "Allow public read access for contact_info" ON contact_info;
DROP POLICY IF EXISTS "Allow admin write access for contact_info" ON contact_info;
CREATE POLICY "Allow public read access for contact_info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Allow admin write access for contact_info" ON contact_info FOR ALL TO authenticated USING (true);


-- 3. KEBIJAKAN KHUSUS UNTUK FORM (PUBLIK BISA MENGIRIM, HANYA ADMIN BISA MELIHAT & MENGELOLA)

-- Tabel: contact_messages (Form Hubungi Kami)
DROP POLICY IF EXISTS "Allow public insert access for contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow admin manage access for contact_messages" ON contact_messages;
CREATE POLICY "Allow public insert access for contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin manage access for contact_messages" ON contact_messages FOR ALL TO authenticated USING (true);

-- Tabel: registrations (Form Pendaftaran Anggota)
DROP POLICY IF EXISTS "Allow public insert access for registrations" ON registrations;
DROP POLICY IF EXISTS "Allow admin manage access for registrations" ON registrations;
CREATE POLICY "Allow public insert access for registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin manage access for registrations" ON registrations FOR ALL TO authenticated USING (true);
