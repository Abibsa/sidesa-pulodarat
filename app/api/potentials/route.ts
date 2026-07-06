import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const potentials = await db.villagePotential.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(potentials)
  } catch (error) {
    console.error("Error fetching potentials:", error)
    return NextResponse.json(
      { error: "Failed to fetch potentials" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, contactInfo, isActive } = body

    const potential = await db.villagePotential.create({
      data: {
        title,
        description,
        category,
        contactInfo,
        isActive: isActive !== false,
      },
    })

    return NextResponse.json(potential, { status: 201 })
  } catch (error) {
    console.error("Error creating potential:", error)
    return NextResponse.json(
      { error: "Failed to create potential" },
      { status: 500 }
    )
  }
}
