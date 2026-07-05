import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticketNumber = searchParams.get("ticketNumber")
    const nik = searchParams.get("nik")

    if (!ticketNumber && !nik) {
      return NextResponse.json(
        { error: "Ticket number or NIK is required" },
        { status: 400 }
      )
    }

    const where: any = {}
    if (ticketNumber) where.ticketNumber = ticketNumber
    if (nik) where.applicantNik = nik

    const letterRequest = await db.letterRequest.findFirst({
      where,
      include: { letterType: true },
      orderBy: { createdAt: "desc" },
    })

    if (!letterRequest) {
      return NextResponse.json(
        { error: "Pengajuan tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(letterRequest)
  } catch (error) {
    console.error("Error tracking letter:", error)
    return NextResponse.json(
      { error: "Failed to track letter" },
      { status: 500 }
    )
  }
}
