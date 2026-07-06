"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { formatDateTime } from "@/lib/utils"
import { Search, CheckCircle, Clock, XCircle, FileText, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import PublicNav from "@/components/PublicNav"
import { motion, AnimatePresence } from "framer-motion"

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
        return <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      case "DIPROSES":
        return <FileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
      case "SELESAI":
        return <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
      case "DITOLAK":
        return <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      default:
        return <Clock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIAJUKAN":
        return "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
      case "DIPROSES":
        return "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300"
      case "SELESAI":
        return "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
      case "DITOLAK":
        return "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
      default:
        return "bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800 dark:text-slate-300"
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav />

      {/* Page Header */}
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cek Status Pengajuan
            </h1>
            <p className="text-muted-foreground text-lg">
              Lacak status pengajuan surat Anda menggunakan nomor tiket atau NIK
            </p>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-8 shadow-md border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Search className="w-5 h-5 text-primary" />
                Pencarian Dokumen
              </CardTitle>
              <CardDescription>
                Masukkan salah satu data di bawah ini untuk melacak status pengajuan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nomor Tiket</Label>
                    <Input
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      placeholder="Contoh: TKT-202601-XXXXXX"
                      className="h-12 rounded-xl focus-visible:ring-primary"
                    />
                  </div>
                  <div className="relative space-y-2 hidden md:block">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-x-3 translate-y-2">
                      <span className="text-sm text-muted-foreground font-medium bg-card px-2">atau</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">NIK Pemohon</Label>
                    <Input
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      placeholder="16 digit NIK"
                      maxLength={16}
                      className="h-12 rounded-xl focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50"
                  >
                    {error}
                  </motion.div>
                )}
                <div className="flex justify-end pt-2">
                  <Button type="submit" className="h-12 rounded-xl px-8 w-full md:w-auto" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Mencari...
                      </>
                    ) : (
                      "Cari Pengajuan"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-lg border-border overflow-hidden">
                <div className={`h-2 w-full ${
                  result.status === "SELESAI" ? "bg-green-500" :
                  result.status === "DITOLAK" ? "bg-red-500" :
                  result.status === "DIPROSES" ? "bg-yellow-500" : "bg-blue-500"
                }`}></div>
                <CardHeader className="bg-muted/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl mb-1">
                        {result.letterType.name}
                      </CardTitle>
                      <CardDescription className="text-base flex items-center gap-2">
                        No. Tiket: <span className="font-mono font-bold text-foreground px-2 py-0.5 bg-muted rounded">{result.ticketNumber}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                  {/* Status Timeline */}
                  <div
                    className={`p-6 rounded-2xl border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-xl mb-1 flex items-center gap-2">
                          Status Saat Ini: {result.status}
                        </p>
                        <p className="text-sm font-medium opacity-90">
                          {result.status === "DIAJUKAN" &&
                            "Pengajuan Anda telah diterima dan sedang menunggu antrean untuk diproses."}
                          {result.status === "DIPROSES" &&
                            "Dokumen Anda sedang diperiksa dan diproses oleh petugas desa."}
                          {result.status === "SELESAI" &&
                            "Pengajuan selesai! Dokumen Anda sudah siap diambil atau diunduh."}
                          {result.status === "DITOLAK" && 
                            "Mohon maaf, pengajuan Anda tidak dapat diproses. Silakan cek catatan petugas."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Detail Pemohon */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
                        Data Pemohon
                      </h3>
                      <div className="space-y-4 bg-muted/50 p-5 rounded-xl border border-border">
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Nama Lengkap</p>
                          <p className="font-semibold text-foreground">{result.applicantName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">NIK</p>
                          <p className="font-semibold text-foreground">{result.applicantNik}</p>
                        </div>
                        {result.applicantPhone && (
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">No. Telepon</p>
                            <p className="font-semibold text-foreground">{result.applicantPhone}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Tanggal Pengajuan</p>
                          <p className="font-semibold text-foreground">{formatDateTime(result.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Data Permohonan */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
                        Detail Permohonan
                      </h3>
                      <div className="bg-muted/50 p-5 rounded-xl border border-border space-y-4">
                        {Object.entries(result.formData).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0 gap-1">
                            <span className="text-sm text-muted-foreground font-medium capitalize">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span className="font-semibold text-foreground sm:text-right">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Catatan Admin */}
                  {result.adminNotes && (
                    <div className="mt-4">
                      <h3 className="font-bold text-lg mb-3">Catatan dari Petugas</h3>
                      <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-5 rounded-r-xl">
                        <p className="text-blue-900 dark:text-blue-100 font-medium">{result.adminNotes}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                    {result.status === "SELESAI" && (
                      <a 
                        href={`/api/letters/generate-pdf?id=${result.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full h-12 rounded-xl text-md">
                          Download Surat Keterangan
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-xl text-md"
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
