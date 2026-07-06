"use client"

import { useEffect, useState } from "react"
import PublicNav from "@/components/PublicNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export default function PotensiPage() {
  const [potentials, setPotentials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/potentials")
      .then(r => r.json())
      .then(data => {
        setPotentials(data)
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  const getCategoryStyles = (category: string) => {
    const styles: any = {
      "UMKM": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Pertanian": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "Pariwisata": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Perikanan": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
      "Peternakan": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    }
    return styles[category] || "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
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
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Potensi Desa</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Jelajahi kekayaan dan produk unggulan yang ada di desa kami
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse"></div>
            ))}
          </div>
        ) : potentials.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <MapPin className="w-16 h-16 mx-auto text-muted mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Belum ada data potensi desa</h3>
            <p>Data potensi desa akan segera ditambahkan</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {potentials.map((potential) => (
                <motion.div key={potential.id} variants={itemVariants}>
                  <Card className="rounded-2xl border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col bg-card overflow-hidden">
                    <CardHeader>
                      <div className="mb-4 flex items-start justify-between">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryStyles(potential.category)}`}>
                          {potential.category}
                        </span>
                      </div>
                      <CardTitle className="text-2xl leading-tight text-foreground">{potential.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col space-y-4">
                      <CardDescription className="text-base text-muted-foreground leading-relaxed flex-1">
                        {potential.description}
                      </CardDescription>
                      
                      {potential.contactInfo && (
                        <div className="flex items-center gap-3 text-sm font-medium text-foreground pt-5 border-t border-border mt-auto">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Phone className="w-4 h-4 text-primary" />
                          </div>
                          <span>{potential.contactInfo}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-auto border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} SIDESA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
