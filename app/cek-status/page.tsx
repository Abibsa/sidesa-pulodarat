"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { formatDateTime } from "@/lib/utils"
import { Search, CheckCircle, Clock, XCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function CekStatusPage() {
  const [ticketNumber, setTicketNumber] = useState("")
  const [nik, setNik] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const params = new URLSearchParams()
      if (ticketNumber) params.append("ticketNumber", ticketNumber)
      if (nik) params.append("nik", nik)

      const res = await fetch(`/api/letters/track?${params}`)
      
      if (res.ok) {
        const data = await res.json()
        setResult(data)
      } else {
        const errorData = await res.json()
        setError(errorData.error || "Pengajuan tidak ditemukan")
      }
    } catch (error) {
      console.error("Error tracking:", error)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DIAJUKAN":
        return <Clock className="w-6 h-6 text-blue-600" />
      case "DIPROSES":
        return <FileText className="w-6 h-6 text-yellow-600" />
      case "SELESAI":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "DITOLAK":
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return <Clock className="w-6 h-6 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIAJUKAN":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "DIPROSES":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "SELESAI":
        return "bg-green-100 text-green-800 border-green-300"
      case "DITOLAK":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="font-bold text-xl">
              SIDESA
            </Link>
            <div className="flex gap-4">
              <Link href="/surat">
                <Button variant="outline">Ajukan Surat</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Login Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cek Status Pengajuan
          </h1>
          <p className="text-gray-600">
            Lacak status pengajuan surat Anda menggunakan nomor tiket atau NIK
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Cari Pengajuan
            </CardTitle>
            <CardDescription>
              Masukkan nomor tiket atau NIK untuk melacak status pengajuan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label>Nomor Tiket</Label>
                <Input
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="TKT-202601-XXXXXX"
                />
              </div>
              <div className="text-center text-sm text-gray-600">atau</div>
              <div className="space-y-2">
                <Label>NIK</Label>
                <Input
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="16 digit NIK"
                  maxLength={16}
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Mencari..." : "Cari Pengajuan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {result.letterType.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    No. Tiket: <span className="font-mono font-semibold">{result.ticketNumber}</span>
                  </CardDescription>
                </div>
                {getStatusIcon(result.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Timeline */}
              <div
                className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">Status: {result.status}</p>
                    <p className="text-sm opacity-80">
                      {result.status === "DIAJUKAN" &&
                        "Pengajuan Anda sedang menunggu diproses"}
                      {result.status === "DIPROSES" &&
                        "Pengajuan Anda sedang diproses oleh petugas"}
                      {result.status === "SELESAI" &&
                        "Pengajuan Anda telah selesai diproses"}
                      {result.status === "DITOLAK" && "Pengajuan Anda ditolak"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Pemohon */}
              <div>
                <h3 className="font-semibold mb-3">Data Pemohon</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{result.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIK</p>
                    <p className="font-medium">{result.applicantNik}</p>
                  </div>
                  {result.applicantPhone && (
                    <div>
                      <p className="text-sm text-gray-600">No. Telepon</p>
                      <p className="font-medium">{result.applicantPhone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
                    <p className="font-medium">{formatDateTime(result.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Data Permohonan */}
              <div>
                <h3 className="font-semibold mb-3">Data Permohonan</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {Object.entries(result.formData).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2 last:border-0">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="font-medium text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Catatan Admin */}
              {result.adminNotes && (
                <div>
                  <h3 className="font-semibold mb-3">Catatan dari Petugas</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                    <p className="text-gray-800">{result.adminNotes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {result.status === "SELESAI" && (
                  <Button className="flex-1">
                    Download Surat
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setResult(null)
                    setTicketNumber("")
                    setNik("")
                  }}
                >
                  Cari Pengajuan Lain
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
