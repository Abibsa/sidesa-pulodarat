"use client"

import { useEffect, useState } from "react"
import PublicNav from "@/components/PublicNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function KontakPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground font-medium">
              {loading ? "Memuat Informasi..." : "Data tidak tersedia"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav />

      {/* Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Kontak Kami</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Hubungi kami untuk informasi lebih lanjut mengenai desa dan pelayanannya
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Informasi Kontak */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-border bg-card overflow-hidden">
                <div className="h-2 w-full bg-primary"></div>
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl mt-1">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-foreground">Alamat Kantor Desa</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {profile.address || "-"}
                        <br />
                        {profile.villageName}, {profile.kecamatan}
                        <br />
                        {profile.kabupaten}, {profile.provinsi}
                      </p>
                    </div>
                  </div>

                  {profile.phone && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mt-1">
                        <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-foreground">Telepon</h3>
                        <p className="text-muted-foreground">{profile.phone}</p>
                      </div>
                    </div>
                  )}

                  {profile.email && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl mt-1">
                        <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-foreground">Email</h3>
                        <p className="text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl mt-1">
                      <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-foreground">Jam Pelayanan Kantor</h3>
                      <p className="text-muted-foreground">
                        {profile.officeHours || "Senin - Jumat, 08:00 - 15:00"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-primary/5 border-primary/20 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Layanan Online 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Untuk pelayanan surat keterangan, Anda tidak perlu datang ke kantor desa. Gunakan layanan online kami kapan saja.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href="/surat"
                      className="group flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">Ajukan Surat Online</div>
                        <div className="text-sm text-muted-foreground">Buat permohonan surat keterangan</div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                      href="/cek-status"
                      className="group flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">Cek Status Pengajuan</div>
                        <div className="text-sm text-muted-foreground">Lacak status surat Anda</div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Peta */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="h-full min-h-[500px] flex flex-col shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Lokasi Peta</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-6 px-6">
                <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-border relative">
                  {profile.mapEmbedUrl ? (
                    <iframe
                      src={profile.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Peta belum tersedia</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-auto border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} SIDESA - {profile.villageName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
