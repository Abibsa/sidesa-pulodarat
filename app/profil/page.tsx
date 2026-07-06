"use client"

import { useEffect, useState } from "react"
import PublicNav from "@/components/PublicNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Info, Target, Map } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfilPage() {
  const [profile, setProfile] = useState<any>(null)
  const [officers, setOfficers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then(r => r.json()),
      fetch("/api/officers").then(r => r.json()),
    ]).then(([profileData, officersData]) => {
      setProfile(profileData)
      setOfficers(officersData)
      setIsLoading(false)
    }).catch((err) => {
      console.error(err)
      setIsLoading(false)
    })
  }, [])

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground font-medium">Memuat Profil Desa...</p>
          </div>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Profil Desa</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto flex items-center justify-center gap-2">
              <Map className="w-5 h-5" />
              {profile.villageName}, {profile.kecamatan}, {profile.kabupaten}, {profile.provinsi}
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Sejarah */}
          {profile.history && (
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-none overflow-hidden bg-card">
                <div className="h-2 w-full bg-primary"></div>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Info className="w-6 h-6" />
                    </div>
                    Sejarah Desa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                    {profile.history}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Visi & Misi */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
            {profile.vision && (
              <Card className="shadow-md border-border hover:shadow-xl transition-shadow bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                      <Target className="w-6 h-6" />
                    </div>
                    Visi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line font-medium">
                    "{profile.vision}"
                  </p>
                </CardContent>
              </Card>
            )}

            {profile.mission && (
              <Card className="shadow-md border-border hover:shadow-xl transition-shadow bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                      <Target className="w-6 h-6" />
                    </div>
                    Misi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                    {profile.mission}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Struktur Organisasi */}
          {officers.length > 0 && (
            <motion.section variants={itemVariants}>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Struktur Organisasi</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Para aparatur desa yang bertugas melayani masyarakat dengan sepenuh hati.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {officers.map((officer, index) => (
                  <motion.div 
                    key={officer.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full border-border bg-card">
                      <CardContent className="pt-8 pb-6">
                        <div className="w-28 h-28 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-background">
                          <Users className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-foreground line-clamp-1">{officer.name}</h3>
                        <p className="text-primary font-medium text-sm bg-primary/10 inline-block px-3 py-1 rounded-full">{officer.position}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} SIDESA - {profile.villageName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
