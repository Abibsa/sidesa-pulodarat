import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await auth()
  
  // Get statistics
  const [residentCount, letterRequestCount, newsCount] = await Promise.all([
    db.resident.count(),
    db.letterRequest.count(),
    db.news.count()
  ])

  const pendingLetters = await db.letterRequest.count({
    where: { status: "DIAJUKAN" }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard Admin</h2>
        <p className="text-muted-foreground mt-1">
          Selamat datang, {session?.user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Penduduk</CardDescription>
            <CardTitle className="text-3xl">{residentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href="/admin/penduduk" 
              className="text-sm text-blue-600 hover:underline"
            >
              Lihat semua →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pengajuan Surat</CardDescription>
            <CardTitle className="text-3xl">{letterRequestCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href="/admin/surat" 
              className="text-sm text-blue-600 hover:underline"
            >
              Lihat semua →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Menunggu Proses</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{pendingLetters}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href="/admin/surat?status=DIAJUKAN" 
              className="text-sm text-blue-600 hover:underline"
            >
              Proses sekarang →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Berita</CardDescription>
            <CardTitle className="text-3xl">{newsCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link 
              href="/admin/berita" 
              className="text-sm text-blue-600 hover:underline"
            >
              Kelola berita →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Menu Utama</CardTitle>
            <CardDescription>Akses cepat ke fitur utama</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link 
              href="/admin/penduduk" 
              className="block p-3 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 border"
            >
              <div className="font-medium">Data Penduduk</div>
              <div className="text-sm text-muted-foreground">Kelola data penduduk desa</div>
            </Link>
            <Link 
              href="/admin/surat" 
              className="block p-3 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 border"
            >
              <div className="font-medium">Pengajuan Surat</div>
              <div className="text-sm text-muted-foreground">Proses pengajuan surat warga</div>
            </Link>
            <Link 
              href="/admin/statistik" 
              className="block p-3 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 border"
            >
              <div className="font-medium">Statistik</div>
              <div className="text-sm text-muted-foreground">Lihat statistik dan grafik</div>
            </Link>
            <Link 
              href="/admin/berita" 
              className="block p-3 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30 border"
            >
              <div className="font-medium">Berita</div>
              <div className="text-sm text-muted-foreground">Kelola berita dan pengumuman</div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi</CardTitle>
            <CardDescription>Status sistem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">Role Anda</span>
              <span className="text-sm font-medium">{session?.user.role}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{session?.user.email}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">Status Database</span>
              <span className="text-sm font-medium text-green-600">● Connected</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 Tip: Gunakan menu navigasi di atas untuk mengakses berbagai fitur admin.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
