"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/utils"
import { Plus, Search, Edit, Trash2, Upload, Download } from "lucide-react"
import { toast } from "sonner"

interface Resident {
  id: string
  nik: string
  kk: string
  name: string
  gender: string
  birthDate: string
  birthPlace: string
  address: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  religion: string
  maritalStatus: string
  occupation: string
  education: string
}

export default function PendudukPage() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  
  const [formData, setFormData] = useState({
    nik: "",
    kk: "",
    name: "",
    gender: "LAKI_LAKI",
    birthDate: "",
    birthPlace: "",
    address: "",
    rt: "001",
    rw: "001",
    kelurahan: "Desa PULODARAT",
    kecamatan: "Kecamatan Sentral",
    religion: "Islam",
    maritalStatus: "BELUM_KAWIN",
    occupation: "",
    education: "",
  })

  const fetchResidents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      })
      
      const res = await fetch(`/api/residents?${params}`)
      const data = await res.json()
      
      setResidents(data.data)
      setTotalPages(data.pagination.totalPages)
      setTotal(data.pagination.total)
    } catch (error) {
      console.error("Error fetching residents:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResidents()
  }, [page, search])

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/residents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsAddOpen(false)
        fetchResidents()
        resetForm()
        toast.success("Data berhasil ditambahkan")
      } else {
        const error = await res.json()
        toast.error(error.error || "Gagal menambahkan data")
      }
    } catch (error) {
      console.error("Error adding resident:", error)
      toast.error("Terjadi kesalahan")
    }
  }

  const handleEdit = async () => {
    if (!selectedResident) return

    try {
      const res = await fetch(`/api/residents/${selectedResident.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsEditOpen(false)
        fetchResidents()
        resetForm()
        toast.success("Data berhasil diupdate")
      } else {
        const error = await res.json()
        toast.error(error.error || "Gagal mengupdate data")
      }
    } catch (error) {
      console.error("Error updating resident:", error)
      toast.error("Terjadi kesalahan")
    }
  }

  const handleDelete = async () => {
    if (!selectedResident) return

    try {
      const res = await fetch(`/api/residents/${selectedResident.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setIsDeleteOpen(false)
        fetchResidents()
        setSelectedResident(null)
        toast.success("Data berhasil dihapus")
      } else {
        toast.error("Gagal menghapus data")
      }
    } catch (error) {
      console.error("Error deleting resident:", error)
      toast.error("Terjadi kesalahan")
    }
  }

  const resetForm = () => {
    setFormData({
      nik: "",
      kk: "",
      name: "",
      gender: "LAKI_LAKI",
      birthDate: "",
      birthPlace: "",
      address: "",
      rt: "001",
      rw: "001",
      kelurahan: "Desa PULODARAT",
      kecamatan: "Kecamatan Sentral",
      religion: "Islam",
      maritalStatus: "BELUM_KAWIN",
      occupation: "",
      education: "",
    })
  }

  const openEdit = (resident: Resident) => {
    setSelectedResident(resident)
    setFormData({
      nik: resident.nik,
      kk: resident.kk,
      name: resident.name,
      gender: resident.gender,
      birthDate: new Date(resident.birthDate).toISOString().split('T')[0],
      birthPlace: resident.birthPlace,
      address: resident.address,
      rt: resident.rt,
      rw: resident.rw,
      kelurahan: resident.kelurahan,
      kecamatan: resident.kecamatan,
      religion: resident.religion,
      maritalStatus: resident.maritalStatus,
      occupation: resident.occupation,
      education: resident.education,
    })
    setIsEditOpen(true)
  }

  const openDelete = (resident: Resident) => {
    setSelectedResident(resident)
    setIsDeleteOpen(true)
  }

  const downloadTemplate = () => {
    const csv = `nik,kk,name,gender,birthDate,birthPlace,address,rt,rw,kelurahan,kecamatan,religion,maritalStatus,occupation,education
'3301010101010001,'3301011234567890,Contoh Nama,LAKI_LAKI,1990-01-01,Jakarta,Jl. Contoh No. 1,'001,'001,Desa PULODARAT,Kecamatan Sentral,Islam,KAWIN,Wiraswasta,SMA/Sederajat`
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_import_penduduk.csv'
    a.click()
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const lines = text.split('\n')
    const headers = lines[0].split(',')
    
    const data = lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',')
      const obj: any = {}
      headers.forEach((header, i) => {
        let val = values[i]?.trim() || "";
        // Strip leading single quote used to prevent Excel auto-formatting
        if (val.startsWith("'")) val = val.substring(1);
        obj[header.trim()] = val;
      })
      return obj
    })

    try {
      const res = await fetch('/api/residents/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })

      const result = await res.json()
      toast.success(`Import selesai! Berhasil: ${result.success}, Gagal: ${result.failed}`)
      setIsImportOpen(false)
      fetchResidents()
    } catch (error) {
      console.error('Error importing:', error)
      toast.error('Gagal import data')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Data Penduduk</h2>
          <p className="text-muted-foreground">Kelola data penduduk desa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Penduduk
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Penduduk</CardTitle>
              <CardDescription>Total: {total} penduduk terdaftar</CardDescription>
            </div>
            <div className="flex gap-2 w-96">
              <Input
                placeholder="Cari NIK, KK, atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 dark:bg-muted/20 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">NIK</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Nama</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">JK</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tanggal Lahir</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">RT/RW</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Pekerjaan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {residents.map((resident) => (
                      <tr key={resident.id} className="hover:bg-muted/50 dark:hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm">{resident.nik}</td>
                        <td className="px-4 py-3 text-sm font-medium">{resident.name}</td>
                        <td className="px-4 py-3 text-sm">{resident.gender === 'LAKI_LAKI' ? 'L' : 'P'}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(resident.birthDate)}</td>
                        <td className="px-4 py-3 text-sm">{resident.rt}/{resident.rw}</td>
                        <td className="px-4 py-3 text-sm">{resident.occupation}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(resident)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDelete(resident)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Halaman {page} dari {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Penduduk</DialogTitle>
            <DialogDescription>Isi form di bawah untuk menambah data penduduk baru</DialogDescription>
          </DialogHeader>
          <ResidentForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleAdd}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Penduduk</DialogTitle>
            <DialogDescription>Update data penduduk</DialogDescription>
          </DialogHeader>
          <ResidentForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button onClick={handleEdit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Penduduk</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data <strong>{selectedResident?.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data Penduduk</DialogTitle>
            <DialogDescription>
              Upload file CSV untuk import data penduduk secara massal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Button variant="outline" onClick={downloadTemplate} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Template CSV
              </Button>
            </div>
            <div>
              <Label htmlFor="csv-file">Pilih File CSV</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleImport}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ResidentForm({ formData, setFormData }: any) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>NIK *</Label>
        <Input
          value={formData.nik}
          onChange={(e) => handleChange("nik", e.target.value)}
          placeholder="16 digit"
          maxLength={16}
        />
      </div>
      <div className="space-y-2">
        <Label>No. KK *</Label>
        <Input
          value={formData.kk}
          onChange={(e) => handleChange("kk", e.target.value)}
          placeholder="16 digit"
          maxLength={16}
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label>Nama Lengkap *</Label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Jenis Kelamin *</Label>
        <Select value={formData.gender} onValueChange={(v) => handleChange("gender", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
            <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Tempat Lahir *</Label>
        <Input
          value={formData.birthPlace}
          onChange={(e) => handleChange("birthPlace", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Tanggal Lahir *</Label>
        <Input
          type="date"
          value={formData.birthDate}
          onChange={(e) => handleChange("birthDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Agama *</Label>
        <Select value={formData.religion} onValueChange={(v) => handleChange("religion", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Islam">Islam</SelectItem>
            <SelectItem value="Kristen">Kristen</SelectItem>
            <SelectItem value="Katolik">Katolik</SelectItem>
            <SelectItem value="Hindu">Hindu</SelectItem>
            <SelectItem value="Buddha">Buddha</SelectItem>
            <SelectItem value="Konghucu">Konghucu</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 space-y-2">
        <Label>Alamat *</Label>
        <Textarea
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label>RT *</Label>
        <Input
          value={formData.rt}
          onChange={(e) => handleChange("rt", e.target.value)}
          placeholder="001"
        />
      </div>
      <div className="space-y-2">
        <Label>RW *</Label>
        <Input
          value={formData.rw}
          onChange={(e) => handleChange("rw", e.target.value)}
          placeholder="001"
        />
      </div>
      <div className="space-y-2">
        <Label>Kelurahan/Desa *</Label>
        <Input
          value={formData.kelurahan}
          onChange={(e) => handleChange("kelurahan", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Kecamatan *</Label>
        <Input
          value={formData.kecamatan}
          onChange={(e) => handleChange("kecamatan", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Status Perkawinan *</Label>
        <Select value={formData.maritalStatus} onValueChange={(v) => handleChange("maritalStatus", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BELUM_KAWIN">Belum Kawin</SelectItem>
            <SelectItem value="KAWIN">Kawin</SelectItem>
            <SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem>
            <SelectItem value="CERAI_MATI">Cerai Mati</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Pendidikan *</Label>
        <Select value={formData.education} onValueChange={(v) => handleChange("education", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</SelectItem>
            <SelectItem value="SD/Sederajat">SD/Sederajat</SelectItem>
            <SelectItem value="SMP/Sederajat">SMP/Sederajat</SelectItem>
            <SelectItem value="SMA/Sederajat">SMA/Sederajat</SelectItem>
            <SelectItem value="D3">D3</SelectItem>
            <SelectItem value="S1">S1</SelectItem>
            <SelectItem value="S2">S2</SelectItem>
            <SelectItem value="S3">S3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 space-y-2">
        <Label>Pekerjaan *</Label>
        <Input
          value={formData.occupation}
          onChange={(e) => handleChange("occupation", e.target.value)}
          placeholder="Petani, Wiraswasta, PNS, dll"
        />
      </div>
    </div>
  )
}
