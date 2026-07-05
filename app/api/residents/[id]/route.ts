import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { Gender, MaritalStatus } from "@prisma/client"

const residentSchema = z.object({
  nik: z.string().min(16).max(16),
  kk: z.string().min(16).max(16),
  name: z.string().min(1),
  gender: z.nativeEnum(Gender),
  birthDate: z.string(),
  birthPlace: z.string().min(1),
  address: z.string().min(1),
  rt: z.string().min(1),
  rw: z.string().min(1),
  kelurahan: z.string().min(1),
  kecamatan: z.string().min(1),
  religion: z.string().min(1),
  maritalStatus: z.nativeEnum(MaritalStatus),
  occupation: z.string().min(1),
  education: z.string().min(1),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resident = await db.resident.findUnique({
      where: { id: params.id },
    })

    if (!resident) {
      return NextResponse.json(
        { error: "Resident not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(resident)
  } catch (error) {
    console.error("Error fetching resident:", error)
    return NextResponse.json(
      { error: "Failed to fetch resident" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validated = residentSchema.parse(body)

    // Check if resident exists
    const existing = await db.resident.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Resident not found" },
        { status: 404 }
      )
    }

    // Check if NIK is being changed and already exists
    if (validated.nik !== existing.nik) {
      const nikExists = await db.resident.findUnique({
        where: { nik: validated.nik },
      })

      if (nikExists) {
        return NextResponse.json(
          { error: "NIK sudah terdaftar" },
          { status: 400 }
        )
      }
    }

    const resident = await db.resident.update({
      where: { id: params.id },
      data: {
        ...validated,
        birthDate: new Date(validated.birthDate),
      },
    })

    return NextResponse.json(resident)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error updating resident:", error)
    return NextResponse.json(
      { error: "Failed to update resident" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.resident.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting resident:", error)
    return NextResponse.json(
      { error: "Failed to delete resident" },
      { status: 500 }
    )
  }
}
