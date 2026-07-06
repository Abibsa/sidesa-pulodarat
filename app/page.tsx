"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import PublicNav from "@/components/PublicNav"
import { formatDate } from "@/lib/utils"
import { useCountUp } from "@/lib/useCountUp"
import {
  FileText, TrendingUp, Users, ArrowRight, MapPin,
  Home, BarChart3, Camera, Search, Mail, Phone,
  Clock, ChevronLeft, ChevronRight, X, Landmark
} from "lucide-react"
import { motion } from "framer-motion"

// ─── Placeholder gallery images (replace with real photos later) ────
const GALLERY_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    title: "Pemandangan Persawahan Desa",
    category: "Alam",
  },
  {
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    title: "Gotong Royong Warga",
    category: "Kegiatan",
  },
  {
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
    title: "Musyawarah Desa",
    category: "Pemerintahan",
  },
  {
    src: "https://images.unsplash.com/photo-1588075592405-d3d4f0846961?w=800&q=80",
    title: "Produk UMKM Lokal",
    category: "Ekonomi",
  },
  {
    src: "https://images.unsplash.com/photo-1593100126453-19b562a800c1?w=800&q=80",
    title: "Kegiatan Posyandu",
    category: "Kesehatan",
  },
  {
    src: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80",
    title: "Pendidikan Anak Desa",
    category: "Pendidikan",
  },
]

