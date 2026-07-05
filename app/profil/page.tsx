"use client"

import { useEffect, useState } from "react"
import PublicNav from "@/components/PublicNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function ProfilPage() {
  const [profile, setProfile] = useState<any>(null)
  const [officers, setOfficers] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then(r => r.json()),
      fetch("/api/officers").then(r => r.json()),
    ]).then(([profileData, officersData]) => {
      setProfile(profileData)
      setOfficers(officersData)
    }).catch(console.error)
  }, [])

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          Memuat...
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
          <h1 className="text-4xl font-bold mb-4">Profil Desa</h1>
          <p className="text-xl text-blue-100">
            {profile.villageName}, {profile.kecamatan}, {profile.kabupaten}, {profile.provinsi}
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Sejarah */}
        {profile.history && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sejarah Desa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.history}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Visi & Misi */}
        <div className="grid md:grid-cols-2 gap-6">
          {profile.vision && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Visi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.vision}
                </p>
              </CardContent>
            </Card>
          )}

          {profile.mission && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Misi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.mission}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Struktur Organisasi */}
        {officers.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8">Struktur Organisasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {officers.map((officer) => (
                <Card key={officer.id} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-16 h-16 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{officer.name}</h3>
                    <p className="text-gray-600 text-sm">{officer.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
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
