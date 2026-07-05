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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const gender = searchParams.get("gender")
    const rt = searchParams.get("rt")
    const rw = searchParams.get("rw")
    const maritalStatus = searchParams.get("maritalStatus")

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nik: { contains: search } },
        { kk: { contains: search } },
      ]
    }

    if (gender) where.gender = gender
    if (rt) where.rt = rt
    if (rw) where.rw = rw
    if (maritalStatus) where.maritalStatus = maritalStatus

    const [residents, total] = await Promise.all([
      db.resident.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.resident.count({ where }),
    ])

    return NextResponse.json({
      data: residents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching residents:", error)
    return NextResponse.json(
      { error: "Failed to fetch residents" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = residentSchema.parse(body)

    // Check if NIK already exists
    const existing = await db.resident.findUnique({
      where: { nik: validated.nik },
    })

    if (existing) {
      return NextResponse.json(
        { error: "NIK sudah terdaftar" },
        { status: 400 }
      )
    }

    const resident = await db.resident.create({
      data: {
        ...validated,
        birthDate: new Date(validated.birthDate),
      },
    })

    return NextResponse.json(resident, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating resident:", error)
    return NextResponse.json(
      { error: "Failed to create resident" },
      { status: 500 }
    )
  }
}
