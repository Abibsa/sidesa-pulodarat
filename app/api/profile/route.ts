import { NextRequest, NextResponse } from "next/server"
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { villageName, history, vision, mission, address, email, phone, mapEmbedUrl, chiefName, chiefGreeting, chiefPhoto } = body

    const profile = await db.villageProfile.findFirst()
    
    let updatedProfile;
    if (profile) {
      updatedProfile = await db.villageProfile.update({
        where: { id: profile.id },
        data: { villageName, history, vision, mission, address, email, phone, mapEmbedUrl, chiefName, chiefGreeting, chiefPhoto },
      })
    } else {
      updatedProfile = await db.villageProfile.create({
        data: { villageName, history, vision, mission, address, email, phone, mapEmbedUrl, chiefName, chiefGreeting, chiefPhoto },
      })
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("Error updating village profile:", error)
    return NextResponse.json(
      { error: "Failed to update village profile" },
      { status: 500 }
    )
  }
}
