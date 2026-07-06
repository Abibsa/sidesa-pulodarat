import { PrismaClient, UserRole, Gender, MaritalStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Mulai seeding database...')
  await prisma.$connect()
  
  console.log('🔄 Menghangatkan koneksi database...')
  await prisma.user.count().catch(() => 0)
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 1. Create Users
  console.log('👤 Membuat user admin...')
  const hashedPassword = await hash('admin123', 10)
  
  await prisma.user.deleteMany({
    where: { email: { in: ['superadmin@desa.id', 'operator@desa.id', 'kepala@desa.id'] } }
  })
  
  await prisma.user.createMany({
    data: [
      {
        email: 'superadmin@desa.id',
        name: 'Super Admin',
        password: hashedPassword,
        role: UserRole.SUPERADMIN
      },
      {
        email: 'operator@desa.id',
        name: 'Operator Desa',
        password: hashedPassword,
        role: UserRole.OPERATOR
      },
      {
        email: 'kepala@desa.id',
        name: 'Kepala Desa',
        password: hashedPassword,
        role: UserRole.KEPALA_DESA
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ User berhasil dibuat')

  // 2. Create Village Profile
  console.log('🏘️  Membuat profil desa...')
  await prisma.villageProfile.deleteMany({})
  await prisma.villageProfile.create({
    data: {
      id: 'default',
      villageName: 'Desa Pulodarat',
      kecamatan: 'Pecangaan',
      kabupaten: 'Kabupaten Jepara',
      provinsi: 'Jawa Tengah',
      history: 'Desa Pulodarat merupakan salah satu desa di Kecamatan Pecangaan, Kabupaten Jepara, Provinsi Jawa Tengah. Desa ini memiliki letak yang strategis di jalur penghubung wilayah Pecangaan dan berkembang sebagai kawasan permukiman, perdagangan, serta industri mebel dan UMKM. Pemerintah desa terus berupaya meningkatkan kualitas pelayanan publik melalui pembangunan dan digitalisasi pelayanan kepada masyarakat.',
      vision: '[Belum dipublikasikan secara resmi]',
      mission: '[Belum dipublikasikan secara resmi]',
      address: 'Jl. Lingkar Pecangaan, RW 02, Desa Pulodarat, Kecamatan Pecangaan, Kabupaten Jepara, Jawa Tengah 59462. Balai Desa Pulodarat',
      phone: '[Belum dipublikasikan]',
      email: '[Belum dipublikasikan]',
      officeHours: 'Senin - Sabtu, 08:00 - 16:00 WIB',
      heroTitle: 'Selamat Datang di Website Resmi Desa Pulodarat',
      heroSubtitle: 'Transparan • Informatif • Melayani',
      chiefName: 'Akhmad Burnadi',
      chiefGreeting: 'Assalamu\'alaikum warahmatullahi wabarakatuh. Selamat datang di website resmi Desa Pulodarat. Kami berkomitmen untuk memberikan pelayanan publik yang berkualitas demi kesejahteraan warga.'
    }
  })

  console.log('✅ Profil desa berhasil dibuat')

  // 3. Create Village Officers
  console.log('👥 Membuat struktur organisasi...')
  await prisma.villageOfficer.createMany({
    data: [
      { name: 'Akhmad Burnadi', position: 'Kepala Desa (Petinggi)', order: 1 },
      { name: '[Nama Lengkap Carik]', position: 'Sekretaris Desa (Carik)', order: 2 },
      { name: '[Nama Kaur Keuangan]', position: 'Kaur Keuangan', order: 3 },
      { name: '[Nama Kaur Umum]', position: 'Kaur Umum', order: 4 },
      { name: '[Nama Kasi Pemerintahan]', position: 'Kasi Pemerintahan', order: 5 }
    ],
    skipDuplicates: true
  })

  console.log('✅ Struktur organisasi berhasil dibuat')

  // 4. Create Residents
  console.log('🧑‍🤝‍🧑 Membuat data penduduk...')
  await prisma.resident.createMany({
    data: [
      {
        nik: '3301010101900001',
        kk: '3301011234567890',
        name: 'Ahmad Rizki',
        gender: Gender.LAKI_LAKI,
        birthDate: new Date('1990-01-01'),
        birthPlace: 'Jakarta',
        address: 'Jl. Mawar No. 1',
        rt: '001',
        rw: '001',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Islam',
        maritalStatus: MaritalStatus.KAWIN,
        occupation: 'Wiraswasta',
        education: 'SMA/Sederajat'
      },
      {
        nik: '3301010202850002',
        kk: '3301011234567890',
        name: 'Siti Nurhaliza',
        gender: Gender.PEREMPUAN,
        birthDate: new Date('1985-02-02'),
        birthPlace: 'Bandung',
        address: 'Jl. Mawar No. 1',
        rt: '001',
        rw: '001',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Islam',
        maritalStatus: MaritalStatus.KAWIN,
        occupation: 'Ibu Rumah Tangga',
        education: 'SMA/Sederajat'
      },
      {
        nik: '3301010303950003',
        kk: '3301012345678901',
        name: 'Budi Santoso',
        gender: Gender.LAKI_LAKI,
        birthDate: new Date('1995-03-03'),
        birthPlace: 'Semarang',
        address: 'Jl. Melati No. 5',
        rt: '002',
        rw: '001',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Kristen',
        maritalStatus: MaritalStatus.BELUM_KAWIN,
        occupation: 'Karyawan Swasta',
        education: 'S1'
      },
      {
        nik: '3301010404920004',
        kk: '3301012345678902',
        name: 'Dewi Lestari',
        gender: Gender.PEREMPUAN,
        birthDate: new Date('1992-04-04'),
        birthPlace: 'Yogyakarta',
        address: 'Jl. Anggrek No. 10',
        rt: '003',
        rw: '002',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Islam',
        maritalStatus: MaritalStatus.KAWIN,
        occupation: 'Guru',
        education: 'S1'
      },
      {
        nik: '3301010505880005',
        kk: '3301012345678903',
        name: 'Eko Prasetyo',
        gender: Gender.LAKI_LAKI,
        birthDate: new Date('1988-05-05'),
        birthPlace: 'Surabaya',
        address: 'Jl. Dahlia No. 15',
        rt: '001',
        rw: '002',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Islam',
        maritalStatus: MaritalStatus.KAWIN,
        occupation: 'Petani',
        education: 'SMP/Sederajat'
      },
      {
        nik: '3301010606870006',
        kk: '3301012345678904',
        name: 'Fitri Handayani',
        gender: Gender.PEREMPUAN,
        birthDate: new Date('1987-06-06'),
        birthPlace: 'Malang',
        address: 'Jl. Kenanga No. 20',
        rt: '002',
        rw: '002',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Islam',
        maritalStatus: MaritalStatus.CERAI_HIDUP,
        occupation: 'Pedagang',
        education: 'SMA/Sederajat'
      },
      {
        nik: '3301010707000007',
        kk: '3301012345678905',
        name: 'Gilang Ramadhan',
        gender: Gender.LAKI_LAKI,
        birthDate: new Date('2000-07-07'),
        birthPlace: 'Solo',
        address: 'Jl. Tulip No. 25',
        rt: '003',
        rw: '003',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Islam',
        maritalStatus: MaritalStatus.BELUM_KAWIN,
        occupation: 'Mahasiswa',
        education: 'SMA/Sederajat'
      },
      {
        nik: '3301010808980008',
        kk: '3301012345678906',
        name: 'Hani Kusuma',
        gender: Gender.PEREMPUAN,
        birthDate: new Date('1998-08-08'),
        birthPlace: 'Medan',
        address: 'Jl. Sakura No. 30',
        rt: '001',
        rw: '003',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Buddha',
        maritalStatus: MaritalStatus.BELUM_KAWIN,
        occupation: 'Desainer',
        education: 'S1'
      },
      {
        nik: '3301010909750009',
        kk: '3301012345678907',
        name: 'Imam Nugroho',
        gender: Gender.LAKI_LAKI,
        birthDate: new Date('1975-09-09'),
        birthPlace: 'Palembang',
        address: 'Jl. Cempaka No. 35',
        rt: '002',
        rw: '003',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Islam',
        maritalStatus: MaritalStatus.KAWIN,
        occupation: 'PNS',
        education: 'S1'
      },
      {
        nik: '3301011010960010',
        kk: '3301012345678908',
        name: 'Jihan Aulia',
        gender: Gender.PEREMPUAN,
        birthDate: new Date('1996-10-10'),
        birthPlace: 'Makassar',
        address: 'Jl. Bougenville No. 40',
        rt: '003',
        rw: '001',
        kelurahan: 'Desa PULODARAT',
        kecamatan: 'Kecamatan Sentral',
        religion: 'Islam',
        maritalStatus: MaritalStatus.BELUM_KAWIN,
        occupation: 'Perawat',
        education: 'D3'
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Data penduduk berhasil dibuat')

  // 5. Create Letter Types
  console.log('📄 Membuat jenis surat...')
  await prisma.letterType.createMany({
    data: [
      {
        name: 'Surat Keterangan Domisili',
        code: 'SKD',
        description: 'Surat keterangan untuk menerangkan domisili seseorang',
        formFields: JSON.stringify([
          { name: 'alamat_lengkap', label: 'Alamat Lengkap', type: 'textarea', required: true },
          { name: 'keperluan', label: 'Keperluan', type: 'text', required: true }
        ])
      },
      {
        name: 'Surat Keterangan Tidak Mampu',
        code: 'SKTM',
        description: 'Surat keterangan untuk menerangkan ketidakmampuan ekonomi',
        formFields: JSON.stringify([
          { name: 'penghasilan', label: 'Penghasilan per Bulan', type: 'text', required: true },
          { name: 'tanggungan', label: 'Jumlah Tanggungan', type: 'number', required: true },
          { name: 'keperluan', label: 'Keperluan', type: 'text', required: true }
        ])
      },
      {
        name: 'Surat Pengantar KTP/KK',
        code: 'SP-KTP',
        description: 'Surat pengantar untuk pembuatan KTP atau Kartu Keluarga',
        formFields: JSON.stringify([
          { name: 'jenis_permohonan', label: 'Jenis Permohonan', type: 'select', options: ['KTP Baru', 'KK Baru', 'Perubahan KTP', 'Perubahan KK'], required: true },
          { name: 'alasan', label: 'Alasan', type: 'textarea', required: true }
        ])
      },
      {
        name: 'Surat Keterangan Usaha',
        code: 'SKU',
        description: 'Surat keterangan untuk menerangkan kepemilikan usaha',
        formFields: JSON.stringify([
          { name: 'nama_usaha', label: 'Nama Usaha', type: 'text', required: true },
          { name: 'jenis_usaha', label: 'Jenis Usaha', type: 'text', required: true },
          { name: 'alamat_usaha', label: 'Alamat Usaha', type: 'textarea', required: true },
          { name: 'tahun_berdiri', label: 'Tahun Berdiri', type: 'number', required: true }
        ])
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Jenis surat berhasil dibuat')

  // 6. Create News
  console.log('📰 Membuat berita...')
  await prisma.news.createMany({
    data: [
      {
        title: 'Peluncuran Sistem Pelayanan Online Desa PULODARAT',
        slug: 'peluncuran-sistem-pelayanan-online',
        excerpt: 'Desa PULODARAT meluncurkan sistem pelayanan online untuk memudahkan warga dalam mengurus administrasi.',
        content: 'Dalam rangka meningkatkan kualitas pelayanan kepada masyarakat, Pemerintah Desa PULODARAT meluncurkan sistem pelayanan online. Melalui sistem ini, warga dapat mengajukan berbagai jenis surat keterangan secara online tanpa perlu datang ke kantor desa.\n\nKepala Desa PULODARAT, H. Ahmad Dahlan, S.Sos menyampaikan bahwa sistem ini diharapkan dapat mempercepat proses pelayanan dan mengurangi antrian di kantor desa. "Dengan sistem online ini, warga bisa mengajukan surat dari rumah dan tinggal mengambil hasilnya di kantor desa," ujarnya.\n\nSistem ini dapat diakses melalui website resmi desa 24 jam sehari.',
        category: 'Pengumuman',
        author: 'Admin Desa'
      },
      {
        title: 'Musyawarah Desa Pembahasan APBDes 2026',
        slug: 'musyawarah-desa-apbdes-2026',
        excerpt: 'Pemerintah Desa mengadakan musyawarah desa untuk membahas Anggaran Pendapatan dan Belanja Desa tahun 2026.',
        content: 'Pemerintah Desa PULODARAT menggelar Musyawarah Desa (Musdes) untuk membahas Rancangan Anggaran Pendapatan dan Belanja Desa (APBDes) tahun anggaran 2026. Kegiatan ini dihadiri oleh perangkat desa, BPD, tokoh masyarakat, dan perwakilan dari berbagai unsur masyarakat.\n\nDalam musyawarah tersebut, dibahas berbagai program prioritas yang akan dilaksanakan di tahun 2026, termasuk pembangunan infrastruktur, pemberdayaan masyarakat, dan peningkatan layanan publik.\n\nKepala Desa menekankan pentingnya partisipasi masyarakat dalam perencanaan pembangunan desa untuk mewujudkan desa yang lebih maju dan sejahtera.',
        category: 'Kegiatan',
        author: 'Admin Desa'
      },
      {
        title: 'Program KKN Universitas Bantu Digitalisasi Desa',
        slug: 'program-kkn-digitalisasi-desa',
        excerpt: 'Mahasiswa KKN dari universitas lokal membantu proses digitalisasi administrasi dan pelayanan desa.',
        content: 'Desa PULODARAT kedatangan mahasiswa Kuliah Kerja Nyata (KKN) dari universitas setempat. Para mahasiswa ini membawa program digitalisasi administrasi dan pelayanan desa.\n\nSelama program KKN, mahasiswa memberikan pelatihan kepada perangkat desa tentang penggunaan sistem pelayanan online dan membantu migrasi data administrasi ke sistem digital.\n\n"Kami sangat terbantu dengan kehadiran mahasiswa KKN. Mereka tidak hanya membawa sistem, tapi juga melatih kami cara menggunakannya," ungkap salah satu perangkat desa.\n\nProgram ini diharapkan dapat meningkatkan efisiensi dan transparansi dalam pengelolaan administrasi desa.',
        category: 'Kegiatan',
        author: 'Admin Desa'
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Berita berhasil dibuat')

  // 7. Create Village Potentials
  console.log('🌾 Membuat data potensi desa...')
  await prisma.villagePotential.createMany({
    data: [
      {
        title: 'Industri Furniture dan Mebel Jepara',
        category: 'UMKM',
        description: 'Sebagian masyarakat bekerja pada industri furniture, ukiran, dan mebel yang menjadi salah satu sektor ekonomi unggulan Kabupaten Jepara.',
        contactInfo: 'Paguyuban Pengrajin Pulodarat'
      },
      {
        title: 'UMKM',
        category: 'UMKM',
        description: 'Masyarakat mengembangkan berbagai usaha mikro seperti perdagangan, kuliner, jasa, serta industri rumah tangga yang menopang perekonomian desa.',
        contactInfo: 'Pusat Oleh-Oleh Pulodarat'
      },
      {
        title: 'Perdagangan dan Jasa',
        category: 'Perdagangan',
        description: 'Lokasi desa yang berada di kawasan Kecamatan Pecangaan menjadikan aktivitas perdagangan dan jasa berkembang cukup pesat.',
        contactInfo: 'BUMDes Pulodarat'
      }
    ],
    skipDuplicates: true
  })

  console.log('✅ Potensi desa berhasil dibuat')

  console.log('\n🎉 Seeding selesai!')
  console.log('\n📝 Login credentials:')
  console.log('   Superadmin: superadmin@desa.id / admin123')
  console.log('   Operator: operator@desa.id / admin123')
  console.log('   Kepala Desa: kepala@desa.id / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
