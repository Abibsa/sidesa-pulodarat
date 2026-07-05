"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function StatistikPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/statistics")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-12">Memuat statistik...</div>
  }

  if (!stats) {
    return <div className="text-center py-12">Gagal memuat data</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Statistik Desa</h2>
        <p className="text-gray-600">Visualisasi data penduduk dan pelayanan desa</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Penduduk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {stats.totals.residents}
            </div>
            <p className="text-sm text-gray-600 mt-1">Jiwa terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pengajuan Surat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {stats.totals.letters}
            </div>
            <p className="text-sm text-gray-600 mt-1">Total pengajuan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Menunggu Proses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">
              {stats.totals.pendingLetters}
            </div>
            <p className="text-sm text-gray-600 mt-1">Perlu ditindaklanjuti</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Penduduk per Jenis Kelamin</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.gender}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent = 0 }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.gender.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Groups Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Penduduk per Kelompok Usia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.ageGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RT/RW Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Penduduk per RT/RW</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.rtRw}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10b981" name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Education Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Penduduk per Tingkat Pendidikan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.education} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#f59e0b" name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupation Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Pekerjaan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.occupation} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8b5cf6" name="Jumlah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Marital Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Penduduk per Status Perkawinan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.maritalStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent = 0 }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.maritalStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Letter Statistics */}
      {stats.lettersByMonth && stats.lettersByMonth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pengajuan Surat per Bulan (6 Bulan Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.lettersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Jumlah Pengajuan"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
