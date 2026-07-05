"use client"

import { useEffect, useState } from "react"
import PublicNav from "@/components/PublicNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          Memuat...
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          Data tidak tersedia
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Kontak Kami</h1>
          <p className="text-xl text-blue-100">
            Hubungi kami untuk informasi lebih lanjut
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Informasi Kontak */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Alamat</h3>
                    <p className="text-gray-600">
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
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telepon</h3>
                      <p className="text-gray-600">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile.email && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Jam Pelayanan</h3>
                    <p className="text-gray-600">
                      {profile.officeHours || "Senin - Jumat, 08:00 - 15:00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>Layanan Online</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Untuk pelayanan surat keterangan, Anda dapat menggunakan layanan online kami yang tersedia 24/7.
                </p>
                <div className="space-y-2">
                  <a
                    href="/surat"
                    className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="font-semibold text-blue-600">Ajukan Surat Online</div>
                    <div className="text-sm text-gray-600">Buat pengajuan surat keterangan</div>
                  </a>
                  <a
                    href="/cek-status"
                    className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="font-semibold text-blue-600">Cek Status Pengajuan</div>
                    <div className="text-sm text-gray-600">Lacak status pengajuan Anda</div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Peta */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Lokasi</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.mapEmbedUrl ? (
                  <div className="aspect-video w-full">
                    <iframe
                      src={profile.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>Peta belum tersedia</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 SIDESA - {profile.villageName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
