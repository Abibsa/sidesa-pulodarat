"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, CheckCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import PublicNav from "@/components/PublicNav"
import { motion } from "framer-motion"

interface LetterType {
  id: string
  name: string
  code: string
  description: string
  formFields: any
}

export default function AjukanSuratPage() {
  const [letterTypes, setLetterTypes] = useState<LetterType[]>([])
  const [selectedType, setSelectedType] = useState<LetterType | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")

  const [applicantData, setApplicantData] = useState({
    nik: "",
    name: "",
    phone: "",
    email: "",
  })

  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetch("/api/letters/types")
      .then((res) => res.json())
      .then((data) => setLetterTypes(data))
      .catch((error) => console.error("Error fetching letter types:", error))
  }, [])

  const handleSelectType = (typeId: string) => {
    const type = letterTypes.find((t) => t.id === typeId)
    if (type) {
      setSelectedType(type)
      setFormData({})
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType) return

    setLoading(true)
    try {
      const res = await fetch("/api/letters/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letterTypeId: selectedType.id,
          applicantNik: applicantData.nik,
          applicantName: applicantData.name,
          applicantPhone: applicantData.phone,
          applicantEmail: applicantData.email,
          formData,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setTicketNumber(data.ticketNumber)
        setSuccess(true)
        setApplicantData({ nik: "", name: "", phone: "", email: "" })
        setFormData({})
        setSelectedType(null)
      } else {
        alert("Gagal mengajukan surat. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      alert("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <Card className="text-center shadow-xl border-none">
              <CardHeader className="pt-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </motion.div>
                <CardTitle className="text-2xl font-bold">Pengajuan Berhasil!</CardTitle>
                <CardDescription className="text-base mt-2">
                  Pengajuan surat Anda telah kami terima dan sedang diproses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="bg-muted p-6 rounded-2xl border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Nomor Tiket Anda:</p>
                  <p className="text-3xl font-black text-primary tracking-wider">{ticketNumber}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Simpan nomor tiket ini untuk melacak status pengajuan Anda di halaman Cek Status.
                </p>
                <div className="flex flex-col gap-3 pt-4">
                  <Link href="/cek-status">
                    <Button className="w-full rounded-xl h-12 text-md">Cek Status Pengajuan</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-12 text-md"
                    onClick={() => setSuccess(false)}
                  >
                    Ajukan Surat Lain
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav />

      {/* Page Header */}
      <div className="bg-primary/5 py-12 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pengajuan Surat Online
            </h1>
            <p className="text-muted-foreground text-lg">
              Isi formulir di bawah ini dengan lengkap dan benar untuk mengajukan surat keterangan dari desa.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Pilih Jenis Surat */}
            <Card className="shadow-sm border-border overflow-hidden">
              <div className="h-1 bg-primary w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">1</span>
                  Pilih Jenis Surat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-foreground">Jenis Surat Keterangan</Label>
                  <Select onValueChange={handleSelectType}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="-- Pilih Jenis Surat yang Dibutuhkan --" />
                    </SelectTrigger>
                    <SelectContent>
                      {letterTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedType && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-muted-foreground p-3 bg-muted rounded-lg border border-border"
                    >
                      {selectedType.description}
                    </motion.p>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Data Pemohon */}
                <Card className="shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">2</span>
                      Identitas Pemohon
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">NIK <span className="text-red-500">*</span></Label>
                        <Input
                          value={applicantData.nik}
                          onChange={(e) =>
                            setApplicantData({ ...applicantData, nik: e.target.value })
                          }
                          placeholder="Masukkan 16 digit NIK"
                          maxLength={16}
                          required
                          className="h-12 rounded-xl focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Nama Lengkap <span className="text-red-500">*</span></Label>
                        <Input
                          value={applicantData.name}
                          onChange={(e) =>
                            setApplicantData({ ...applicantData, name: e.target.value })
                          }
                          placeholder="Sesuai KTP"
                          required
                          className="h-12 rounded-xl focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">No. Telepon / WhatsApp</Label>
                        <Input
                          type="tel"
                          value={applicantData.phone}
                          onChange={(e) =>
                            setApplicantData({ ...applicantData, phone: e.target.value })
                          }
                          placeholder="08xxxxxxxxxx"
                          className="h-12 rounded-xl focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Email (Opsional)</Label>
                        <Input
                          type="email"
                          value={applicantData.email}
                          onChange={(e) =>
                            setApplicantData({ ...applicantData, email: e.target.value })
                          }
                          placeholder="email@contoh.com"
                          className="h-12 rounded-xl focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Dinamis */}
                <Card className="shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">3</span>
                      Detail Permohonan
                    </CardTitle>
                    <CardDescription>
                      Informasi tambahan yang diperlukan untuk {selectedType.name.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {JSON.parse(selectedType.formFields).map((field: any) => (
                      <div key={field.name} className="space-y-2">
                        <Label className="text-sm font-medium">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            value={formData[field.name] || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, [field.name]: e.target.value })
                            }
                            required={field.required}
                            rows={4}
                            className="rounded-xl resize-none focus-visible:ring-primary"
                            placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                          />
                        ) : field.type === "select" ? (
                          <Select
                            value={formData[field.name] || ""}
                            onValueChange={(value) =>
                              setFormData({ ...formData, [field.name]: value })
                            }
                          >
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="-- Pilih --" />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={field.type}
                            value={formData[field.name] || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, [field.name]: e.target.value })
                            }
                            required={field.required}
                            className="h-12 rounded-xl focus-visible:ring-primary"
                            placeholder={`Masukkan ${field.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Submit Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-xl px-8"
                    onClick={() => {
                      setSelectedType(null)
                      setFormData({})
                    }}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-12 rounded-xl px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Kirim Permohonan"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </main>
    </div>
  )
}
