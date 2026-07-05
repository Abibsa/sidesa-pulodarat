import { NextResponse } from "next/server"
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
