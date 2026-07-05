import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { LetterStatus } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const letterRequest = await db.letterRequest.findUnique({
      where: { id: params.id },
      include: { letterType: true },
    })

    if (!letterRequest) {
      return NextResponse.json(
        { error: "Letter request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(letterRequest)
  } catch (error) {
    console.error("Error fetching letter request:", error)
    return NextResponse.json(
      { error: "Failed to fetch letter request" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, adminNotes, processedBy } = body

    const updateData: any = {
      status: status as LetterStatus,
      adminNotes,
    }

    if (status === "DIPROSES" && !processedBy) {
      updateData.processedAt = new Date()
      updateData.processedBy = processedBy || "admin"
    }

    if (status === "SELESAI" || status === "DITOLAK") {
      updateData.completedAt = new Date()
    }

    const letterRequest = await db.letterRequest.update({
      where: { id: params.id },
      data: updateData,
      include: { letterType: true },
    })

    return NextResponse.json(letterRequest)
  } catch (error) {
    console.error("Error updating letter request:", error)
    return NextResponse.json(
      { error: "Failed to update letter request" },
      { status: 500 }
    )
  }
}
