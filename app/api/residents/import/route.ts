import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Gender, MaritalStatus } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data } = body

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Data harus berupa array dan tidak boleh kosong" },
        { status: 400 }
      )
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      
      try {
        // Validate required fields
        if (!row.nik || !row.name || !row.gender) {
          results.failed++
          results.errors.push({
            row: i + 1,
            error: "Field wajib tidak lengkap (NIK, Nama, Jenis Kelamin)",
            data: row,
          })
          continue
        }

        // Check if NIK already exists
        const existing = await db.resident.findUnique({
          where: { nik: row.nik },
        })

        if (existing) {
          results.failed++
          results.errors.push({
            row: i + 1,
            error: `NIK ${row.nik} sudah terdaftar`,
            data: row,
          })
          continue
        }

        // Create resident
        await db.resident.create({
          data: {
            nik: row.nik,
            kk: row.kk || row.nik,
            name: row.name,
            gender: row.gender as Gender,
            birthDate: new Date(row.birthDate || "2000-01-01"),
            birthPlace: row.birthPlace || "Unknown",
            address: row.address || "-",
            rt: row.rt || "001",
            rw: row.rw || "001",
            kelurahan: row.kelurahan || "Desa",
            kecamatan: row.kecamatan || "Kecamatan",
            religion: row.religion || "Islam",
            maritalStatus: (row.maritalStatus as MaritalStatus) || MaritalStatus.BELUM_KAWIN,
            occupation: row.occupation || "Belum Bekerja",
            education: row.education || "Tidak/Belum Sekolah",
          },
        })

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : "Unknown error",
          data: row,
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error importing residents:", error)
    return NextResponse.json(
      { error: "Failed to import residents" },
      { status: 500 }
    )
  }
}
