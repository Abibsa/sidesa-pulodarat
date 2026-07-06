import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kebijakan Privasi — SIDESA Desa Pulodarat",
  description: "Kebijakan Privasi layanan Sistem Informasi Desa (SIDESA) Desa Pulodarat, Kecamatan Pecangaan, Kabupaten Jepara.",
}

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-200 hover:text-white transition-colors text-sm font-medium mb-4 inline-block">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Kebijakan Privasi</h1>
          <p className="text-blue-100 mt-2">Terakhir diperbarui: Juli 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground">1. Pendahuluan</h2>
            <p className="text-muted-foreground leading-relaxed">
              SIDESA (Sistem Informasi Desa) Desa Pulodarat berkomitmen untuk melindungi privasi 
              pengguna layanan kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, 
              menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform SIDESA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">2. Informasi yang Kami Kumpulkan</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dalam rangka memberikan pelayanan administrasi desa, kami dapat mengumpulkan informasi berikut:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Data identitas: Nama lengkap, NIK, nomor Kartu Keluarga</li>
              <li>Data kontak: Alamat, nomor telepon, email</li>
              <li>Data kependudukan: Tanggal lahir, tempat lahir, status perkawinan, pekerjaan, pendidikan</li>
              <li>Data pengajuan surat: Jenis surat, keperluan, dan dokumen pendukung</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">3. Penggunaan Informasi</h2>
            <p className="text-muted-foreground leading-relaxed">
              Informasi yang dikumpulkan digunakan untuk:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Memproses pengajuan surat dan layanan administrasi desa</li>
              <li>Mengelola data kependudukan desa sesuai peraturan yang berlaku</li>
              <li>Menghubungi Anda terkait status pengajuan layanan</li>
              <li>Meningkatkan kualitas pelayanan publik desa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">4. Perlindungan Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk 
              melindungi data pribadi Anda dari akses tidak sah, penggunaan yang tidak semestinya, 
              atau pengungkapan. Akses terhadap data kependudukan dibatasi hanya untuk petugas 
              desa yang berwenang.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">5. Hak Anda</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sebagai warga desa, Anda memiliki hak untuk:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Mengakses data pribadi Anda yang tersimpan di sistem desa</li>
              <li>Meminta perbaikan data yang tidak akurat</li>
              <li>Mengetahui bagaimana data Anda digunakan</li>
              <li>Mengajukan keluhan terkait pengelolaan data pribadi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">6. Kontak</h2>
            <p className="text-muted-foreground leading-relaxed">
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi 
              Pemerintah Desa Pulodarat melalui halaman{" "}
              <Link href="/kontak" className="text-primary hover:underline font-medium">
                Kontak
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
