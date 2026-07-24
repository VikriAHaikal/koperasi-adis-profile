# 🏦 KOPKAR ADIS — Website Company Profile

Website company profile resmi **Koperasi Karyawan ADIS (KOPKAR ADIS)** yang dibangun dengan stack modern. Dilengkapi fitur CMS (Content Management System) berbasis admin panel untuk pengelolaan konten secara dinamis tanpa perlu menyentuh kode.

> 🚧 **Status**: Ongoing Development

---

## 🚀 Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | TypeScript |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Routing** | React Router DOM v7 |
| **Backend / DB** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Styling** | Vanilla CSS (Custom Design System) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Linting** | ESLint + TypeScript ESLint |

---

## ✨ Fitur Utama

### 🌐 Halaman Publik
- **Beranda** — Hero slider dinamis, statistik, unit usaha, berita terkini
- **Tentang Kami** — Sejarah koperasi, visi & misi, milestone, struktur organisasi, prestasi, mitra
- **Unit Usaha** — Daftar unit usaha beserta detail halaman per unit (cabang, galeri, jam operasional)
- **Berita** — Artikel berita koperasi dengan kategori
- **Laporan RAT** — Dokumen resmi yang dapat diunduh
- **Kontak** — Form pesan, informasi kontak, integrasi WhatsApp

### 🔐 Admin Panel
- Login terproteksi dengan session management
- Dashboard dengan ringkasan statistik
- Manajemen konten: Hero, Profil, Unit Usaha, Berita, Dokumen, Kontak
- Rich Text Editor untuk konten artikel
- Manajemen pesan masuk dari pengunjung

### ⚙️ Fitur Teknis
- **Dual-mode DB**: Otomatis fallback ke LocalStorage (Mock Data) jika Supabase belum dikonfigurasi
- **SEO-ready**: Meta tags dinamis per halaman, `robots.txt`, `sitemap.xml`, `manifest.json`
- **PWA-ready**: Service Worker (`sw.js`) untuk offline support
- **Cookie Consent** banner
- **Floating WhatsApp** button dinamis dari data kontak
- **Back to Top** button
- **Responsive Design** untuk semua ukuran layar
- Admin area diblokir dari crawler (`/admin`, `/login`)

---

## 🛠️ Cara Menjalankan Lokal

### Prasyarat
- Node.js >= 18
- npm atau package manager lainnya

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/VikriAHaikal/koperasi-adis-profile.git
cd koperasi-adis-profile

# 2. Install dependencies
npm install

# 3. Salin file environment dan isi dengan kredensial Supabase
cp .env.example .env
```

### Konfigurasi `.env`

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ℹ️ Jika `.env` tidak diisi, aplikasi akan otomatis berjalan dengan **Mock Data (LocalStorage)** — cocok untuk demo/preview tanpa backend.

### Jalankan Development Server

```bash
npm run dev
```

### Setup Database Supabase (Opsional)

Jalankan SQL berikut di Supabase SQL Editor secara berurutan:
1. `supabase-schema.sql` — Membuat semua tabel dan data awal
2. `supabase_security_policies.sql` — Mengatur Row Level Security (RLS)

---

## 📁 Struktur Proyek

```
koperasi-adis-profile/
├── public/                  # Aset statis (logo, gambar, manifest, robots.txt, sitemap, sw.js)
├── src/
│   ├── assets/              # Aset internal (hero image, svg)
│   ├── components/          # Komponen reusable (Navbar, Footer, Hero, dll.)
│   │   └── admin/           # Komponen khusus admin (RichTextEditor)
│   ├── pages/
│   │   ├── public/          # Halaman publik (Home, About, BusinessUnits, dll.)
│   │   └── admin/           # Halaman admin (Login, Dashboard, tabs)
│   ├── services/
│   │   └── db.ts            # Abstraksi layer database (Supabase + Mock fallback)
│   ├── supabaseClient.ts    # Inisialisasi Supabase client
│   ├── App.tsx              # Root component & routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles & design tokens
├── supabase-schema.sql      # DDL schema database
├── supabase_security_policies.sql  # RLS policies
├── vercel.json              # Konfigurasi deployment Vercel (SPA rewrite)
├── vite.config.ts           # Konfigurasi Vite
└── .env.example             # Template environment variables
```

---

## 🔒 Keamanan

- ✅ File `.env` **tidak** di-commit ke repository (sudah ada di `.gitignore`)
- ✅ Kredensial Supabase hanya dibaca dari environment variables
- ✅ Admin panel menggunakan session-based auth
- ✅ Halaman admin diproteksi dengan route guard (`PrivateRoute`)
- ✅ RLS (Row Level Security) diterapkan di level database Supabase
- ✅ Area admin diblokir dari indexing mesin pencari

---

## 📜 Lisensi

Proyek ini dibuat untuk keperluan internal **Koperasi Karyawan ADIS**. All rights reserved.
