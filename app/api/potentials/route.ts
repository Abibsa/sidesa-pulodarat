import { NextResponse } from "next/server"
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
