"use client"

import { useEffect, useState } from "react"
import PublicNav from "@/components/PublicNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Phone } from "lucide-react"

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

  const getCategoryColor = (category: string) => {
    const colors: any = {
      "UMKM": "bg-blue-100 text-blue-800",
      "Pertanian": "bg-green-100 text-green-800",
      "Pariwisata": "bg-purple-100 text-purple-800",
      "Perikanan": "bg-cyan-100 text-cyan-800",
      "Peternakan": "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Potensi Desa</h1>
          </div>
          <p className="text-xl text-blue-100">
            Kekayaan dan potensi unggulan desa kami
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">Memuat data...</div>
        ) : potentials.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            Belum ada data potensi desa
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {potentials.map((potential) => (
              <Card key={potential.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(potential.category)}`}>
                      {potential.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{potential.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-700">
                    {potential.description}
                  </CardDescription>
                  {potential.contactInfo && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
                      <Phone className="w-4 h-4" />
                      <span>{potential.contactInfo}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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
