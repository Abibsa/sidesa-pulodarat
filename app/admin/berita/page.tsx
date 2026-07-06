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
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminBeritaPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "Admin",
    category: "Pemerintahan",
  })

  const fetchNews = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/news?page=${page}&limit=10${search ? `&search=${search}` : ''}`)
      const data = await res.json()
      setNews(data.data || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error("Error fetching news:", error)
      toast.error("Gagal memuat berita")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [page, search])

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleAdd = async () => {
    try {
      if (!formData.title || !formData.content) {
        toast.error("Judul dan konten harus diisi")
        return
      }

      const slug = generateSlug(formData.title) + '-' + Date.now()

      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slug }),
      })

      if (res.ok) {
        setIsAddOpen(false)
        fetchNews()
        resetForm()
        toast.success("Berita berhasil ditambahkan")
      } else {
        const err = await res.json()
        toast.error(err.error || "Gagal menambahkan berita")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const handleEdit = async () => {
    try {
      if (!formData.title || !formData.content) {
        toast.error("Judul dan konten harus diisi")
        return
      }

      const slug = generateSlug(formData.title)

      const res = await fetch(`/api/news/${selectedNews.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slug }),
      })

      if (res.ok) {
        setIsEditOpen(false)
        fetchNews()
        resetForm()
        toast.success("Berita berhasil diupdate")
      } else {
        toast.error("Gagal mengupdate berita")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/news/${selectedNews.slug}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setIsDeleteOpen(false)
        fetchNews()
        toast.success("Berita berhasil dihapus")
      } else {
        toast.error("Gagal menghapus berita")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "Admin",
      category: "Pemerintahan",
    })
  }

  const openEdit = (item: any) => {
    setSelectedNews(item)
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || "",
      author: item.author,
      category: item.category,
    })
    setIsEditOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Kelola Berita</h2>
          <p className="text-muted-foreground">Kelola publikasi dan pengumuman desa</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Berita
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Berita</CardTitle>
            <div className="flex gap-2 w-96">
              <Input
                placeholder="Cari judul..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : news.length === 0 ? (
             <div className="text-center py-8 text-muted-foreground">Tidak ada berita ditemukan</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Judul</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Penulis</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm">{formatDate(item.publishedAt)}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                      <td className="px-4 py-3 text-sm">{item.category}</td>
                      <td className="px-4 py-3 text-sm">{item.author}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedNews(item); setIsDeleteOpen(true) }}>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Berita</DialogTitle>
            <DialogDescription>Tulis berita atau pengumuman baru</DialogDescription>
          </DialogHeader>
          <NewsForm formData={formData} setFormData={setFormData} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleAdd}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Berita</DialogTitle>
          </DialogHeader>
          <NewsForm formData={formData} setFormData={setFormData} />
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
            <DialogTitle>Hapus Berita</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{selectedNews?.title}</strong>?
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

function NewsForm({ formData, setFormData }: any) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Judul *</Label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Judul Berita"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Kategori *</Label>
          <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Pemerintahan">Pemerintahan</SelectItem>
              <SelectItem value="Pembangunan">Pembangunan</SelectItem>
              <SelectItem value="Pemberdayaan">Pemberdayaan</SelectItem>
              <SelectItem value="Kesehatan">Kesehatan</SelectItem>
              <SelectItem value="Pengumuman">Pengumuman</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Penulis *</Label>
          <Input
            value={formData.author}
            onChange={(e) => handleChange("author", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Ringkasan (Opsional)</Label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => handleChange("excerpt", e.target.value)}
          rows={2}
          placeholder="Akan ditampilkan di daftar berita..."
        />
      </div>
      <div className="space-y-2">
        <Label>Konten *</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          rows={12}
          placeholder="Tulis konten berita di sini..."
        />
      </div>
    </div>
  )
}
