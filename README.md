<![CDATA[<div align="center">

# 🏘️ SIDESA — Sistem Informasi Desa Pulodarat

### Kecamatan Pecangaan, Kabupaten Jepara, Jawa Tengah

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

Aplikasi web full-stack untuk **digitalisasi pelayanan administrasi desa**.<br/>
Dibuat sebagai program kerja **KKN Angkatan XXI Tahun 2026**.

[🚀 Live Demo](#-deployment) · [📖 Dokumentasi](#-quick-start) · [🐛 Laporkan Bug](https://github.com/Abibsa/sidesa-pulodarat/issues)

<br/>

---

</div>

## 📋 Daftar Isi

- [🎯 Tentang Project](#-tentang-project)
- [✨ Fitur Lengkap](#-fitur-lengkap)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
- [📁 Struktur Project](#-struktur-project)
- [🚀 Quick Start](#-quick-start)
- [🗄️ Database](#️-database)
- [🔑 Akun Default](#-akun-default)
- [📦 Scripts](#-scripts)
- [🌍 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🎓 Program KKN](#-program-kkn)
- [🔧 Troubleshooting](#-troubleshooting)
- [👥 Tim Pengembang](#-tim-pengembang)

---

## 🎯 Tentang Project

**SIDESA** (Sistem Informasi Desa) adalah platform digital yang mengintegrasikan seluruh aspek pelayanan desa ke dalam satu aplikasi web modern. Project ini mendukung **2 program kerja KKN**:

| # | Program Kerja | Output |
|:-:|---------------|--------|
| 1 | **Digitalisasi Administrasi Desa** | Website desa + pelayanan surat online 24/7 |
| 2 | **Pelatihan Perangkat Desa** | Panduan & pelatihan penggunaan sistem digital |

### 💡 Mengapa SIDESA?

> *"Warga tidak perlu datang ke kantor desa hanya untuk mengurus surat. Cukup dari rumah, ajukan secara online, dan tinggal ambil hasilnya."*

- 🕐 Pelayanan **24 jam** tanpa batasan jam kerja
- 📱 Akses dari **HP, tablet, atau komputer**
- 🔍 Tracking status pengajuan **real-time**
- 📊 Dashboard statistik untuk **pengambilan keputusan**
- 🌙 Tampilan **dark mode** yang nyaman di mata

---

## ✨ Fitur Lengkap

### 🌐 Website Publik *(Tanpa Login)*

<table>
<tr>
<td width="50%">

**📄 Halaman Informasi**
- Beranda dengan hero section & sambutan Kepala Desa
- Profil Desa (sejarah, visi-misi, struktur organisasi)
- Berita & Pengumuman dengan kategori
- Potensi Desa (UMKM, pariwisata, industri)
- Kontak & Peta lokasi desa
- Kebijakan Privasi & Syarat Ketentuan

</td>
<td width="50%">

**📝 Pelayanan Surat Online**
- Ajukan surat **tanpa perlu akun** (cukup NIK)
- 4 jenis surat: SKD, SKTM, SP-KTP, SKU
- Form dinamis sesuai jenis surat
- Nomor tiket otomatis untuk tracking
- Cek status: `Diajukan → Diproses → Selesai`
- Notifikasi catatan admin

</td>
</tr>
</table>

### 🔐 Panel Admin *(Login Required)*

<table>
<tr>
<td width="33%">

**📋 Manajemen Surat**
- Dashboard pengajuan masuk
- Proses / tolak pengajuan
- Catatan admin ke pemohon
- Generate PDF surat resmi
- Filter & search canggih

</td>
<td width="33%">

**👥 Data Penduduk**
- CRUD data lengkap
- Search by NIK, nama, RT/RW
- Validasi data (Zod schema)
- Pagination optimal

</td>
<td width="34%">

**📊 Dashboard & Lainnya**
- Statistik penduduk (chart)
- Kelola berita & pengumuman
- Kelola profil desa
- CRUD aparatur desa
- CRUD potensi desa

</td>
</tr>
</table>

### 🎨 UI/UX Premium

| Fitur | Deskripsi |
|-------|-----------|
| 🌗 Dark Mode | Toggle animasi sun/moon dengan bintang berkedip & awan |
| 📱 Responsive | Mobile-first, tampil sempurna di semua ukuran layar |
| ✨ Animasi | Framer Motion untuk transisi halus & micro-interactions |
| 🎯 Accessible | Focus visible, aria-labels, keyboard navigation |
| 🧭 SEO | Meta tags, semantic HTML, heading hierarchy |

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="25%">

**Frontend**

</td>
<td align="center" width="25%">

**Backend**

</td>
<td align="center" width="25%">

**Database**

</td>
<td align="center" width="25%">

**DevOps**

</td>
</tr>
<tr>
<td>

- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS 4
- Framer Motion
- Recharts
- Lucide Icons
- Radix UI

</td>
<td>

- Next.js API Routes
- NextAuth.js v5 (beta)
- Zod (validasi)
- bcryptjs (hash)
- React PDF

</td>
<td>

- PostgreSQL 16
- Prisma ORM 7
- Prisma Adapter PG
- Neon (cloud DB)

</td>
<td>

- Vercel (hosting)
- GitHub (repo)
- ESLint
- tsx (runner)

</td>
</tr>
</table>

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │ Halaman  │  │  Panel   │  │  Pelayanan Surat      │ │
│  │  Publik  │  │  Admin   │  │  Online (Form+Track)  │ │
│  └────┬─────┘  └────┬─────┘  └──────────┬────────────┘ │
└───────┼──────────────┼──────────────────┼───────────────┘
        │              │                  │
        ▼              ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                 NEXT.JS SERVER (Vercel)                  │
│  ┌─────────────────────────────────────────────────┐    │
│  │              App Router (RSC + Client)           │    │
│  ├─────────────────────────────────────────────────┤    │
│  │  API Routes:                                     │    │
│  │  /api/letters/*     → Surat & PDF Generator     │    │
│  │  /api/residents/*   → Data Penduduk             │    │
│  │  /api/news/*        → Berita                    │    │
│  │  /api/officers/*    → Aparatur Desa             │    │
│  │  /api/potentials/*  → Potensi Desa              │    │
│  │  /api/profile/*     → Profil Desa               │    │
│  │  /api/statistics/*  → Dashboard Statistik       │    │
│  │  /api/auth/*        → NextAuth.js               │    │
│  ├─────────────────────────────────────────────────┤    │
│  │  Prisma ORM 7 (PG Adapter)                      │    │
│  └──────────────────────┬──────────────────────────┘    │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   PostgreSQL (Neon)   │
              │   8 Models / Tables   │
              └───────────────────────┘
```

---

## 📁 Struktur Project

```
sidesa/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📄 layout.tsx                # Root layout + ThemeProvider
│   ├── 📄 page.tsx                  # 🏠 Beranda (hero, sambutan, statistik)
│   ├── 📄 globals.css               # Design system + animasi
│   │
│   ├── 📂 profil/                   # 📋 Profil Desa
│   ├── 📂 berita/                   # 📰 Berita & detail ([slug])
│   ├── 📂 potensi/                  # 🌾 Potensi Desa
│   ├── 📂 kontak/                   # 📞 Kontak & peta
│   ├── 📂 surat/                    # 📝 Form pengajuan surat online
│   ├── 📂 cek-status/               # 🔍 Tracking status surat
│   ├── 📂 login/                    # 🔐 Halaman login admin
│   ├── 📂 kebijakan-privasi/        # 📜 Privacy policy
│   ├── 📂 syarat-ketentuan/         # 📜 Terms of service
│   │
│   ├── 📂 admin/                    # 🔒 Panel Admin (Protected)
│   │   ├── 📄 layout.tsx            # Layout admin + auth check
│   │   ├── 📄 page.tsx              # Dashboard utama
│   │   ├── 📂 surat/               # Kelola pengajuan surat
│   │   ├── 📂 penduduk/            # CRUD data penduduk
│   │   ├── 📂 berita/              # CRUD berita
│   │   ├── 📂 profil/              # Edit profil desa
│   │   ├── 📂 aparatur/            # CRUD aparatur desa
│   │   ├── 📂 potensi/             # CRUD potensi desa
│   │   └── 📂 statistik/           # Dashboard chart
│   │
│   └── 📂 api/                      # 🔌 REST API Endpoints
│       ├── 📂 auth/                 # NextAuth handlers
│       ├── 📂 letters/              # Surat + generate-pdf
│       ├── 📂 residents/            # Data penduduk
│       ├── 📂 news/                 # Berita + [slug]
│       ├── 📂 officers/             # Aparatur + [id]
│       ├── 📂 potentials/           # Potensi + [id]
│       ├── 📂 profile/              # Profil desa
│       └── 📂 statistics/           # Data statistik
│
├── 📂 components/                   # 🧩 React Components
│   ├── 📄 PublicNav.tsx             # Navigasi publik + ThemeToggle
│   ├── 📄 AdminNavClient.tsx        # Navigasi admin + active links
│   ├── 📄 ThemeToggle.tsx           # 🌗 Animated sun/moon toggle
│   ├── 📄 ThemeProvider.tsx         # next-themes wrapper
│   └── 📂 ui/                      # Radix UI components
│       ├── button, card, dialog
│       ├── input, label, textarea
│       ├── select, switch, tabs
│       └── dropdown-menu
│
├── 📂 lib/                          # 🔧 Utilities
│   ├── 📄 db.ts                     # Prisma client singleton
│   ├── 📄 utils.ts                  # Helper functions (cn, format)
│   ├── 📄 useCountUp.ts            # Hook animasi angka
│   └── 📄 validations.ts           # Zod schemas
│
├── 📂 prisma/                       # 🗄️ Database
│   ├── 📄 schema.prisma            # 8 models database
│   ├── 📄 seed.ts                  # Data awal (seed)
│   └── 📄 test-connection.ts       # Script tes koneksi & fungsi
│
├── 📄 auth.ts                       # NextAuth.js config
├── 📄 proxy.ts                      # Dev proxy server
├── 📄 next.config.ts                # Next.js config
├── 📄 tsconfig.json                 # TypeScript config
├── 📄 .env.example                  # Template environment variables
└── 📄 package.json                  # Dependencies & scripts
```

---

## 🚀 Quick Start

### Prasyarat

- **Node.js** v18+ → [Download](https://nodejs.org/)
- **npm** v9+ (sudah termasuk di Node.js)
- **Database PostgreSQL** — pilih salah satu:
  - ☁️ [Neon.tech](https://neon.tech) *(Recommended, gratis)*
  - ☁️ [Supabase](https://supabase.com) *(gratis)*
  - 🖥️ PostgreSQL lokal

### Langkah 1 — Clone & Install

```bash
git clone https://github.com/Abibsa/sidesa-pulodarat.git
cd sidesa-pulodarat
npm install
```

### Langkah 2 — Setup Environment

```bash
# Copy template
copy .env.example .env
```

Edit file `.env` dan isi:

```env
# 🗄️ Database — WAJIB diganti!
# Dapatkan gratis di https://neon.tech
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# 🔐 NextAuth — WAJIB diganti!
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="HASIL_GENERATE_ANDA_DISINI"

# 🏷️ App Info
NEXT_PUBLIC_APP_NAME="SIDESA"
NEXT_PUBLIC_VILLAGE_NAME="Desa PULODARAT"
```

### Langkah 3 — Setup Database

```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Buat tabel di database
npm run db:seed        # Isi data awal (3 admin, 10 penduduk, dll)
```

### Langkah 4 — Jalankan!

```bash
npm run dev
```

Buka **http://localhost:3000** 🎉

---

## 🗄️ Database

### 8 Models Prisma

```
┌──────────────────┐     ┌──────────────────┐
│      User        │     │    Resident       │
│  (3 roles admin) │     │ (data penduduk)   │
├──────────────────┤     ├──────────────────┤
│ id, email, name  │     │ nik, kk, name    │
│ password, role   │     │ gender, birth*   │
│ SUPERADMIN       │     │ address, rt, rw  │
│ OPERATOR         │     │ religion, edu    │
│ KEPALA_DESA      │     │ occupation, etc  │
└──────────────────┘     └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│   LetterType     │────▶│  LetterRequest   │
│  (jenis surat)   │     │ (pengajuan surat)│
├──────────────────┤     ├──────────────────┤
│ name, code       │     │ ticketNumber     │
│ formFields (JSON)│     │ applicant*       │
│ templatePath     │     │ formData (JSON)  │
│ isActive         │     │ status (enum)    │
└──────────────────┘     │ adminNotes       │
                         └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│      News        │     │ VillageProfile   │
│  (berita desa)   │     │ (profil desa)    │
├──────────────────┤     ├──────────────────┤
│ title, slug      │     │ villageName      │
│ content, excerpt │     │ history, vision  │
│ category, author │     │ mission, contact │
│ coverImage       │     │ hero*, chief*    │
│ isPublished      │     │ mapEmbedUrl      │
└──────────────────┘     └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│ VillageOfficer   │     │ VillagePotential │
│(aparatur desa)   │     │ (potensi desa)   │
├──────────────────┤     ├──────────────────┤
│ name, position   │     │ title, category  │
│ photo, order     │     │ description      │
│ isActive         │     │ images (JSON)    │
└──────────────────┘     │ contactInfo      │
                         └──────────────────┘
```

### Status Surat (Enum)

```
DIAJUKAN  →  DIPROSES  →  SELESAI
                       →  DITOLAK
```

### Data Seed

Setelah `npm run db:seed`, tersedia:

| Data | Jumlah | Keterangan |
|------|:------:|------------|
| 👤 Admin Users | 3 | Superadmin, Operator, Kepala Desa |
| 🧑 Penduduk | 10 | Data realistis (NIK, KK, biodata) |
| 📄 Jenis Surat | 4 | SKD, SKTM, SP-KTP, SKU |
| 📰 Berita | 3 | Pengumuman & kegiatan desa |
| 🏘️ Profil Desa | 1 | Desa Pulodarat, Pecangaan, Jepara |
| 👥 Aparatur Desa | 5 | Kepala Desa + perangkat |
| 🌾 Potensi Desa | 3 | UMKM, perdagangan, industri mebel |

---

## 🔑 Akun Default

> ⚠️ **Ganti password di production!**

| Email | Password | Role | Akses |
|-------|----------|------|-------|
| `superadmin@desa.id` | `admin123` | **SUPERADMIN** | Semua fitur |
| `operator@desa.id` | `admin123` | **OPERATOR** | Operasional harian |
| `kepala@desa.id` | `admin123` | **KEPALA_DESA** | View & approval |

---

## 📦 Scripts

```bash
# 🔧 Development
npm run dev              # Jalankan dev server (http://localhost:3000)
npm run build            # Build production (prisma generate + next build)
npm run start            # Start production server
npm run lint             # Jalankan ESLint

# 🗄️ Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Buat migration baru (development)
npm run db:push          # Push schema ke database (tanpa migration)
npm run db:seed          # Seed data awal
npm run db:studio        # Buka Prisma Studio (GUI database)

# 🧪 Testing
npm run test:check       # Tes koneksi DB, env, login, surat, cek status
```

---

## 🌍 Deployment

### Deploy ke Vercel *(Recommended)*

**1. Push ke GitHub**
```bash
git add -A
git commit -m "ready for deployment"
git push origin main
```

**2. Import di Vercel**
- Buka [vercel.com](https://vercel.com) → **New Project**
- Import repo `sidesa-pulodarat`
- Framework: **Next.js** (auto-detect)

**3. Set Environment Variables**

Di Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Connection string dari Neon/Supabase |
| `NEXTAUTH_SECRET` | Random string yang di-generate |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `SIDESA` |
| `NEXT_PUBLIC_VILLAGE_NAME` | `Desa PULODARAT` |

**4. Deploy!** 🚀

---

## 🧪 Testing

Jalankan test suite lengkap:

```bash
npm run test:check
```

Test yang dijalankan:

| # | Test | Deskripsi |
|:-:|------|-----------|
| 1 | **Database Connection** | Koneksi ke PostgreSQL |
| 2 | **Environment Variables** | Cek semua env var terisi |
| 3 | **Route Check** | Tes semua halaman publik (perlu `npm run dev`) |
| 4 | **Login Admin** | Verifikasi kredensial admin di database |
| 5 | **Ajukan Surat** | Tes buat pengajuan surat baru |
| 6 | **Cek Status** | Tes tracking surat berdasarkan tiket |

Contoh output:

```
====================================
🚀 MEMULAI TEST SISTEM SIDESA 🚀
====================================

--- CEK ENVIRONMENT VARIABLES ---
✅ DATABASE_URL OK
✅ NEXTAUTH_SECRET OK
✅ NEXTAUTH_URL OK
✅ NEXT_PUBLIC_APP_NAME OK

--- KONEKSI DATABASE ---
✅ Koneksi database: OK
📊 Total Users: 3
📊 Total Berita: 3
📊 Total Potensi Desa: 9
📊 Total Pengajuan Surat: 0

--- CEK FUNGSI UTAMA ---
✅ Tes Login Admin: OK
✅ Tes Ajukan Surat: OK
✅ Tes Cek Status: OK

🏁 SEMUA TES PASSED! ✅
====================================
```

---

## 🎓 Program KKN

### Proker 1 — Digitalisasi Administrasi Desa

| Output | Status |
|--------|:------:|
| Website desa dengan profil & informasi | ✅ |
| Sistem pelayanan surat online 24/7 | ✅ |
| Database penduduk terdigitalisasi | ✅ |
| Dashboard statistik real-time | ✅ |
| Generate PDF surat resmi | ✅ |
| Dark mode & responsive design | ✅ |

### Proker 2 — Pelatihan Perangkat Desa

| Sesi | Materi | Durasi |
|:----:|--------|:------:|
| 1 | Pengenalan SIDESA & Login | 15 menit |
| 2 | Dashboard & Navigasi | 10 menit |
| 3 | **Mengelola Pengajuan Surat** ⭐ | 45 menit |
| 4 | Mengelola Data Penduduk | 30 menit |
| 5 | Mengelola Berita & Profil Desa | 20 menit |
| 6 | Dashboard Statistik | 15 menit |
| 7 | Tips & Troubleshooting | 10 menit |
| | **Total** | **~2.5 jam** |

---

## 🔧 Troubleshooting

<details>
<summary><b>❌ Cannot find module '@prisma/client'</b></summary>

```bash
npm run db:generate
```
</details>

<details>
<summary><b>❌ Database connection failed</b></summary>

- Pastikan `DATABASE_URL` di file `.env` sudah benar
- Pastikan database online (cek dashboard Neon/Supabase)
- Cek format URL: `postgresql://user:pass@host:5432/dbname?sslmode=require`
</details>

<details>
<summary><b>❌ Login gagal / error</b></summary>

- Pastikan sudah menjalankan `npm run db:seed`
- Cek `NEXTAUTH_SECRET` di `.env` sudah diisi
- Gunakan email: `superadmin@desa.id` & password: `admin123`
</details>

<details>
<summary><b>❌ Port 3000 sudah dipakai</b></summary>

```bash
npm run dev -- -p 3001
```
</details>

<details>
<summary><b>❌ Prisma schema out of sync</b></summary>

```bash
npm run db:push       # Push ulang schema
npm run db:generate   # Regenerate client
```
</details>

<details>
<summary><b>❌ Build error di Vercel</b></summary>

- Pastikan semua environment variables sudah di-set di Vercel
- Cek build logs untuk detail error
- Pastikan `DATABASE_URL` accessible dari Vercel (gunakan cloud DB, bukan localhost)
</details>

---

## 🚨 Catatan Penting

> [!WARNING]
> - **Jangan commit file `.env`** — sudah ada di `.gitignore`
> - **Ganti semua password default** sebelum production
> - **Backup database** secara berkala
> - **Test di local** sebelum deploy ke production

> [!TIP]
> - Gunakan `npm run db:studio` untuk melihat & edit data via GUI
> - Gunakan `npm run test:check` untuk verifikasi sistem sebelum deploy
> - Dark mode toggle ada di navbar (ikon matahari/bulan yang animasi)

---

## 👥 Tim Pengembang

<div align="center">

**KKN Angkatan XXI Tahun 2026**

| Nama | NIM | Peran |
|:-----|:---:|:------|
| **Muhammad Ashab Ibnu Abdul Aziz** | `231240001399` | Developer & Programmer |

📍 Desa Pulodarat, Kec. Pecangaan, Kab. Jepara, Jawa Tengah

</div>

---

<div align="center">

### ⭐ Jika project ini bermanfaat, beri bintang di GitHub!

[![GitHub Stars](https://img.shields.io/github/stars/Abibsa/sidesa-pulodarat?style=social)](https://github.com/Abibsa/sidesa-pulodarat)

**Selamat menggunakan SIDESA!** 🏘️✨<br/>
*Transparan • Informatif • Melayani*

</div>
]]>
