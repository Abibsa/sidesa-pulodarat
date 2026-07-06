import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const officers = await db.villageOfficer.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(officers)
  } catch (error) {
    console.error("Error fetching officers:", error)
    return NextResponse.json(
      { error: "Failed to fetch officers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, position, photo, order, isActive } = body

    const officer = await db.villageOfficer.create({
      data: {
        name,
        position,
        photo,
        order: parseInt(order) || 0,
        isActive: isActive !== false,
      },
    })

    return NextResponse.json(officer, { status: 201 })
  } catch (error) {
    console.error("Error creating officer:", error)
    return NextResponse.json(
      { error: "Failed to create officer" },
      { status: 500 }
    )
  }
}
