"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPotensiPage() {
  const [potentials, setPotentials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedPotential, setSelectedPotential] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "UMKM",
    contactInfo: "",
    isActive: true,
  })

  const fetchPotentials = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/potentials`)
      const data = await res.json()
      setPotentials(data)
    } catch (error) {
      console.error("Error fetching potentials:", error)
      toast.error("Gagal memuat potensi desa")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPotentials()
  }, [])

  const handleAdd = async () => {
    try {
      if (!formData.title || !formData.description) {
        toast.error("Judul dan deskripsi harus diisi")
        return
      }

      const res = await fetch("/api/potentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsAddOpen(false)
        fetchPotentials()
        resetForm()
        toast.success("Potensi berhasil ditambahkan")
      } else {
        toast.error("Gagal menambahkan potensi")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const handleEdit = async () => {
    try {
      if (!formData.title || !formData.description) {
        toast.error("Judul dan deskripsi harus diisi")
        return
      }

      const res = await fetch(`/api/potentials/${selectedPotential.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsEditOpen(false)
        fetchPotentials()
        resetForm()
        toast.success("Potensi berhasil diupdate")
      } else {
        toast.error("Gagal mengupdate potensi")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/potentials/${selectedPotential.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setIsDeleteOpen(false)
        fetchPotentials()
        toast.success("Potensi berhasil dihapus")
      } else {
        toast.error("Gagal menghapus potensi")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "UMKM",
      contactInfo: "",
      isActive: true,
    })
  }

  const openEdit = (item: any) => {
    setSelectedPotential(item)
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      contactInfo: item.contactInfo || "",
      isActive: item.isActive,
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Potensi Desa</h2>
          <p className="text-muted-foreground">Kelola data UMKM, Pertanian, dan Pariwisata</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Potensi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Potensi</CardTitle>
          <CardDescription>Kekayaan dan produk unggulan desa</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : potentials.length === 0 ? (
             <div className="text-center py-8 text-muted-foreground">Tidak ada potensi ditemukan</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Judul</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Kontak</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {potentials.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                      <td className="px-4 py-3 text-sm">{item.category}</td>
                      <td className="px-4 py-3 text-sm">{item.contactInfo || "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.isActive ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedPotential(item); setIsDeleteOpen(true) }}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Potensi</DialogTitle>
          </DialogHeader>
          <PotentialForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleAdd}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Potensi</DialogTitle>
          </DialogHeader>
          <PotentialForm formData={formData} setFormData={setFormData} />
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
            <DialogTitle>Hapus Potensi</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{selectedPotential?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PotentialForm({ formData, setFormData }: any) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Judul *</Label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Kategori *</Label>
          <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="UMKM">UMKM</SelectItem>
              <SelectItem value="Pertanian">Pertanian</SelectItem>
              <SelectItem value="Pariwisata">Pariwisata</SelectItem>
              <SelectItem value="Perikanan">Perikanan</SelectItem>
              <SelectItem value="Peternakan">Peternakan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2 justify-center pt-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(v: boolean) => handleChange("isActive", v)}
            />
            <Label>Aktif ditampilkan</Label>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Deskripsi Singkat *</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Info Kontak (Opsional)</Label>
        <Input
          value={formData.contactInfo}
          onChange={(e) => handleChange("contactInfo", e.target.value)}
          placeholder="No HP / WhatsApp"
        />
      </div>
    </div>
  )
}
