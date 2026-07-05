import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const letterTypes = await db.letterType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(letterTypes)
  } catch (error) {
    console.error("Error fetching letter types:", error)
    return NextResponse.json(
      { error: "Failed to fetch letter types" },
      { status: 500 }
    )
  }
}
