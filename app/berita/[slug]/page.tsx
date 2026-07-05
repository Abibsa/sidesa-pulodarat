"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import PublicNav from "@/components/PublicNav"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Calendar, User } from "lucide-react"

export default function BeritaDetailPage() {
  const params = useParams()
  const [news, setNews] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/news/${params.slug}`)
        .then(r => r.json())
        .then(data => {
          setNews(data)
          setLoading(false)
        })
        .catch(error => {
          console.error(error)
          setLoading(false)
        })
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          Memuat berita...
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1>
          <Link href="/berita">
            <Button>Kembali ke Berita</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/berita">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Berita
          </Button>
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {news.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-6">{news.title}</h1>

          <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(news.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{news.author}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {news.content}
            </div>
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link href="/berita">
            <Button variant="outline">Lihat Berita Lainnya</Button>
          </Link>
        </div>
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
