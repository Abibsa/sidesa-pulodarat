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

export default function AdminAparaturPage() {
  const [officers, setOfficers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    photo: "",
    order: "0",
    isActive: true,
  })

  const fetchOfficers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/officers`)
      const data = await res.json()
      // API currently only returns active by default, but let's assume we fetch all in admin
      // Since our API currently does { isActive: true }, we should change that for admin or just show them here.
      setOfficers(data)
    } catch (error) {
      console.error("Error fetching officers:", error)
      toast.error("Gagal memuat aparatur")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOfficers()
  }, [])

  const handleAdd = async () => {
    try {
      if (!formData.name || !formData.position) {
        toast.error("Nama dan jabatan harus diisi")
        return
      }

      const res = await fetch("/api/officers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsAddOpen(false)
        fetchOfficers()
        resetForm()
        toast.success("Aparatur berhasil ditambahkan")
      } else {
        toast.error("Gagal menambahkan aparatur")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const handleEdit = async () => {
    try {
      if (!formData.name || !formData.position) {
        toast.error("Nama dan jabatan harus diisi")
        return
      }

      const res = await fetch(`/api/officers/${selectedOfficer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsEditOpen(false)
        fetchOfficers()
        resetForm()
        toast.success("Aparatur berhasil diupdate")
      } else {
        toast.error("Gagal mengupdate aparatur")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/officers/${selectedOfficer.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setIsDeleteOpen(false)
        fetchOfficers()
        toast.success("Aparatur berhasil dihapus")
      } else {
        toast.error("Gagal menghapus aparatur")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      photo: "",
      order: "0",
      isActive: true,
    })
  }

  const openEdit = (item: any) => {
    setSelectedOfficer(item)
    setFormData({
      name: item.name,
      position: item.position,
      photo: item.photo || "",
      order: item.order.toString(),
      isActive: item.isActive,
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Aparatur Desa</h2>
          <p className="text-muted-foreground">Kelola struktur organisasi desa</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Aparatur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Aparatur</CardTitle>
          <CardDescription>Struktur organisasi pemerintahan desa</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : officers.length === 0 ? (
             <div className="text-center py-8 text-muted-foreground">Tidak ada aparatur ditemukan</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Urutan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Nama</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Jabatan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {officers.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm">{item.order}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-sm">{item.position}</td>
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
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedOfficer(item); setIsDeleteOpen(true) }}>
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
            <DialogTitle>Tambah Aparatur</DialogTitle>
          </DialogHeader>
          <OfficerForm formData={formData} setFormData={setFormData} />
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
            <DialogTitle>Edit Aparatur</DialogTitle>
          </DialogHeader>
          <OfficerForm formData={formData} setFormData={setFormData} />
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
            <DialogTitle>Hapus Aparatur</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{selectedOfficer?.name}</strong>?
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

function OfficerForm({ formData, setFormData }: any) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Nama Lengkap *</Label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Jabatan *</Label>
        <Input
          value={formData.position}
          onChange={(e) => handleChange("position", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>URL Foto</Label>
        <Input
          value={formData.photo}
          onChange={(e) => handleChange("photo", e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Urutan Tampil (Angka)</Label>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) => handleChange("order", e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2 justify-center pt-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(v: boolean) => handleChange("isActive", v)}
            />
            <Label>Aktif</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
