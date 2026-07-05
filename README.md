# SIDESA - Sistem Informasi Desa

Aplikasi web full-stack untuk kebutuhan program KKN yang menggabungkan profil desa publik, sistem pengajuan surat online, manajemen data penduduk, dan dashboard statistik desa.

## ⚡ QUICK START - Baca Ini Dulu!

**🚨 PENTING: File `.env` Anda masih menggunakan database default!**

**→ BUKA FILE: [MULAI_DISINI.md](./MULAI_DISINI.md)** untuk panduan setup lengkap.

Program **tidak akan jalan** sampai Anda:
1. Daftar database di Neon.tech (gratis, 2 menit)
2. Copy connection string ke file `.env`
3. Jalankan `npx prisma db push` dan `npm run db:seed`

📖 **Dokumentasi Setup:**
- **[MULAI_DISINI.md](./MULAI_DISINI.md)** ← **BACA INI DULU!**
- **[QUICK_START.md](./QUICK_START.md)** - Setup 5 menit
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Setup detail

---

## 🎯 Tujuan Project

Project ini dibuat untuk mendukung 2 program kerja KKN:
1. **Digitalisasi Administrasi Desa** - Sistem pelayanan surat online
2. **Pelatihan Perangkat Desa** - Melatih penggunaan sistem digital

## ✨ Fitur Utama

### 🌐 Website Publik (Tanpa Login)
- ✅ Beranda dengan hero section & sambutan kepala desa
- ✅ Profil Desa (sejarah, visi-misi, struktur organisasi)
- ✅ Berita & Pengumuman dengan kategori
- ✅ Potensi Desa (UMKM, pariwisata, produk unggulan)
- ✅ Kontak & Peta lokasi
- ✅ **Pengajuan Surat Online** (fitur inti untuk warga)
- ✅ **Cek Status Pengajuan** dengan nomor tiket/NIK
- ✅ Responsive mobile-first design
- ✅ SEO-friendly

### 📋 Pelayanan Surat Online (Publik → Admin)
- ✅ Warga ajukan surat tanpa perlu akun (cukup NIK)
- ✅ 4 jenis surat tersedia:
  - Surat Keterangan Domisili
  - Surat Keterangan Tidak Mampu (SKTM)
  - Surat Pengantar KTP/KK
  - Surat Keterangan Usaha
- ✅ Form dinamis per jenis surat
- ✅ Upload lampiran (KTP/KK)
- ✅ Nomor tiket otomatis untuk tracking
- ✅ Status tracking: Diajukan → Diproses → Selesai/Ditolak
- ✅ Admin dashboard untuk memproses pengajuan
- ✅ Catatan admin untuk pemohon
- ✅ Filter & search pengajuan

### 👥 Manajemen Data Penduduk (Admin Only)
- ✅ CRUD data penduduk lengkap (NIK, KK, biodata, RT/RW, dll)
- ✅ Import CSV/Excel untuk bulk upload
- ✅ Search & filter (by NIK, nama, RT/RW, jenis kelamin)
- ✅ Pagination untuk performa optimal
- ✅ Validasi data dengan Zod

### 📊 Dashboard Statistik (Admin + Ringkasan Publik)
- ✅ Visualisasi dengan Recharts (pie, bar, line charts)
- ✅ Statistik penduduk:
  - Per jenis kelamin
  - Per kelompok usia
  - Per RT/RW
  - Per tingkat pendidikan
  - Per mata pencaharian
  - Per status perkawinan
- ✅ Statistik pengajuan surat per bulan
- ✅ Data real-time dari database

### 🔐 Autentikasi & Authorization
- ✅ NextAuth.js dengan credentials provider
- ✅ 3 role: SUPERADMIN, OPERATOR, KEPALA_DESA
- ✅ Password hashing dengan bcryptjs
- ✅ JWT session-based
- ✅ Protected routes dengan middleware
- ✅ Login page dengan error handling

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts (visualisasi data)
- Lucide React (icons)

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js

**Deployment:**
- Vercel (serverless-ready)
- Neon/Supabase (database)

## 📁 Struktur Project

```
sidesa/
├── app/
│   ├── (public)/              # Website publik
│   │   ├── page.tsx           # Homepage
│   │   ├── profil/            # Profil desa
│   │   ├── berita/            # Berita & detail
│   │   ├── potensi/           # Potensi desa
│   │   ├── kontak/            # Kontak
│   │   ├── surat/             # Ajukan surat online
│   │   └── cek-status/        # Tracking pengajuan
│   ├── admin/                 # Admin panel (protected)
│   │   ├── page.tsx           # Dashboard admin
│   │   ├── penduduk/          # CRUD data penduduk
│   │   ├── surat/             # Kelola pengajuan surat
│   │   └── statistik/         # Dashboard statistik
│   ├── login/                 # Halaman login
│   └── api/                   # API routes
│       ├── residents/         # CRUD penduduk + import
│       ├── letters/           # Kelola surat & tracking
│       ├── statistics/        # Data statistik
│       ├── profile/           # Profil desa
│       ├── officers/          # Struktur organisasi
│       ├── news/              # Berita
│       └── potentials/        # Potensi desa
├── components/
│   ├── ui/                    # Komponen UI (shadcn/ui)
│   └── PublicNav.tsx          # Navigation publik
├── lib/
│   ├── db.ts                  # Prisma client
│   └── utils.ts               # Utility functions
├── prisma/
│   ├── schema.prisma          # Database schema (8 models)
│   └── seed.ts                # Seed data dummy
├── auth.ts                    # NextAuth config
├── middleware.ts              # Route protection
├── .env.example               # Environment template
├── README.md                  # Dokumentasi utama
├── SETUP_GUIDE.md             # Panduan setup detail
├── DEPLOYMENT.md              # Panduan deploy ke Vercel
└── PANDUAN_PELATIHAN_PERANGKAT_DESA.md  # Materi pelatihan
```

