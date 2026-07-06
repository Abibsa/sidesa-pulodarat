"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PublicNav from "@/components/PublicNav"
import { formatDate } from "@/lib/utils"
import { FileText, TrendingUp, Users, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [news, setNews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then(r => r.json()),
      fetch("/api/statistics").then(r => r.json()),
      fetch("/api/news?limit=3").then(r => r.json()),
    ]).then(([profileData, statsData, newsData]) => {
      setProfile(profileData)
      setStats(statsData)
      setNews(newsData.data || [])
      setIsLoading(false)
    }).catch((err) => {
      console.error(err)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              {profile?.heroTitle || "Selamat Datang di SIDESA"}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              {profile?.heroSubtitle || "Sistem Informasi Desa - Platform digital terpadu untuk pelayanan administrasi dan informasi terkini"}
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link href="/surat" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-white text-blue-700 hover:bg-blue-50 rounded-xl h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all">
                  <FileText className="w-5 h-5 mr-2" />
                  Ajukan Surat
                </Button>
              </Link>
              <Link href="/cek-status" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-700 rounded-xl h-14 px-8 text-lg">
                  Cek Status
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sambutan Kepala Desa */}
      {profile?.chiefGreeting && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-3 gap-12 items-center"
            >
              <div className="md:col-span-1">
                <div className="aspect-square bg-muted rounded-2xl mb-6 shadow-md overflow-hidden">
                  {/* Placeholder for Chief Image */}
                  <div className="w-full h-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                    <Users className="w-20 h-20 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-foreground">{profile.chiefName}</h3>
                <p className="text-primary text-center font-medium mt-1">Kepala Desa</p>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
                  Sambutan
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Sambutan Kepala Desa</h2>
                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                  {profile.chiefGreeting}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Statistik */}
      <section className="py-20 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Statistik Desa</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Data terkini mengenai kependudukan dan layanan di desa kami</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse"></div>
              ))
            ) : stats && (
              <>
                <Card className="rounded-2xl border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Total Penduduk</CardTitle>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
                      {stats.totals.residents}
                    </div>
                    <p className="text-muted-foreground font-medium">Jiwa terdaftar</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Pengajuan Surat</CardTitle>
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
                      {stats.totals.letters}
                    </div>
                    <p className="text-muted-foreground font-medium">Total pengajuan</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card sm:col-span-2 md:col-span-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Layanan Online</CardTitle>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">24/7</div>
                    <p className="text-muted-foreground font-medium">Akses kapan saja</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Berita Terbaru */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Berita Terbaru</h2>
              <p className="text-muted-foreground">Kabar terkini dan informasi penting seputar desa</p>
            </div>
            <Link href="/berita">
              <Button variant="outline" className="rounded-xl group">
                Lihat Semua Berita 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse"></div>
              ))
            ) : news.length > 0 ? (
              news.map((item) => (
                <Card key={item.id} className="rounded-2xl overflow-hidden border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-card">
                  <div className="h-48 bg-muted w-full relative">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                  </div>
                  <CardHeader className="flex-1">
                    <div className="text-sm font-medium text-primary mb-3">
                      {formatDate(item.publishedAt)}
                    </div>
                    <CardTitle className="line-clamp-2 text-xl leading-tight mb-2 hover:text-primary transition-colors">
                      <Link href={`/berita/${item.slug}`}>
                        {item.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base">
                      {item.excerpt || item.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                    </CardDescription>
                  </CardHeader>
                  <div className="p-6 pt-0 mt-auto">
                    <Link href={`/berita/${item.slug}`}>
                      <Button variant="ghost" className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:bg-transparent group">
                        Baca selengkapnya 
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Belum ada berita terbaru.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Butuh Layanan Administrasi?
            </h2>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Hemat waktu Anda! Ajukan surat keterangan secara online dari rumah, kapan saja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/surat" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-white text-primary hover:bg-slate-100 rounded-xl h-14 px-10 text-lg shadow-xl">
                  Mulai Pengajuan
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
            <div className="md:col-span-4 lg:col-span-5">
              <Link href="/" className="font-bold text-2xl text-white mb-6 block">
                SIDESA
              </Link>
              <p className="text-base leading-relaxed max-w-sm mb-6">
                Platform digital inovatif untuk pelayanan administrasi desa yang lebih cepat, transparan, dan mudah diakses oleh seluruh warga.
              </p>
            </div>
            
            <div className="md:col-span-4 lg:col-span-3">
              <h3 className="text-white font-semibold text-lg mb-6">Menu Navigasi</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/profil" className="hover:text-white transition-colors">Profil Desa</Link></li>
                <li><Link href="/berita" className="hover:text-white transition-colors">Berita Terkini</Link></li>
                <li><Link href="/potensi" className="hover:text-white transition-colors">Potensi & Produk</Link></li>
                <li><Link href="/kontak" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-4 lg:col-span-4">
              <h3 className="text-white font-semibold text-lg mb-6">Layanan Warga</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/surat" className="hover:text-white transition-colors flex items-center"><FileText className="w-4 h-4 mr-2"/> Ajukan Surat Online</Link></li>
                <li><Link href="/cek-status" className="hover:text-white transition-colors flex items-center"><TrendingUp className="w-4 h-4 mr-2"/> Cek Status Pengajuan</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors flex items-center"><Users className="w-4 h-4 mr-2"/> Login Admin SIDESA</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} SIDESA - {profile?.villageName || "Desa Digital"}. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
