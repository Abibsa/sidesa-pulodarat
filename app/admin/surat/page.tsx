"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatDateTime } from "@/lib/utils"
import { Search, Eye } from "lucide-react"
import { toast } from "sonner"

interface LetterRequest {
  id: string
  ticketNumber: string
  applicantNik: string
  applicantName: string
  applicantPhone?: string
  status: string
  createdAt: string
  letterType: {
    name: string
    code: string
  }
  formData: any
  adminNotes?: string
}

export default function SuratPage() {
  const [requests, setRequests] = useState<LetterRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LetterRequest | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      })

      const res = await fetch(`/api/letters/requests?${params}`)
      const data = await res.json()

      setRequests(data.data)
      setTotalPages(data.pagination.totalPages)
      setTotal(data.pagination.total)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [page, search, statusFilter])

  const openDetail = (request: LetterRequest) => {
    setSelectedRequest(request)
    setNewStatus(request.status)
    setAdminNotes(request.adminNotes || "")
    setIsDetailOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return

    try {
      const res = await fetch(`/api/letters/requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes,
        }),
      })

      if (res.ok) {
        setIsDetailOpen(false)
        fetchRequests()
        toast.success("Status berhasil diupdate")
      } else {
        toast.error("Gagal update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Terjadi kesalahan")
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: any = {
      DIAJUKAN: "bg-blue-100 text-blue-800",
      DIPROSES: "bg-yellow-100 text-yellow-800",
      SELESAI: "bg-green-100 text-green-800",
      DITOLAK: "bg-red-100 text-red-800",
    }
    return badges[status] || "bg-muted text-foreground"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Pengajuan Surat</h2>
          <p className="text-muted-foreground">Kelola pengajuan surat dari warga</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Pengajuan</CardTitle>
              <CardDescription>Total: {total} pengajuan</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Status</SelectItem>
                  <SelectItem value="DIAJUKAN">Diajukan</SelectItem>
                  <SelectItem value="DIPROSES">Diproses</SelectItem>
                  <SelectItem value="SELESAI">Selesai</SelectItem>
                  <SelectItem value="DITOLAK">Ditolak</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Cari tiket/NIK/nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        No. Tiket
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Jenis Surat
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Pemohon
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        NIK
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {requests.map((request) => (
                      <tr key={request.id} className="hover:bg-muted/50 dark:hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-mono">
                          {request.ticketNumber}
                        </td>
                        <td className="px-4 py-3 text-sm">{request.letterType.name}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {request.applicantName}
                        </td>
                        <td className="px-4 py-3 text-sm">{request.applicantNik}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDateTime(request.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetail(request)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
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

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan Surat</DialogTitle>
            <DialogDescription>
              No. Tiket: {selectedRequest?.ticketNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Jenis Surat</Label>
                  <p className="font-medium">{selectedRequest.letterType.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Kode Surat</Label>
                  <p className="font-medium">{selectedRequest.letterType.code}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nama Pemohon</Label>
                  <p className="font-medium">{selectedRequest.applicantName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">NIK</Label>
                  <p className="font-medium">{selectedRequest.applicantNik}</p>
                </div>
                {selectedRequest.applicantPhone && (
                  <div>
                    <Label className="text-muted-foreground">No. Telepon</Label>
                    <p className="font-medium">{selectedRequest.applicantPhone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Tanggal Pengajuan</Label>
                  <p className="font-medium">{formatDateTime(selectedRequest.createdAt)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-muted-foreground mb-2 block">Data Form</Label>
                <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg space-y-2">
                  {Object.entries(selectedRequest.formData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIAJUKAN">Diajukan</SelectItem>
                    <SelectItem value="DIPROSES">Diproses</SelectItem>
                    <SelectItem value="SELESAI">Selesai</SelectItem>
                    <SelectItem value="DITOLAK">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Catatan Admin</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk pemohon..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
            <Button onClick={handleUpdateStatus}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