## 🗄️ Database Schema

### 8 Models Prisma:

1. **User** - Admin sistem (3 roles)
2. **Resident** - Data penduduk lengkap
3. **LetterType** - Jenis surat dengan form dinamis (JSON)
4. **LetterRequest** - Pengajuan surat + tracking
5. **News** - Berita & artikel
6. **VillageProfile** - Profil desa (singleton)
7. **VillageOfficer** - Struktur organisasi
8. **VillagePotential** - Potensi desa (UMKM, wisata)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
copy .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[generate dengan: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"]"
NEXT_PUBLIC_APP_NAME="SIDESA"
NEXT_PUBLIC_VILLAGE_NAME="Desa PULODARAT"
```

### 3. Setup Database
```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema ke database
npm run db:seed        # Seed data dummy
```

### 4. Run Development Server
```bash
npm run dev
```

Buka http://localhost:3000

## 🔑 Login Credentials (Setelah Seed)

| Email | Password | Role |
|-------|----------|------|
| superadmin@desa.id | admin123 | SUPERADMIN |
| operator@desa.id | admin123 | OPERATOR |
| kepala@desa.id | admin123 | KEPALA_DESA |

## 📦 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database commands
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Create migration (dev)
npm run db:push      # Push schema tanpa migration
npm run db:seed      # Seed data dummy
npm run db:studio    # Open Prisma Studio (GUI)
```

## 🌍 Deployment

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap deploy ke Vercel dengan Neon/Supabase.

**Ringkas:**
1. Setup database di Neon/Supabase
2. Push code ke GitHub
3. Import project di Vercel
4. Set environment variables
5. Deploy!

## 📚 Dokumentasi Lengkap

| File | Deskripsi |
|------|-----------|
| [README.md](./README.md) | Overview & quick start |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Setup detail step-by-step |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy ke production |
| [PANDUAN_PELATIHAN_PERANGKAT_DESA.md](./PANDUAN_PELATIHAN_PERANGKAT_DESA.md) | Materi pelatihan 2-3 jam |

## 🎓 Untuk Program KKN

### Proker 1: Digitalisasi Administrasi Desa
**Output:**
- ✅ Website desa dengan profil & berita
- ✅ Sistem pelayanan surat online 24/7
- ✅ Database penduduk terdigitalisasi
- ✅ Dashboard statistik real-time

### Proker 2: Pelatihan Penggunaan Aplikasi
**Materi (2-3 jam):**
1. Pengenalan SIDESA (15 menit)
2. Login & Dashboard (10 menit)
3. Mengelola Pengajuan Surat (45 menit) ⭐ INTI
4. Mengelola Data Penduduk (30 menit)
5. Dashboard Statistik (20 menit)
6. Tips & Troubleshooting (10 menit)

Lihat [PANDUAN_PELATIHAN_PERANGKAT_DESA.md](./PANDUAN_PELATIHAN_PERANGKAT_DESA.md)

## 🎯 Fitur Unggulan untuk Pelatihan

Modul **Pelayanan Surat Online** dirancang khusus untuk mudah dilatihkan:

✅ **Alur jelas**: Diajukan → Diproses → Selesai
✅ **UI intuitif**: Tombol & label bahasa Indonesia
✅ **Form sederhana**: Tidak perlu teknis
✅ **Catatan admin**: Komunikasi dengan pemohon
✅ **Tracking mudah**: Cukup nomor tiket/NIK

## 🔧 Troubleshooting

### Error: Cannot find module @prisma/client
```bash
npm run db:generate
```

### Error: Database connection failed
- Cek `DATABASE_URL` di `.env`
- Pastikan database online

### Error login
- Pastikan sudah run `npm run db:seed`
- Cek `NEXTAUTH_SECRET` di `.env`

### Port 3000 sudah dipakai
```bash
npm run dev -- -p 3001
```

## 📝 Seed Data

Setelah `npm run db:seed`, tersedia:
- **3 user admin** (superadmin, operator, kepala desa)
- **10 penduduk** dengan data realistis
- **4 jenis surat** (Domisili, SKTM, Pengantar KTP, Surat Usaha)
- **3 berita** tentang desa
- **1 profil desa** lengkap
- **5 struktur organisasi**
- **3 potensi desa** (UMKM, pertanian, wisata)

## 🚨 Important Notes

1. **Jangan commit file `.env`** - sudah ada di .gitignore
2. **Ganti password default** di production
3. **Backup database** secara berkala
4. **Test di local** sebelum deploy

## 🤝 Support

Untuk kendala teknis:
1. Cek dokumentasi di folder ini
2. Lihat error logs di console/terminal
3. Test dengan data seed terlebih dahulu

## 📄 License

Project ini dibuat untuk keperluan KKN Universitas.

## 👥 Tim Pengembang

Dibuat oleh Tim KKN Angkatan XXI Tahun 2026
- Divisi: [Nama Divisi]
- Lokasi: [Nama Desa]

---

**Selamat menggunakan SIDESA! Semoga bermanfaat untuk kemajuan desa.** 🎉
