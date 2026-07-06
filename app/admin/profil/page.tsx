"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

export default function AdminProfilPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    history: "",
    vision: "",
    mission: "",
    address: "",
    email: "",
    phone: "",
    mapUrl: "",
    headName: "",
    headMessage: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setFormData({
            name: data.name || "",
            history: data.history || "",
            vision: data.vision || "",
            mission: data.mission || "",
            address: data.address || "",
            email: data.email || "",
            phone: data.phone || "",
            mapUrl: data.mapUrl || "",
            headName: data.headName || "",
            headMessage: data.headMessage || "",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Gagal memuat profil desa")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("Profil desa berhasil diupdate")
      } else {
        toast.error("Gagal mengupdate profil desa")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Profil Desa</h2>
          <p className="text-muted-foreground">Kelola informasi publik profil desa</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Umum</CardTitle>
            <CardDescription>Data dasar profil desa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Desa *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sejarah Singkat</Label>
              <Textarea
                value={formData.history}
                onChange={(e) => handleChange("history", e.target.value)}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visi & Misi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Visi</Label>
              <Textarea
                value={formData.vision}
                onChange={(e) => handleChange("vision", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Misi</Label>
              <Textarea
                value={formData.mission}
                onChange={(e) => handleChange("mission", e.target.value)}
                rows={5}
                placeholder="Gunakan tanda '-' atau bullet point untuk setiap poin misi"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kontak & Alamat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Alamat Lengkap *</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Telepon</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL Google Maps (Embed src)</Label>
              <Textarea
                value={formData.mapUrl}
                onChange={(e) => handleChange("mapUrl", e.target.value)}
                rows={3}
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kepala Desa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kepala Desa *</Label>
              <Input
                value={formData.headName}
                onChange={(e) => handleChange("headName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sambutan Kepala Desa</Label>
              <Textarea
                value={formData.headMessage}
                onChange={(e) => handleChange("headMessage", e.target.value)}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
