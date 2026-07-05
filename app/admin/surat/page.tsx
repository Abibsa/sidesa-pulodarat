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
        alert("Status berhasil diupdate")
      } else {
        alert("Gagal update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Terjadi kesalahan")
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: any = {
      DIAJUKAN: "bg-blue-100 text-blue-800",
      DIPROSES: "bg-yellow-100 text-yellow-800",
      SELESAI: "bg-green-100 text-green-800",
      DITOLAK: "bg-red-100 text-red-800",
    }
    return badges[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Pengajuan Surat</h2>
          <p className="text-gray-600">Kelola pengajuan surat dari warga</p>
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
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        No. Tiket
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Jenis Surat
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pemohon
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        NIK
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
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
                        <td className="px-4 py-3 text-sm text-gray-600">
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
                <div className="text-sm text-gray-600">
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
                  <Label className="text-gray-600">Jenis Surat</Label>
                  <p className="font-medium">{selectedRequest.letterType.name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Kode Surat</Label>
                  <p className="font-medium">{selectedRequest.letterType.code}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Nama Pemohon</Label>
                  <p className="font-medium">{selectedRequest.applicantName}</p>
                </div>
                <div>
                  <Label className="text-gray-600">NIK</Label>
                  <p className="font-medium">{selectedRequest.applicantNik}</p>
                </div>
                {selectedRequest.applicantPhone && (
                  <div>
                    <Label className="text-gray-600">No. Telepon</Label>
                    <p className="font-medium">{selectedRequest.applicantPhone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-600">Tanggal Pengajuan</Label>
                  <p className="font-medium">{formatDateTime(selectedRequest.createdAt)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-gray-600 mb-2 block">Data Form</Label>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {Object.entries(selectedRequest.formData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
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
