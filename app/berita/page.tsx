"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import PublicNav from "@/components/PublicNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Newspaper } from "lucide-react"

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

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Berita & Pengumuman</h1>
          </div>
          <p className="text-xl text-blue-100">
            Informasi terkini dari desa
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">Memuat berita...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Belum ada berita yang dipublikasikan
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="line-clamp-3 mb-4 flex-1">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Sebelumnya
                </Button>
                <div className="flex items-center px-4">
                  Halaman {page} dari {totalPages}
                </div>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 SIDESA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
