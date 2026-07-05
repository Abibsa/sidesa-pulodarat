"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Pengajuan Berhasil!</CardTitle>
            <CardDescription>
              Pengajuan surat Anda telah kami terima
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Nomor Tiket Anda:</p>
              <p className="text-2xl font-bold text-blue-600">{ticketNumber}</p>
            </div>
            <p className="text-sm text-gray-600">
              Simpan nomor tiket ini untuk melacak status pengajuan Anda
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/cek-status">
                <Button className="w-full">Cek Status Pengajuan</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSuccess(false)}
              >
                Ajukan Surat Lain
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="font-bold text-xl">
              SIDESA
            </Link>
            <div className="flex gap-4">
              <Link href="/cek-status">
                <Button variant="outline">Cek Status</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Login Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ajukan Surat Online
          </h1>
          <p className="text-gray-600">
            Ajukan berbagai jenis surat keterangan secara online tanpa perlu datang ke kantor desa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilih Jenis Surat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Pilih Jenis Surat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleSelectType}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Pilih Jenis Surat --" />
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
                <p className="text-sm text-gray-600 mt-2">
                  {selectedType.description}
                </p>
              )}
            </CardContent>
          </Card>

          {selectedType && (
            <>
              {/* Data Pemohon */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Pemohon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>NIK *</Label>
                      <Input
                        value={applicantData.nik}
                        onChange={(e) =>
                          setApplicantData({ ...applicantData, nik: e.target.value })
                        }
                        placeholder="16 digit"
                        maxLength={16}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Lengkap *</Label>
                      <Input
                        value={applicantData.name}
                        onChange={(e) =>
                          setApplicantData({ ...applicantData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>No. Telepon</Label>
                      <Input
                        type="tel"
                        value={applicantData.phone}
                        onChange={(e) =>
                          setApplicantData({ ...applicantData, phone: e.target.value })
                        }
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={applicantData.email}
                        onChange={(e) =>
                          setApplicantData({ ...applicantData, email: e.target.value })
                        }
                        placeholder="email@contoh.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form Dinamis */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Permohonan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {JSON.parse(selectedType.formFields).map((field: any) => (
                    <div key={field.name} className="space-y-2">
                      <Label>
                        {field.label} {field.required && "*"}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                          required={field.required}
                          rows={3}
                        />
                      ) : field.type === "select" ? (
                        <Select
                          value={formData[field.name] || ""}
                          onValueChange={(value) =>
                            setFormData({ ...formData, [field.name]: value })
                          }
                        >
                          <SelectTrigger>
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
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedType(null)
                    setFormData({})
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Memproses..." : "Ajukan Permohonan"}
                </Button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  )
}
