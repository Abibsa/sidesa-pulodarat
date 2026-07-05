import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateTicketNumber } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) where.status = status
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search } },
        { applicantNik: { contains: search } },
        { applicantName: { contains: search, mode: "insensitive" } },
      ]
    }

    const [requests, total] = await Promise.all([
      db.letterRequest.findMany({
        where,
        include: {
          letterType: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.letterRequest.count({ where }),
    ])

    return NextResponse.json({
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching letter requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch letter requests" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { letterTypeId, applicantNik, applicantName, applicantPhone, applicantEmail, formData } = body

    // Generate ticket number
    const ticketNumber = generateTicketNumber()

    const letterRequest = await db.letterRequest.create({
      data: {
        ticketNumber,
        letterTypeId,
        applicantNik,
        applicantName,
        applicantPhone,
        applicantEmail,
        formData,
        status: "DIAJUKAN",
      },
      include: {
        letterType: true,
      },
    })

    return NextResponse.json(letterRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating letter request:", error)
    return NextResponse.json(
      { error: "Failed to create letter request" },
      { status: 500 }
    )
  }
}