// ─── Stat Card with count-up animation ──────────────────────────────
function StatCard({
  icon: Icon,
  iconClass,
  iconColor,
  label,
  value,
  suffix,
  delay,
}: {
  icon: React.ElementType
  iconClass: string
  iconColor: string
  label: string
  value: number
  suffix?: string
  delay: number
}) {
  const { count, ref } = useCountUp({ end: value, duration: 2200 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      ref={ref}
    >
      <Card className="card-premium rounded-2xl border-none shadow-lg bg-card overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3.5 rounded-2xl ${iconClass}`}>
              <Icon className={`w-7 h-7 ${iconColor}`} />
            </div>
          </div>
          <div className="text-4xl md:text-5xl font-extrabold text-foreground mb-1 tracking-tight">
            {count.toLocaleString("id-ID")}
            {suffix && <span className="text-2xl md:text-3xl text-muted-foreground ml-1">{suffix}</span>}
          </div>
          <p className="text-muted-foreground font-medium text-base">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────
export default function HomePage() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [news, setNews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  // Fetch data
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

  // Parallax scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lightbox navigation
  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % GALLERY_ITEMS.length)
  }, [])

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)
  }, [])

  // Framer motion fade-in-up variant
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* ════════════════════════════════════════════════════════════
          HERO SECTION — Photo Background + Parallax
          ════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="hero-section text-white">
        {/* Background Image with Parallax */}
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=85"
          alt="Pemandangan Desa Pulodarat"
          fill
          priority
          sizes="100vw"
          className="hero-bg-image"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />

        {/* Dark overlay */}
        <div className="hero-overlay" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-[1]" />

        {/* Content */}
        <div className="hero-content w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium"
            >
              <Landmark className="w-4 h-4" />
              Desa Pulodarat, Kec. Pecangaan, Kab. Jepara
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg">
              {profile?.heroTitle || "Selamat Datang di Desa Pulodarat"}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto drop-shadow-md">
              {profile?.heroSubtitle || "Sistem Informasi Desa - Platform digital terpadu untuk pelayanan administrasi dan informasi terkini Desa Pulodarat"}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Link href="/surat" className="w-full sm:w-auto">
                <Button size="lg" className="btn-glow-white w-full bg-white text-blue-700 hover:bg-blue-50 rounded-xl h-14 px-8 text-lg shadow-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Ajukan Surat
                </Button>
              </Link>
              <Link href="/cek-status" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="btn-glow-outline w-full border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-700 rounded-xl h-14 px-8 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Cek Status
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SAMBUTAN KEPALA DESA
          ════════════════════════════════════════════════════════════ */}
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
                <div className="section-badge mb-2">
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

      {/* ════════════════════════════════════════════════════════════
          STATISTIK DESA — 4-Column Grid + Counting Animation
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <div className="flex justify-center mb-4">
              <span className="section-badge">
                <BarChart3 className="w-4 h-4" />
                Data Terkini
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Statistik Desa</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Data terkini mengenai kependudukan dan layanan di Desa Pulodarat
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
              ))
            ) : stats && stats.totals ? (
              <>
                <StatCard
                  icon={Users}
                  iconClass="stat-icon-blue"
                  iconColor="text-blue-600 dark:text-blue-400"
                  label="Jiwa Terdaftar"
                  value={stats.totals.residents || 0}
                  delay={0}
                />
                <StatCard
                  icon={Home}
                  iconClass="stat-icon-emerald"
                  iconColor="text-emerald-600 dark:text-emerald-400"
                  label="Kepala Keluarga"
                  value={stats.totals.families || 0}
                  delay={0.1}
                />
                <StatCard
                  icon={FileText}
                  iconClass="stat-icon-amber"
                  iconColor="text-amber-600 dark:text-amber-400"
                  label="Total Pengajuan Surat"
                  value={stats.totals.letters || 0}
                  delay={0.2}
                />
                <StatCard
                  icon={MapPin}
                  iconClass="stat-icon-purple"
                  iconColor="text-purple-600 dark:text-purple-400"
                  label="RT / RW Tercatat"
                  value={stats.totals.rtCount || 0}
                  suffix={`/ ${stats.totals.rwCount || 0}`}
                  delay={0.3}
                />
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          BERITA TERBARU
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <div className="section-badge mb-3">
                <FileText className="w-4 h-4" />
                Informasi
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Berita Terbaru</h2>
              <p className="text-muted-foreground text-lg">Kabar terkini dan informasi penting seputar desa</p>
            </div>
            <Link href="/berita">
              <Button variant="outline" className="btn-glow-primary rounded-xl group">
                Lihat Semua Berita
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
              ))
            ) : news.length > 0 ? (
              news.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="card-premium rounded-2xl overflow-hidden border-border shadow-sm flex flex-col h-full bg-card">
                    <div className="h-48 bg-muted w-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20" />
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold backdrop-blur-sm">
                          {item.category || "Umum"}
                        </span>
                      </div>
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
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Belum ada berita terbaru.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          GALERI DESA — Photo Grid + Lightbox
          ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <div className="flex justify-center mb-4">
              <span className="section-badge">
                <Camera className="w-4 h-4" />
                Dokumentasi
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Galeri Desa</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Dokumentasi kegiatan dan potensi Desa Pulodarat
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {GALLERY_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`gallery-item relative ${idx === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                onClick={() => openLightbox(idx)}
              >
                <div className={`relative w-full overflow-hidden rounded-2xl ${idx === 0 ? "aspect-[4/3] md:aspect-square" : "aspect-[4/3]"}`}>
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes={idx === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                    className="object-cover"
                  />
                  <div className="gallery-overlay flex items-end p-4 md:p-6">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-2 inline-block">
                        {item.category}
                      </span>
                      <p className="text-white font-semibold text-sm md:text-lg drop-shadow-lg">{item.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 bg-black/95 border-none rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">
            {GALLERY_ITEMS[lightboxIndex]?.title}
          </DialogTitle>
          <div className="relative w-full aspect-video">
            <Image
              src={GALLERY_ITEMS[lightboxIndex]?.src || ""}
              alt={GALLERY_ITEMS[lightboxIndex]?.title || ""}
              fill
              sizes="95vw"
              className="object-contain"
            />

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-2 inline-block">
                {GALLERY_ITEMS[lightboxIndex]?.category}
              </span>
              <p className="text-white font-semibold text-lg">
                {GALLERY_ITEMS[lightboxIndex]?.title}
              </p>
              <p className="text-white/60 text-sm mt-1">
                {lightboxIndex + 1} / {GALLERY_ITEMS.length}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════
          CTA SECTION
          ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
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
                <Button size="lg" className="btn-glow-white w-full bg-white text-primary hover:bg-slate-100 rounded-xl h-14 px-10 text-lg shadow-xl">
                  Mulai Pengajuan
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER — Enhanced with full contact info & social links
          ════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand + Description */}
            <div className="md:col-span-4 lg:col-span-4">
              <Link href="/" className="font-bold text-2xl text-white mb-6 block">
                SIDESA
              </Link>
              <p className="text-base leading-relaxed max-w-sm mb-6">
                Platform digital inovatif untuk pelayanan administrasi desa yang lebih cepat, transparan, dan mudah diakses oleh seluruh warga.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                <a href="#" className="social-icon" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="YouTube">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s-.002 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s.002-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2 lg:col-span-2">
              <h3 className="text-white font-semibold text-lg mb-6">Navigasi</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/profil" className="hover:text-white transition-colors">Profil Desa</Link></li>
                <li><Link href="/berita" className="hover:text-white transition-colors">Berita Terkini</Link></li>
                <li><Link href="/potensi" className="hover:text-white transition-colors">Potensi & Produk</Link></li>
                <li><Link href="/kontak" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="md:col-span-3 lg:col-span-3">
              <h3 className="text-white font-semibold text-lg mb-6">Layanan Warga</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/surat" className="hover:text-white transition-colors flex items-center"><FileText className="w-4 h-4 mr-2"/> Ajukan Surat Online</Link></li>
                <li><Link href="/cek-status" className="hover:text-white transition-colors flex items-center"><TrendingUp className="w-4 h-4 mr-2"/> Cek Status Pengajuan</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors flex items-center"><Users className="w-4 h-4 mr-2"/> Login Admin SIDESA</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-3 lg:col-span-3">
              <h3 className="text-white font-semibold text-lg mb-6">Kontak Desa</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{profile?.address || "Desa Pulodarat, Kec. Pecangaan, Kab. Jepara, Jawa Tengah"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span>{profile?.phone || "(Belum dipublikasikan)"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span>{profile?.email || "(Belum dipublikasikan)"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
                  <span>{profile?.officeHours || "Senin - Jumat, 08:00 - 15:00"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} SIDESA - {profile?.villageName || "Desa Pulodarat"}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
              <Link href="/syarat-ketentuan" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
