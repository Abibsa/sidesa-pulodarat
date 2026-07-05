import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const profile = await db.villageProfile.findFirst()
    
    if (!profile) {
      return NextResponse.json(
        { error: "Village profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching village profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch village profile" },
      { status: 500 }
    )
  }
}
