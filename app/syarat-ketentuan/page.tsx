import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — SIDESA Desa Pulodarat",
  description: "Syarat dan Ketentuan penggunaan layanan Sistem Informasi Desa (SIDESA) Desa Pulodarat, Kecamatan Pecangaan, Kabupaten Jepara.",
}

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-200 hover:text-white transition-colors text-sm font-medium mb-4 inline-block">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Syarat &amp; Ketentuan</h1>
          <p className="text-blue-100 mt-2">Terakhir diperbarui: Juli 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground">1. Ketentuan Umum</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dengan mengakses dan menggunakan layanan SIDESA (Sistem Informasi Desa) Desa 
              Pulodarat, Anda dianggap telah membaca, memahami, dan menyetujui syarat dan 
              ketentuan yang berlaku. Layanan ini disediakan oleh Pemerintah Desa Pulodarat 
              untuk memudahkan pelayanan administrasi kepada warga.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">2. Penggunaan Layanan</h2>
            <p className="text-muted-foreground leading-relaxed">
              Layanan SIDESA mencakup:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Pengajuan surat keterangan dan dokumen administrasi desa secara online</li>
              <li>Pemantauan status pengajuan surat</li>
              <li>Akses informasi publik desa (berita, profil, potensi desa)</li>
              <li>Data statistik kependudukan desa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">3. Kewajiban Pengguna</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sebagai pengguna layanan SIDESA, Anda wajib:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Memberikan informasi yang benar, akurat, dan lengkap dalam setiap pengajuan</li>
              <li>Tidak menyalahgunakan layanan untuk kepentingan yang melanggar hukum</li>
              <li>Menjaga kerahasiaan nomor tiket pengajuan</li>
              <li>Mengambil dokumen yang telah selesai diproses dalam waktu yang ditentukan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">4. Proses Pengajuan Surat</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ketentuan terkait pengajuan surat melalui SIDESA:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Pengajuan surat dilakukan secara online melalui form yang telah disediakan</li>
              <li>Setiap pengajuan akan mendapatkan nomor tiket untuk pelacakan status</li>
              <li>Waktu pemrosesan surat maksimal 3 hari kerja sejak pengajuan diterima</li>
              <li>Pengambilan dokumen fisik dilakukan di Kantor Desa Pulodarat pada jam pelayanan</li>
              <li>Pemerintah Desa berhak menolak pengajuan yang tidak memenuhi persyaratan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">5. Batasan Tanggung Jawab</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pemerintah Desa Pulodarat berupaya menjaga ketersediaan layanan SIDESA, namun 
              tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan. Pemerintah Desa 
              tidak bertanggung jawab atas kerugian yang timbul akibat gangguan teknis, pemeliharaan 
              sistem, atau keadaan di luar kendali.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">6. Perubahan Syarat &amp; Ketentuan</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pemerintah Desa Pulodarat berhak mengubah Syarat &amp; Ketentuan ini sewaktu-waktu. 
              Perubahan akan diinformasikan melalui website resmi desa. Penggunaan layanan 
              setelah perubahan dianggap sebagai persetujuan atas perubahan tersebut.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">7. Kontak</h2>
            <p className="text-muted-foreground leading-relaxed">
              Untuk pertanyaan lebih lanjut mengenai Syarat &amp; Ketentuan ini, silakan hubungi 
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
