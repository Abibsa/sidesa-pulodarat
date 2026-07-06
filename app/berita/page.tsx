"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import PublicNav from "@/components/PublicNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Newspaper, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function BeritaPage() {
  const [news, setNews] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/news?page=${page}&limit=9`)
      .then(r => r.json())
      .then(data => {
        setNews(data.data || [])
        setTotalPages(data.pagination.totalPages)
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }, [page])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Newspaper className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Berita & Pengumuman</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Informasi terkini dan pengumuman resmi dari desa
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse"></div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Newspaper className="w-16 h-16 mx-auto text-muted mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Belum ada berita</h3>
            <p>Berita yang dipublikasikan akan muncul di sini</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="rounded-2xl overflow-hidden border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-card">
                    <div className="h-48 bg-muted w-full relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {formatDate(item.publishedAt)}
                        </span>
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
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 mt-16">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-10 w-10"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center px-4 font-medium">
                  Halaman {page} dari {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-10 w-10"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
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
