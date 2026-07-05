"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PublicNav from "@/components/PublicNav"
import { formatDate } from "@/lib/utils"
import { FileText, TrendingUp, Users, Newspaper } from "lucide-react"

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [news, setNews] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then(r => r.json()),
      fetch("/api/statistics").then(r => r.json()),
      fetch("/api/news?limit=3").then(r => r.json()),
    ]).then(([profileData, statsData, newsData]) => {
      setProfile(profileData)
      setStats(statsData)
      setNews(newsData.data || [])
    }).catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              {profile?.heroTitle || "Selamat Datang di SIDESA"}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {profile?.heroSubtitle || "Sistem Informasi Desa - Platform digital untuk pelayanan administrasi dan informasi desa"}
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/surat">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <FileText className="w-5 h-5 mr-2" />
                  Ajukan Surat Online
                </Button>
              </Link>
              <Link href="/cek-status">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Cek Status Pengajuan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Desa */}
      {profile?.chiefGreeting && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold text-center">{profile.chiefName}</h3>
                <p className="text-gray-600 text-center">Kepala Desa</p>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold mb-4">Sambutan Kepala Desa</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.chiefGreeting}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Statistik */}
      {stats && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Statistik Desa</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Total Penduduk</CardTitle>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600">
                    {stats.totals.residents}
                  </div>
                  <p className="text-gray-600">Jiwa terdaftar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pengajuan Surat</CardTitle>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600">
                    {stats.totals.letters}
                  </div>
                  <p className="text-gray-600">Total pengajuan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Layanan Online</CardTitle>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-600">24/7</div>
                  <p className="text-gray-600">Akses kapan saja</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Berita Terbaru */}
      {news.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Berita Terbaru</h2>
              <Link href="/berita">
                <Button variant="outline">Lihat Semua</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-sm text-gray-600 mb-2">
                      {formatDate(item.publishedAt)}
                    </div>
                    <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {item.excerpt || item.content.substring(0, 150)}...
                    </CardDescription>
                    <Link href={`/berita/${item.slug}`}>
                      <Button variant="link" className="p-0">
                        Baca selengkapnya →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Butuh Layanan Administrasi?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Ajukan surat keterangan secara online tanpa perlu datang ke kantor desa
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/surat">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Ajukan Sekarang
              </Button>
            </Link>
            <Link href="/profil">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Tentang Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">SIDESA</h3>
              <p className="text-sm">
                Sistem Informasi Desa untuk pelayanan yang lebih cepat dan transparan
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Menu</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/profil" className="hover:text-white">Profil Desa</Link></li>
                <li><Link href="/berita" className="hover:text-white">Berita</Link></li>
                <li><Link href="/potensi" className="hover:text-white">Potensi Desa</Link></li>
                <li><Link href="/kontak" className="hover:text-white">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Layanan</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/surat" className="hover:text-white">Ajukan Surat</Link></li>
                <li><Link href="/cek-status" className="hover:text-white">Cek Status</Link></li>
                <li><Link href="/login" className="hover:text-white">Login Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 SIDESA - {profile?.villageName || "Desa"}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
